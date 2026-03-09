require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        console.log('Twitter Keys Check:', !!process.env.TWITTER_API_KEY, !!process.env.TWITTER_API_SECRET, !!process.env.TWITTER_ACCESS_TOKEN, !!process.env.TWITTER_ACCESS_SECRET);
        
        const twitterClient = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
        });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = 'Act as a successful entrepreneur sharing valuable niche business insights on Twitter.\n' +
            'Format your response as a JSON object with a single field: "tweet".\n' +
            'Pick a random, weird, hyper-specific emerging digital niche.\n' +
            'The tweet field should be under 200 characters, read like genuine advice (not clickbait), and include one line break.\n' +
            'No hashtags in the text itself.\n';

        console.log('Generating tweet...');
        const result = await model.generateContent(prompt);
        console.log('Gemini returned response');
        
        let responseText = result.response.text()
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
        
        console.log('Raw output:', responseText);
        
        const postData = JSON.parse(responseText);
        const cta = '\n\nRun a free AI report at nichereport.ai #SideHustle';
        const finalTweet = postData.tweet + cta;

        console.log('Tweeting: ' + finalTweet);
        const tweet = await twitterClient.readWrite.v2.tweet(finalTweet);
        console.log('Successfully tweeted! Tweet ID: ' + tweet.data.id);
    } catch (error) {
        console.error('Twitter Post Error:', error.message || error);
        console.error(error.data);
    }
}
test();
