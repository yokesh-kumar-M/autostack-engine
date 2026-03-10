const cron = require('node-cron');
const supabase = require('../services/supabase');
const emailService = require('../services/email');

const runWeeklyDigest = async () => {
    console.log("EXEC: Starting Weekly Digest automation...", new Date().toISOString());

    try {
        if (!supabase) {
            console.error("Supabase client not initialized.");
            return { error: "supabase_missing" };
        }

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

        const reportHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #F4A81D;">NicheReport.ai — Weekly Analytics Digest</h2>
                <hr/>
                <p><strong>Reports Generated:</strong> ${queries.length}</p>
                <p><strong>New Leads Captured:</strong> ${leads.length}</p>
                <h3>Top Trending Niches This Week:</h3>
                <p style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${topKeywords || 'No data yet.'}</p>
                <p>Keep up the great work! Your automated system is running perfectly.</p>
                <hr/>
                <p style="font-size: 11px; color: #777;">Sent via NicheReport Automation Engine.</p>
            </div>
        `;

        await emailService.sendGenericEmail(
            process.env.GMAIL_USER,
            'Weekly NicheReport Analytics Digest 📈',
            reportHtml
        );

        console.log("✅ Weekly Digest Email Sent Successfully!");
        return { queries: queries.length, leads: leads.length };

    } catch (error) {
        console.error("Weekly Digest Error:", error);
        throw error;
    }
};

const startWeeklyDigestCron = () => {
    // Run every Friday at 17:00 UTC
    console.log("Weekly Digest Cron Job Registered (runs Fri at 17:00 UTC).");
    cron.schedule('0 17 * * 5', runWeeklyDigest);
};

module.exports = { startWeeklyDigestCron, runWeeklyDigest };
