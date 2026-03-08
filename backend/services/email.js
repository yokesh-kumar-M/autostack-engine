const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const OWNER_EMAIL = process.env.GMAIL_USER; // yokeshkumar1704@gmail.com
const PLAYBOOK_URL = 'https://yokeshkumar.gumroad.com/l/niche-playbook';
const TEMPLATES_URL = 'https://yokeshkumar.gumroad.com/l/niche-playbook';
const AUTOSTACK_URL  = 'https://yokeshkumar.gumroad.com/l/autostack';

// ─────────────────────────────────────────────
// CUSTOMER-FACING EMAILS
// ─────────────────────────────────────────────

const templates = {
    day0: (email) => ({
        from: '"NicheReport AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: 'Your AI Niche Report is inside 📈',
        html: '<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">' +
            '<p>Hey there,</p>' +
            '<p>You recently generated a market analysis report on NicheReport.ai.</p>' +
            '<p>Finding the right niche is 80% of the battle when building an online business. Most people fail because they target an oversaturated market, or a market with no monetization potential.</p>' +
            '<p>Because you used our tool, you\'re already ahead of the curve.</p>' +
            '<p>If you want to take the guesswork out of building a profitable asset in this niche, you need a proven blueprint. Let me hand it to you.</p>' +
            '<p><strong>Grab The Ultimate Niche Research Playbook ($9):</strong><br/>' +
            '<a href="' + PLAYBOOK_URL + '" style="color:#F4A81D;font-weight:bold;text-decoration:none;">📘 Get The Blueprint Now →</a></p>' +
            '<p>Talk soon,<br/>Yokesh, Founder of NicheReport.ai</p>' +
            '<hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>' +
            '<p style="font-size:12px;color:#777;">Sent because you requested a report at nichereport.ai.</p>' +
            '</div>'
    }),

    day3: (email) => ({
        from: '"NicheReport AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: '3 mistakes preventing your first $1,000 ❌',
        html: '<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">' +
            '<p>Hey,</p>' +
            '<p>It\'s been a few days since you ran your market analysis. Did you take action yet?</p>' +
            '<p>Here are 3 reasons why most people find a great niche but make $0:</p>' +
            '<ol><li>They wait too long to build an email list.</li>' +
            '<li>They try to reinvent the wheel instead of using proven templates.</li>' +
            '<li>They don\'t analyze their competitors\' weaknesses.</li></ol>' +
            '<p>We created a resource that solves all of this: <strong>50 Profitable Micro-Niche Templates</strong>. It\'s a cheat code for launching a niche that converts immediately.</p>' +
            '<p><a href="' + TEMPLATES_URL + '" style="color:#F4A81D;font-weight:bold;text-decoration:none;">📊 Get The Templates Here →</a></p>' +
            '<p>To your success,<br/>Yokesh, NicheReport.ai</p>' +
            '<hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>' +
            '<p style="font-size:12px;color:#777;">Sent because you requested a report at nichereport.ai.</p>' +
            '</div>'
    }),

    day7: (email) => ({
        from: '"NicheReport AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: 'The exact tools you need for this niche 🛠️',
        html: '<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">' +
            '<p>Hey,</p>' +
            '<p>If you\'re serious about dominating your niche, you need the right tools. Here\'s the exact stack we recommend:</p>' +
            '<p><strong>1. The Full Launch Blueprint:</strong> Step-by-step guide to building a niche site that generates passive income.<br/>' +
            '<a href="' + PLAYBOOK_URL + '" style="color:#F4A81D;font-weight:bold;text-decoration:none;">📘 Grab The Playbook ($9) →</a></p>' +
            '<p><strong>2. The Complete Revenue System:</strong> Want to build your own AI income engine like NicheReport.ai?<br/>' +
            '<a href="' + AUTOSTACK_URL + '" style="color:#F4A81D;font-weight:bold;text-decoration:none;">🚀 AutoStack Revenue System ($399) →</a></p>' +
            '<p>Let\'s build something great.<br/>Yokesh, NicheReport.ai</p>' +
            '<hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>' +
            '<p style="font-size:12px;color:#777;">Sent because you requested a report at nichereport.ai.</p>' +
            '</div>'
    })
};

// ─────────────────────────────────────────────
// OWNER NOTIFICATION EMAILS
// ─────────────────────────────────────────────

const notify = {
    newLead: (email, keyword, source) => ({
        from: '"NicheReport Alerts" <' + OWNER_EMAIL + '>',
        to: OWNER_EMAIL,
        subject: '🔔 New Lead: ' + email,
        html: '<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">' +
            '<h2 style="color:#F4A81D;margin:0 0 16px;">🔔 New Lead Captured</h2>' +
            '<table style="width:100%;border-collapse:collapse;">' +
            '<tr><td style="padding:8px 0;color:#94a3b8;width:120px;">Email</td><td style="padding:8px 0;color:#fff;font-weight:bold;">' + email + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Niche</td><td style="padding:8px 0;color:#fff;">' + (keyword || 'unknown') + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Source</td><td style="padding:8px 0;color:#fff;">' + (source || 'report_form') + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Time</td><td style="padding:8px 0;color:#fff;">' + new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}) + ' IST</td></tr>' +
            '</table>' +
            '<p style="margin-top:16px;color:#64748b;font-size:13px;">Welcome email has been sent automatically ✅</p>' +
            '</div>'
    }),

    reportGenerated: (keyword, wordCount, affiliateCount, hasEmail) => ({
        from: '"NicheReport Alerts" <' + OWNER_EMAIL + '>',
        to: OWNER_EMAIL,
        subject: '📊 Report Generated: "' + keyword + '"',
        html: '<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">' +
            '<h2 style="color:#22c55e;margin:0 0 16px;">📊 New Report Generated</h2>' +
            '<table style="width:100%;border-collapse:collapse;">' +
            '<tr><td style="padding:8px 0;color:#94a3b8;width:140px;">Keyword</td><td style="padding:8px 0;color:#fff;font-weight:bold;">' + keyword + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Word Count</td><td style="padding:8px 0;color:#fff;">' + wordCount + ' words</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Affiliate Links</td><td style="padding:8px 0;color:#fff;">' + affiliateCount + ' links injected</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Email Provided</td><td style="padding:8px 0;color:#fff;">' + (hasEmail ? '✅ Yes — Follow-up queued' : '❌ No') + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Time</td><td style="padding:8px 0;color:#fff;">' + new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}) + ' IST</td></tr>' +
            '</table>' +
            '</div>'
    }),

    rateLimitHit: (ip, keyword) => ({
        from: '"NicheReport Alerts" <' + OWNER_EMAIL + '>',
        to: OWNER_EMAIL,
        subject: '🔥 Hot Lead — Rate Limit Hit: "' + keyword + '"',
        html: '<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">' +
            '<h2 style="color:#f97316;margin:0 0 16px;">🔥 Hot Lead — Rate Limit Hit!</h2>' +
            '<p style="color:#cbd5e1;">Someone used all 3 free reports and hit the rate limit. This is a <strong style="color:#fbbf24;">high-intent buyer</strong>.</p>' +
            '<table style="width:100%;border-collapse:collapse;">' +
            '<tr><td style="padding:8px 0;color:#94a3b8;width:120px;">Last Keyword</td><td style="padding:8px 0;color:#fff;font-weight:bold;">' + (keyword || 'unknown') + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">IP</td><td style="padding:8px 0;color:#fff;">' + ip + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Time</td><td style="padding:8px 0;color:#fff;">' + new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}) + ' IST</td></tr>' +
            '</table>' +
            '</div>'
    }),

    gumroadSale: (productName, price, buyerEmail) => ({
        from: '"NicheReport Alerts" <' + OWNER_EMAIL + '>',
        to: OWNER_EMAIL,
        subject: '💰 SALE! $' + (price/100).toFixed(2) + ' — ' + productName,
        html: '<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">' +
            '<h2 style="color:#F4A81D;margin:0 0 16px;">💰 You Just Made A Sale!</h2>' +
            '<table style="width:100%;border-collapse:collapse;">' +
            '<tr><td style="padding:8px 0;color:#94a3b8;width:130px;">Product</td><td style="padding:8px 0;color:#fff;font-weight:bold;">' + productName + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Amount</td><td style="padding:8px 0;color:#22c55e;font-size:20px;font-weight:bold;">$' + (price/100).toFixed(2) + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Buyer Email</td><td style="padding:8px 0;color:#fff;">' + (buyerEmail || 'N/A') + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Time</td><td style="padding:8px 0;color:#fff;">' + new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}) + ' IST</td></tr>' +
            '</table>' +
            '<p style="margin-top:20px;font-size:24px;text-align:center;">🎉 MacBook Pro counter ticking! 🎉</p>' +
            '</div>'
    }),

    affiliateClick: (keyword, url) => ({
        from: '"NicheReport Alerts" <' + OWNER_EMAIL + '>',
        to: OWNER_EMAIL,
        subject: '🔗 Affiliate Click: ' + keyword,
        html: '<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">' +
            '<h2 style="color:#818cf8;margin:0 0 16px;">🔗 Affiliate Link Clicked</h2>' +
            '<table style="width:100%;border-collapse:collapse;">' +
            '<tr><td style="padding:8px 0;color:#94a3b8;width:110px;">Keyword</td><td style="padding:8px 0;color:#fff;">' + (keyword || 'unknown') + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">URL</td><td style="padding:8px 0;color:#60a5fa;word-break:break-all;font-size:12px;">' + (url || 'N/A') + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#94a3b8;">Time</td><td style="padding:8px 0;color:#fff;">' + new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}) + ' IST</td></tr>' +
            '</table>' +
            '</div>'
    })
};

// ─────────────────────────────────────────────
// SEND HELPERS
// ─────────────────────────────────────────────

const send = async (template) => {
    try {
        await transporter.sendMail(template);
        return true;
    } catch (err) {
        console.error('Email send error:', err.message);
        return false;
    }
};

const sendWelcomeEmail        = (email)                      => send(templates.day0(email));
const sendDay3Email           = (email)                      => send(templates.day3(email));
const sendDay7Email           = (email)                      => send(templates.day7(email));

// Owner notifications (fire-and-forget — never block the API response)
const notifyNewLead           = (email, keyword, source)     => send(notify.newLead(email, keyword, source));
const notifyReportGenerated   = (kw, words, aff, hasEmail)   => send(notify.reportGenerated(kw, words, aff, hasEmail));
const notifyRateLimitHit      = (ip, keyword)                => send(notify.rateLimitHit(ip, keyword));
const notifyGumroadSale       = (product, price, buyer)      => send(notify.gumroadSale(product, price, buyer));
const notifyAffiliateClick    = (keyword, url)               => send(notify.affiliateClick(keyword, url));

module.exports = {
    sendWelcomeEmail,
    sendDay3Email,
    sendDay7Email,
    notifyNewLead,
    notifyReportGenerated,
    notifyRateLimitHit,
    notifyGumroadSale,
    notifyAffiliateClick
};
