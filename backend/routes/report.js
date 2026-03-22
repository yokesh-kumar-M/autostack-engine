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

        // Validate input
        if (!keyword || typeof keyword !== 'string') {
            return res.status(400).json({ error: "Keyword is required" });
        }

        // Sanitize keyword
        const sanitizedKeyword = keyword.trim().substring(0, 200);
        if (sanitizedKeyword.length < 2) {
            return res.status(400).json({ error: "Keyword must be at least 2 characters" });
        }

        // --- Rate Limiting via Supabase ---
        if (supabase) {
            try {
                const today = new Date();
                const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();

                const { count, error } = await supabase
                    .from('queries')
                    .select('*', { count: 'exact', head: true })
                    .eq('ip_hash', ip_hash)
                    .gte('created_at', startOfDay);

                if (!error && count !== null && count >= 3) {
                    emailService.notifyRateLimitHit(ip_hash, sanitizedKeyword).catch(() => {});
                    return res.status(429).json({ 
                        error: "You've reached your daily limit of 3 free reports. Come back tomorrow!",
                        retry_after: "24 hours"
                    });
                }
            } catch (rateError) {
                console.warn('Rate limit check failed, continuing:', rateError.message);
                // Don't block the request if rate limit check fails
            }
        }

        console.log(`[REPORT] Generating for: "${sanitizedKeyword}" from IP: ${ip_hash.substring(0, 10)}...`);

        // Detect intent
        const isHeight = isHeightRelated(sanitizedKeyword);
        console.log(`[REPORT] Intent detected: ${isHeight ? 'HEIGHT' : 'NICHE'}`);

        // Generate report from AI
        let rawReport;
        try {
            rawReport = await generateReport(sanitizedKeyword);
        } catch (aiError) {
            console.error('[REPORT] AI generation failed:', aiError.message);
            return res.status(500).json({ 
                error: 'AI service temporarily unavailable. Please try again in a few moments.' 
            });
        }

        // Process affiliate links (context-aware)
        const { html: processedHtml, count: affiliateCount } = injectAffiliateLinks(rawReport, email || null, sanitizedKeyword);

        // Word count
        const textOnly = processedHtml.replace(/<[^>]*>?/gm, '');
        const wordCount = textOnly.trim().split(/\s+/).length;

        // Log to Supabase (non-blocking)
        if (supabase) {
            supabase.from('queries').insert([
                { keyword: sanitizedKeyword, email: email || null, ip_hash }
            ]).then(({ error }) => {
                if (error) console.error("[REPORT] Supabase insert error:", error.message);
            }).catch(err => {
                console.error("[REPORT] Supabase error:", err.message);
            });
        }

        console.log(`[REPORT] ✅ Success: "${sanitizedKeyword}" - ${wordCount} words, ${affiliateCount} links`);

        res.json({
            report_html: processedHtml,
            word_count: wordCount,
            affiliate_count: affiliateCount
        });

        // Owner notification (fire-and-forget)
        emailService.notifyReportGenerated(sanitizedKeyword, wordCount, affiliateCount, !!email).catch(() => {});

        // Send report PDF to user if email provided
        if (email && typeof email === 'string' && email.includes('@') && email.includes('.')) {
            emailService.sendReportEmail(email, sanitizedKeyword, processedHtml).catch(err => 
                console.error('[REPORT] Email send failed:', err.message)
            );
        }

    } catch (error) {
        console.error('[REPORT] Unexpected error:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;
