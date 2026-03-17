const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { automateProductCreation } = require('../services/productAutomation');
const emailService = require('../services/email');

// Simple admin protective middleware
const adminAuth = (req, res, next) => {
    const password = req.headers['x-admin-password'];
    if (password === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid admin password' });
    }
};

router.use(adminAuth);

// Get comprehensive stats (Revenue & Hits)
router.get('/stats', async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ 
                hits: 0, 
                revenue: 0, 
                leads: 0, 
                affiliateClicks: 0,
                gumroadSales: 0,
                message: 'Supabase not configured' 
            });
        }

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

        // Get total stats
        const [queriesResult, conversionsResult] = await Promise.all([
            supabase.from('queries').select('*', { count: 'exact', head: true }),
            supabase.from('conversions').select('*')
        ]);

        const totalQueries = queriesResult.count || 0;
        const conversions = conversionsResult.data || [];

        // Calculate revenue from gumroad_sale
        const gumroadSales = conversions.filter(c => c.type === 'gumroad_sale');
        const totalRevenue = gumroadSales.reduce((sum, c) => sum + (parseFloat(c.revenue) || 0), 0);

        // Other metrics
        const leads = conversions.filter(c => c.type === 'email_capture').length;
        const affiliateClicks = conversions.filter(c => c.type === 'affiliate_click').length;

        // Weekly stats
        const weeklyConversions = conversions.filter(c => new Date(c.created_at) >= weekAgo);
        const weeklyRevenue = weeklyConversions
            .filter(c => c.type === 'gumroad_sale')
            .reduce((sum, c) => sum + (parseFloat(c.revenue) || 0), 0);
        const weeklyHits = totalQueries; // This would need date filtering for accurate weekly

        // Top keywords
        const keywordCounts = {};
        const { data: recentQueries } = await supabase
            .from('queries')
            .select('keyword')
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (recentQueries) {
            recentQueries.forEach(q => {
                keywordCounts[q.keyword] = (keywordCounts[q.keyword] || 0) + 1;
            });
        }
        
        const topKeywords = Object.entries(keywordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([keyword, count]) => ({ keyword, count }));

        // Recent sales
        const recentSales = gumroadSales
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10)
            .map(s => ({
                product: s.keyword,
                revenue: s.revenue,
                date: s.created_at
            }));

        res.json({
            hits: {
                total: totalQueries,
                today: today,
            },
            revenue: {
                total: totalRevenue,
                currency: 'INR',
                weekly: weeklyRevenue,
                sales: gumroadSales.length
            },
            leads: {
                total: leads,
                affiliateClicks
            },
            topKeywords,
            recentSales,
            system: {
                gemini: 'configured',
                supabase: 'connected',
                gumroad: 'webhook_active'
            }
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Simple public stats endpoint (for display, no auth needed)
router.get('/public-stats', async (req, res) => {
    try {
        if (!supabase) {
            return res.json({ hits: '0', revenue: '₹0' });
        }

        const { count } = await supabase
            .from('queries')
            .select('*', { count: 'exact', head: true });

        const { data: conversions } = await supabase
            .from('conversions')
            .select('revenue')
            .eq('type', 'gumroad_sale');

        const totalRevenue = (conversions || [])
            .reduce((sum, c) => sum + (parseFloat(c.revenue) || 0), 0);

        res.json({
            hits: (count || 0).toLocaleString(),
            revenue: `₹${totalRevenue.toLocaleString()}`
        });

    } catch (error) {
        res.json({ hits: '0', revenue: '₹0' });
    }
});

// Trigger product automation (AI Content -> PDF -> Gumroad Listing)
router.post('/create-product', async (req, res) => {
    const { keyword, price } = req.body;
    
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        const result = await automateProductCreation(keyword, price || 9);
        
        // Notify owner with the links and attached PDF
        await emailService.sendGenericEmail(
            process.env.GMAIL_USER, // Assuming ownerEmail is process.env.GMAIL_USER
            `💡 MANUAL TRIGGER READY: ${keyword}`,
            `<div style="font-family: sans-serif; background: #0D1B2A; color: white; padding: 30px; border-radius: 8px;">
                <h1 style="color: #4CAF50;">Product Asset Successfully Generated!</h1>
                <p>You Manually triggered the asset generator. The resulting PDF is attached to this email.</p>
                
                <div style="background: #1B2A40; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Keyword:</strong> ${keyword}</p>
                    <p><strong>Proposed Price:</strong> $${price || 9}</p>
                </div>
                <h2>Next Steps</h2>
                <ol style="color: #E2E8F0;">
                    <li>Download the attached PDF to your computer.</li>
                    <li>Go to your <a href="${result.gumroad_url}" style="color: #F4A81D;">Gumroad Dashboard</a>.</li>
                    <li>Create a New Product named "The Ultimate ${keyword} Blueprint".</li>
                    <li>Upload the PDF and set the price to $${price || 9}.</li>
                </ol>
            </div>`,
            [{ filename: result.fileName, path: result.pdf_path }]
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manual trigger for Twitter Auto-Poster
router.post('/trigger-twitter', async (req, res) => {
    try {
        const { startTwitterCron } = require('../automation/twitter-cron');
        // We need to bypass the actual cron schedule and run the logic once.
        // Let's refactor the logic into a separate service later, but for now, we'll extract it.
        const { runTwitterPost } = require('../automation/twitter-cron');
        const result = await runTwitterPost();
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manual trigger for Follow-up Emails (Day 3 / Day 7)
router.post('/trigger-emails', async (req, res) => {
    try {
        const { runEmailAutomation } = require('../automation/email-cron');
        const result = await runEmailAutomation();
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manual trigger for Weekly Analytics Digest
router.post('/trigger-digest', async (req, res) => {
    try {
        const { runWeeklyDigest } = require('../automation/weekly-digest-cron');
        const result = await runWeeklyDigest();
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
