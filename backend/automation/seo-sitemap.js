const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const BASE_URL = 'https://nichereport.ai';
const SITEMAP_PATH = path.join(__dirname, '../../frontend/sitemap.xml');

const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/app.html', priority: '0.9', changefreq: 'weekly' },
    { url: '/height-growth.html', priority: '0.9', changefreq: 'weekly' },
];

// SEO keyword landing pages that drive organic traffic
const seoKeywords = [
    'how-to-grow-taller-naturally',
    'height-increase-protocol',
    'hgh-optimization',
    'niche-research-tool',
    'profitable-niches-2026',
    'ai-niche-finder',
    'micro-niche-ideas',
];

const generateSitemap = () => {
    try {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        for (const page of pages) {
            xml += `\n  <url>\n    <loc>${BASE_URL}${page.url}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`;
        }

        // Add SEO keyword pages as deep links to app.html
        for (const kw of seoKeywords) {
            xml += `\n  <url>\n    <loc>${BASE_URL}/app.html?keyword=${kw.replace(/-/g, '+')}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
        }

        xml += '\n</urlset>';

        fs.writeFileSync(SITEMAP_PATH, xml);
        console.log("✅ Sitemap generated at: " + SITEMAP_PATH);
    } catch (err) {
        console.error('Sitemap Error:', err.message);
    }
};

const startSitemapCron = () => {
    cron.schedule('0 0 * * 0', generateSitemap);
    generateSitemap();
};

module.exports = { startSitemapCron };
