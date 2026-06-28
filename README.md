# City Copilot

[Next.js](https://nextjs.org/) · [React](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) · [Tailwind CSS](https://tailwindcss.com/) · [Vercel](https://vercel.com/) · [Vultr AI](https://www.vultr.com/products/cloud-gpu/) · [Toronto Open Data](https://open.toronto.ca/) · [Supabase](https://supabase.com/) · [Lucide React](https://lucide.dev/)

City Copilot is a Toronto-focused civic assistant that helps residents ask city-service questions, compare neighborhoods, review live civic proposals, and turn plain language into clear next steps.

## Run Locally

```bash
npm install
cp .env.local.example .env.local # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), or the local port printed by Next.js if `3000` is already in use.

## Settings

Open `/settings` to paste local demo keys and configure the app from the browser.

- `Provider`: choose `Vultr`, `OpenAI`, or another OpenAI-compatible provider.
- `API key`: paste the key for the selected provider.
- `Base URL`: paste the provider's OpenAI-compatible `/v1` endpoint. OpenAI can leave this blank.
- `Model`: use `minimax-m2.7` for Vultr by default.
- `Toronto Open Data token`: optional token for higher API limits.
- `Use live data`: keeps Toronto Open Data lookups enabled when available.

Browser settings are stored only on your device in `localStorage` and are sent only to this app's API routes. For production, put secret keys in Vercel environment variables instead of relying on browser settings.

## Vercel Environment Variables

Recommended production variables:

```bash
VULTR_API_KEY=your-key
VULTR_API_BASE_URL=https://your-vultr-openai-compatible-endpoint/v1
VULTR_MODEL=minimax-m2.7
```

Optional fallback variables:

```bash
OPENAI_API_KEY=optional
OPENAI_MODEL=gpt-4.1-mini
AI_API_KEY=optional
AI_BASE_URL=optional
AI_MODEL=optional
TORONTO_OPEN_DATA_APP_TOKEN=optional
```

## Core Routes

- `/` and `/assistant`: chatbot-first City Copilot.
- `/neighborhoods`: livability score, radar graph, what-if scenarios, and neighborhood AI chat.
- `/compare`: side-by-side neighborhood comparison.
- `/participate`: CivicMatch-style proposal cards with act/skip/details tools.
- `/reports`: demo report tracking.
- `/resources`: city resource finder.
- `/settings`: local API key and configuration control room.
