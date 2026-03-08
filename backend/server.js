require('dotenv').config();
const express = require('express');
const cors = require('cors');

const reportRoutes    = require('./routes/report');
const leadsRoutes     = require('./routes/leads');
const affiliateRoutes = require('./routes/affiliate');
const gumroadRoutes   = require('./routes/gumroad');
const adminRoutes     = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

// Load routes
app.use('/api/report',    reportRoutes);
app.use('/api/lead',      leadsRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/gumroad',   gumroadRoutes);  // Gumroad sale webhook
app.use('/api/admin',     adminRoutes);    // Admin automation triggers

const rssRoute = require('./routes/rss');
app.use('/api', rssRoute);

// Healthcheck endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    
    // Start Cron Jobs (Only when server is actually running)
    const { startEmailCron } = require('./automation/email-cron');
    const { startTwitterCron } = require('./automation/twitter-cron');
    const { startWeeklyDigestCron } = require('./automation/weekly-digest-cron');
    const { startAutoProductCron } = require('./automation/auto-product-cron');
    startEmailCron();
    startTwitterCron();
    startWeeklyDigestCron();
    startAutoProductCron();
});
