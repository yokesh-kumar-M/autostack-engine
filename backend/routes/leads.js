const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

router.post('/', async (req, res) => {
    try {
        const body = req.body;

        // Require supabase client to be initialized
        if (!supabase) {
            console.warn("Got lead/click but Supabase is not configured yet.");
            return res.json({ success: true, warning: 'Supabase unconfigured' });
        }

        if (body.type === 'affiliate_click') {
            // Log click conversion
            const { error } = await supabase.from('conversions').insert([{
                type: 'affiliate_click',
                keyword: body.keyword || 'unknown',
                url: body.url || null,
                source: body.source || 'report'
            }]);

            if (error) throw error;
            return res.json({ success: true });
        }

        // Standard Lead Capture (Email)
        if (body.email) {
            const { error } = await supabase.from('conversions').insert([{
                type: 'email_capture',
                keyword: body.keyword || 'unknown',
                source: body.email,  // Storing email in source to avoid schema changes
                revenue: 0
            }]);

            // Send native welcome email immediately using Gmail
            try {
                const emailService = require('../services/email');
                await emailService.sendWelcomeEmail(body.email);
            } catch (err) {
                console.error("Native Gmail welcome email failed:", err);
            }

            if (error) throw error;
            return res.json({ success: true });
        }

        res.status(400).json({ error: "Invalid payload" });

    } catch (error) {
        console.error("Lead/Conversion logging error:", error);
        res.status(500).json({ error: "Failed to log event" });
    }
});

module.exports = router;
