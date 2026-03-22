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
        // 1. Send Day 1 Follow Up (next day after signup)
        // ============================================
        const oneDayAgoStart = new Date();
        oneDayAgoStart.setDate(oneDayAgoStart.getDate() - 1);
        oneDayAgoStart.setHours(0, 0, 0, 0);

        const oneDayAgoEnd = new Date(oneDayAgoStart);
        oneDayAgoEnd.setHours(23, 59, 59, 999);

        const { data: day1Users, error: err1 } = await supabase
            .from('conversions')
            .select('keyword, source, url')
            .eq('type', 'email_capture')
            .gte('created_at', oneDayAgoStart.toISOString())
            .lte('created_at', oneDayAgoEnd.toISOString());

        if (err1) {
            console.warn("Day 1 query error:", err1.message);
        } else {
            console.log("Found " + (day1Users ? day1Users.length : 0) + " users for Day 1 emails.");
        }

        const day1SentEmails = new Set();
        if (day1Users && day1Users.length > 0) {
            for (const user of day1Users) {
                const email = user.source;
                if (email && typeof email === 'string' && email.includes('@') && !day1SentEmails.has(email)) {
                    try {
                        const isHeight = user.url === 'height';
                        await emailService.sendDay1Email(email, isHeight);
                        day1SentEmails.add(email);
                        console.log(`Day 1 email sent to ${email}`);
                    } catch (emailErr) {
                        console.error(`Failed to send Day 1 email to ${email}:`, emailErr.message);
                    }
                }
            }
        }

        // ============================================
        // 2. Send Day 3 Follow Up
        // ============================================
        const threeDaysAgoStart = new Date();
        threeDaysAgoStart.setDate(threeDaysAgoStart.getDate() - 3);
        threeDaysAgoStart.setHours(0, 0, 0, 0);

        const threeDaysAgoEnd = new Date(threeDaysAgoStart);
        threeDaysAgoEnd.setHours(23, 59, 59, 999);

        const { data: day3Users, error: err3 } = await supabase
            .from('conversions')
            .select('keyword, source, url')
            .eq('type', 'email_capture')
            .gte('created_at', threeDaysAgoStart.toISOString())
            .lte('created_at', threeDaysAgoEnd.toISOString());

        if (err3) {
            console.warn("Day 3 query error:", err3.message);
        } else {
            console.log("Found " + (day3Users ? day3Users.length : 0) + " users for Day 3 emails.");
        }

        const day3SentEmails = new Set();
        if (day3Users && day3Users.length > 0) {
            for (const user of day3Users) {
                const email = user.source;
                if (email && typeof email === 'string' && email.includes('@') && !day3SentEmails.has(email)) {
                    try {
                        const isHeight = user.url === 'height';
                        await emailService.sendDay3Email(email, isHeight);
                        day3SentEmails.add(email);
                        console.log(`Day 3 email sent to ${email}`);
                    } catch (emailErr) {
                        console.error(`Failed to send Day 3 email to ${email}:`, emailErr.message);
                    }
                }
            }
        }

        // ============================================
        // 3. Send Day 7 Follow Up
        // ============================================
        const sevenDaysAgoStart = new Date();
        sevenDaysAgoStart.setDate(sevenDaysAgoStart.getDate() - 7);
        sevenDaysAgoStart.setHours(0, 0, 0, 0);

        const sevenDaysAgoEnd = new Date(sevenDaysAgoStart);
        sevenDaysAgoEnd.setHours(23, 59, 59, 999);

        const { data: day7Users, error: err7 } = await supabase
            .from('conversions')
            .select('keyword, source, url')
            .eq('type', 'email_capture')
            .gte('created_at', sevenDaysAgoStart.toISOString())
            .lte('created_at', sevenDaysAgoEnd.toISOString());

        if (err7) {
            console.warn("Day 7 query error:", err7.message);
        } else {
            console.log("Found " + (day7Users ? day7Users.length : 0) + " users for Day 7 emails.");
        }

        const day7SentEmails = new Set();
        if (day7Users && day7Users.length > 0) {
            for (const user of day7Users) {
                const email = user.source;
                if (email && typeof email === 'string' && email.includes('@') && !day7SentEmails.has(email)) {
                    try {
                        const isHeight = user.url === 'height';
                        await emailService.sendDay7Email(email, isHeight);
                        day7SentEmails.add(email);
                        console.log(`Day 7 email sent to ${email}`);
                    } catch (emailErr) {
                        console.error(`Failed to send Day 7 email to ${email}:`, emailErr.message);
                    }
                }
            }
        }

        return { day1Sent: day1SentEmails.size, day3Sent: day3SentEmails.size, day7Sent: day7SentEmails.size };

    } catch (error) {
        console.error("Automation Error:", error);
        throw error;
    }
};

const startEmailCron = () => {
    console.log("Email Cron Job Registered (runs at 10:00 UTC daily).");
    cron.schedule('0 10 * * *', runEmailAutomation);
};

module.exports = { startEmailCron, runEmailAutomation };
