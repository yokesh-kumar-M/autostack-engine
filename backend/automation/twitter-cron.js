const cron = require('node-cron');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { TwitterApi } = require('twitter-api-v2');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Alternate between height growth tips (drives product sales) and niche research tips (drives tool traffic)
const TWEET_TYPES = ['height', 'niche', 'height', 'height', 'niche'];
let tweetTypeIndex = 0;

const runTwitterPost = async () => {
    console.log('EXEC: Starting Twitter Auto-Poster...', new Date().toISOString());

    try {
        if (!process.env.TWITTER_API_KEY || process.env.TWITTER_API_KEY === 'your_twitter_api_key') {
            console.warn('Twitter API credentials not configured.');
            return { skipped: true, reason: 'unconfigured' };
        }

        const twitterClient = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
        });

        const tweetType = TWEET_TYPES[tweetTypeIndex % TWEET_TYPES.length];
        tweetTypeIndex++;

        let finalTweet = "";
        const apiKey = process.env.GEMINI_API_KEY || '';

        if (apiKey && apiKey !== 'placeholder-key') {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

                let prompt;
                if (tweetType === 'height') {
                    prompt = `Write a single tweet (under 220 chars) sharing a specific, scientific insight about natural height growth or HGH optimization. Include one surprising stat or fact. No hashtags. Format as JSON: {"tweet":"..."}`;
                } else {
                    prompt = `Write a single tweet (under 220 chars) sharing a sharp insight about finding profitable micro-niches online. Be contrarian and specific. No hashtags. Format as JSON: {"tweet":"..."}`;
                }

                const result = await model.generateContent(prompt);
                const responseText = result.response.text()
                    .replace(/```json/g, '').replace(/```/g, '').trim();
                const postData = JSON.parse(responseText);

                if (tweetType === 'height') {
                    finalTweet = postData.tweet + '\n\nFree growth analysis → niche-report-ai.vercel.app #HeightGrowth #Biohacking';
                } else {
                    finalTweet = postData.tweet + '\n\nFree AI niche report → niche-report-ai.vercel.app #NicheResearch #SideHustle';
                }
            } catch (gemErr) {
                console.error('Gemini error in Twitter bot:', gemErr.message);
            }
        }

        // Fallback tweets
        if (!finalTweet) {
            const fallbacks = {
                height: [
                    "L-arginine + L-glutamine taken before sleep can spike HGH by up to 700%. Most people sleep wrong.\n\nFree growth analysis → niche-report-ai.vercel.app",
                    "Your intervertebral discs can expand with proper decompression. That's hidden height you're leaving on the table.\n\nFree analysis → niche-report-ai.vercel.app",
                    "Deep sleep in complete darkness boosts HGH by 157%. Your phone's blue light is suppressing your growth.\n\nFree growth report → niche-report-ai.vercel.app",
                    "Dead hangs for 60 seconds daily can recover 1-2cm of spinal compression. You're shrinking right now as you read this.\n\nFree growth report → niche-report-ai.vercel.app",
                    "HGH optimization + spinal decompression + proper nutrition = real height gains. Not hype. Science.\n\nFree AI analysis → niche-report-ai.vercel.app",
                    "Stop losing height to bad posture. Kyphosis is stealing 1-3 inches right now.\n\nFree growth analysis → niche-report-ai.vercel.app",
                    "The 40/40/20 macro split fuels bone development. Most people eat completely wrong for growth.\n\nFree growth report → niche-report-ai.vercel.app",
                    "Inversion therapy 10 min daily can add measurable height. Your discs are screaming for decompression.\n\nFree AI analysis → niche-report-ai.vercel.app"
                ],
                niche: [
                    "The best niches aren't 'trending.' They're boring problems rich people pay to solve.\n\nFree AI niche report → niche-report-ai.vercel.app",
                    "Stop competing in saturated markets. Find the weird, specific niche nobody is serving yet.\n\nFree AI analysis → niche-report-ai.vercel.app",
                    "80% of successful online businesses start with niche research. 90% of failing ones skip it.\n\nFree report → niche-report-ai.vercel.app",
                    "Before you build ANYTHING, validate the niche. I built a free tool that does this in 30 seconds.\n\nniche-report-ai.vercel.app",
                    "AI resume writing service. Pet memorials. Notion templates. These niches print money. Here's why.\n\nFree niche analysis → niche-report-ai.vercel.app",
                    "The money is in the margins. Find the tiny niche with passionate buyers and zero competition.\n\nFree AI research → niche-report-ai.vercel.app",
                    "Most entrepreneurs pick niches based on passion. Smart ones pick based on profit potential first.\n\nFree niche finder → niche-report-ai.vercel.app",
                    "Local SEO for dentists. $500-2000/month retainers. Most dentists have ZERO online presence.\n\nFree niche research → niche-report-ai.vercel.app"
                ]
            };
            const options = fallbacks[tweetType];
            finalTweet = options[Math.floor(Math.random() * options.length)];
        }

        console.log('Tweeting: ' + finalTweet.substring(0, 80) + '...');
        const tweet = await twitterClient.readWrite.v2.tweet(finalTweet);
        console.log('Successfully tweeted! ID: ' + tweet.data.id);
        return { success: true, tweetId: tweet.data.id, type: tweetType };

    } catch (error) {
        console.error('Twitter Post Error:', error.message || error);
        throw error;
    }
};

const startTwitterCron = () => {
    // Run Mon, Wed, Fri, Sat, Sun at 10:00 AM UTC (3:30 PM IST — peak engagement)
    console.log('Twitter Cron Job Registered (Mon/Wed/Fri/Sat/Sun at 10:00 UTC).');
    // Mon=1, Wed=3, Fri=5, Sat=6, Sun=0
    cron.schedule('0 10 * * 1,3,5,6,0', runTwitterPost);
};

module.exports = { startTwitterCron, runTwitterPost };
