const cron = require('node-cron');
const supabase = require('../services/supabase');
const emailService = require('../services/email');

const startWeeklyDigestCron = () => {
    // Run every Friday at 17:00 UTC
    console.log("Weekly Digest Cron Job Registered (runs Fri at 17:00 UTC).");
    
    cron.schedule('0 17 * * 5', async () => {
        console.log("EXEC: Starting Weekly Digest cron job...", new Date().toISOString());

        try {
            if (!supabase) return;

            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            // Fetch queries from last 7 days
            const { data: queries, error } = await supabase
                .from('queries')
                .select('*')
                .gte('created_at', oneWeekAgo.toISOString());

            if (error) throw error;

            // Fetch new emails captured
            const { data: leads, error: leadErr } = await supabase
                .from('conversions')
                .select('*')
                .eq('type', 'email_capture')
                .gte('created_at', oneWeekAgo.toISOString());

            if (leadErr) throw leadErr;

            const topKeywordMap = {};
            queries.forEach(q => {
                topKeywordMap[q.keyword] = (topKeywordMap[q.keyword] || 0) + 1;
            });
            const topKeywords = Object.entries(topKeywordMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(k => "• " + k[0] + " (" + k[1] + " searches)")
                .join('<br>');

            const reportHtml = '<h2>Weekly Digest: NicheReport.ai</h2>' +
                '<p><strong>Reports Generated:</strong> ' + queries.length + '</p>' +
                '<p><strong>New Leads Captured:</strong> ' + leads.length + '</p>' +
                '<h3>Top Trending Niches This Week:</h3>' +
                '<p>' + topKeywords + '</p>' +
                '<p>Keep up the great work! Your automated system is running perfectly.</p>';

            // Using the existing mailer from email.js which logs in using the admin Gmail
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                 service: 'gmail',
                 auth: {
                     user: process.env.GMAIL_USER,
                     pass: process.env.GMAIL_APP_PASSWORD
                 }
            });

            await transporter.sendMail({
                from: '"NicheReport Automation" <' + process.env.GMAIL_USER + '>',
                to: process.env.GMAIL_USER,
                subject: 'Weekly NicheReport Analytics Digest 📈',
                html: reportHtml
            });

            console.log("✅ Weekly Digest Email Sent Successfully!");

        } catch (error) {
            console.error("Weekly Digest Error:", error);
        }
    });
};

module.exports = { startWeeklyDigestCron };
