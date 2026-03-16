const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const emailService = require('../services/email');
const { verifyWebhook } = require('../services/gumroad');

/**
 * POST /api/gumroad/ping
 * Gumroad calls this endpoint every time a sale is made.
 * Configure it in: Gumroad Dashboard → Settings → Advanced → Ping
 * Ping URL: https://niche-report-ai.onrender.com/api/gumroad/ping
 */
router.post('/ping', async (req, res) => {
    try {
        const payload = req.body;

        console.log('Gumroad Ping received:', JSON.stringify(payload).substring(0, 200));

        // Verify the payload is from your Gumroad account
        if (!verifyWebhook(payload)) {
            console.warn('Gumroad webhook seller_id mismatch — ignoring');
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const productName  = payload.product_name || 'Unknown Product';
        const price        = parseInt(payload.price || 0, 10);  // cents
        const buyerEmail   = payload.email || null;
        const orderId      = payload.sale_id || payload.order_id || 'unknown';
        const refunded     = payload.refunded === 'true' || payload.refunded === true;

        if (refunded) {
            console.log('Gumroad Ping: refund for', orderId, '— skipping sale notification');
            return res.json({ success: true, skipped: 'refund' });
        }

        // Log to Supabase
        if (supabase) {
            await supabase.from('conversions').insert([{
                type: 'gumroad_sale',
                keyword: productName,
                source: buyerEmail || 'anonymous',
                revenue: price / 100,
                url: orderId
            }]).then(({ error }) => {
                if (error) console.error('Supabase sale insert error:', error.message);
            });
        }

        // Notify owner immediately — this is revenue! (fire and forget, don't block response)
        emailService.notifyGumroadSale(productName, price, buyerEmail).catch(err => 
            console.error('Sale notification email failed:', err.message)
        );

        console.log('✅ Gumroad Sale processed: ' + productName + ' $' + (price / 100).toFixed(2));
        res.json({ success: true });

    } catch (error) {
        console.error('Gumroad webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

module.exports = router;
