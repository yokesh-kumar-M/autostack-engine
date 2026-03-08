const cron = require('node-cron');
const { TwitterApi } = require('twitter-api-v2');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const startTwitterCron = () => {
    // Run Monday, Wednesday, Friday at 9:00 AM UTC
    console.log("Twitter Cron Job Registered (runs Mon, Wed, Fri at 09:00 UTC).");
    
    cron.schedule('0 9 * * 1,3,5', async () => {
        console.log("EXEC: Starting Twitter Auto-Poster cron job...", new Date().toISOString());

        try {
            if (!process.env.TWITTER_API_KEY || process.env.TWITTER_API_KEY.includes('xxx')) {
                console.warn("Twitter API credentials not found or invalid. Skipping automated post.");
                return;
            }

            const twitterClient = new TwitterApi({
                appKey: process.env.TWITTER_API_KEY,
                appSecret: process.env.TWITTER_API_SECRET,
                accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessSecret: process.env.TWITTER_ACCESS_SECRET,
            });

            // 1. Generate unique, highly valuable tweet via Gemini
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = \`
                Act as a highly successful entrepreneur sharing valuable insights on Twitter.
                Format the response strictly as a JSON object with one field: "tweet".
                Pick a random, weird, hyper-specific emerging digital niche (e.g., 'notion templates for dog trainers', 'AI generated textures for indie games', 'newsletter for specific obscure hobby').
                
                The "tweet" should be exactly a 200 character viral text explaining the opportunity. Do not make it sound like clickbait, make it sound like genuine advice or an observation. Include exactly one line break.
                Do not include any hashtags or markdown formatting in the text.
            \`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            const postData = JSON.parse(responseText);

            const cta = "\\n\\nRun a free AI report at nichereport.ai #SideHustle";
            const finalTweet = postData.tweet + cta;

            // 2. Post to Twitter
            console.log(\`Tweeting...\`);
            console.log(\`Content: \${finalTweet}\`);

            const rwClient = twitterClient.readWrite;
            const tweet = await rwClient.v2.tweet(finalTweet);

            console.log(\`✅ Successfully tweeted! Tweet ID: \${tweet.data.id}\`);

        } catch (error) {
            console.error("Twitter Post Error:", error);
        }
    });
};

module.exports = { startTwitterCron };
