const express = require('express');
const router = express.Router();
const { NICHE_AFFILIATE_MAP, HEIGHT_AFFILIATE_MAP } = require('../services/affiliateMap');

router.get('/links', (req, res) => {
    res.json({
        niche: Object.keys(NICHE_AFFILIATE_MAP),
        height: Object.keys(HEIGHT_AFFILIATE_MAP)
    });
});

module.exports = router;
