// ============================================================
// Gumroad Product Catalog & CTA Builder — NicheReport.ai
// Smart contextual upsells based on user intent
// ============================================================

// --------------- Product Catalog (Prices match actual Gumroad) ---------------
const PRODUCTS = {
    // --- NICHE RESEARCH PRODUCTS ---
    playbook: {
        id: 'niche-playbook',
        name: 'The Ultimate Niche Research Playbook',
        price: '₹2,499+',
        priceRaw: 2499,
        emoji: '📘',
        category: 'niche',
    },
    templates: {
        id: 'xqane',
        name: '50 Profitable Micro-Niche Templates',
        price: '$42+',
        priceRaw: 42,
        emoji: '📊',
        category: 'niche',
    },
    system: {
        id: 'autostack_Revenue_System',
        name: 'AutoStack Revenue System',
        price: '₹399+',
        priceRaw: 399,
        emoji: '🚀',
        category: 'niche',
    },

    // --- HEIGHT GROWTH PRODUCTS ---
    bamboo: {
        id: 'bamboomethod',
        name: 'The Bamboo Method for Height',
        price: '₹1,599',
        priceRaw: 1599,
        emoji: '🎋',
        category: 'height',
    },
    gumbi: {
        id: 'gumbimodeprotocol',
        name: 'Gumbi Mode: Elite Stature Protocol',
        price: '₹2,199',
        priceRaw: 2199,
        emoji: '🧬',
        category: 'height',
    },
    '6ft6': {
        id: '6ft6method',
        name: 'The 6ft6 Method',
        price: '₹2,499',
        priceRaw: 2499,
        emoji: '📏',
        category: 'height',
    },
    superheight: {
        id: 'superheightsupercharge',
        name: 'SuperHeight Super Charge',
        price: '₹1,299',
        priceRaw: 1299,
        emoji: '⚡',
        category: 'height',
    },
    hormone: {
        id: 'hghoptimization',
        name: 'HGH Optimization Protocol',
        price: '₹999',
        priceRaw: 999,
        emoji: '🩸',
        category: 'height',
    },
    heightgain: {
        id: '5inchheightgain',
        name: '5-Inch Height Gain Blueprint',
        price: '₹2,499',
        priceRaw: 2499,
        emoji: '📈',
        category: 'height',
    },
    primal: {
        id: 'primalhormones',
        name: 'Primal Hormones Guide',
        price: '₹2,499',
        priceRaw: 2499,
        emoji: '🦴',
        category: 'height',
    },

    // --- BUNDLES ---
    ultimate_pack: {
        id: 'ultimatebundle',
        name: 'Super Human Growth Bundle (9-in-1)',
        price: '₹7,999',
        priceRaw: 7999,
        emoji: '🏆',
        category: 'height',
    }
};

// --------------- Link Builders ---------------

function buildProductLink(productKey, opts = {}) {
    const product = PRODUCTS[productKey];
    if (!product) throw new Error(`Unknown product key: ${productKey}`);

    const base = `https://${process.env.GUMROAD_USERNAME || 'yokeshkumar'}.gumroad.com/l/${product.id}`;
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

function buildUpsellLink(productKey, email = null) {
    return buildProductLink(productKey, {
        email,
        utmSource: 'nichereport',
        utmMedium: 'report',
        utmCampaign: 'auto_upsell',
    });
}

// --------------- CTA HTML Generators ---------------

function buildInlineCTA(productKey, anchorText = null) {
    const product = PRODUCTS[productKey];
    if (!product) return '';
    const url = buildUpsellLink(productKey);
    const text = anchorText || `${product.emoji} ${product.name} (${product.price})`;
    return `<a href="${url}" target="_blank" rel="noopener" style="color:#F4A81D;font-weight:600;text-decoration:underline;">${text}</a>`;
}

/**
 * Build the upsell block for HEIGHT GROWTH reports
 */
function buildHeightUpsellBlock(email = null, keyword = null) {
    const bundleUrl = buildUpsellLink('ultimate_pack', email);
    const gumbiUrl = buildUpsellLink('gumbi', email);
    const hghUrl = buildUpsellLink('hormone', email);

    const keywordLine = keyword
        ? `<p style="margin-bottom:12px;color:#ccc;">Based on your research into <strong>"${escapeHtml(keyword)}"</strong>, these elite protocols will accelerate your transformation:</p>`
        : '';

    return `
<div style="margin-top:40px;padding:28px 24px;background:linear-gradient(135deg,#0D1B2A 0%,#1B2D45 100%);border:2px solid #F4A81D;border-radius:12px;text-align:center;font-family:system-ui,-apple-system,sans-serif;">
  <p style="font-size:13px;letter-spacing:2px;color:#F4A81D;margin:0 0 8px;text-transform:uppercase;">🏆 Elite Transformation</p>
  <h3 style="color:#fff;margin:0 0 12px;font-size:22px;">Maximize Your Biological Potential</h3>
  ${keywordLine}
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;">
    <a href="${bundleUrl}" target="_blank" rel="noopener"
       onclick="gtag('event','purchase',{'currency':'INR','value':7999,'items':[{'item_id':'ultimate_bundle','item_name':'Super Human Growth Bundle'}]});"
       style="display:inline-block;padding:14px 28px;background:#F4A81D;color:#0D1B2A;font-weight:700;border-radius:8px;text-decoration:none;font-size:15px;">
      🏆 Ultimate 9-in-1 Bundle — ₹7,999
    </a>
    <a href="${gumbiUrl}" target="_blank" rel="noopener"
       onclick="gtag('event','purchase',{'currency':'INR','value':2199,'items':[{'item_id':'gumbi_mode','item_name':'Gumbi Mode Protocol'}]});"
       style="display:inline-block;padding:14px 28px;background:transparent;color:#F4A81D;font-weight:700;border:2px solid #F4A81D;border-radius:8px;text-decoration:none;font-size:15px;">
      🧬 Gumbi Mode Protocol — ₹2,199
    </a>
    <a href="${hghUrl}" target="_blank" rel="noopener"
       style="display:inline-block;padding:12px 24px;background:transparent;color:#22c55e;font-weight:600;border:1px solid #22c55e;border-radius:8px;text-decoration:none;font-size:14px;">
      🩸 HGH Protocol — ₹999
    </a>
  </div>
  <p style="margin-top:16px;font-size:12px;color:#8899aa;">🔥 <strong>Limited Time:</strong> Get lifetime updates when you buy today · Secure Checkout · Instant PDF Access</p>
  <div style="margin-top:16px;padding:10px;background:rgba(244,168,29,0.1);border-radius:8px;">
    <p style="font-size:12px;color:#F4A81D;margin:0;">⏰ Offer ends soon — Regular price ₹12,999</p>
  </div>
</div>

<div style="margin-top:20px;padding:20px;background:#1a2f4a;border-radius:12px;text-align:center;">
  <p style="color:#9FB3C8;font-size:14px;margin:0 0 10px;">💡 <strong>Success Story:</strong> "I gained 2 inches in 8 weeks using the Gumbi Mode protocol. This is the real deal." — Raj, Mumbai</p>
</div>`;
}

/**
 * Build the upsell block for NICHE RESEARCH reports
 */
function buildNicheUpsellBlock(email = null, keyword = null) {
    const playbookUrl = buildUpsellLink('playbook', email);
    const templatesUrl = buildUpsellLink('templates', email);
    const systemUrl = buildUpsellLink('system', email);

    const keywordLine = keyword
        ? `<p style="margin-bottom:12px;color:#ccc;">You just analyzed <strong>"${escapeHtml(keyword)}"</strong> — now get the tools to dominate it:</p>`
        : '';

    return `
<div style="margin-top:40px;padding:28px 24px;background:linear-gradient(135deg,#0D1B2A 0%,#1B2D45 100%);border:2px solid #F4A81D;border-radius:12px;text-align:center;font-family:system-ui,-apple-system,sans-serif;">
  <p style="font-size:13px;letter-spacing:2px;color:#F4A81D;margin:0 0 8px;text-transform:uppercase;">🚀 Go From Research To Revenue</p>
  <h3 style="color:#fff;margin:0 0 12px;font-size:22px;">Turn This Report Into A Business</h3>
  ${keywordLine}
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;">
    <a href="${playbookUrl}" target="_blank" rel="noopener"
       onclick="gtag('event','purchase',{'currency':'INR','value':2499,'items':[{'item_id':'niche_playbook','item_name':'Niche Research Playbook'}]});"
       style="display:inline-block;padding:14px 28px;background:#F4A81D;color:#0D1B2A;font-weight:700;border-radius:8px;text-decoration:none;font-size:15px;">
      📘 Niche Research Playbook — ₹2,499+
    </a>
    <a href="${templatesUrl}" target="_blank" rel="noopener"
       style="display:inline-block;padding:14px 28px;background:transparent;color:#F4A81D;font-weight:700;border:2px solid #F4A81D;border-radius:8px;text-decoration:none;font-size:15px;">
      📊 50 Micro-Niche Templates — $42+
    </a>
    <a href="${systemUrl}" target="_blank" rel="noopener"
       style="display:inline-block;padding:12px 24px;background:transparent;color:#22c55e;font-weight:600;border:1px solid #22c55e;border-radius:8px;text-decoration:none;font-size:14px;">
      🚀 AutoStack Revenue System — ₹399+
    </a>
  </div>
  <p style="margin-top:16px;font-size:12px;color:#8899aa;">🔥 <strong>Bonus:</strong> Get my personal email course ($197 value) when you buy today</p>
  <div style="margin-top:16px;padding:10px;background:rgba(244,168,29,0.1);border-radius:8px;">
    <p style="font-size:12px;color:#F4A81D;margin:0;">⏰ Last chance — Price increases to ₹4,999 in 48 hours</p>
  </div>
</div>

<div style="margin-top:20px;padding:20px;background:#1a2f4a;border-radius:12px;text-align:center;">
  <p style="color:#9FB3C8;font-size:14px;margin:0 0 10px;">💡 <strong>Verified Result:</strong> "Found 3 untapped niches worth $50K/year. This playbook is gold." — Amit, Bangalore</p>
</div>`;
}

/**
 * Legacy wrapper — picks the right upsell block based on keyword context.
 * Called by affiliateMap.js
 */
function buildReportUpsellBlock(email = null, keyword = null, isHeight = false) {
    if (isHeight) {
        return buildHeightUpsellBlock(email, keyword);
    }
    return buildNicheUpsellBlock(email, keyword);
}

// --------------- Gumroad Webhook Verification ---------------

function verifyWebhook(payload) {
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
    buildHeightUpsellBlock,
    buildNicheUpsellBlock,
    verifyWebhook,
};
