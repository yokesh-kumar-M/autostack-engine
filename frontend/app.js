// ===== NicheReport.ai — App Logic =====
// Handles: form submission, API calls, report rendering, email capture

// ===== Configuration =====
const CONFIG = {
    // Update this to your Render.com URL after deployment
    API_BASE: 'https://niche-report-api.onrender.com',
    MAX_FREE_REPORTS: 3,
    LOADING_STEP_DELAYS: [2000, 5000, 9000, 14000, 18000], // ms delays for loading steps
};

// ===== DOM Elements =====
const reportForm = document.getElementById('reportForm');
const keywordInput = document.getElementById('keywordInput');
const emailInput = document.getElementById('emailInput');
const generateBtn = document.getElementById('generateBtn');
const loadingContainer = document.getElementById('loadingContainer');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const reportContainer = document.getElementById('reportContainer');
const reportTitle = document.getElementById('reportTitle');
const reportMeta = document.getElementById('reportMeta');
const reportContent = document.getElementById('reportContent');
const emailCaptureForm = document.getElementById('emailCaptureForm');
const postReportCapture = document.getElementById('postReportCapture');

// ===== State =====
let currentReport = null;
let loadingTimers = [];

// ===== On Page Load: Check for keyword from URL =====
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('keyword');
    if (keyword) {
        keywordInput.value = keyword;
        // Auto-generate after a short delay
        setTimeout(() => reportForm.dispatchEvent(new Event('submit')), 500);
    }

    // Mobile menu
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('open');
        });
    }
});

// ===== Form Submission =====
reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const keyword = keywordInput.value.trim();
    const email = emailInput.value.trim();

    if (!keyword) return;

    // Check rate limit (local check — server also enforces)
    if (isRateLimited()) {
        showError('You\'ve reached your daily limit of 3 free reports. Come back tomorrow or upgrade to Premium for unlimited reports!');
        return;
    }

    // Show loading, hide others
    showLoading();
    hideError();
    hideReport();

    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword, email }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Server error (${response.status})`);
        }

        const data = await response.json();

        // Store report
        currentReport = {
            keyword,
            html: data.report_html,
            wordCount: data.word_count,
            affiliateCount: data.affiliate_count,
            generatedAt: new Date().toISOString(),
        };

        // Track report generation locally
        incrementReportCount();

        // Show report
        displayReport(currentReport);

        // Track in GA4
        if (typeof gtag === 'function') {
            gtag('event', 'report_generated', {
                keyword: keyword,
                word_count: data.word_count,
            });
        }

    } catch (err) {
        console.error('Report generation failed:', err);
        showError(err.message || 'Failed to generate report. Please try again.');
    } finally {
        hideLoading();
    }
});

// ===== Email Capture Form =====
emailCaptureForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('captureEmail').value.trim();
    if (!email) return;

    try {
        await fetch(`${CONFIG.API_BASE}/api/lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                keyword: currentReport?.keyword || '',
                source: 'post_report_capture',
            }),
        });

        // Show success regardless of API response
        emailCaptureForm.style.display = 'none';
        document.getElementById('captureSuccess').style.display = 'block';

        if (typeof gtag === 'function') {
            gtag('event', 'email_captured', { source: 'post_report' });
        }
    } catch (err) {
        // Still show success — email might have been captured
        emailCaptureForm.style.display = 'none';
        document.getElementById('captureSuccess').style.display = 'block';
    }
});

// ===== Display Report =====
function displayReport(report) {
    reportTitle.textContent = `Niche Report: ${report.keyword}`;
    reportMeta.textContent = `${report.wordCount} words · ${report.affiliateCount} resource links · Generated ${formatDate(report.generatedAt)}`;
    reportContent.innerHTML = report.html;
    reportContainer.classList.add('active');

    // Hide email capture if email already provided
    if (emailInput.value.trim()) {
        postReportCapture.style.display = 'none';
    }

    // Scroll to report
    reportContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Track affiliate link clicks
    reportContent.querySelectorAll('a[href*="amzn.to"], a[href*="shareasale"], a[href*="gumroad"]').forEach(link => {
        link.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'affiliate_click', {
                    link_url: link.href,
                    keyword: report.keyword,
                });
            }
            // Also log to backend
            fetch(`${CONFIG.API_BASE}/api/lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'affiliate_click',
                    keyword: report.keyword,
                    url: link.href,
                }),
            }).catch(() => { }); // Fire and forget
        });
    });
}

// ===== Loading Animation =====
function showLoading() {
    loadingContainer.classList.add('active');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    // Animate loading steps sequentially
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    loadingTimers = [];

    steps.forEach((stepId, index) => {
        const timer = setTimeout(() => {
            // Mark previous as done
            if (index > 0) {
                document.getElementById(steps[index - 1]).classList.remove('active');
                document.getElementById(steps[index - 1]).classList.add('done');
            }
            document.getElementById(stepId).classList.add('active');
        }, CONFIG.LOADING_STEP_DELAYS[index]);
        loadingTimers.push(timer);
    });
}

function hideLoading() {
    loadingContainer.classList.remove('active');
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Report →';
    loadingTimers.forEach(t => clearTimeout(t));
    loadingTimers = [];

    // Reset step states
    document.querySelectorAll('.loading-step').forEach(el => {
        el.classList.remove('active', 'done');
    });
}

// ===== Error Handling =====
function showError(msg) {
    errorMessage.textContent = msg;
    errorContainer.classList.add('active');
}

function hideError() {
    errorContainer.classList.remove('active');
}

// ===== Hide Report =====
function hideReport() {
    reportContainer.classList.remove('active');
}

// ===== Reset Form =====
function resetForm() {
    hideError();
    hideReport();
    keywordInput.value = '';
    emailInput.value = '';
    keywordInput.focus();

    // Reset email capture
    emailCaptureForm.style.display = 'inline-flex';
    document.getElementById('captureSuccess').style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Copy Report =====
function copyReport() {
    if (!currentReport) return;

    const textContent = reportContent.innerText;
    navigator.clipboard.writeText(textContent).then(() => {
        const copyBtn = document.querySelector('[onclick="copyReport()"]');
        const original = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = original, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = reportContent.innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });

    if (typeof gtag === 'function') {
        gtag('event', 'report_copied', { keyword: currentReport.keyword });
    }
}

// ===== Download Report =====
function downloadReport() {
    if (!currentReport) return;

    const htmlDoc = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Niche Report: ${currentReport.keyword} — NicheReport.ai</title>
    <style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.8; }
        h1 { color: #0D1B2A; border-bottom: 2px solid #F4A81D; padding-bottom: 12px; }
        h2 { color: #1B2838; margin-top: 32px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
        a { color: #F4A81D; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.85rem; color: #888; text-align: center; }
    </style>
</head>
<body>
    ${currentReport.html}
    <div class="footer">
        <p>Generated by NicheReport.ai — Free AI Niche Research Tool</p>
        <p>Visit <a href="https://nichereport.ai">nichereport.ai</a> to generate your own reports</p>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `niche-report-${currentReport.keyword.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof gtag === 'function') {
        gtag('event', 'report_downloaded', { keyword: currentReport.keyword });
    }
}

// ===== Rate Limiting (Client-Side) =====
function getReportCount() {
    const data = JSON.parse(localStorage.getItem('nichereport_usage') || '{}');
    const today = new Date().toISOString().split('T')[0];
    if (data.date !== today) return 0;
    return data.count || 0;
}

function incrementReportCount() {
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem('nichereport_usage') || '{}');
    if (data.date !== today) {
        localStorage.setItem('nichereport_usage', JSON.stringify({ date: today, count: 1 }));
    } else {
        data.count = (data.count || 0) + 1;
        localStorage.setItem('nichereport_usage', JSON.stringify(data));
    }
}

function isRateLimited() {
    return getReportCount() >= CONFIG.MAX_FREE_REPORTS;
}

// ===== Utility: Format Date =====
function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
