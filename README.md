# Quantzy

> **Find the edge before the market does.**

Prediction-market intelligence terminal with **5 progressive complexity levels**.
Scan Polymarket, Kalshi, sports, crypto & macro for mispriced outcomes ranked by
edge, confidence, liquidity, and social conviction.

## Complexity Levels

| Level | Name     | What you see                                           |
|-------|----------|--------------------------------------------------------|
| 1     | Starter  | Trending bets, simple take/skip. No jargon.            |
| 2     | Explorer | Edge %, confidence, basic filters, sparklines.         |
| 3     | Analyst  | Mind-map scanner, social trading, alerts, calibration. |
| 4     | Quant    | Probability decomposition, copy-trade, challenges.     |
| 5     | Operator | Full terminal — all views, AI Analyst, Apex tier.      |

Switch anytime with the dot-slider in the top nav bar. The AI Guide chatbot
(bottom-left corner) explains everything and can level you up via chat.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5174
npm run build      # ./dist
npx serve dist     # serve static build on :3000
```

## Deploy (Cloudflare Pages)

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Framework preset:** None (or Vite)

Connect this repo in Cloudflare dashboard → Pages → Create a project →
Connect to Git → select `remi9martin/quantzy` → set build output to `dist`.

Or via Wrangler CLI:
```bash
npm run build
npx wrangler pages deploy dist --project-name=quantzy
```

## Stack

- Vite + React 18 + React Router + Tailwind CSS
- Pure SVG visualizations (no charting libs)
- Mock data in `src/data/markets.js`
- No backend — 100% static

## Routes

**Public:** `/` Landing · `/pricing` · `/methodology`

**App (20 routes):**
`/app` Dashboard · `/app/scanner` Mind map · `/app/explore` · `/app/feed` ·
`/app/signal/:id` · `/app/historical` · `/app/missed` · `/app/social` ·
`/app/trader/:name` · `/app/leaderboard` · `/app/teams` · `/app/challenges` ·
`/app/calibration` · `/app/alerts` · `/app/analyst` · `/app/tiers` ·
`/app/vault` · `/app/settings`
