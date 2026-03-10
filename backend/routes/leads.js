const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const emailService = require('../services/email');
const { isHeightRelated } = require('../services/gemini');

router.post('/', async (req, res) => {
    try {
        const body = req.body;

        if (!supabase) {
            console.warn('Got lead/click but Supabase is not configured.');
            return res.json({ success: true, warning: 'Supabase unconfigured' });
        }

        // ── Affiliate Click Logging ──────────────────────────────────
        if (body.type === 'affiliate_click') {
            const { error } = await supabase.from('conversions').insert([{
                type: 'affiliate_click',
                keyword: body.keyword || 'unknown',
                url: body.url || null,
                source: body.source || 'report'
            }]);
            if (error) throw error;

            emailService.notifyAffiliateClick(body.keyword, body.url).catch(() => {});
            return res.json({ success: true });
        }

        // ── Email Lead Capture ───────────────────────────────────────
        if (body.email) {
            const keyword = body.keyword || 'unknown';
            const isHeight = isHeightRelated(keyword);

            const { error } = await supabase.from('conversions').insert([{
                type: 'email_capture',
                keyword: keyword,
                source: body.email,
                revenue: 0,
                // Store the keyword category for contextual drip emails
                url: isHeight ? 'height' : 'niche'
            }]);
            if (error) throw error;

            // Send contextual welcome email
            emailService.sendWelcomeEmail(body.email, isHeight).catch(err =>
                console.error('Welcome email failed:', err.message));

            emailService.notifyNewLead(body.email, keyword, body.source || 'report_form')
                .catch(() => {});

            return res.json({ success: true });
        }

        res.status(400).json({ error: 'Invalid payload' });

    } catch (error) {
        console.error('Lead/Conversion logging error:', error);
        res.status(500).json({ error: 'Failed to log event' });
    }
});

module.exports = router;
