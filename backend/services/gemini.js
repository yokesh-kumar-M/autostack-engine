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

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
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
        return text;
    } catch (e) {
        console.error("Gemini API Error (Fallback to Demo Mode):", e.message);
        return getDemoReport(keyword);
    }
}

module.exports = { generateReport };
