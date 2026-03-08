const cron = require('node-cron');
const { TwitterApi } = require('twitter-api-v2');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const startTwitterCron = () => {
    // Run Monday, Wednesday, Friday at 9:00 AM UTC
    console.log('Twitter Cron Job Registered (runs Mon, Wed, Fri at 09:00 UTC).');

    cron.schedule('0 9 * * 1,3,5', async () => {
        console.log('EXEC: Starting Twitter Auto-Poster cron job...', new Date().toISOString());

        try {
            if (!process.env.TWITTER_API_KEY || process.env.TWITTER_API_KEY.includes('xxx')) {
                console.warn('Twitter API credentials not configured. Skipping tweet.');
                return;
            }

            const twitterClient = new TwitterApi({
                appKey: process.env.TWITTER_API_KEY,
                appSecret: process.env.TWITTER_API_SECRET,
                accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessSecret: process.env.TWITTER_ACCESS_SECRET,
            });

            // Generate tweet content via Gemini
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = 'Act as a successful entrepreneur sharing valuable niche business insights on Twitter.\n' +
                'Format your response as a JSON object with a single field: "tweet".\n' +
                'Pick a random, weird, hyper-specific emerging digital niche.\n' +
                'The tweet field should be under 200 characters, read like genuine advice (not clickbait), and include one line break.\n' +
                'No hashtags in the text itself.\n';

            const result = await model.generateContent(prompt);
            const responseText = result.response.text()
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

            const postData = JSON.parse(responseText);
            const cta = '\n\nRun a free AI report at nichereport.ai #SideHustle';
            const finalTweet = postData.tweet + cta;

            // Post the tweet
            console.log('Tweeting: ' + finalTweet.substring(0, 80) + '...');

            const tweet = await twitterClient.readWrite.v2.tweet(finalTweet);
            console.log('Successfully tweeted! Tweet ID: ' + tweet.data.id);

        } catch (error) {
            console.error('Twitter Post Error:', error.message || error);
        }
    });
};

module.exports = { startTwitterCron };
