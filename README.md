# AutoStack Revenue Engine — NicheReport.ai

[![Status](https://img.shields.io/badge/status-build--in--public-orange)](#)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Anthropic](https://img.shields.io/badge/AI-Claude-D97757?logo=anthropic)](https://www.anthropic.com/claude)
[![Supabase](https://img.shields.io/badge/DB-Supabase-3FCF8E?logo=supabase)](https://supabase.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs)](https://nodejs.org/)
[![Gumroad](https://img.shields.io/badge/Sales-Gumroad-FF90E8)](https://gumroad.com/)

> AI-powered niche research tool. Type a niche, get a 15-page market report (audience size, competitor landscape, content gaps, monetisation models, recommended channels). Powered by Claude with structured retrieval. Sold on Gumroad.

This repo is published as a **transparency artefact** for the build-in-public process. The source is proprietary — see [LICENSE](LICENSE).

## The product

| Layer | What it does |
|---|---|
| **Frontend** | Static HTML/CSS/JS landing + buyer flow on GitHub Pages |
| **Backend** | Node.js + Express on Render |
| **AI engine** | Anthropic Claude (Sonnet) — structured prompt that returns the report sections |
| **Database** | Supabase Postgres (orders, generated reports, leads) |
| **Payments** | Gumroad (one-off purchase, no subscription) |
| **Email** | Zapier → Mailchimp for buyer delivery + waitlist |
| **Traffic** | Reddit bot + organic SEO + niche content syndication |

## Why build-in-public?

The plan is to ship weekly, post each milestone on Twitter + IndieHackers, and treat the GitHub stars as a signal of community interest rather than the revenue metric. Progress is tracked in [`plan.md`](./plan.md); ready-to-post copy in [`TRAFFIC_POSTS_READY.md`](./TRAFFIC_POSTS_READY.md).

## Repo layout

```
autostack-engine/
├── frontend/            Static HTML/CSS/JS landing (GitHub Pages)
├── backend/             Node.js + Express API (Render)
├── automation/          Cron jobs — Reddit bot, sitemap generation, analytics
├── products/            Gumroad digital product source files (PDFs, deliverables)
├── Dockerfile           Local dev container
├── plan.md              Master implementation plan with progress tracking
├── TRAFFIC_POSTS_READY.md   Paste-ready posts for the launch sequence
└── README.md
```

## Run locally (for collaborators with access)

```bash
cd backend
npm install
cp .env.example .env
# Fill in: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY,
#          GUMROAD_KEY, ZAPIER_HOOK, MAILCHIMP_API_KEY
node server.js
```

Frontend is static — `frontend/` is served directly by GitHub Pages from `main`.

## Status

Build-in-public. Subscribe via the live landing page (link forthcoming) to get notified at launch.

## Related projects

- [SprayMaster](https://github.com/yokesh-kumar-M/SprayMaster) — multi-protocol password sprayer.
- [PIIcasso](https://github.com/yokesh-kumar-M/Piicasso) — PII intelligence + adversarial wordlist platform.
- [Portfolio](https://github.com/yokesh-kumar-M/Portfolio) — Iron Man HUD personal site.

## License

[Proprietary — All Rights Reserved](LICENSE). The source is public for transparency; commercial use, redistribution, and derivative works are not permitted without written consent. Licensing enquiries: `dezprox25@gmail.com`.

© 2024-2026 Yokesh Kumar M
