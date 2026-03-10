const { generateProductGuide } = require('./gemini');
const { createNichePDF } = require('./pdfService');
const fs = require('fs');
const path = require('path');

/**
 * The "Magic Button" function: 
 * 1. Generates Chapter-by-chapter AI content
 * 2. Creates a branded PDF
 * 3. Creates a Gumroad product draft
 * 4. Returns the result to the owner
 */
async function automateProductCreation(keyword, priceInUsd = 9) {
    try {
        console.log(`🚀 Starting Product Automation for: ${keyword}`);

        // 1. Generate High-Value Guide Content
        const content = await generateProductGuide(keyword);
        console.log('✅ AI Guide Content Generated');

        // 2. Create PDF
        const fileName = `${keyword.replace(/\s+/g, '-').toLowerCase()}-blueprint.pdf`;
        const outputDir = path.join(__dirname, '../temp_products');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
        
        const outputPath = path.join(outputDir, fileName);
        await createNichePDF(keyword, content, outputPath);
        console.log(`✅ PDF Created at: ${outputPath}`);

        // 3. Instead of hitting the 404 Gumroad API, we provide the files directly
        // to the owner. The owner will drag-and-drop the PDF into their Gumroad dashboard.
        console.log(`✅ Ready for Gumroad Listing`);

        return {
            success: true,
            gumroad_url: 'https://app.gumroad.com/products/new', // Directs to product creation page
            pdf_path: outputPath,
            fileName: fileName
        };

    } catch (error) {
        console.error('Automation Error:', error);
        throw error;
    }
}

module.exports = { automateProductCreation };
