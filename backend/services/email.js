const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const templates = {
    day0: (email) => ({
        from: '"NicheReport AI" <' + process.env.GMAIL_USER + '>',
        to: email,
        subject: 'Your AI Niche Report is inside 📈',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333;">
            <p>Hey there,</p>
            <p>You recently generated a market analysis report on NicheReport.ai.</p>
            <p>Finding the right niche is 80% of the battle when building an online business. Most people fail because they target an oversaturated market, or a market with no monetization potential.</p>
            <p>Because you used our tool, you're already ahead of the curve.</p>
            <p>If you want to take the guesswork out of building a profitable asset in this niche, you need a blueprint. Let me hand it to you.</p>
            <p><strong>Click here to grab The Ultimate Niche Research Playbook:</strong><br/>
            <a href="https://yourgumroadlink.com" style="color: #F4A81D; font-weight: bold; text-decoration: none;">🔗 Get The Blueprint Now</a></p>
            <p>Talk soon,<br/>Founder, NicheReport.ai</p>
            
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #777;">
                Sent to you because you requested a report at nichereport.ai.
            </p>
        </div>`
    }),
    
    day3: (email) => ({
        from: '"NicheReport AI" <' + process.env.GMAIL_USER + '>',
        to: email,
        subject: '3 mistakes preventing your first $1,000 ❌',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333;">
            <p>Hey,</p>
            <p>It's been a few days since you ran your market analysis. Did you take action yet?</p>
            <p>Here are 3 reasons why most people find a great niche but make $0:</p>
            <ol>
                <li>They wait too long to build an email list.</li>
                <li>They try to reinvent the wheel instead of using proven templates.</li>
                <li>They don't analyze their competitors' weaknesses.</li>
            </ol>
            <p>We created a resource that solves all of this: <strong>50 Profitable Micro-Niche Templates</strong>. It's basically a cheat code for finding a niche that converts immediately.</p>
            <p>Instead of spending weeks guessing, just use our templates.</p>
            <p><a href="https://yourgumroadlink.com" style="color: #F4A81D; font-weight: bold; text-decoration: none;">🔗 Get The Niche Templates Here</a></p>
            <p>To your success,<br/>Founder, NicheReport.ai</p>
            
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #777;">
                Sent to you because you requested a report at nichereport.ai.
            </p>
        </div>`
    }),
    
    day7: (email) => ({
        from: '"NicheReport AI" <' + process.env.GMAIL_USER + '>',
        to: email,
        subject: 'The exact tools you need for this niche 🛠️',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333;">
            <p>Hey,</p>
            <p>If you're serious about dominating your new niche, you need the right tools. I see a lot of people trying to string together cheap, broken tools and wondering why their traffic isn't converting.</p>
            <p>Here is the exact tech stack we recommend for launching your new project today:</p>
            <p><strong>1. The Best Email Capture Tool:</strong> If you aren't building an email list in your niche, you are losing money. Use this.<br/>
            <a href="https://youraffiliatelink1.com" style="color: #F4A81D; font-weight: bold; text-decoration: none;">🔗 View Our Top Email Tool</a></p>
            <p><strong>2. The SEO Engine:</strong> Organic traffic is free traffic. Find out exactly what your competitors rank for using this tool.<br/>
            <a href="https://youraffiliatelink2.com" style="color: #F4A81D; font-weight: bold; text-decoration: none;">🔗 View Our Top SEO Tool</a></p>
            <p><strong>3. The Premium Blueprint:</strong> Need a step-by-step guide on how exactly we build sites that print money? Grab the playbook.<br/>
            <a href="https://yourgumroadlink.com" style="color: #F4A81D; font-weight: bold; text-decoration: none;">🔗 Grab The Blueprint</a></p>
            <p>Let's build something great.<br/>Founder, NicheReport.ai</p>
            
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #777;">
                Sent to you because you requested a report at nichereport.ai.
            </p>
        </div>`
    })
};

const sendWelcomeEmail = async (email) => {
    try {
        const info = await transporter.sendMail(templates.day0(email));
        console.log('✅ Welcome email sent to: ' + email);
        return true;
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        throw error;
    }
};

const sendDay3Email = async (email) => {
    try {
        const info = await transporter.sendMail(templates.day3(email));
        console.log('✅ Day 3 email sent to: ' + email);
        return true;
    } catch (error) {
        console.error('❌ Error sending Day 3 email:', error);
        throw error;
    }
};

const sendDay7Email = async (email) => {
    try {
        const info = await transporter.sendMail(templates.day7(email));
        console.log('✅ Day 7 email sent to: ' + email);
        return true;
    } catch (error) {
        console.error('❌ Error sending Day 7 email:', error);
        throw error;
    }
};

module.exports = {
    sendWelcomeEmail,
    sendDay3Email,
    sendDay7Email
};
