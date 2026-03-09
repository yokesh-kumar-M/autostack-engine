const { automateProductCreation } = require('./services/productAutomation');
const { sendGenericEmail } = require('./services/email');
require('dotenv').config();

(async () => {
    try {
        const topic = 'Faceless TikTok E-commerce';
        console.log('🤖 Test Trigger started for niche: ' + topic);
        const result = await automateProductCreation(topic, 19);

        const ownerEmail = process.env.GMAIL_USER;
        await sendGenericEmail(
            ownerEmail,
            `🚨 TEST GUMROAD ASSET READY: ${topic}`,
            `
            <div style="font-family: sans-serif; background: #0D1B2A; color: white; padding: 30px; border-radius: 8px;">
                <h1 style="color: #F4A81D;">Your 25-Page Sample Product is Ready</h1>
                <p>Please review the physical PDF attachment to confirm the non-robotic, cynical tone of voice.</p>
                
                <div style="background: #1B2A40; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Topic:</strong> ${topic}</p>
                    <p><strong>Suggested Price:</strong> $19.00</p>
                </div>
            </div>
            `,
            [{ filename: result.fileName, path: result.pdf_path }]
        );
        console.log('✅ TEST EMAIL SENT SUCCESSFULLY WITH PDF ATTACHED!');
    } catch(e) {
        console.error('FAILED', e);
    }
})();
