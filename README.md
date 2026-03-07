# AutoStack Revenue Engine — NicheReport.ai

AI-powered niche research tool that generates comprehensive market reports automatically.

## Quick Start

### Frontend (GitHub Pages)
```bash
# Files in /frontend — deploy to GitHub Pages
# index.html, app.html, styles.css, app.js
```

### Backend (Render.com)
```bash
cd backend
npm install
cp .env.example .env
# Fill in your API keys
node server.js
```

### Environment Variables
Copy `.env.example` to `.env` and fill in all required keys. See the file for descriptions.

## Architecture
- **Frontend:** Static HTML/CSS/JS on GitHub Pages
- **Backend:** Node.js + Express on Render.com
- **AI Engine:** Anthropic Claude claude-sonnet-4-20250514
- **Database:** Supabase (PostgreSQL)
- **Payments:** Gumroad
- **Email:** Zapier + Mailchimp
- **Traffic:** Reddit bot + SEO + Antigravity

## File Structure
```
autostack-engine/
├── frontend/          # GitHub Pages site
├── backend/           # Render.com Node.js server
├── automation/        # Cron jobs (Reddit bot, sitemap, analytics)
├── products/          # Gumroad digital products
├── plan.md            # Master implementation plan with progress tracking
└── README.md          # This file
```

## License
Proprietary — All rights reserved.
