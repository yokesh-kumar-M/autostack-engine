const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://niche-report-ai.vercel.app';
const SITEMAP_PATH = path.join(__dirname, '../frontend/sitemap.xml');

const pages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/app.html', priority: '0.8', changefreq: 'monthly' }
];

const generateSitemap = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    for (const page of pages) {
        xml += '\n  <url>\n    <loc>' + BASE_URL + page.url + '</loc>\n    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n    <changefreq>' + page.changefreq + '</changefreq>\n    <priority>' + page.priority + '</priority>\n  </url>';
    }

    xml += '\n</urlset>';

    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log("✅ Sitemap successfully generated at: " + SITEMAP_PATH);
    console.log("   Contains " + pages.length + " URLs for " + BASE_URL);
};

generateSitemap();
