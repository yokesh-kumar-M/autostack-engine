const cron = require('node-cron');
const supabase = require('../services/supabase');
const emailService = require('../services/email');

const runEmailAutomation = async () => {
    console.log("EXEC: Starting daily email automation...", new Date().toISOString());

    if (!supabase) {
        console.error("Supabase client not initialized.");
        return { error: "supabase_missing" };
    }

    try {
        // ============================================
        // 1. Send Day 3 Follow Up (Upsell Templates)
        // ============================================
        const threeDaysAgoStart = new Date();
        threeDaysAgoStart.setDate(threeDaysAgoStart.getDate() - 3);
        threeDaysAgoStart.setHours(0, 0, 0, 0);

        const threeDaysAgoEnd = new Date(threeDaysAgoStart);
        threeDaysAgoEnd.setHours(23, 59, 59, 999);

        const { data: day3Users, error: err3 } = await supabase
            .from('conversions')
            .select('keyword, source')
            .eq('type', 'email_capture')
            .gte('created_at', threeDaysAgoStart.toISOString())
            .lte('created_at', threeDaysAgoEnd.toISOString());

        if (err3) throw err3;

        console.log("Found " + day3Users.length + " users for Day 3 emails.");
        for (const user of day3Users) {
             const email = user.source; 
             if(email && email.includes('@')) {
                 await emailService.sendDay3Email(email);
             }
        }

        // ============================================
        // 2. Send Day 7 Follow Up (Tech Stack Affiliate)
        // ============================================
        const sevenDaysAgoStart = new Date();
        sevenDaysAgoStart.setDate(sevenDaysAgoStart.getDate() - 7);
        sevenDaysAgoStart.setHours(0, 0, 0, 0);

        const sevenDaysAgoEnd = new Date(sevenDaysAgoStart);
        sevenDaysAgoEnd.setHours(23, 59, 59, 999);

        const { data: day7Users, error: err7 } = await supabase
            .from('conversions')
            .select('keyword, source')
            .eq('type', 'email_capture')
            .gte('created_at', sevenDaysAgoStart.toISOString())
            .lte('created_at', sevenDaysAgoEnd.toISOString());

        if (err7) throw err7;

        console.log("Found " + day7Users.length + " users for Day 7 emails.");
        for (const user of day7Users) {
             const email = user.source;
             if(email && email.includes('@')) {
                 await emailService.sendDay7Email(email);
             }
        }
        
        return { day3Sent: day3Users.length, day7Sent: day7Users.length };

    } catch (error) {
        console.error("Automation Error:", error);
        throw error;
    }
};

const startEmailCron = () => {
    // Run exactly at 10:00 AM UTC every single day.
    console.log("Email Cron Job Registered (runs at 10:00 UTC daily).");
    cron.schedule('0 10 * * *', runEmailAutomation);
};

module.exports = { startEmailCron, runEmailAutomation };
