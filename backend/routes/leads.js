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
                source: body.source || 'capture_form',
                revenue: 0
            }]);

            // Also store email against the query if needed via triggers, or update queries.

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
