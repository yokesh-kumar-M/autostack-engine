const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const cleanupTempProducts = () => {
    console.log("EXEC: Starting storage cleanup...", new Date().toISOString());
    const tempDir = path.join(__dirname, '../temp_products');

    if (!fs.existsSync(tempDir)) {
        console.log("Cleanup: temp_products directory does not exist. Skipping.");
        return;
    }

    try {
        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

        let deletedCount = 0;
        files.forEach(file => {
            const filePath = path.join(tempDir, file);
            const stats = fs.statSync(filePath);

            if (now - stats.mtimeMs > MAX_AGE) {
                fs.unlinkSync(filePath);
                deletedCount++;
            }
        });

        console.log(`✅ Cleanup completed. Deleted ${deletedCount} old PDF(s).`);
    } catch (error) {
        console.error("Cleanup Error:", error.message);
    }
};

const startCleanupCron = () => {
    // Run at 03:00 AM UTC every day
    console.log("Cleanup Cron Job Registered (runs daily at 03:00 UTC).");
    cron.schedule('0 3 * * *', cleanupTempProducts);
    
    // Also run once on startup
    cleanupTempProducts();
};

module.exports = { startCleanupCron };
