// ============================================================
// Gumroad Upsell Link Builder — NicheReport.ai
// Builds product links, CTA HTML blocks, and discount URLs
// for embedding into AI-generated reports.
// ============================================================

// --------------- Product Catalog ---------------
const PRODUCTS = {
  playbook: {
    id: 'niche-playbook',                // ✅ Verified live Gumroad product
    name: 'The Ultimate Niche Research Playbook',
    price: 9,
    currency: 'USD',
    description: '15-page PDF: niche validation frameworks, competitor teardowns, monetization blueprints, 10 proven niche case studies, and a 30-day action plan.',
    emoji: '📘',
    tag: 'playbook',
  },
  templates: {
    id: 'niche-playbook',                // Points to playbook as default until templates product is created
    name: '50 Profitable Micro-Niche Templates',
    price: 4,
    currency: 'USD',
    description: 'Google Sheets pack with 50 pre-researched micro-niches — traffic estimates, competition scores, monetization angles, and starter keyword lists.',
    emoji: '📊',
    tag: 'templates',
  },
  system: {
    id: 'autostack',                     // ✅ Verified live: AutoStack Revenue System ($399)
    name: 'AutoStack Revenue System',
    price: 399,
    currency: 'USD',
    description: 'The exact step-by-step system behind NicheReport.ai — build your own AI revenue engine from scratch with $0 investment.',
    emoji: '🚀',
    tag: 'system',
  },
};

// --------------- Link Builders ---------------

/**
 * Build a clean Gumroad product URL with optional prefill & UTM params.
 *
 * @param {string} productKey  - Key from PRODUCTS ('playbook' | 'templates' | 'system')
 * @param {Object} [opts]
 * @param {string} [opts.email]       - Pre-fill buyer email
 * @param {string} [opts.discount]    - Gumroad offer code (e.g. 'LAUNCH50')
 * @param {string} [opts.utmSource]   - UTM source for analytics
 * @param {string} [opts.utmMedium]   - UTM medium
 * @param {string} [opts.utmCampaign] - UTM campaign
 * @param {string} [opts.affiliateId] - Gumroad affiliate ID (for 3rd-party referrers)
 * @returns {string} Full URL
 */
function buildProductLink(productKey, opts = {}) {
  const product = PRODUCTS[productKey];
  if (!product) throw new Error(`Unknown product key: ${productKey}`);

  const base = `https://${process.env.GUMROAD_USERNAME || 'nichereport'}.gumroad.com/l/${product.id}`;
  const params = new URLSearchParams();

  if (opts.email) params.set('email', opts.email);
  if (opts.discount) params.set('offer_code', opts.discount);
  if (opts.affiliateId) params.set('a', opts.affiliateId);
  if (opts.utmSource) params.set('utm_source', opts.utmSource);
  if (opts.utmMedium) params.set('utm_medium', opts.utmMedium);
  if (opts.utmCampaign) params.set('utm_campaign', opts.utmCampaign);

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Convenience: build upsell link specifically for in-report CTAs.
 * Attaches utm_source=nichereport&utm_medium=report automatically.
 */
function buildUpsellLink(productKey, email = null) {
  return buildProductLink(productKey, {
    email,
    utmSource: 'nichereport',
    utmMedium: 'report',
    utmCampaign: 'auto_upsell',
  });
}

// --------------- CTA HTML Generators ---------------

/**
 * Generate the full upsell CTA HTML block appended to every report.
 * Includes both main products with styled buttons.
 *
 * @param {string|null} email - Visitor email (pre-fills checkout)
 * @param {string|null} keyword - The keyword the report was about (personalisation)
 * @returns {string} HTML string
 */
function buildReportUpsellBlock(email = null, keyword = null) {
  const playbookUrl = buildUpsellLink('playbook', email);
  const templatesUrl = buildUpsellLink('templates', email);

  const keywordLine = keyword
    ? `<p style="margin-bottom:12px;color:#ccc;">Based on your research into <strong>"${escapeHtml(keyword)}"</strong>, these resources will accelerate your results:</p>`
    : '';

  return `
<div style="margin-top:40px;padding:28px 24px;background:linear-gradient(135deg,#0D1B2A 0%,#1B2D45 100%);border:2px solid #F4A81D;border-radius:12px;text-align:center;font-family:system-ui,-apple-system,sans-serif;">
  <p style="font-size:13px;letter-spacing:2px;color:#F4A81D;margin:0 0 8px;text-transform:uppercase;">⚡ Unlock Premium</p>
  <h3 style="color:#fff;margin:0 0 12px;font-size:22px;">Take Your Niche Research to the Next Level</h3>
  ${keywordLine}
  <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;margin-top:20px;">
    <a href="${playbookUrl}" target="_blank" rel="noopener"
       style="display:inline-block;padding:14px 28px;background:#F4A81D;color:#0D1B2A;font-weight:700;border-radius:8px;text-decoration:none;font-size:15px;transition:transform .15s;">
      📘 Niche Playbook — $9
    </a>
    <a href="${templatesUrl}" target="_blank" rel="noopener"
       style="display:inline-block;padding:14px 28px;background:transparent;color:#F4A81D;font-weight:700;border:2px solid #F4A81D;border-radius:8px;text-decoration:none;font-size:15px;transition:transform .15s;">
      📊 50 Templates — $4
    </a>
  </div>
  <p style="margin-top:16px;font-size:12px;color:#8899aa;">Instant download · No subscription · 30-day refund guarantee</p>
</div>`;
}

/**
 * Generate a smaller inline CTA link (for the "Monetization Opportunities" section).
 */
function buildInlineCTA(productKey, anchorText = null) {
  const product = PRODUCTS[productKey];
  if (!product) return '';
  const url = buildUpsellLink(productKey);
  const text = anchorText || `${product.emoji} ${product.name} ($${product.price})`;
  return `<a href="${url}" target="_blank" rel="noopener" style="color:#F4A81D;font-weight:600;text-decoration:underline;">${text}</a>`;
}

// --------------- Gumroad Webhook Verification (future) ---------------

/**
 * Verify a Gumroad ping/webhook payload.
 * Gumroad sends POST with seller_id — match against your own.
 * Full signature verification requires Gumroad API v2.
 *
 * @param {Object} payload - req.body from Gumroad webhook
 * @returns {boolean}
 */
function verifyWebhook(payload) {
  // ✅ Seller ID confirmed: wJOtX63Uq1dcO8M3sxxVkA==
  const expectedSellerId = process.env.GUMROAD_SELLER_ID || 'wJOtX63Uq1dcO8M3sxxVkA==';
  return payload && payload.seller_id === expectedSellerId;
}

// --------------- Helpers ---------------

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --------------- Exports ---------------
module.exports = {
  PRODUCTS,
  buildProductLink,
  buildUpsellLink,
  buildInlineCTA,
  buildReportUpsellBlock,
  verifyWebhook,
};
