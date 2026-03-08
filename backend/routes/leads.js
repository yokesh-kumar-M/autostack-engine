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

            // Add to Mailchimp directly to skip Zapier limits
            try {
                if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
                    const dc = process.env.MAILCHIMP_API_KEY.split('-')[1];
                    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`;
                    
                    const response = await fetch(url, {
                        method: 'POST',
                        body: JSON.stringify({
                            email_address: body.email,
                            status: 'subscribed'
                        }),
                        headers: {
                            'Authorization': `ApiKey ${process.env.MAILCHIMP_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        console.log(`Mailchimp: Successfully subscribed ${body.email}`);
                    } else {
                        // Suppress error log if they are just already subscribed
                        const result = await response.json();
                        if (result.title !== "Member Exists") {
                            console.error(`Mailchimp error for ${body.email}:`, result);
                        }
                    }
                }
            } catch (err) {
                console.error("Mailchimp integration failed:", err);
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
