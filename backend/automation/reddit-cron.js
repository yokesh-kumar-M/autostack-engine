const cron = require('node-cron');
const snoowrap = require('snoowrap');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const TARGET_SUBREDDITS = [
    'entrepreneur',
    'sidehustle',
    'juststart',
    'affiliatemarketing',
    'passive_income',
    'blogging'
];

// Keeps track of the next subreddit to post to
let currentSubredditIndex = 0;

const startRedditCron = () => {
    // Run Monday, Wednesday, Friday at 9:00 AM UTC
    console.log("Reddit Cron Job Registered (runs Mon, Wed, Fri at 09:00 UTC).");
    
    cron.schedule('0 9 * * 1,3,5', async () => {
        console.log("EXEC: Starting Reddit Auto-Poster cron job...", new Date().toISOString());

        try {
            if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_SECRET || process.env.REDDIT_CLIENT_ID.includes('xxx')) {
                console.warn("Reddit API credentials not found or invalid. Skipping automated post.");
                return;
            }

            const r = new snoowrap({
                userAgent: 'NicheReportBot/1.0.0 by ' + process.env.REDDIT_USER,
                clientId: process.env.REDDIT_CLIENT_ID,
                clientSecret: process.env.REDDIT_SECRET,
                username: process.env.REDDIT_USER,
                password: process.env.REDDIT_PASS
            });

            // 1. Generate unique, highly valuable content via Gemini
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                Act as a highly successful entrepreneur sharing valuable insights.
                Format the response strictly as a JSON object with two fields: "title" and "body".
                Pick a random, weird, hyper-specific emerging digital niche (e.g., 'notion templates for dog trainers', 'AI generated textures for indie games', 'newsletter for specific obscure hobby').
                
                The "title" should be a catchy, highly engaging Reddit post title (under 80 characters) explaining the opportunity. Do not make it sound like clickbait, make it sound like genuine advice or an observation.
                The "body" should be exactly 150 to 180 words. Give a highly valuable breakdown of the niche, why it's profitable, and the demand signals (e.g. search volume or competitor gaps). 
                Do not include any hashtags or markdown formatting in the title.
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const postData = JSON.parse(responseText);

            const cta = "\\n\\n---\\n*If you want to validate niches like this instantly, you can run a free AI report at [NicheReport.ai](https://nichereport.ai/). No sign-up required.*";
            const finalBody = postData.body + cta;

            // 2. Determine target subreddit
            const targetSub = TARGET_SUBREDDITS[currentSubredditIndex];

            // 3. Post to Reddit
            console.log(`Posting to r/${targetSub}...`);
            console.log(`Title: ${postData.title}`);

            const submission = await r.getSubreddit(targetSub).submitSelfpost({
                title: postData.title,
                text: finalBody
            });

            console.log(`✅ Successfully posted to r/${targetSub}! Post ID: ${submission.id}`);

            // 4. Rotate to next subreddit for the next run
            currentSubredditIndex = (currentSubredditIndex + 1) % TARGET_SUBREDDITS.length;

        } catch (error) {
            console.error("Reddit Post Error:", error);
        }
    });
};

module.exports = { startRedditCron };
