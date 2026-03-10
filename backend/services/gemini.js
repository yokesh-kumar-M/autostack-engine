const { GoogleGenerativeAI } = require("@google/generative-ai");

// ── Keyword Intent Detection ────────────────────────────────────
const HEIGHT_KEYWORDS = [
    'height', 'grow taller', 'tall', 'growth hormone', 'hgh', 'bone',
    'stature', 'spine', 'posture', 'stretching', 'limb', 'grow tall',
    'increase height', 'height increase', 'height growth', 'growing taller',
    'biohacking', 'gumbi', 'bamboo method', '6ft', 'decompression',
    'epiphyseal', 'cartilage', 'height gain', 'grow inches', 'taller naturally',
    'short stature', 'height maximiz', 'biological potential', 'physical potential'
];

function isHeightRelated(keyword) {
    const lower = keyword.toLowerCase();
    return HEIGHT_KEYWORDS.some(h => lower.includes(h));
}

function getDemoReport(keyword) {
    if (isHeightRelated(keyword)) {
        return getHeightDemoReport(keyword);
    }
    return `
            <h2>Market Overview</h2>
            <p>The market for <strong>${keyword}</strong> is experiencing significant growth in 2026. Early movers who establish authority now will capture substantial market share.</p>
            <p>Based on our analysis, this niche shows strong demand signals with moderate competition — an excellent entry point for new entrepreneurs.</p>
            <h2>Top 5 Competitors</h2>
            <ul>
                <li><strong>Competitor 1:</strong> Focused on enterprise solutions with strong brand recognition.</li>
                <li><strong>Competitor 2:</strong> Targets the budget-conscious consumer with aggressive pricing.</li>
                <li><strong>Competitor 3:</strong> Excellent UX but premium price point creates a gap below them.</li>
                <li><strong>Competitor 4:</strong> Niche leader but outdated tech stack creates opportunity.</li>
                <li><strong>Competitor 5:</strong> Emerging startup with great marketing but thin product.</li>
            </ul>
            <h2>Monetization Opportunities</h2>
            <p>To successfully monetize <strong>${keyword}</strong>, start by validating demand with our [AFFILIATE:niche playbook]. Build your audience using [AFFILIATE:email marketing tool], then capture organic traffic with [AFFILIATE:SEO software].</p>
            <p>Use our [AFFILIATE:niche templates] to identify the highest-margin sub-niches within ${keyword}. Launch your site on a reliable [AFFILIATE:hosting service] for maximum uptime.</p>
            <h2>Content Strategy</h2>
            <ol>
                <li>How ${keyword} is Revolutionizing The Industry in 2026</li>
                <li>The Ultimate Guide to ${keyword} (2026 Edition)</li>
                <li>3 Mistakes Beginners Make With ${keyword}</li>
                <li>${keyword} vs. The Top Alternatives — Honest Comparison</li>
                <li>How to Maximize Your ROI with ${keyword}</li>
            </ol>
            <h2>Premium Upgrade CTA</h2>
            <p>Want the exact blueprint for dominating this niche? Get our [AFFILIATE:niche playbook] — a proven framework used by successful entrepreneurs.</p>
    `;
}

function getHeightDemoReport(keyword) {
    return `
            <h2>Biological Potential Analysis</h2>
            <p>Our AI has analyzed the scientific literature surrounding <strong>${keyword}</strong>. The human body retains significant growth potential through natural optimization protocols — even after puberty.</p>
            <p>Key growth factors include Human Growth Hormone (HGH) optimization, spinal decompression, and targeted nutrition protocols that most people completely overlook.</p>
            <h2>Top Growth Protocols Analyzed</h2>
            <ul>
                <li><strong>Spinal Decompression:</strong> Can unlock 1-3 inches of hidden height by expanding intervertebral discs.</li>
                <li><strong>HGH Optimization:</strong> Natural amino acid cocktails can spike growth hormone by up to 700%.</li>
                <li><strong>Postural Correction:</strong> Fixing Kyphosis and Lordosis can reveal inches you're currently losing.</li>
                <li><strong>Sleep Protocol:</strong> Deep sleep optimization increases HGH release by 157%.</li>
                <li><strong>Nutrition Timing:</strong> The 40/40/20 macronutrient rule fuels bone development.</li>
            </ul>
            <h2>Optimization Opportunities</h2>
            <p>To maximize your biological potential, you need a systematic approach. Start with the [AFFILIATE:height entry] to understand your baseline, then advance to [AFFILIATE:height primary] for the complete protocol.</p>
            <p>For the most accelerated results, the [AFFILIATE:height bundle] gives you every protocol, method, and scientific breakdown in one comprehensive system.</p>
            <h2>Recommended Protocol Stack</h2>
            <ol>
                <li>Week 1-2: Baseline measurement & postural assessment</li>
                <li>Week 3-4: Begin spinal decompression & HGH cocktail protocol</li>
                <li>Week 5-8: Advanced stretching regime & sleep optimization</li>
                <li>Week 9-12: Full protocol integration & progress tracking</li>
                <li>Week 12+: Maintenance & advanced techniques</li>
            </ol>
            <h2>Get Your Complete Blueprint</h2>
            <p>Ready to start your transformation? The [AFFILIATE:height primary] contains the exact 12-week protocol used by our most successful clients. For the ultimate system, grab the [AFFILIATE:height bundle].</p>
    `;
}

async function generateReport(keyword) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey || apiKey === 'placeholder-key' || apiKey.includes('xxxxxxxx')) {
        return getDemoReport(keyword);
    }

    const heightMode = isHeightRelated(keyword);
    const MAX_RETRIES = 3;
    const BASE_DELAY_MS = 15000;

    // Try multiple models in order of preference (newest first — they have fresh quotas)
    const MODELS_TO_TRY = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

    for (const modelName of MODELS_TO_TRY) {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);

                let systemPrompt;
                if (heightMode) {
                    systemPrompt = `You are Peak Potential AI, a specialized biological optimization research AI. Generate a comprehensive 1,200-word height growth and biological potential analysis report formatted in HTML for the given keyword.
The report MUST contain the following exact H2 headings:
<h2>Biological Potential Analysis</h2>
<h2>Top Growth Protocols Analyzed</h2>
<h2>Optimization Opportunities</h2>
<h2>Recommended Protocol Stack</h2>
<h2>Get Your Complete Blueprint</h2>

IMPORTANT: Throughout the report, naturally weave in these EXACT placeholders:
[AFFILIATE:height entry]
[AFFILIATE:height primary]
[AFFILIATE:height bundle]

Make the report scientifically grounded, citing real mechanisms (HGH, IGF-1, spinal decompression, bone remodeling). Be authoritative and specific with numbers and protocols. Format beautifully with paragraphs, lists, and bold text. Output valid HTML tags directly — no markdown codeblock wrappers.`;
                } else {
                    systemPrompt = `You are NicheReport AI, a highly specialized market research AI. Generate a comprehensive 1,200-word niche research report formatted in HTML for the given keyword.
The report MUST contain the following exact H2 headings:
<h2>Market Overview</h2>
<h2>Top 5 Competitors</h2>
<h2>Monetization Opportunities</h2>
<h2>Content Strategy</h2>
<h2>Premium Upgrade CTA</h2>

IMPORTANT: Throughout the report, naturally weave in these EXACT placeholders where appropriate:
[AFFILIATE:niche playbook]
[AFFILIATE:niche templates]
[AFFILIATE:email marketing tool]
[AFFILIATE:SEO software]
[AFFILIATE:hosting service]

Make the report highly valuable, insightful, actionable, and formatted beautifully with well-spaced paragraphs, lists, and bold text. Output valid HTML tags directly — no markdown codeblock wrappers.`;
                }

                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: systemPrompt
                });

                const prompt = heightMode
                    ? `Generate a detailed biological potential and height optimization analysis for: "${keyword}"`
                    : `Generate a highly valuable niche report for the keyword: "${keyword}"`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();
                text = text.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
                // Strip any <html>, <head>, <body>, <style>, <meta>, <!DOCTYPE> tags the AI might add
                text = text.replace(/<!DOCTYPE[^>]*>/gi, '');
                text = text.replace(/<\/?html[^>]*>/gi, '');
                text = text.replace(/<head[\s\S]*?<\/head>/gi, '');
                text = text.replace(/<\/?body[^>]*>/gi, '');
                text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
                text = text.replace(/<meta[^>]*>/gi, '');
                text = text.replace(/<title[\s\S]*?<\/title>/gi, '');
                text = text.trim();
                console.log(`Gemini report generated for "${keyword}" using ${modelName} (attempt ${attempt})`);
                return text;
            } catch (e) {
                const isRateLimit = e.message && (
                    e.message.includes('429') ||
                    e.message.includes('quota') ||
                    e.message.includes('Quota') ||
                    e.message.includes('Resource has been exhausted')
                );

                if (isRateLimit && attempt < MAX_RETRIES) {
                    const delay = BASE_DELAY_MS * attempt;
                    console.log(`Rate limited on ${modelName} (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                // If rate limited on this model, try the next model
                if (isRateLimit) {
                    console.log(`Model ${modelName} quota exhausted. Trying next model...`);
                    break;
                }

                console.error(`Gemini API Error (${modelName}, attempt ${attempt}):`, e.message);
                if (attempt === MAX_RETRIES) break;
            }
        }
    }

    console.log('All Gemini models failed. Returning demo report.');
    return getDemoReport(keyword);
}

async function generateProductGuide(keyword) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey || apiKey === 'placeholder-key' || apiKey.includes('xxxxxxxx')) {
        return `# The Simulated Blueprint for ${keyword}\nThis is a sample playbook content for your automated Gumroad product.`;
    }

    const MODELS_TO_TRY = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

    for (const modelName of MODELS_TO_TRY) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: `You are an elite, cynical, underground digital entrepreneur writing a controversial 'tell-all' book. 
CRITICAL ANTI-AI RULES:
- DO NOT sound like a helpful assistant, a textbook, or a motivational speaker.
- DO NOT use filler words like "Actionable Framework", "Moreover", "Furthermore", "Delve into".
- AVOID generic listicles. Write in continuous, hard-hitting, narrative paragraphs.
- Content must read as 100% human-written. Zero-fluff.
- Tone: Aggressive, deeply factual, slightly contrarian, insider-knowledge.`
            });

            let fullMarkdown = `# The Ultimate Blueprint: ${keyword}\n\n`;

            const chapters = [
                `Chapter 1: The Raw Truth About ${keyword}`,
                `Chapter 2: Building An Audience That Actually Buys`,
                `Chapter 3: The Monetization Math (No Fluff)`,
                `Chapter 4: The 30-Day Execution Timeline`,
                `Chapter 5: Traffic Arbitrage & Content Systems`,
                `Chapter 6: Defending Your Moat & Scaling Operations`,
                `Chapter 7: Asset Valuation & The Exit`
            ];

            console.log(`Starting multi-chapter generation for "${keyword}" using ${modelName}...`);
            for (let i = 0; i < chapters.length; i++) {
                const chapTitle = chapters[i];
                console.log(`Writing ${chapTitle}...`);
                const prompt = `Write a brutal, highly-detailed 1,500-word chapter for an elite business book about "${keyword}". 
The chapter is titled: "${chapTitle}".
Start dropping heavy insider knowledge immediately. No intros. Write narrative paragraphs with exact numbers and contrarian takes.
FORMAT: Use markdown headers (###) for sub-topics. Limit bold to critical metrics.`;

                let retries = 3;
                let success = false;
                while (retries > 0 && !success) {
                    try {
                        const result = await model.generateContent(prompt);
                        const response = await result.response;
                        const text = response.text();
                        fullMarkdown += `## ${chapTitle}\n\n${text}\n\n---\n\n`;
                        success = true;
                        await new Promise(r => setTimeout(r, 10000));
                    } catch (e) {
                        retries--;
                        if (retries === 0) {
                            console.error(`Failed to generate ${chapTitle}:`, e.message);
                            fullMarkdown += `## ${chapTitle}\n\n[Section skipped: ${e.message}]\n\n---\n\n`;
                        } else {
                            console.log(`Rate limited on ${chapTitle}. Retrying in 20s...`);
                            await new Promise(r => setTimeout(r, 20000));
                        }
                    }
                }
            }
            return fullMarkdown;
        } catch (e) {
            console.error(`Model ${modelName} failed for product guide:`, e.message);
            continue;
        }
    }

    return `# The Blueprint for ${keyword}\nFailed to generate full guide. All models exhausted.`;
}

module.exports = { generateReport, generateProductGuide, isHeightRelated };
