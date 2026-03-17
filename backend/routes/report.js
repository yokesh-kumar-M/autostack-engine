const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { generateReport, isHeightRelated } = require('../services/gemini');
const { injectAffiliateLinks } = require('../services/affiliateMap');
const emailService = require('../services/email');

router.post('/', async (req, res) => {
    try {
        const { keyword, email } = req.body;
        const ip_hash = req.ip || req.headers['x-forwarded-for'] || 'unknown';

        if (!keyword) {
            return res.status(400).json({ error: "Keyword is required" });
        }

        // Sanitize keyword
        const sanitizedKeyword = keyword.trim().substring(0, 200);
        if (sanitizedKeyword.length < 2) {
            return res.status(400).json({ error: "Keyword must be at least 2 characters" });
        }

        // --- Rate Limiting via Supabase ---
        if (supabase) {
            const today = new Date().toISOString().split('T')[0];
            const startOfDay = new Date(today).toISOString();

            try {
                const { count, error } = await supabase
                    .from('queries')
                    .select('*', { count: 'exact', head: true })
                    .eq('ip_hash', ip_hash)
                    .gte('created_at', startOfDay);

                if (!error && count >= 3) {
                    emailService.notifyRateLimitHit(ip_hash, keyword).catch(() => {});
                    return res.status(429).json({ error: "You have reached your daily limit of 3 free reports. Please come back tomorrow or upgrade!" });
                }
            } catch (rateError) {
                console.warn('Rate limit check failed:', rateError.message);
            }
        }

        console.log(`Generating report for: ${sanitizedKeyword}`);

        // Detect intent
        const isHeight = isHeightRelated(sanitizedKeyword);

        // Generate report from AI
        const rawReport = await generateReport(sanitizedKeyword);

        // Process affiliate links (context-aware)
        const { html: processedHtml, count: affiliateCount } = injectAffiliateLinks(rawReport, email || null, sanitizedKeyword);

        // Word count
        const textOnly = processedHtml.replace(/<[^>]*>?/gm, '');
        const wordCount = textOnly.trim().split(/\s+/).length;

        // Log to Supabase
        if (supabase) {
            supabase.from('queries').insert([
                { keyword: sanitizedKeyword, email: email || null, ip_hash }
            ]).then(({ error }) => {
                if (error) console.error("Supabase insert error (queries):", error.message);
            });
        }

        res.json({
            report_html: processedHtml,
            word_count: wordCount,
            affiliate_count: affiliateCount
        });

        // Owner notification (fire-and-forget)
        emailService.notifyReportGenerated(sanitizedKeyword, wordCount, affiliateCount, !!email).catch(() => {});

        // Send report PDF to user if email provided
        if (email && email.includes('@')) {
            emailService.sendReportEmail(email, sanitizedKeyword, processedHtml).catch(err => 
                console.error('Failed to email report:', err.message)
            );
        }

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report. Please try again.' });
    }
});

module.exports = router;
