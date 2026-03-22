const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const emailService = require('../services/email');
const { isHeightRelated } = require('../services/gemini');

router.post('/', async (req, res) => {
    try {
        const body = req.body || {};

        // Validate email if provided
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = (body.email && typeof body.email === 'string' && emailRegex.test(body.email)) 
            ? body.email.toLowerCase().trim() 
            : null;

        // ── Affiliate Click Logging ──────────────────────────────────
        if (body.type === 'affiliate_click') {
            console.log(`[LEAD] Affiliate click: ${body.keyword || 'unknown'}`);
            
            if (supabase) {
                try {
                    const { error } = await supabase.from('conversions').insert([{
                        type: 'affiliate_click',
                        keyword: body.keyword || 'unknown',
                        url: body.url || null,
                        source: body.source || 'report'
                    }]);
                    if (error) throw error;
                } catch (dbError) {
                    console.error('[LEAD] Failed to log affiliate click:', dbError.message);
                }
            }

            emailService.notifyAffiliateClick(body.keyword, body.url).catch(() => {});
            return res.json({ success: true });
        }

        // ── Email Lead Capture ───────────────────────────────────────
        if (email) {
            const keyword = body.keyword || 'unknown';
            const isHeight = isHeightRelated(keyword);

            console.log(`[LEAD] New lead: ${email} (${keyword}) - ${isHeight ? 'HEIGHT' : 'NICHE'}`);

            if (supabase) {
                try {
                    const { error } = await supabase.from('conversions').insert([{
                        type: 'email_capture',
                        keyword: keyword,
                        source: email,
                        revenue: 0,
                        url: isHeight ? 'height' : 'niche'
                    }]);
                    if (error) throw error;
                } catch (dbError) {
                    console.error('[LEAD] Failed to save lead:', dbError.message);
                    // Don't fail the request - still try to send emails
                }
            }

            // Send contextual welcome email (fire-and-forget)
            emailService.sendWelcomeEmail(email, isHeight).catch(err =>
                console.error('[LEAD] Welcome email failed:', err.message));

            emailService.notifyNewLead(email, keyword, body.source || 'report_form')
                .catch(() => {});

            return res.json({ success: true, message: 'Subscribed successfully!' });
        }

        // Neither valid email nor affiliate click
        res.status(400).json({ error: 'Invalid request. Please provide a valid email.' });

    } catch (error) {
        console.error('[LEAD] Unexpected error:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;
