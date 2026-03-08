const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const emailService = require('../services/email');

router.post('/', async (req, res) => {
    try {
        const body = req.body;

        if (!supabase) {
            console.warn('Got lead/click but Supabase is not configured yet.');
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

            // Notify owner (fire-and-forget)
            emailService.notifyAffiliateClick(body.keyword, body.url).catch(() => {});

            return res.json({ success: true });
        }

        // ── Email Lead Capture ───────────────────────────────────────
        if (body.email) {
            const { error } = await supabase.from('conversions').insert([{
                type: 'email_capture',
                keyword: body.keyword || 'unknown',
                source: body.email,  // email stored in source column
                revenue: 0
            }]);
            if (error) throw error;

            // Send welcome email to customer
            emailService.sendWelcomeEmail(body.email).catch(err =>
                console.error('Welcome email failed:', err.message));

            // Notify owner of new lead (fire-and-forget)
            emailService.notifyNewLead(body.email, body.keyword, body.source || 'report_form')
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
