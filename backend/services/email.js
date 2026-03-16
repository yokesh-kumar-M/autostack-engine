const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const OWNER_EMAIL = process.env.GMAIL_USER;

// Product URLs
const GUMBI_MODE_URL = 'https://yokeshkumar.gumroad.com/l/gumbimodeprotocol?utm_source=nichereport&utm_medium=email';
const BAMBOO_METHOD_URL = 'https://yokeshkumar.gumroad.com/l/bamboomethod?utm_source=nichereport&utm_medium=email';
const ULTIMATE_BUNDLE_URL = 'https://yokeshkumar.gumroad.com/l/ultimatebundle?utm_source=nichereport&utm_medium=email';
const HGH_URL = 'https://yokeshkumar.gumroad.com/l/hghoptimization?utm_source=nichereport&utm_medium=email';
const PLAYBOOK_URL = 'https://yokeshkumar.gumroad.com/l/niche-playbook?utm_source=nichereport&utm_medium=email';
const TEMPLATES_URL = 'https://yokeshkumar.gumroad.com/l/xqane?utm_source=nichereport&utm_medium=email';
const AUTOSTACK_URL = 'https://yokeshkumar.gumroad.com/l/autostack_Revenue_System?utm_source=nichereport&utm_medium=email';

// ─────────────────────────────────────────────
// CUSTOMER-FACING EMAILS — HEIGHT GROWTH SEQUENCE
// ─────────────────────────────────────────────
const heightTemplates = {
    day0: (email) => ({
        from: '"Peak Potential AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: 'Your Growth Potential Analysis is inside 📈',
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">
            <p>Hey there,</p>
            <p>You recently generated a biological potential analysis on NicheReport.ai.</p>
            <p>Most people fail at physical optimization because they follow generic advice. The science says otherwise — targeted protocols for HGH optimization, spinal decompression, and bone remodeling produce real, measurable results.</p>
            <p>Here's the most effective starting point:</p>
            <p><strong>🩸 HGH Optimization Protocol (₹999):</strong> Learn the exact amino acid cocktail that spikes growth hormone by up to 700%.<br/>
            <a href="${HGH_URL}" style="color:#F4A81D;font-weight:bold;">Unlock HGH Protocol →</a></p>
            <p>To your growth,<br/>Yokesh, Founder of NicheReport.ai</p>
            <hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>
            <p style="font-size:12px;color:#777;">Sent because you requested an analysis at niche-report-ai.vercel.app. Reply STOP to unsubscribe.</p>
        </div>`
    }),
    day1: (email) => ({
        from: '"Peak Potential AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: 'Quick question about your height goals 🎯',
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">
            <p>Hey,</p>
            <p>Quick follow-up from yesterday's analysis.</p>
            <p>Did you know that <strong>HGH production declines by 14% every decade after age 20</strong>? This means the earlier you start optimizing, the better your results will be.</p>
            <p>Here's what most people don't realize about height growth:</p>
            <ul>
                <li>Your spine compresses by 1-3cm throughout the day — decompression can reverse this permanently</li>
                <li>L-arginine before sleep can spike HGH by 700% — but timing and dosage matter hugely</li>
                <li>Poor posture alone can steal 1-3 inches of your actual height</li>
            </ul>
            <p>The <strong>HGH Optimization Protocol</strong> covers the exact science — dosages, timing, cycling schedules, and what to avoid:</p>
            <p><a href="${HGH_URL}" style="color:#F4A81D;font-weight:bold;">🩸 Get the HGH Protocol (₹999) →</a></p>
            <p>Or if you want the complete 12-week system:</p>
            <p><a href="${GUMBI_MODE_URL}" style="color:#F4A81D;font-weight:bold;">🧬 Gumbi Mode Protocol (₹2,199) →</a></p>
            <p>— Yokesh</p>
            <hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>
            <p style="font-size:12px;color:#777;">Sent because you requested a report at niche-report-ai.vercel.app. Reply STOP to unsubscribe.</p>
        </div>`
    }),
    day3: (email) => ({
        from: '"Peak Potential AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: '3 biological blocks preventing your growth ❌',
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">
            <p>Hey,</p>
            <p>It's been a few days since you ran your analysis. Here are 3 reasons most growth attempts fail:</p>
            <ol><li>Poor sleep hygiene destroying HGH production.</li>
            <li>Ignoring spinal decompression techniques.</li>
            <li>Failing to optimize IGF-1 signaling through nutrition.</li></ol>
            <p>The <strong>Gumbi Mode Protocol</strong> solves all of this with a structured 12-week system:</p>
            <p><a href="${GUMBI_MODE_URL}" style="color:#F4A81D;font-weight:bold;">🧬 Get Gumbi Mode (₹2,199) →</a></p>
            <p>Or start lighter with the Bamboo Method:</p>
            <p><a href="${BAMBOO_METHOD_URL}" style="color:#F4A81D;font-weight:bold;">🎋 Get The Bamboo Method (₹1,599) →</a></p>
            <p>To your success,<br/>Yokesh</p>
            <hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>
            <p style="font-size:12px;color:#777;">Sent because you requested a report at niche-report-ai.vercel.app. Reply STOP to unsubscribe.</p>
        </div>`
    }),
    day7: (email) => ({
        from: '"Peak Potential AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: 'The Complete Human Growth Library 🏆',
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">
            <p>Hey,</p>
            <p>If you're serious about maximizing your physical potential, here's the complete system:</p>
            <p><strong>🏆 Super Human Growth Bundle (9-in-1):</strong> Every protocol, method, and scientific breakdown in one package.<br/>
            <a href="${ULTIMATE_BUNDLE_URL}" style="color:#F4A81D;font-weight:bold;">Grab The Ultimate Bundle (₹7,999) →</a></p>
            <p><strong>🧬 Gumbi Mode Protocol:</strong> Our flagship stature engineering system.<br/>
            <a href="${GUMBI_MODE_URL}" style="color:#F4A81D;font-weight:bold;">Gumbi Mode (₹2,199) →</a></p>
            <p>Transform your biology today.<br/>Yokesh</p>
            <hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>
            <p style="font-size:12px;color:#777;">Sent because you requested a report at niche-report-ai.vercel.app. Reply STOP to unsubscribe.</p>
        </div>`
    })
};

// ─────────────────────────────────────────────
// CUSTOMER-FACING EMAILS — NICHE RESEARCH SEQUENCE
// ─────────────────────────────────────────────
const nicheTemplates = {
    day0: (email) => ({
        from: '"NicheReport AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: 'Your Niche Research Report is ready 📊',
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">
            <p>Hey there,</p>
            <p>You recently generated a niche research report on NicheReport.ai — great move!</p>
            <p>Finding the right niche is 80% of the game. Most entrepreneurs fail because they skip this step or rely on gut feeling instead of data.</p>
            <p>Want the complete framework for validating and dominating any niche?</p>
            <p><strong>📘 The Ultimate Niche Research Playbook (₹2,499+):</strong><br/>
            <a href="${PLAYBOOK_URL}" style="color:#F4A81D;font-weight:bold;">Get The Playbook →</a></p>
            <p>To your success,<br/>Yokesh, Founder of NicheReport.ai</p>
            <hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>
            <p style="font-size:12px;color:#777;">Sent because you requested a report at niche-report-ai.vercel.app. Reply STOP to unsubscribe.</p>
        </div>`
    }),
    day1: (email) => ({
        from: '"NicheReport AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: 'The #1 reason niche businesses fail 💀',
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">
            <p>Hey,</p>
            <p>Quick follow-up from yesterday.</p>
            <p>After analyzing thousands of niche businesses, here's the brutal truth: <strong>90% fail because they skip validation</strong>.</p>
            <p>They pick a niche that "sounds good," build a website, create content... then wonder why nobody buys.</p>
            <p>The fix is simple: validate BEFORE you build. Check search volume, analyze competitor revenue, test with a minimum viable offer.</p>
            <p>Our <strong>50 Profitable Micro-Niche Templates</strong> give you 50 pre-validated niches with exact search data, CPC, and monetization blueprints — so you skip straight to the ones that work:</p>
            <p><a href="${TEMPLATES_URL}" style="color:#F4A81D;font-weight:bold;">📊 Get 50 Pre-Validated Niches ($42+) →</a></p>
            <p>Or get the complete system for finding your own:</p>
            <p><a href="${PLAYBOOK_URL}" style="color:#F4A81D;font-weight:bold;">📘 Niche Research Playbook (₹2,499+) →</a></p>
            <p>— Yokesh</p>
            <hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>
            <p style="font-size:12px;color:#777;">Sent because you requested a report at niche-report-ai.vercel.app. Reply STOP to unsubscribe.</p>
        </div>`
    }),
    day3: (email) => ({
        from: '"NicheReport AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: 'Found your niche? Here\'s what to do next 🎯',
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">
            <p>Hey,</p>
            <p>It's been 3 days since you ran your niche analysis. Did you pick a winner?</p>
            <p>Here's the brutal truth: 90% of niche businesses fail because founders don't validate demand before building. Don't be one of them.</p>
            <p>Our <strong>50 Profitable Micro-Niche Templates</strong> give you 50 pre-validated, high-margin niches with exact search volume, CPC data, and monetization blueprints.</p>
            <p><a href="${TEMPLATES_URL}" style="color:#F4A81D;font-weight:bold;">📊 Get 50 Pre-Validated Niches ($42+) →</a></p>
            <p>Or build the whole system yourself:</p>
            <p><a href="${AUTOSTACK_URL}" style="color:#F4A81D;font-weight:bold;">🚀 AutoStack Revenue System (₹399+) →</a></p>
            <p>Best,<br/>Yokesh</p>
            <hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>
            <p style="font-size:12px;color:#777;">Sent because you requested a report at niche-report-ai.vercel.app. Reply STOP to unsubscribe.</p>
        </div>`
    }),
    day7: (email) => ({
        from: '"NicheReport AI" <' + OWNER_EMAIL + '>',
        to: email,
        subject: 'Last chance: Your complete niche domination toolkit 🚀',
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;color:#333;">
            <p>Hey,</p>
            <p>One week ago you were researching niches. Where are you now?</p>
            <p>Here's your complete toolkit to go from research to revenue:</p>
            <p><strong>1. 📘 The Niche Research Playbook:</strong> Validate any niche in 48 hours.<br/>
            <a href="${PLAYBOOK_URL}" style="color:#F4A81D;font-weight:bold;">Get It (₹2,499+) →</a></p>
            <p><strong>2. 📊 50 Micro-Niche Templates:</strong> Pre-researched profitable niches.<br/>
            <a href="${TEMPLATES_URL}" style="color:#F4A81D;font-weight:bold;">Browse Templates ($42+) →</a></p>
            <p><strong>3. 🚀 AutoStack Revenue System:</strong> Build an automated revenue engine.<br/>
            <a href="${AUTOSTACK_URL}" style="color:#F4A81D;font-weight:bold;">Get The System (₹399+) →</a></p>
            <p>Take action today.<br/>Yokesh</p>
            <hr style="margin-top:40px;border:none;border-top:1px solid #eee;"/>
            <p style="font-size:12px;color:#777;">Sent because you requested a report at niche-report-ai.vercel.app. Reply STOP to unsubscribe.</p>
        </div>`
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
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
            <h2 style="color:#F4A81D;margin:0 0 16px;">🔔 New Lead Captured</h2>
            <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#94a3b8;width:120px;">Email</td><td style="padding:8px 0;color:#fff;font-weight:bold;">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Niche</td><td style="padding:8px 0;color:#fff;">${keyword || 'unknown'}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Source</td><td style="padding:8px 0;color:#fff;">${source || 'report_form'}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Time</td><td style="padding:8px 0;color:#fff;">${new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})} IST</td></tr>
            </table></div>`
    }),

    reportGenerated: (keyword, wordCount, affiliateCount, hasEmail) => ({
        from: '"NicheReport Alerts" <' + OWNER_EMAIL + '>',
        to: OWNER_EMAIL,
        subject: '📊 Report: "' + keyword + '"',
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
            <h2 style="color:#22c55e;margin:0 0 16px;">📊 Report Generated</h2>
            <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#94a3b8;">Keyword</td><td style="padding:8px 0;color:#fff;font-weight:bold;">${keyword}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Words</td><td style="padding:8px 0;color:#fff;">${wordCount}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Affiliate Links</td><td style="padding:8px 0;color:#fff;">${affiliateCount}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Email</td><td style="padding:8px 0;color:#fff;">${hasEmail ? '✅ Drip queued' : '❌ No'}</td></tr>
            </table></div>`
    }),

    rateLimitHit: (ip, keyword) => ({
        from: '"NicheReport Alerts" <' + OWNER_EMAIL + '>',
        to: OWNER_EMAIL,
        subject: '🔥 Hot Lead — Rate Limit: "' + keyword + '"',
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
            <h2 style="color:#f97316;margin:0 0 16px;">🔥 Rate Limit Hit — High-Intent User!</h2>
            <p style="color:#cbd5e1;">This user burned all 3 free reports. Consider reaching out.</p>
            <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#94a3b8;">Keyword</td><td style="padding:8px 0;color:#fff;">${keyword || 'unknown'}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">IP</td><td style="padding:8px 0;color:#fff;">${ip}</td></tr>
            </table></div>`
    }),

    gumroadSale: (productName, price, buyerEmail) => ({
        from: '"NicheReport Alerts" <' + OWNER_EMAIL + '>',
        to: OWNER_EMAIL,
        subject: '💰 SALE! ₹' + (price/100).toFixed(0) + ' — ' + productName,
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
            <h2 style="color:#F4A81D;margin:0 0 16px;">💰 You Made A Sale!</h2>
            <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#94a3b8;">Product</td><td style="padding:8px 0;color:#fff;font-weight:bold;">${productName}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Amount</td><td style="padding:8px 0;color:#22c55e;font-size:20px;font-weight:bold;">₹${(price/100).toFixed(0)}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Buyer</td><td style="padding:8px 0;color:#fff;">${buyerEmail || 'N/A'}</td></tr>
            </table>
            <p style="margin-top:20px;font-size:24px;text-align:center;">🎉🎉🎉</p></div>`
    }),

    affiliateClick: (keyword, url) => ({
        from: '"NicheReport Alerts" <' + OWNER_EMAIL + '>',
        to: OWNER_EMAIL,
        subject: '🔗 Click: ' + keyword,
        html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
            <h2 style="color:#818cf8;margin:0 0 16px;">🔗 Affiliate Click</h2>
            <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#94a3b8;">Keyword</td><td style="padding:8px 0;color:#fff;">${keyword || 'unknown'}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">URL</td><td style="padding:8px 0;color:#60a5fa;word-break:break-all;font-size:12px;">${url || 'N/A'}</td></tr>
            </table></div>`
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

// Contextual email sending — picks height vs niche templates
const sendWelcomeEmail = (email, isHeight = false) => {
    const templates = isHeight ? heightTemplates : nicheTemplates;
    return send(templates.day0(email));
};

const sendDay1Email = (email, isHeight = false) => {
    const templates = isHeight ? heightTemplates : nicheTemplates;
    return send(templates.day1(email));
};

const sendDay3Email = (email, isHeight = false) => {
    const templates = isHeight ? heightTemplates : nicheTemplates;
    return send(templates.day3(email));
};

const sendDay7Email = (email, isHeight = false) => {
    const templates = isHeight ? heightTemplates : nicheTemplates;
    return send(templates.day7(email));
};

// Owner notifications
const notifyNewLead           = (email, keyword, source)     => send(notify.newLead(email, keyword, source));
const notifyReportGenerated   = (kw, words, aff, hasEmail)   => send(notify.reportGenerated(kw, words, aff, hasEmail));
const notifyRateLimitHit      = (ip, keyword)                => send(notify.rateLimitHit(ip, keyword));
const notifyGumroadSale       = (product, price, buyer)      => send(notify.gumroadSale(product, price, buyer));
const notifyAffiliateClick    = (keyword, url)               => send(notify.affiliateClick(keyword, url));

const sendGenericEmail = (to, subject, html, attachments = []) => {
    return send({
        from: '"NicheReport AI" <' + OWNER_EMAIL + '>',
        to,
        subject,
        html,
        attachments
    });
};

const sendReportEmail = async (email, keyword, htmlContent) => {
    const { createNichePDF } = require('./pdfService');
    const { isHeightRelated } = require('./gemini');
    const fs = require('fs');
    const path = require('path');

    const isHeight = isHeightRelated(keyword);
    const ctaUrl = isHeight ? GUMBI_MODE_URL : PLAYBOOK_URL;
    const ctaText = isHeight ? 'Gumbi Mode Protocol' : 'Niche Research Playbook';

    try {
        const plainText = htmlContent
            .replace(/<h[12][^>]*>/gi, '## ')
            .replace(/<\/h[12]>/gi, '\n\n')
            .replace(/<h[34][^>]*>/gi, '### ')
            .replace(/<\/h[34]>/gi, '\n\n')
            .replace(/<li[^>]*>/gi, '- ')
            .replace(/<\/li>/gi, '\n')
            .replace(/<p[^>]*>/gi, '\n\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)')
            .replace(/<[^>]*>?/gm, '')
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
            .replace(/[\u{2600}-\u{26FF}]/gu, '')
            .trim();

        const fileName = `NicheReport-${keyword.replace(/\s+/g, '-')}.pdf`;
        const tempPath = path.join(__dirname, '../temp_' + Date.now() + '.pdf');
        
        await createNichePDF(keyword, plainText, tempPath);

        const success = await send({
            from: '"NicheReport AI" <' + OWNER_EMAIL + '>',
            to: email,
            subject: `Your AI Report: ${keyword} 📈`,
            html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
                <h2>Your Report is Ready!</h2>
                <p>Attached is your comprehensive analysis for <strong>"${keyword}"</strong>.</p>
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Review the key findings in the PDF</li>
                    <li>Check out the <a href="${ctaUrl}">${ctaText}</a> for the complete blueprint</li>
                </ul>
                <p>Talk soon,<br/>Yokesh, Founder of NicheReport.ai</p>
            </div>`,
            attachments: [{ filename: fileName, path: tempPath }]
        });

        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        return success;
    } catch (err) {
        console.error('Failed to send report email:', err.message);
        return false;
    }
};

module.exports = {
    sendWelcomeEmail,
    sendDay1Email,
    sendDay3Email,
    sendDay7Email,
    notifyNewLead,
    notifyReportGenerated,
    notifyRateLimitHit,
    notifyGumroadSale,
    notifyAffiliateClick,
    sendGenericEmail,
    sendReportEmail
};
