const express = require('express');
const router = express.Router();
const { AFFILIATE_MAP } = require('../services/affiliateMap');

router.get('/links', (req, res) => {
    // Send list of affiliate configs to frontend if needed
    res.json(AFFILIATE_MAP);
});

module.exports = router;
