require('dotenv').config();
const express = require('express');
const cors = require('cors');

const reportRoutes = require('./routes/report');
const leadsRoutes = require('./routes/leads');
const affiliateRoutes = require('./routes/affiliate');

const app = express();

app.use(cors());
app.use(express.json());

// Load routes
app.use('/api/report', reportRoutes);
app.use('/api/lead', leadsRoutes);
app.use('/api/affiliate', affiliateRoutes);

// Healthcheck endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
    
    // Start automated background tasks
    const { startEmailCron } = require('./automation/email-cron');
    const { startRedditCron } = require('./automation/reddit-cron');
    startEmailCron();
    startRedditCron();
});
