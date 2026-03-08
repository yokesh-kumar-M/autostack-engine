const express = require('express');
const router = express.Router();
const { automateProductCreation } = require('../services/productAutomation');
const emailService = require('../services/email');

// Trigger product automation (AI Content -> PDF -> Gumroad Listing)
router.post('/create-product', async (req, res) => {
    const { keyword, price } = req.body;
    
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        const result = await automateProductCreation(keyword, price || 9);
        
        // Notify owner with the links
        const message = `
            <h2>🚀 New Product Asset Generated!</h2>
            <p><strong>Keyword:</strong> ${keyword}</p>
            <p><strong>Blueprint PDF:</strong> Successfully generated locally at <code>${result.pdf_path}</code></p>
            <p><strong>Next Step:</strong> Gumroad has recently locked down automated product creation via their API. To list this product:</p>
            <ol>
                <li>Open <a href="${result.gumroad_url}">Gumroad Product Builder</a></li>
                <li>Name the product: "The Ultimate ${keyword} Strategy Playbook"</li>
                <li>Set the price to $${price || 9}</li>
                <li>Upload the generated PDF file from: <code>${result.pdf_path}</code></li>
            </ol>
            <p>The entire 2,000-word book has been formatted and branded automatically. It's ready to sell!</p>
        `;

        await emailService.sendGenericEmail(
            process.env.GMAIL_USER,
            `Business Update: New Product Ready for ${keyword}`,
            message
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
