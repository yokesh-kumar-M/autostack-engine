const { buildUpsellLink, buildInlineCTA, buildReportUpsellBlock } = require('./gumroad');
const axios = require('axios');
// ──────────────────────────────────────────────
// Affiliate Link Mapping
// Placeholders emitted by Claude are replaced
// with real HTML links before the report is sent.
// ──────────────────────────────────────────────

const AFFILIATE_MAP = {
  '[AFFILIATE:email marketing tool]': `<a href="${process.env.AFFILIATE_LINK_EMAIL || 'https://mailchimp.com'}" target="_blank" rel="noopener nofollow" class="affiliate-link" data-product="email">📧 Email Marketing Tool</a>`,

  '[AFFILIATE:SEO software]': `<a href="${process.env.AFFILIATE_LINK_SEO || 'https://ahrefs.com'}" target="_blank" rel="noopener nofollow" class="affiliate-link" data-product="seo">🔍 SEO Software</a>`,

  // Points to Gumroad Product 1: The Ultimate Niche Research Playbook ($9)
  '[AFFILIATE:design course]': buildInlineCTA('playbook', '📘 The Ultimate Niche Research Playbook ($9)'),

  // Points to Gumroad Product 2: 50 Profitable Micro-Niche Templates ($4)
  '[AFFILIATE:niche templates]': buildInlineCTA('templates', '📊 50 Profitable Micro-Niche Templates ($4)'),

  '[AFFILIATE:hosting service]': `<a href="${process.env.AFFILIATE_LINK_HOST || 'https://render.com'}" target="_blank" rel="noopener nofollow" class="affiliate-link" data-product="hosting">🌐 Web Hosting Provider</a>`,
};

const GUMROAD_ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;
const GUMROAD_API_URL = 'https://api.gumroad.com/v2';

/**
 * Creates a new Gumroad product programmatically.
 */
async function createProduct(name, price, description) {
    try {
        const response = await axios.post(`${GUMROAD_API_URL}/products`, {
            access_token: GUMROAD_ACCESS_TOKEN,
            name: name,
            price: price, // in cents (e.g., 1000 = $10.00)
            description: description,
            url: `https://nichereport.ai/resources/${name.replace(/\s+/g, '-').toLowerCase()}`
        });
        return response.data;
    } catch (error) {
        console.error("Error creating Gumroad product:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Fetch all Gumroad products for this user.
 */
async function getProducts() {
    try {
        const response = await axios.get(`${GUMROAD_API_URL}/products`, {
            params: { access_token: GUMROAD_ACCESS_TOKEN }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching Gumroad products:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Generates an affiliate link for a specific product and user email.
 * Note: Gumroad requires the affiliate to have an account, or we can use generic tracking links.
 */
async function generateAffiliateLink(productId, email) {
    try {
        // Gumroad API v2 /affiliates endpoint allows you to add an affiliate to a product
        const response = await axios.post(`${GUMROAD_API_URL}/affiliates`, {
            access_token: GUMROAD_ACCESS_TOKEN,
            email: email,
            amount: 50, // 50% commission
            product_id: productId
        });
        
        return response.data;
    } catch (error) {
        console.error("Error generating Gumroad affiliate link:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Replace all [AFFILIATE:xxx] placeholders in the report HTML and
 * append the Gumroad upsell CTA block at the end.
 *
 * @param {string} htmlContent - Raw report HTML from Claude
 * @param {string|null} email  - Visitor email for checkout prefill
 * @param {string|null} keyword - The searched keyword (personalises CTA)
 * @returns {{ html: string, count: number }}
 */
function injectAffiliateLinks(htmlContent, email = null, keyword = null) {
  let modifiedHtml = htmlContent;
  let affiliateCount = 0;

  // Replace all placeholders
  for (const [placeholder, linkHtml] of Object.entries(AFFILIATE_MAP)) {
    while (modifiedHtml.includes(placeholder)) {
      modifiedHtml = modifiedHtml.replace(placeholder, linkHtml);
      affiliateCount++;
    }
  }

  // Append the styled Gumroad upsell block at the bottom of every report
  modifiedHtml += buildReportUpsellBlock(email, keyword);

  return { html: modifiedHtml, count: affiliateCount };
}

module.exports = {
    injectAffiliateLinks,
    AFFILIATE_MAP,
    createProduct,
    getProducts,
    generateAffiliateLink
};
