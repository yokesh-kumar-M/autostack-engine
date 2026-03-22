// ===== NicheReport.ai — App Logic =====
// Handles: form submission, API calls, report rendering, email capture

// ===== Configuration =====
const CONFIG = {
    API_BASE: 'https://autostack-api-production.onrender.com',
    MAX_FREE_REPORTS: 3,
    LOADING_STEP_DELAYS: [2000, 4000, 7000, 12000, 18000],
    REQUEST_TIMEOUT: 60000,
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
let isGenerating = false;

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

    // Prevent double submission
    if (isGenerating) return;

    const keyword = keywordInput.value.trim();
    const email = emailInput.value.trim();

    if (!keyword) {
        showError('Please enter a keyword to analyze.');
        return;
    }

    if (keyword.length < 2) {
        showError('Keyword must be at least 2 characters.');
        return;
    }

    // Check rate limit (local check — server also enforces)
    if (isRateLimited()) {
        showError('You\'ve reached your daily limit of 3 free reports. Come back tomorrow! Need more? Check out our premium bundles.');
        return;
    }

    // Show loading, hide others
    showLoading();
    hideError();
    hideReport();
    isGenerating = true;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

        const response = await fetch(`${CONFIG.API_BASE}/api/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword, email }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errorMsg = errData.error || `Server error (${response.status})`;
            throw new Error(errorMsg);
        }

        const data = await response.json();

        // Validate response
        if (!data.report_html) {
            throw new Error('Invalid response from server. Please try again.');
        }

        // Store report
        currentReport = {
            keyword,
            html: data.report_html,
            wordCount: data.word_count || 0,
            affiliateCount: data.affiliate_count || 0,
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
                word_count: data.word_count || 0,
            });
        }

    } catch (err) {
        console.error('Report generation failed:', err);
        
        let errorMsg = 'Failed to generate report. Please try again.';
        
        if (err.name === 'AbortError') {
            errorMsg = 'Request timed out. The AI is taking too long. Please try again.';
        } else if (err.message.includes('429')) {
            errorMsg = 'Daily limit reached. Come back tomorrow for more free reports!';
        } else if (err.message.includes('500')) {
            errorMsg = 'Server is temporarily busy. Please try again in a few moments.';
        } else if (err.message) {
            errorMsg = err.message;
        }
        
        showError(errorMsg);
    } finally {
        hideLoading();
        isGenerating = false;
    }
});

// ===== Email Capture Form =====
emailCaptureForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailField = document.getElementById('captureEmail');
    const email = emailField.value.trim();
    
    if (!email || !email.includes('@') || !email.includes('.')) {
        emailField.style.borderColor = '#ef4444';
        setTimeout(() => emailField.style.borderColor = '', 2000);
        return;
    }

    const submitBtn = emailCaptureForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                keyword: currentReport?.keyword || '',
                source: 'post_report_capture',
            }),
        });

        // Show success
        emailCaptureForm.style.display = 'none';
        const successEl = document.getElementById('captureSuccess');
        if (successEl) {
            successEl.style.display = 'block';
        }

        if (typeof gtag === 'function') {
            gtag('event', 'email_captured', { source: 'post_report' });
        }
    } catch (err) {
        console.error('Email capture failed:', err);
        // Still show success for better UX
        emailCaptureForm.style.display = 'none';
        const successEl = document.getElementById('captureSuccess');
        if (successEl) {
            successEl.style.display = 'block';
        }
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ===== Display Report =====
function displayReport(report) {
    if (!report || !report.html) return;

    if (reportTitle) reportTitle.textContent = `Report: ${report.keyword}`;
    if (reportMeta) reportMeta.textContent = `${report.wordCount || 0} words · ${report.affiliateCount || 0} resource links · Generated ${formatDate(report.generatedAt)}`;
    if (reportContent) reportContent.innerHTML = report.html;
    if (reportContainer) reportContainer.classList.add('active');

    // Hide email capture if email already provided
    const emailVal = emailInput?.value?.trim();
    if (emailVal && postReportCapture) {
        postReportCapture.style.display = 'none';
    }

    // Scroll to report
    if (reportContainer) {
        reportContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Track affiliate link clicks
    if (reportContent) {
        reportContent.querySelectorAll('a[href*="gumroad"]').forEach(link => {
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
                }).catch(() => { });
            });
        });
    }
}

// ===== Loading Animation =====
function showLoading() {
    loadingContainer.classList.add('active');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Analyzing...';

    // Animate loading steps sequentially
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    loadingTimers = [];

    steps.forEach((stepId, index) => {
        const el = document.getElementById(stepId);
        if (!el) return;
        
        const timer = setTimeout(() => {
            // Mark previous as done
            if (index > 0) {
                const prevEl = document.getElementById(steps[index - 1]);
                if (prevEl) {
                    prevEl.classList.remove('active');
                    prevEl.classList.add('done');
                }
            }
            el.classList.add('active');
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
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    steps.forEach(stepId => {
        const el = document.getElementById(stepId);
        if (el) {
            el.classList.remove('active', 'done');
        }
    });
}

// ===== Error Handling =====
function showError(msg) {
    if (errorMessage) errorMessage.textContent = msg;
    if (errorContainer) errorContainer.classList.add('active');
    
    // Scroll to error
    if (errorContainer) {
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function hideError() {
    if (errorContainer) errorContainer.classList.remove('active');
}

// ===== Hide Report =====
function hideReport() {
    if (reportContainer) reportContainer.classList.remove('active');
}

// ===== Reset Form =====
function resetForm() {
    hideError();
    hideReport();
    keywordInput.value = '';
    emailInput.value = '';
    
    // Focus on keyword input
    if (keywordInput) keywordInput.focus();

    // Reset email capture
    if (emailCaptureForm) emailCaptureForm.style.display = 'inline-flex';
    const captureSuccess = document.getElementById('captureSuccess');
    if (captureSuccess) captureSuccess.style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Copy Report =====
function copyReport() {
    if (!currentReport) return;

    try {
        const textContent = reportContent?.innerText || currentReport.html?.replace(/<[^>]*>/g, '');
        if (!textContent) return;

        navigator.clipboard.writeText(textContent).then(() => {
            const copyBtn = document.querySelector('[onclick="copyReport()"]');
            if (copyBtn) {
                const original = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied!';
                setTimeout(() => copyBtn.textContent = original, 2000);
            }
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = textContent;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                const copyBtn = document.querySelector('[onclick="copyReport()"]');
                if (copyBtn) {
                    const original = copyBtn.textContent;
                    copyBtn.textContent = '✓ Copied!';
                    setTimeout(() => copyBtn.textContent = original, 2000);
                }
            } catch (e) {
                console.error('Copy failed:', e);
            }
            document.body.removeChild(textarea);
        });

        if (typeof gtag === 'function') {
            gtag('event', 'report_copied', { keyword: currentReport.keyword });
        }
    } catch (err) {
        console.error('Copy error:', err);
    }
}

// ===== Download Report =====
function downloadReport() {
    if (!currentReport) return;

    try {
        const htmlDoc = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Report: ${currentReport.keyword} — NicheReport.ai</title>
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
        <p>Generated by NicheReport.ai — Free AI Research Tool</p>
        <p>Visit <a href="https://niche-report-ai.vercel.app">niche-report-ai.vercel.app</a></p>
    </div>
</body>
</html>`;

        const blob = new Blob([htmlDoc], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${currentReport.keyword.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (typeof gtag === 'function') {
            gtag('event', 'report_downloaded', { keyword: currentReport.keyword });
        }
    } catch (err) {
        console.error('Download error:', err);
    }
}

// ===== Rate Limiting (Client-Side) =====
function getReportCount() {
    try {
        const data = JSON.parse(localStorage.getItem('nichereport_usage') || '{}');
        const today = new Date().toISOString().split('T')[0];
        if (data.date !== today) return 0;
        return data.count || 0;
    } catch {
        return 0;
    }
}

function incrementReportCount() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const data = JSON.parse(localStorage.getItem('nichereport_usage') || '{}');
        if (data.date !== today) {
            localStorage.setItem('nichereport_usage', JSON.stringify({ date: today, count: 1 }));
        } else {
            data.count = (data.count || 0) + 1;
            localStorage.setItem('nichereport_usage', JSON.stringify(data));
        }
    } catch {
        // Local storage might be blocked
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
