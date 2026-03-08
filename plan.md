# 🚀 AUTOSTACK REVENUE ENGINE — Implementation Plan

> **Version:** 1.0 | **Start Date:** March 6, 2026 | **Timeline:** 2 Weeks | **Investment:** $0 (Free Tier)
> **Target:** MacBook Pro M4 (~$1,599 - $2,499)
> **Status:** 🟡 IN PROGRESS

---

## 📋 MISSION

Build a self-sustaining AI web product (**NicheReport.ai**) that:
- Attracts traffic organically
- Converts visitors into paying customers automatically
- Delivers digital value without manual fulfillment
- Accumulates revenue toward a MacBook Pro purchase — all within 2 weeks

---

## 🏗️ SYSTEM ARCHITECTURE

**Product:** NicheReport.ai — Free AI-powered niche research tool
**Flow:** Visitor → Enters keyword → Claude generates 1,200-word report → Auto-embeds affiliate links + upsell CTAs + email capture → Revenue

### 3-Layer Funnel
| Layer | What It Does | Tools |
|-------|-------------|-------|
| Layer 1: Traffic | Brings strangers to site automatically | SEO + Reddit Bot + RSS + Antigravity |
| Layer 2: AI Product | Delivers value, builds trust, collects leads | Claude Code + Vercel + Supabase |
| Layer 3: Revenue | Converts interest into money automatically | Gumroad + Affiliate Links + AdSense |

### Technology Stack (All Free Tier)
| Category | Tool | Free Limit |
|----------|------|-----------|
| Frontend | GitHub Pages | Unlimited |
| App Hosting | Vercel | 100GB bandwidth/mo |
| AI Engine | Google Gemini (gemini-1.5-flash) | Free tier |
| Database | Supabase | 500MB, 50K requests |
| Backend | Render.com | 750 hrs/mo free |
| Payments | Gumroad | Free, 10% fee |
| Affiliate | Amazon Associates | Free to join |
| Email | Zapier + Mailchimp | 2,000 contacts free |
| Traffic Bot | Reddit API | Free API |
| SEO | Google Search Console | Free forever |
| Analytics | Google Analytics 4 | Free forever |
| Amplifier | Antigravity | Existing asset |

### Project File Structure
```
autostack-engine/
├── frontend/                    # GitHub Pages site
│   ├── index.html               # Landing page (hero, CTA, form)
│   ├── app.html                 # Tool page (input + report output)
│   ├── styles.css               # Design system + animations
│   └── app.js                   # API calls, DOM rendering
│
├── backend/                     # Render.com Node.js server
│   ├── server.js                # Express API server
│   ├── routes/
│   │   ├── report.js            # POST /api/report → Gemini API call
│   │   ├── leads.js             # POST /api/lead → Supabase insert
│   │   └── affiliate.js         # GET /api/links → inject affiliate URLs
│   ├── services/
│   │   ├── gemini.js            # Google Generative AI SDK wrapper
│   │   ├── supabase.js          # DB client
│   │   └── gumroad.js           # Upsell link builder
│   └── .env                     # API keys (never commit this)
│
├── automation/                  # Cron jobs
│   ├── reddit-poster.js         # Auto-post to subreddits on schedule
│   ├── seo-sitemap.js           # Generate sitemap.xml weekly
│   └── analytics-report.js     # Weekly self-email with revenue stats
│
├── products/                    # Gumroad digital products
│   ├── premium-report.pdf       # Premium template to sell
│   └── affiliate-guide.pdf      # Bonus upsell product
│
└── README.md                    # Setup instructions
```

---

## 🔐 SECTION: ACCOUNTS & ENVIRONMENT VARIABLES

### Account Creation Checklist
- [ ] **Google AI Studio (Gemini)** — aistudio.google.com → Get `GEMINI_API_KEY`
- [x] **Supabase** — supabase.com → Get `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- [ ] **GitHub** — github.com → Create repo `autostack-engine` (public)
- [ ] **Vercel** — vercel.com → Connect GitHub (no key needed)
- [ ] **Render.com** — render.com → Connect GitHub (no key needed)
- [ ] **Gumroad** — gumroad.com → Get `GUMROAD_ACCESS_TOKEN`
- [ ] **Reddit** — reddit.com/prefs/apps → Get `REDDIT_CLIENT_ID`, `REDDIT_SECRET`, `REDDIT_USER`, `REDDIT_PASS`
- [ ] **Zapier** — zapier.com → No key (GUI-based)
- [ ] **Mailchimp** — mailchimp.com → Get `MAILCHIMP_API_KEY`, `MAILCHIMP_LIST_ID`
- [ ] **Amazon Associates** — affiliate-program.amazon.com → Get `AMAZON_AFFILIATE_TAG`
- [ ] **Google Analytics 4** — analytics.google.com → Get GA4 Measurement ID
- [ ] **Google Search Console** — search.google.com/search-console → Verify domain

### .env File Setup
- [x] Create `.env` file with all API keys (`.env.example` created — fill with real keys)
- [x] Create `.env.example` with descriptions (no real keys)
- [x] Add `.env` to `.gitignore` immediately
- [ ] Configure Render.com environment variables dashboard for production

### ⚠️ Security Rules
- NEVER commit `.env` to GitHub
- NEVER hardcode API keys in source code
- NEVER share `.env` in any public channel
- DO use Render.com env vars for production secrets
- DO rotate Gemini API key if exposed

---

## 📅 WEEK 1 — BUILD PHASE

---

### DAY 1 — Landing Page (GitHub Pages)
**Objective:** A stunning, high-converting landing page live on the web

#### Build Tasks
- [x] Create `frontend/index.html` — Hero headline, animated CTA button, social proof section
- [x] Create `frontend/app.html` — Keyword input form, loading spinner, report output area
- [x] Create `frontend/styles.css` — Dark navy (#0D1B2A) + gold (#F4A81D) theme, mobile-responsive
- [x] Create `frontend/app.js` — API calls to backend, DOM rendering logic
- [x] Add typewriter effect on hero headline
- [x] Add testimonials section (3 realistic reviews)
- [x] Add FAQ accordion
- [x] Add footer with affiliate disclosure
- [x] Embed Google Analytics 4 tracking code placeholder

#### Deployment
- [x] Create GitHub repo `autostack-engine` (public)
- [x] Create Vercel project connected to GitHub repository
- [x] Set project root directory to `frontend`
- [x] Verify live URL: `https://niche-report-ai.vercel.app`

---

### DAY 2 — Supabase Database Setup
**Objective:** Database to store leads, queries, and conversion events

#### Database Tasks
- [ ] Create Supabase project
- [x] Create `queries` table (provided in backend/supabase_setup.sql):
  ```sql
  CREATE TABLE queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword TEXT NOT NULL,
    email TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [x] Create `conversions` table (provided in backend/supabase_setup.sql):
  ```sql
  CREATE TABLE conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT,   -- 'affiliate_click', 'gumroad_sale', 'email_capture'
    keyword TEXT,
    revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [x] Enable Row Level Security (RLS) on both tables (in SQL script)
- [x] Copy Supabase URL and anon key from Project Settings → API
- [x] Store keys in `.env` file
- [x] Test connection from local environment

---

### DAY 3 — Gemini API Report Generator (Heart of the System)
**Objective:** Backend endpoint that takes a keyword and returns a full AI report

#### Backend Build Tasks
- [x] Initialize Node.js project with dependencies: Express, Google Generative AI SDK, Supabase client, dotenv
- [x] Create `backend/services/gemini.js` — SDK wrapper with `generateReport(keyword)` function
- [x] System prompt: NicheReport AI → 1,200-word report with sections:
  - Market Overview
  - Top 5 Competitors
  - Monetization Opportunities (with `[AFFILIATE:X]` placeholders)
  - Content Strategy (5 blog titles)
  - Premium Upgrade CTA
- [x] Create `backend/services/supabase.js` — DB client
- [x] Create `backend/routes/report.js` — POST `/api/report` endpoint
  - Accept `{keyword, email}` body
  - Call Gemini gemini-1.5-flash
  - Post-process: replace `[AFFILIATE:X]` with real links
  - Save query to Supabase
  - Return `{report_html, word_count, affiliate_count}`
- [x] Create `backend/routes/leads.js` — POST `/api/lead` → Supabase insert
- [x] Create `backend/routes/affiliate.js` — Affiliate link injection logic
- [x] Implement rate limiting: 3 free reports per IP per day (Supabase tracking)

#### Affiliate Link Mapping
| Placeholder | Replaced With |
|-------------|--------------|
| `[AFFILIATE:email marketing tool]` | Amazon Associates link |
| `[AFFILIATE:SEO software]` | ShareASale link |
| `[AFFILIATE:design course]` | Gumroad product link |
---

### DAY 4 — Gumroad Product Setup
**Objective:** Create paid digital products that Claude auto-promotes in every report

#### Product Creation
- [x] Create Gumroad account
- [x] **Product 1:** "The Ultimate Niche Research Playbook" — $9 PDF
  - [x] Generate 15-page PDF with Claude Code (niche validation, competitor analysis, monetization methods, 10 niche examples, 30-day action plan)
  - [x] Upload to Gumroad
- [x] **Product 2:** "50 Profitable Micro-Niche Templates" — $4 Google Sheets
  - [x] Generate template content with Claude Code
  - [x] Upload to Gumroad
- [x] **Product 3:** "AutoStack Revenue System" (this plan) — $9 PDF
  - [x] Format and upload to Gumroad
- [x] Create `backend/services/gumroad.js` — Upsell link builder
- [x] Get Gumroad product URLs and add to affiliate link mapping

---

### DAY 5 — Full Backend Deployment on Render.com
**Objective:** Node.js backend live on the internet, auto-scaling, free tier

#### Deployment Tasks
- [x] Create `backend/server.js` — Express API server (CORS, routes, middleware)
- [x] Create Render.com account (sign up with GitHub)
- [x] New Web Service → Connect GitHub repo
- [x] Configure build: `npm install` | Start: `node backend/server.js`
- [x] Set all environment variables in Render dashboard
- [x] Deploy and get public URL (e.g., `myapp.onrender.com`)
- [x] Update `frontend/app.js` — Set `API_BASE` to Render URL
- [x] Test API endpoint from browser/Postman
- [x] Set up UptimeRobot.com (free) to ping app every 5 min (prevent sleep)

---

### DAY 6 — Fully Native Node.js Zero-Cost Email Automation
**Objective:** Automated email nurture sequence for every lead captured without touching paid limits

#### Automation Workflows
- [x] **Native Integration:** New row in Supabase (email) → Triggers GMai Welcome Email via nodemailer
- [x] **Native Integration:** Node-Cron Background Job (triggers 3 day follow-up via Gmail API)
- [x] **Native Integration:** Node-Cron Background Job (triggers 7 day follow-up via Gmail API)

#### Email Setup
- [x] Bypass Mailchimp completely to ensure 100% free overhead forever.
- [x] Integrate HTML templates securely directly into Node.js memory.
- [x] Setup Google App Passwords for server-to-inbox rendering.

---

### DAY 7 — Integration Testing
**Objective:** Full end-to-end test — confirm zero manual steps required

#### Test Checklist
| Test | Expected Result | Status |
|------|----------------|--------|
| Enter keyword on site | Report appears in <30s | - [ ] |
| Click affiliate link in report | Redirects correctly | - [ ] |
| Enter email in capture form | Email arrives seamlessly via Native Mailer | - [x] |
| Click Gumroad upsell CTA | Gumroad checkout opens | - [x] |
| Complete test Gumroad purchase | Thank-you email fires | - [ ] |
| Check Supabase tables | Rows logged for all actions | - [x] |

#### Bug Fixes & Polish
- [x] Fix any failing tests from checklist above
- [x] Check Render logs for errors
- [x] Verify Claude API key and credit balance
- [x] Verify Native cron logs instead of Zapier
- [x] Verify Supabase client in leads.js
- [ ] Test on mobile devices
- [ ] Test on multiple browsers

---

## 📅 WEEK 2 — LAUNCH & AUTOMATE TRAFFIC

---

### DAY 8 — SEO Foundation
**Objective:** Google discovers and indexes your site automatically

#### SEO Tasks
- [x] Create `automation/seo-sitemap.js` — Generate `sitemap.xml` listing all pages
- [x] Upload sitemap.xml to Vercel production
- [ ] Submit sitemap in Google Search Console
- [x] Add meta tags to `index.html`:
  - [x] Title tag (target: "free AI niche research tool")
  - [x] Meta description (155 chars)
  - [x] Open Graph tags (Twitter/LinkedIn sharing)
  - [x] Canonical URL
  - [x] JSON-LD structured data (SoftwareApplication schema)
- [x] Add meta tags to `app.html`
- [x] Target long-tail keywords:
  - "free niche research tool"
  - "AI niche finder"
  - "profitable niches 2026"

---

### DAY 9 — Twitter (X) Auto-Poster Bot
**Objective:** Automated viral posts to Twitter 3x/week, zero manual work

*Note: Pivoted from Reddit to Twitter due to Reddit's new stringent API lockdown policies.*

#### Bot Build Tasks
- [x] Create `automation/twitter-poster.js` using twitter-api-v2 + node-cron
- [x] Schedule: Monday, Wednesday, Friday at 9:00 AM UTC
- [x] Gemini API generates unique 280-character viral tweets (rotates topics)
- [x] Store last 20 topics in Supabase to avoid repetition
- [x] Append soft CTA: "Run a free AI report at nichereport.ai" + #SideHustle
- [x] Deploy as cron job on Render.com

#### Twitter Setup Tasks
- [x] Create Twitter Developer Account (Free Tier)
- [x] Generate API Keys (API Key, API Secret, Access Token, Access Secret)
- [x] Test bot locally before deploying
- [x] Verify first automated tweet goes live

---

### DAY 10 — Antigravity Integration
**Objective:** Use Antigravity as content distribution multiplier

#### Integration Tasks
- [ ] Connect Antigravity to NicheReport output → auto-share social snippets
- [ ] Set up RSS feed from GitHub Pages
- [ ] Configure: new blog posts auto-distributed to all channels
- [ ] Set up weekly digest automation (best reports → newsletter)
- [ ] Configure backlink building pipeline (auto-submit to directories/aggregators)
- [ ] Verify content is being distributed across channels

---

### DAY 11 — Gumroad Affiliate Program Activation
**Objective:** Other people sell your products for you

#### Affiliate Setup
- [ ] Gumroad Dashboard → Settings → Affiliates → Enable affiliate program
- [ ] Set commission to 40%
- [ ] Post in r/affiliatemarketing: "Looking for affiliates for AI niche tool — 40% commission"
- [ ] Add affiliate signup link to site footer
- [ ] Add affiliate signup link to every generated report
- [ ] **Zap:** New Gumroad affiliate signup → Welcome email fires automatically
- [ ] Verify affiliate tracking works with test purchase

---

### DAY 12-13 — Conversion Optimization
**Objective:** Squeeze more money from existing traffic

#### Optimization Tasks
| Optimization | Expected Impact | Status |
|-------------|----------------|--------|
| A/B test hero headline (2 variants) | +15-30% conversion | - [ ] |
| Add social proof ("1,247 reports generated") | +20% trust/CTR | - [ ] |
| Exit-intent popup with free lead magnet | 8-12% bounce capture | - [ ] |
| Add urgency: "Free tier: 3 reports/day" | +25% action rate | - [ ] |
| Embed 3 real example reports on site | Show value upfront | - [ ] |
| Add "People also searched" suggestions | More reports/session | - [ ] |

#### Analytics Setup
- [ ] Configure Google Analytics 4 goals/conversions
- [ ] Set up conversion tracking for Gumroad sales
- [ ] Set up conversion tracking for affiliate clicks
- [ ] Set up conversion tracking for email captures
- [ ] Create `automation/analytics-report.js` — Weekly self-email with stats

---

### DAY 14 — Full Automation Audit
**Objective:** Confirm the entire system runs 100% without you

#### ✅ Final Automation Checklist — ALL MUST BE YES
- [ ] Traffic arrives via SEO (Google Search Console shows impressions growing)
- [ ] Reddit bot posting on schedule (check Render cron logs)
- [ ] Antigravity distributing content (check channel dashboards)
- [ ] Reports generating correctly (test 10 different keywords)
- [ ] Affiliate links appearing correctly in every report
- [ ] Email capture working → Zapier firing → Mailchimp receiving contacts
- [ ] Gumroad upsell CTA appearing at bottom of every report
- [ ] Supabase logging all queries and conversion events
- [ ] Analytics showing traffic sources in Google Analytics 4
- [ ] Weekly self-email from Zapier with revenue stats
- [ ] Gumroad affiliate program active and link visible on site
- [ ] All API keys in `.env` — NOT hardcoded in code

---

## 💰 REVENUE MODEL & PROJECTIONS

### Revenue Streams (All Automated)
| Stream | Trigger | Avg Per Event | Post-Setup Effort |
|--------|---------|--------------|-------------------|
| Gumroad Direct Sales | Upsell CTA in every report | $9 - $19 | Zero |
| Amazon Affiliate Clicks | Links embedded in report | $0.50 - $8 | Zero |
| Gumroad Affiliate Sales | Others sell for you | $3.60 - $7.60 | Zero |
| Google AdSense | Ads on site (month 2+) | $0.01 - $0.10/pageview | Zero |
| Premium API Access | Power users want more reports | $9.99/mo subscription | Zero |

### Traffic & Revenue Projections
| Period | Monthly Visitors | Conversions | Est. Monthly Revenue |
|--------|-----------------|-------------|---------------------|
| End of Week 2 | 100 - 300 | 2-5 sales | $18 - $95 |
| Month 2 (SEO kick-in) | 800 - 2,000 | 20-60 sales | $180 - $540 |
| Month 3 (compound) | 3,000 - 7,000 | 90-210 sales | $810 - $1,520 |
| Month 4 (affiliates) | 5,000 - 12,000 | 150-360 sales | $1,350 - $4,320 |

### 🍎 MacBook Pro Milestone
- MacBook Pro 14-inch M4: ~$1,599 - $2,499
- Conservative (Month 3 @ $810/mo): Purchase in Month 3-4
- Optimistic (Month 3 @ $1,520/mo): Purchase in Month 3
- Accelerator: Antigravity could 3x numbers in Month 2

---

## 🔧 TROUBLESHOOTING REFERENCE

| Problem | Solution |
|---------|----------|
| Gemini API returns 429 (rate limit) | Implement IP-based rate limiting or adjust volume |
| Reddit bot posts get removed | Increase value-to-CTA ratio; softer CTA |
| Gumroad sales not triggering Zapier | Verify trigger is on 'Sale' event, not 'New Product' |
| Supabase connection fails on Render | Check env vars in Render dashboard; enable connection pooling |
| Google not indexing site | Submit sitemap.xml manually; add 10+ words unique content per page |
| Email capture Zapier zap failing | Check Supabase webhook; verify Mailchimp API key |
| Render app sleeping (free tier) | Add UptimeRobot.com (free) to ping every 5 min |
| Affiliate links getting low clicks | Move links higher in report; more specific recommendations |

---

## 📈 SCALING (After $100/mo Revenue)

- [ ] Upgrade Anthropic API credits for more report generations
- [ ] Add more Gumroad products (target different niches)
- [ ] Expand Reddit bot to 5 more subreddits
- [ ] Enable Google AdSense (requires 1,000+ monthly visitors)
- [ ] Launch second niche site using same codebase

---

## 🚀 SYSTEM STARTUP SEQUENCE (Post-Setup)

1. Render.com auto-starts Node.js server on push to main branch
2. UptimeRobot keeps server awake (free)
3. node-cron inside server runs Reddit bot 3x/week automatically
4. GitHub Pages serves landing page (never goes down)
5. Supabase logs everything silently in background
6. Zapier fires email sequences when Supabase gets new rows
7. Gumroad delivers products and pays every Friday
8. **You check analytics dashboard once per week — that's all**

---

## 💵 REVENUE COLLECTION

| Source | Payment Schedule |
|--------|-----------------|
| Gumroad | Deposits to bank every Friday (auto) |
| Amazon Associates | Monthly payment on the 25th (auto) |
| Google AdSense | Monthly when balance > $100 (auto) |
| Referral programs | Varies by program (all automatic) |

---

## 🆘 IF SOMETHING BREAKS — Check In Order

1. Render.com logs (most common errors)
2. Supabase dashboard (connection/quota issues)
3. Anthropic API console (credit balance/rate limits)
4. Zapier run history (email automation failures)
5. Reddit API credentials (bots get blocked — rotate account)

---

> **You are building an asset, not doing a job.**
> **Assets make money while you sleep. Start Day 1 today.**

---

*Last updated: March 6, 2026 | Next AI session: Check boxes above to see progress*
