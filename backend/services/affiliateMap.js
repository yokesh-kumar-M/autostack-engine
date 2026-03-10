const { buildUpsellLink, buildInlineCTA, buildReportUpsellBlock } = require('./gumroad');
const { isHeightRelated } = require('./gemini');

// ──────────────────────────────────────────────
// SMART Affiliate Link Mapping
// Contextually replaces placeholders based on
// whether the user searched height or business topics
// ──────────────────────────────────────────────

// --- HEIGHT GROWTH affiliate map ---
const HEIGHT_AFFILIATE_MAP = {
    '[AFFILIATE:height entry]': buildInlineCTA('hormone', '🩸 HGH Optimization Protocol (₹999)'),
    '[AFFILIATE:height primary]': buildInlineCTA('gumbi', '🧬 Gumbi Mode: Elite Stature Protocol (₹2,199)'),
    '[AFFILIATE:height bundle]': buildInlineCTA('ultimate_pack', '🏆 Super Human Growth Bundle — 9-in-1 (₹7,999)'),
    // Fallback legacy placeholders
    '[AFFILIATE:design course]': buildInlineCTA('gumbi', '🧬 Gumbi Mode Protocol (₹2,199)'),
    '[AFFILIATE:niche templates]': buildInlineCTA('bamboo', '🎋 The Bamboo Method (₹1,599)'),
    '[AFFILIATE:email marketing tool]': buildInlineCTA('heightgain', '📈 5-Inch Height Gain Blueprint (₹2,499)'),
    '[AFFILIATE:SEO software]': buildInlineCTA('superheight', '⚡ SuperHeight Super Charge (₹1,299)'),
    '[AFFILIATE:hosting service]': buildInlineCTA('primal', '🦴 Primal Hormones Guide (₹2,499)'),
};

// --- NICHE RESEARCH affiliate map ---
const NICHE_AFFILIATE_MAP = {
    '[AFFILIATE:niche playbook]': buildInlineCTA('playbook', '📘 The Ultimate Niche Research Playbook (₹2,499+)'),
    '[AFFILIATE:niche templates]': buildInlineCTA('templates', '📊 50 Profitable Micro-Niche Templates ($42+)'),
    '[AFFILIATE:email marketing tool]': `<a href="https://mailchimp.com" target="_blank" rel="noopener nofollow" class="affiliate-link" data-product="email">📧 Email Marketing Platform</a>`,
    '[AFFILIATE:SEO software]': `<a href="https://ahrefs.com" target="_blank" rel="noopener nofollow" class="affiliate-link" data-product="seo">🔍 SEO Research Tool</a>`,
    '[AFFILIATE:hosting service]': `<a href="https://render.com" target="_blank" rel="noopener nofollow" class="affiliate-link" data-product="hosting">🌐 Cloud Hosting Provider</a>`,
    // Fallback legacy placeholders
    '[AFFILIATE:design course]': buildInlineCTA('playbook', '📘 Niche Research Playbook (₹2,499+)'),
};

/**
 * Replace all [AFFILIATE:xxx] placeholders in the report HTML and
 * append the correct upsell CTA block based on keyword intent.
 *
 * @param {string} htmlContent - Raw report HTML from AI
 * @param {string|null} email  - Visitor email for checkout prefill
 * @param {string|null} keyword - The searched keyword
 * @returns {{ html: string, count: number, isHeight: boolean }}
 */
function injectAffiliateLinks(htmlContent, email = null, keyword = null) {
    let modifiedHtml = htmlContent;
    let affiliateCount = 0;

    const isHeight = keyword ? isHeightRelated(keyword) : false;
    const affiliateMap = isHeight ? HEIGHT_AFFILIATE_MAP : NICHE_AFFILIATE_MAP;

    // Replace all placeholders
    for (const [placeholder, linkHtml] of Object.entries(affiliateMap)) {
        while (modifiedHtml.includes(placeholder)) {
            modifiedHtml = modifiedHtml.replace(placeholder, linkHtml);
            affiliateCount++;
        }
    }

    // Append the correct upsell block
    modifiedHtml += buildReportUpsellBlock(email, keyword, isHeight);

    return { html: modifiedHtml, count: affiliateCount, isHeight };
}

module.exports = {
    injectAffiliateLinks,
    HEIGHT_AFFILIATE_MAP,
    NICHE_AFFILIATE_MAP,
};
