const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

router.get('/feed.xml', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(500).send("Database not configured.");
        }

        // Fetch the last 20 unique "queries" to build our trending niches RSS feed
        const { data, error } = await supabase
            .from('queries')
            .select('keyword, created_at')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        // Deduplicate keywords so the feed is high quality
        const uniqueKeywords = [];
        const uniqueItems = [];

        for (const item of data) {
            const word = item.keyword.toLowerCase().trim();
            if (!uniqueKeywords.includes(word) && word.length > 3) {
                uniqueKeywords.push(word);
                uniqueItems.push(item);
                if (uniqueItems.length >= 10) break; // Keep the feed to top 10 recent
            }
        }

        let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n' +
'<rss version="2.0">\n' +
'<channel>\n' +
'  <title>NicheReport.ai — Trending AI Niches</title>\n' +
'  <link>https://nichereport.ai/</link>\n' +
'  <description>Automated live feed of the most profitable emerging niches discovered by our AI researchers today.</description>\n';

        for (const item of uniqueItems) {
            const encodedKeyword = encodeURIComponent(item.keyword);
            xml += '\n' +
'  <item>\n' +
'    <title>Trending Niche: ' + item.keyword + '</title>\n' +
'    <link>https://nichereport.ai/app.html?keyword=' + encodedKeyword + '</link>\n' +
'    <description>Our AI has just compiled a comprehensive market analysis, competitor breakdown, and monetization strategy for \\\'' + item.keyword + '\\\'. Check out the full breakdown for free.</description>\n' +
'    <pubDate>' + new Date(item.created_at).toUTCString() + '</pubDate>\n' +
'  </item>';
        }

        xml += '\n' +
'</channel>\n' +
'</rss>';

        res.set('Content-Type', 'application/xml');
        res.status(200).send(xml);

    } catch (error) {
        console.error('RSS Feed Error:', error);
        res.status(500).send("Error generating feed.");
    }
});

module.exports = router;
