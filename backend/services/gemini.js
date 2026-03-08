const { GoogleGenerativeAI } = require("@google/generative-ai");

function getDemoReport(keyword) {
    return `
            <h2>Market Overview</h2>
            <p>This is a simulated NicheReport for <strong>${keyword}</strong>. To get the real AI generation, please input your exact Gemini API Key in the backend <code>.env</code> file or Render dashboard.</p>
            <p>The market for ${keyword} is growing but competition is fierce. Entering this niche requires high-quality differentiation.</p>
            <h2>Top 5 Competitors</h2>
            <ul>
                <li><strong>Competitor 1:</strong> Focused on enterprise solutions.</li>
                <li><strong>Competitor 2:</strong> Targets the budget-conscious consumer.</li>
                <li><strong>Competitor 3:</strong> Excellent UX but high price.</li>
                <li><strong>Competitor 4:</strong> Niche leader but outdated tech.</li>
                <li><strong>Competitor 5:</strong> Emerging startup with great marketing.</li>
            </ul>
            <h2>Monetization Opportunities</h2>
            <p>To successfully monetize ${keyword}, you should build an engaged audience first using [AFFILIATE:email marketing tool]. Then, capture organic traffic using [AFFILIATE:SEO software]. Make sure to launch your site on a reliable [AFFILIATE:hosting service].</p>
            <p>For a proven step-by-step framework, grab our [AFFILIATE:design course] — or speed up your research with [AFFILIATE:niche templates].</p>
            <h2>Content Strategy</h2>
            <ol>
                <li>How ${keyword} is Revolutionizing The Industry</li>
                <li>The Ultimate Guide to ${keyword} (2026 Edition)</li>
                <li>3 Mistakes Beginners Make With ${keyword}</li>
                <li>${keyword} vs. The Alternatives</li>
                <li>How to Maximize Your ROI with ${keyword}</li>
            </ol>
            <h2>Premium Upgrade CTA</h2>
            <p>Want the exact blueprint for dominating this niche? Get our [AFFILIATE:design course].</p>
    `;
}

async function generateReport(keyword) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey || apiKey === 'placeholder-key' || apiKey.includes('xxxxxxxx')) {
        return getDemoReport(keyword);
    }

    const MAX_RETRIES = 3;
    const BASE_DELAY_MS = 20000; // 20 seconds — free tier rate limits need this

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: `You are NicheReport AI, a highly specialized market research AI. Generate a comprehensive 1,200-word niche research report formatted in HTML for the given keyword.
The report MUST contain the following exact H2 headings:
<h2>Market Overview</h2>
<h2>Top 5 Competitors</h2>
<h2>Monetization Opportunities</h2>
<h2>Content Strategy</h2>
<h2>Premium Upgrade CTA</h2>

IMPORTANT INSTRUCTION: Throughout the report, naturally weave in these EXACT placeholders where appropriate so our system can inject affiliate resources. DO NOT invent links, just use these placeholders:
[AFFILIATE:email marketing tool]
[AFFILIATE:SEO software]
[AFFILIATE:design course]
[AFFILIATE:niche templates]
[AFFILIATE:hosting service]

Make the report highly valuable, insightful, actionable, and formatted beautifully with well-spaced paragraphs, lists, and bold text for emphasis. Do not wrap in markdown tags like \`\`\`html, just output valid HTML tags directly.`
            });

            const prompt = `Generate a highly valuable niche report for the keyword: "${keyword}"`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            // Remove markdown codeblock tags if they were added despite instructions
            text = text.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
            console.log(`Gemini report generated successfully for "${keyword}" (attempt ${attempt})`);
            return text;
        } catch (e) {
            const isRateLimit = e.message && (
                e.message.includes('429') ||
                e.message.includes('quota') ||
                e.message.includes('Quota') ||
                e.message.includes('retry') ||
                e.message.includes('Resource has been exhausted')
            );

            if (isRateLimit && attempt < MAX_RETRIES) {
                const delay = BASE_DELAY_MS * attempt;
                console.log(`Gemini rate limited (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            console.error(`Gemini API Error (attempt ${attempt}/${MAX_RETRIES}, Fallback to Demo):`, e.message);
            return getDemoReport(keyword);
        }
    }

    return getDemoReport(keyword);
}

async function generateProductGuide(keyword) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey || apiKey === 'placeholder-key' || apiKey.includes('xxxxxxxx')) {
        return `# The Simulated Blueprint for ${keyword}\nThis is a sample playbook content for your automated Gumroad product.`;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `You are an elite, cynical, underground digital entrepreneur writing a controversial 'tell-all' book. 
CRITICAL ANTI-AI RULES:
- DO NOT sound like a helpful assistant, a textbook, or a motivational speaker. DO NOT ask conversational rhetorical questions (e.g. "Ready to cultivate your own passive income?").
- DO NOT use the words: "Actionable Framework", "Conclusion", "Moreover", "Furthermore", "Delve into", "Navigating the landscape", "A multifaceted approach", "It's important to note", "In summary".
- AVOID generic listicles (e.g., "1. Identify Your Niche", "2. Outcome"). AI uses these as crutches. Write in continuous, hard-hitting, narrative paragraphs instead.
- If you use bullet points, limit them to raw data, specific metrics, or exact software stacks. No generic advice.
- Content must pass all AI detectors as 100% human-written. Plagiarism-free. 
- Tone: Aggressive, deeply factual, slightly contrarian, insider-knowledge, zero-fluff. Read like a premium $500 consulting document.`
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

    try {
        console.log(`Starting multi-chapter generation of ~25 page book for "${keyword}"...`);
        for (let i = 0; i < chapters.length; i++) {
            const chapTitle = chapters[i];
            console.log(`Writing ${chapTitle}...`);
            const prompt = `Write a brutal, highly-detailed 1,500-word chapter for an elite business book about "${keyword}". 
The chapter is titled: "${chapTitle}".
CRITICAL: Do NOT write an intro that says "In this chapter, we will..." Just start dropping heavy, insider knowledge immediately.
CRITICAL: Do NOT format this as a standard AI listicle (e.g. "1. Step One", "2. Step Two"). Write highly readable, narrative paragraphs filled with exact numbers, deep psychological triggers, real or highly plausible case studies, and contrarian takes. 
CRITICAL: Do NOT ask the reader questions. Tell them exactly how it works.
FORMAT: Use markdown headers (###) for distinct sub-topics. Limit bold text to emphasizing critical metrics, not every single sentence.
DO NOT output the literal title of the chapter at the very beginning, just start the prose directly.`;

            let retries = 3;
            let success = false;
            while (retries > 0 && !success) {
                try {
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text();
                    
                    fullMarkdown += `## ${chapTitle}\n\n${text}\n\n---\n\n`;
                    success = true;
                    // Mindful delay to avoid hitting the 15 RPM free tier limit
                    await new Promise(r => setTimeout(r, 12000)); 
                } catch (e) {
                    retries--;
                    if (retries === 0) {
                        console.error(`Failed to generate ${chapTitle}:`, e.message);
                        fullMarkdown += `## ${chapTitle}\n\n[Section skipped due to API limits or errors: ${e.message}]\n\n---\n\n`;
                    } else {
                        console.log(`Rate limited on ${chapTitle}. Retrying in 20s...`);
                        await new Promise(r => setTimeout(r, 20000));
                    }
                }
            }
        }
        return fullMarkdown;
    } catch (e) {
        console.error("Gemini Guide Generation Error:", e.message);
        return `# The Blueprint for ${keyword}\nFailed to generate full guide. Error: ${e.message}`;
    }
}

module.exports = { generateReport, generateProductGuide };
