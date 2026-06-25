# WorldCup Pulse

Production-quality MVP for a social FIFA World Cup prediction and leaderboard app.

Tagline: **Predict. Compete. Represent.**

WorldCup Pulse is for fun only. It does not include betting, odds, wagering, money prizes, or gambling language.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage-ready structure, and RLS policies
- Server actions for prediction locking and scoring entry points
- Mock football data provider that can be swapped for a real API later
- Mobile-first, responsive UI components

## Main Routes

- `/` landing page
- `/matches` and `/matches/[id]`
- `/leaderboards`
- `/confidence`
- `/about`
- `/sign-in`, `/sign-up`, `/onboarding`
- `/dashboard`
- `/predict/[matchId]`
- `/my-predictions`, `/my-results`, `/my-stats`, `/my-badges`
- `/groups`, `/groups/new`, `/groups/[id]`
- `/share`
- `/admin/matches`, `/admin/matches/[id]/edit`, `/admin/score-predictions`

## Football Data Provider

The app defines a `FootballDataProvider` interface in `lib/worldcup.ts`:

- `fetchFixtures()`
- `fetchStandings()`
- `fetchLiveScores()`
- `fetchMatchEvents()`
- `fetchTeams()`
- `fetchPlayers()`

`MockFootballDataProvider` powers the MVP. Later, the implementation can be replaced with providers such as Sportmonks, Statorium, API-Football, Live-Score API, or a FIFA official/manual source workflow.

## Supabase Setup

1. Create a Supabase project.
2. Add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run SQL in this order:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/seed.sql`
4. Enable email auth.
5. Replace mock reads and placeholder actions with authenticated Supabase server clients.

## Scoring Model

- Correct match result: 3 points
- Correct exact score: 5 bonus points
- Correct first team to score: 2 points
- Correct total goals range: 2 points
- Correct player of the match: 3 points
- Confidence bonus at 70% or higher: +1 if right, -1 if wrong
- Streak bonuses: +2 at 3, +5 at 5, +12 at 10

## What Is Mocked

- Auth forms are Supabase-ready UI but not wired to live sessions.
- Match data, leaderboards, groups, confidence snapshots, and prediction history render from `lib/worldcup.ts`.
- Share cards are HTML/CSS cards with a download/share placeholder.
- Admin scoring uses the MVP scoring function and sample predictions.

## Important Safety Rule

WorldCup Pulse is a social football prediction game for bragging rights, streaks, badges, and friendly competition only. Do not add betting, odds, wagering, gambling flows, or money prizes.
