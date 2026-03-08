const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { generateReport } = require('../services/gemini');
const { injectAffiliateLinks } = require('../services/affiliateMap');
const emailService = require('../services/email');

router.post('/', async (req, res) => {
    try {
        const { keyword, email } = req.body;
        const ip_hash = req.ip || req.headers['x-forwarded-for'] || 'unknown';

        if (!keyword) {
            return res.status(400).json({ error: "Keyword is required" });
        }

        // --- Rate Limiting via Supabase ---
        if (supabase) {
            const today = new Date().toISOString().split('T')[0]; // simple YYYY-MM-DD

            // Note: Since Supabase created_at is TIMESTAMPTZ, to match today we can do >= start of day
            const startOfDay = new Date(today).toISOString();

            const { count, error } = await supabase
                .from('queries')
                .select('*', { count: 'exact', head: true })
                .eq('ip_hash', ip_hash)
                .gte('created_at', startOfDay);

            if (!error && count >= 3) {
                // Notify owner — this is a high-intent user who burned all free reports
                emailService.notifyRateLimitHit(ip_hash, keyword).catch(() => {});
                return res.status(429).json({ error: "You have reached your daily limit of 3 free reports. Please come back tomorrow or upgrade!" });
            }
        }
        // -----------------------------------

        console.log(`Generating report for: ${keyword}`);

        // Generate report from AI
        const rawReport = await generateReport(keyword);

        // Process affiliate links (pass email + keyword for personalised Gumroad CTAs)
        const { html: processedHtml, count: affiliateCount } = injectAffiliateLinks(rawReport, email || null, keyword);

        // Approximate word count by stripping HTML
        const textOnly = processedHtml.replace(/<[^>]*>?/gm, '');
        const wordCount = textOnly.trim().split(/\s+/).length;

        // Log asynchronously to Supabase (if configured)
        if (supabase) {
            supabase.from('queries').insert([
                { keyword, email: email || null, ip_hash }
            ]).then(({ error }) => {
                if (error) console.error("Supabase insert error (queries):", error.message);
            });
        }

        res.json({
            report_html: processedHtml,
            word_count: wordCount,
            affiliate_count: affiliateCount
        });

        // Notify owner of report generation (fire-and-forget after response sent)
        emailService.notifyReportGenerated(keyword, wordCount, affiliateCount, !!email).catch(() => {});

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

module.exports = router;
