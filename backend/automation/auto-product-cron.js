const cron = require('node-cron');
const { automateProductCreation } = require('../services/productAutomation');
const { sendGenericEmail } = require('../services/email');

// The ultimate library of high-value niche topics to automatically cycle through
const NICHE_TOPICS = [
    "SaaS for Local Businesses",
    "Micro-SaaS for Event Planners",
    "Automated Newsletter Businesses",
    "AI Agents for Real Estate",
    "High-Ticket B2B Lead Generation",
    "Faceless TikTok E-commerce",
    "No-Code App Development Agencies",
    "Print on Demand in 2026",
    "Ghostwriting for B2B Founders",
    "Programmatic SEO Content Farms",
    "Digital Product Empires for Notion",
    "The Solopreneur Holding Company Model"
];

let currentTopicIndex = 0;

function startAutoProductCron() {
    // Schedule to run every 2 days at 9:00 AM UTC (0 9 */2 * *)
    // For testing you can change this to run every minute: '* * * * *'
    cron.schedule('0 9 */2 * *', async () => {
        console.log('🤖 [AUTO-ASSET CRON] Starting 2-Day Product Generation Cycle...');
        
        try {
            const topic = NICHE_TOPICS[currentTopicIndex];
            console.log(`🤖 Generating massive book for niche: ${topic}`);

            const result = await automateProductCreation(topic, 19);

            // Send YOU the final email immediately
            const ownerEmail = process.env.GMAIL_USER;
            if (ownerEmail) {
                await sendGenericEmail(
                    ownerEmail,
                    `🚨 NEW GUMROAD ASSET READY: ${topic}`,
                    `
                    <div style="font-family: sans-serif; background: #0D1B2A; color: white; padding: 30px; border-radius: 8px;">
                        <h1 style="color: #F4A81D;">Your New 25-Page Product is Ready</h1>
                        <p>The AutoAsset system just finished writing and formatting a massive PDF book for you.</p>
                        
                        <div style="background: #1B2A40; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Topic:</strong> ${topic}</p>
                            <p><strong>Suggested Price:</strong> $19.00</p>
                            <p><strong>Local PDF File:</strong> <code>${result.pdf_path}</code></p>
                        </div>

                        <h2>Next Steps (1 Minute task)</h2>
                        <ol style="color: #E2E8F0;">
                            <li>Download the attached PDF to your computer.</li>
                            <li>Go to your <a href="${result.gumroad_url}" style="color: #F4A81D;">Gumroad Dashboard</a>.</li>
                            <li>Create a New Product named "The Ultimate ${topic} Blueprint".</li>
                            <li>Upload the PDF and set the price to $19.00.</li>
                        </ol>
                        
                        <p>Another asset will be generated automatically in 48 hours.</p>
                    </div>
                    `,
                    [{ filename: result.fileName, path: result.pdf_path }]
                );
            }

            console.log('🤖 [AUTO-ASSET CRON] Pipeline completed successully. Owner Emailed.');
            
            // Increment the topic for next time
            currentTopicIndex = (currentTopicIndex + 1) % NICHE_TOPICS.length;

        } catch (error) {
            console.error('🤖 [AUTO-ASSET CRON] Critical Failure:', error);
            const ownerEmail = process.env.GMAIL_USER;
            if (ownerEmail) {
                sendGenericEmail(
                    ownerEmail,
                    `CRITICAL WARNING: AutoAsset Cron Failed`,
                    `<p>The automated product generator failed. Check Render logs immediately. Error: ${error.message}</p>`
                );
            }
        }
    });

    console.log('✅ [AUTO-ASSET CRON] Scheduled. Next run: every 2 days.');
}

module.exports = { startAutoProductCron };
