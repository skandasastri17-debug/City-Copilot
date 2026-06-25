import Link from "next/link";
import { Award, CalendarClock, ChevronRight, Flame, Lock, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import { buildConfidenceSnapshot, calculatePredictionScore, classifyPersonality, demoProfile, getTeam, isPredictionLocked, leaderboardRows, playerPool, type LeaderboardRow, type Match } from "@/lib/worldcup";
import { savePrediction } from "@/lib/actions";

function Surface({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`ticket-card rounded-[28px] ${className}`}>{children}</div>;
}

export function TeamBadge({ teamId }: { teamId: string }) {
  const team = getTeam(teamId);
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-semibold text-[color:var(--ink)] shadow-sm">
      <span aria-hidden="true">{team.flagEmoji}</span>
      {team.name}
    </span>
  );
}

export function StreakBadge({ streak = demoProfile.currentStreak }: { streak?: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,106,61,0.24)] bg-[rgba(255,106,61,0.08)] px-3 py-1.5 text-sm font-extrabold text-[color:var(--flare)]">
      <Flame size={16} aria-hidden="true" />
      {streak} match streak
    </span>
  );
}

export function CountdownToKickoff({ kickoffTime }: { kickoffTime: string }) {
  const kickoff = new Date(kickoffTime);
  const locked = Date.now() >= kickoff.getTime();
  const diff = Math.max(0, kickoff.getTime() - Date.now());
  const hours = Math.floor(diff / 36e5);
  const minutes = Math.floor((diff % 36e5) / 6e4);

  return (
    <div className={`font-utility inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${locked ? "bg-[rgba(16,32,58,0.08)] text-[color:var(--muted)]" : "bg-[rgba(223,246,207,0.9)] text-[color:var(--ink)] ring-1 ring-[rgba(16,32,58,0.08)]"}`}>
      {locked ? <Lock size={14} aria-hidden="true" /> : <CalendarClock size={14} aria-hidden="true" />}
      {locked ? "Locked" : `${hours}h ${minutes}m to lock`}
    </div>
  );
}

export function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);
  const locked = isPredictionLocked(match);

  return (
    <Surface className="overflow-hidden p-0">
      <article className="matchday-shell relative p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-utility text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {match.stage.replaceAll("_", " ")} · {match.city}
            </p>
            <h2 className="font-display mt-3 text-[1.8rem] font-extrabold leading-none tracking-[-0.05em] text-[color:var(--ink)] sm:text-[2.2rem]">
              {home.name}
              <span className="mx-2 text-[color:var(--muted)]">vs</span>
              {away.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              {home.flagEmoji} {home.name} · {away.flagEmoji} {away.name} · {new Date(match.kickoffTime).toLocaleString()} · {match.venue}
            </p>
          </div>
          <CountdownToKickoff kickoffTime={match.kickoffTime} />
        </div>
        {match.status !== "scheduled" && (
          <div className="scoreboard-panel mt-6 rounded-[22px] p-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div className="scoreboard-divider pr-3">
                <p className="font-utility text-[10px] uppercase tracking-[0.3em] text-white/60">Home</p>
                <p className="font-display mt-2 text-2xl font-extrabold tracking-[-0.06em]">{home.name}</p>
              </div>
              <div className="font-display text-4xl font-black tracking-[-0.08em]">{match.homeScore ?? 0}-{match.awayScore ?? 0}</div>
              <div className="pl-3">
                <p className="font-utility text-[10px] uppercase tracking-[0.3em] text-white/60">Away</p>
                <p className="font-display mt-2 text-2xl font-extrabold tracking-[-0.06em]">{away.name}</p>
              </div>
            </div>
          </div>
        )}
        {!compact && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/matches/${match.id}`} className="inline-flex items-center gap-1 rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--ink)]">
              Match center <ChevronRight size={16} />
            </Link>
            <Link href={`/predict/${match.id}`} className={`rounded-full px-4 py-2 text-sm font-extrabold ${locked ? "bg-[rgba(16,32,58,0.1)] text-[color:var(--muted)]" : "bg-[color:var(--cobalt)] text-white shadow-[0_14px_28px_rgba(41,93,255,0.24)]"}`}>
              {locked ? "View prediction" : "Predict this match"}
            </Link>
          </div>
        )}
      </article>
    </Surface>
  );
}

export function PredictionForm({ match }: { match: Match }) {
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);
  const locked = isPredictionLocked(match);

  return (
    <Surface className="p-6 sm:p-7">
      <form action={savePrediction} className="grid gap-6">
        <input type="hidden" name="matchId" value={match.id} />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-utility text-[11px] uppercase tracking-[0.26em] text-[color:var(--muted)]">Prediction slip</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[color:var(--ink)]">{home.name} vs {away.name}</h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">Save your read before kickoff. Server validation locks edits when the clock hits zero.</p>
          </div>
          <CountdownToKickoff kickoffTime={match.kickoffTime} />
        </div>
        <fieldset disabled={locked} className="grid gap-4 disabled:opacity-60">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--ink)]">
              Result
              <select name="predictedResult" className="rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3">
                <option value="home">{home.name} win</option>
                <option value="draw">Draw</option>
                <option value="away">{away.name} win</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--ink)]">
              {home.name} score
              <input name="predictedHomeScore" type="number" min="0" max="20" defaultValue="2" className="rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--ink)]">
              {away.name} score
              <input name="predictedAwayScore" type="number" min="0" max="20" defaultValue="1" className="rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--ink)]">
              First team to score
              <select name="predictedFirstTeamToScoreId" className="rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3">
                <option value={home.id}>{home.name}</option>
                <option value={away.id}>{away.name}</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--ink)]">
              Total goals range
              <select name="predictedTotalGoalsRange" className="rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3">
                <option value="0-1">0-1</option>
                <option value="2-3">2-3</option>
                <option value="4+">4+</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--ink)]">
              Player of the match
              <select name="predictedPlayerOfMatch" className="rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-3">
                {playerPool.map((player) => <option key={player} value={player}>{player}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--ink)]">
              Confidence percentage
              <div className="rounded-[18px] border border-[color:var(--line)] bg-white px-4 py-4">
                <input name="confidencePercentage" type="range" min="0" max="100" defaultValue="72" className="w-full accent-[color:var(--flare)]" />
              </div>
            </label>
          </div>
          <button className="rounded-full bg-[color:var(--flare)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(255,106,61,0.26)]">
            Save prediction
          </button>
        </fieldset>
        {locked && <p className="rounded-[18px] bg-[rgba(16,32,58,0.08)] p-4 text-sm font-semibold text-[color:var(--muted)]">Predictions lock at kickoff and cannot be edited after that time.</p>}
      </form>
    </Surface>
  );
}

export function LeaderboardTable({ rows = leaderboardRows }: { rows?: LeaderboardRow[] }) {
  return (
    <Surface className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[rgba(16,32,58,0.04)] text-left">
            <tr className="font-utility text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {["Rank", "Display name", "Favourite team", "Points", "Accuracy", "Streak", "Predictions"].map((header) => (
                <th key={header} className="px-4 py-4 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rank} className={`border-t border-[color:var(--line)] ${row.displayName === "Ved" ? "bg-[rgba(41,93,255,0.06)]" : "bg-white"}`}>
                <td className="px-4 py-4 font-display text-xl font-extrabold tracking-[-0.05em] text-[color:var(--ink)]">#{row.rank}</td>
                <td className="px-4 py-4 font-semibold text-[color:var(--ink)]">{row.displayName}</td>
                <td className="px-4 py-4 text-[color:var(--muted)]">{row.favouriteTeam}</td>
                <td className="px-4 py-4 font-extrabold text-[color:var(--flare)]">{row.points}</td>
                <td className="px-4 py-4 text-[color:var(--muted)]">{row.accuracy}%</td>
                <td className="px-4 py-4 text-[color:var(--muted)]">{row.currentStreak}</td>
                <td className="px-4 py-4 text-[color:var(--muted)]">{row.predictionsMade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}

export function ConfidenceIndexCard({ match }: { match: Match }) {
  const snapshot = buildConfidenceSnapshot(match);
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);

  return (
    <Surface className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-utility text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Fan confidence index</p>
          <h2 className="font-display mt-2 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--ink)]">{snapshot.label}</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">{snapshot.totalPredictions.toLocaleString()} predictions counted</p>
        </div>
        <ShieldCheck className="text-[color:var(--cobalt)]" />
      </div>
      <div className="mt-5 grid gap-4">
        {[
          [`${home.name} win`, snapshot.homeWinPercentage, "var(--cobalt)"],
          ["Draw", snapshot.drawPercentage, "var(--muted)"],
          [`${away.name} win`, snapshot.awayWinPercentage, "var(--flare)"]
        ].map(([label, value, color]) => (
          <div key={label}>
            <div className="mb-1.5 flex justify-between text-sm font-semibold text-[color:var(--ink)]"><span>{label}</span><span>{value}%</span></div>
            <div className="h-2.5 rounded-full bg-[rgba(16,32,58,0.08)]">
              <div className="h-2.5 rounded-full" style={{ width: `${value}%`, backgroundColor: String(color).startsWith("var") ? `var(${String(color).slice(4, -1)})` : String(color) }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-[color:var(--muted)]">
        Average confidence: {home.name} {snapshot.averageHomeConfidence}%, {away.name} {snapshot.averageAwayConfidence}%.
      </p>
    </Surface>
  );
}

export function ShareCard({ variant = "daily" }: { variant?: "daily" | "result" | "streak" | "rank" | "personality" }) {
  const title = {
    daily: "Ved's WorldCup Pulse",
    result: "Match Result Read",
    streak: "Streak Alive",
    rank: "City Rank Card",
    personality: "Fan Personality"
  }[variant];

  const insight = classifyPersonality();

  return (
    <article className="scoreboard-panel rise-in rounded-[30px] p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-utility text-[11px] uppercase tracking-[0.3em] text-white/55">{title}</p>
          <h2 className="font-display mt-3 text-4xl font-extrabold tracking-[-0.06em]">Canada 2-1 Qatar</h2>
        </div>
        <span className="pulse-live mt-1 inline-flex h-3 w-3 rounded-full bg-[color:var(--flare)]" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <p className="rounded-[20px] border border-white/10 bg-white/6 p-3"><span className="font-utility block text-[10px] uppercase tracking-[0.24em] text-white/55">Accuracy</span><b className="mt-1 block text-lg">71%</b></p>
        <p className="rounded-[20px] border border-white/10 bg-white/6 p-3"><span className="font-utility block text-[10px] uppercase tracking-[0.24em] text-white/55">Current streak</span><b className="mt-1 block text-lg">4</b></p>
        <p className="rounded-[20px] border border-white/10 bg-white/6 p-3"><span className="font-utility block text-[10px] uppercase tracking-[0.24em] text-white/55">Rank</span><b className="mt-1 block text-lg">#3 Mississauga</b></p>
        <p className="rounded-[20px] border border-white/10 bg-white/6 p-3"><span className="font-utility block text-[10px] uppercase tracking-[0.24em] text-white/55">Style</span><b className="mt-1 block text-lg">{insight.title}</b></p>
      </div>
      <button className="mt-6 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[color:var(--ink)]">Download/share placeholder</button>
    </article>
  );
}

export function UserRankCard() {
  return (
    <Surface className="p-5 sm:p-6">
      <section className="grid gap-4 sm:grid-cols-4">
        {[
          ["Total points", demoProfile.totalPoints],
          ["Accuracy", `${demoProfile.accuracyPercentage}%`],
          ["Global rank", "#3"],
          ["City rank", "#1 Mississauga"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-[22px] bg-white/75 p-4 ring-1 ring-[color:var(--line)]">
            <p className="font-utility text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">{label}</p>
            <p className="font-display mt-2 text-4xl font-extrabold tracking-[-0.06em] text-[color:var(--ink)]">{value}</p>
          </div>
        ))}
      </section>
    </Surface>
  );
}

export function PrivateGroupCard({ name, code, members }: { name: string; code: string; members: number }) {
  return (
    <Surface className="p-5">
      <Users className="text-[color:var(--cobalt)]" />
      <h2 className="font-display mt-4 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--ink)]">{name}</h2>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{members} members. Invite code {code}.</p>
      <Link href={`/groups/${code.toLowerCase()}`} className="mt-5 inline-flex rounded-full bg-[color:var(--cobalt)] px-4 py-2 text-sm font-extrabold text-white">
        Open group
      </Link>
    </Surface>
  );
}

export function PointsBreakdown() {
  return (
    <Surface className="p-6">
      <h2 className="font-display text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--ink)]">Scoring model</h2>
      <div className="mt-5 grid gap-2 text-sm text-[color:var(--ink)]">
        {[
          "Correct match result: 3 points",
          "Correct exact score: 5 bonus points",
          "Correct first team to score: 2 points",
          "Correct total goals range: 2 points",
          "Correct player of the match: 3 points",
          "Confidence bonus at 70%+: +1 if right, -1 if wrong",
          "Streak bonuses: +2 at 3, +5 at 5, +12 at 10"
        ].map((item) => (
          <p key={item} className="rounded-[18px] bg-white px-4 py-3 font-semibold ring-1 ring-[color:var(--line)]">{item}</p>
        ))}
      </div>
    </Surface>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Surface className="p-8 text-center">
      <Trophy className="mx-auto text-[color:var(--flare)]" />
      <h2 className="font-display mt-4 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--ink)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{body}</p>
    </Surface>
  );
}

export function LoadingState() {
  return <Surface className="p-6 text-sm font-semibold text-[color:var(--muted)]">Loading WorldCup Pulse...</Surface>;
}

export function AppShell({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[30px] border border-[color:var(--line)] bg-[rgba(255,255,255,0.72)] p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
        {eyebrow && <p className="font-utility text-[11px] uppercase tracking-[0.26em] text-[color:var(--muted)]">{eyebrow}</p>}
        <h1 className="font-display mt-2 text-4xl font-extrabold tracking-[-0.06em] text-[color:var(--ink)] sm:text-6xl">{title}</h1>
      </div>
      {children}
    </main>
  );
}

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-full border border-white/40 bg-[rgba(16,32,58,0.92)] p-2 text-xs font-semibold text-white shadow-xl backdrop-blur md:hidden">
      {[
        ["Matches", "/matches"],
        ["Board", "/leaderboards"],
        ["Groups", "/groups"],
        ["Share", "/share"]
      ].map(([label, href]) => <Link key={href} href={href} className="rounded-full px-2 py-2 text-center hover:bg-white/10">{label}</Link>)}
    </nav>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function BadgeGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {["First Prediction", "Perfect Score", "3 Match Streak", "5 Match Streak", "Upset Genius", "Loyal Fan", "Top 10 City", "Group Champion", "Final Prophet"].map((badge) => (
        <Surface key={badge} className="p-5">
          <Award className="text-[color:var(--flare)]" />
          <h2 className="font-display mt-4 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--ink)]">{badge}</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Badge criteria is tracked from predictions, streaks, groups, and leaderboard ranks.</p>
        </Surface>
      ))}
    </div>
  );
}

export function DemoScoreBreakdown() {
  const score = calculatePredictionScore({
    id: "demo",
    userId: "demo",
    matchId: "m4",
    predictedHomeScore: 1,
    predictedAwayScore: 2,
    predictedResult: "away",
    predictedFirstTeamToScoreId: "can",
    predictedTotalGoalsRange: "2-3",
    predictedPlayerOfMatch: "Alphonso Davies",
    confidencePercentage: 78,
    createdAt: "",
    updatedAt: ""
  }, {
    id: "m4",
    homeTeamId: "usa",
    awayTeamId: "can",
    kickoffTime: "2026-06-14T20:00:00.000Z",
    venue: "BC Place",
    city: "Vancouver",
    stage: "group",
    status: "completed",
    homeScore: 1,
    awayScore: 2,
    firstTeamToScoreId: "can",
    playerOfMatchName: "Alphonso Davies"
  }, 3);

  return (
    <Surface className="p-6">
      <h2 className="font-display text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--ink)]">Recent result breakdown</h2>
      <div className="mt-5 grid gap-2 text-sm">
        {Object.entries(score).map(([key, value]) => (
          <p key={key} className="flex justify-between rounded-[18px] bg-white px-4 py-3 ring-1 ring-[color:var(--line)]">
            <span className="text-[color:var(--muted)]">{key.replace(/([A-Z])/g, " $1")}</span>
            <b className="text-[color:var(--ink)]">{value}</b>
          </p>
        ))}
      </div>
    </Surface>
  );
}

export function HeroScoreboard({ match }: { match: Match }) {
  const home = getTeam(match.homeTeamId);
  const away = getTeam(match.awayTeamId);

  return (
    <div className="scoreboard-panel rise-in rounded-[34px] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="font-utility inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-white/75">
          <span className="pulse-live h-2.5 w-2.5 rounded-full bg-[color:var(--flare)]" />
          Next lock
        </span>
        <span className="font-utility text-[10px] uppercase tracking-[0.28em] text-white/55">Social prediction board</span>
      </div>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div className="scoreboard-divider pr-3">
          <p className="font-utility text-[10px] uppercase tracking-[0.28em] text-white/55">{home.flagEmoji} home</p>
          <h2 className="font-display mt-2 text-[2.25rem] font-extrabold leading-none tracking-[-0.06em]">{home.name}</h2>
          <p className="mt-2 text-sm text-white/70">Supporters split 64%</p>
        </div>
        <div className="font-display text-[3.8rem] font-black leading-none tracking-[-0.1em]">2-1</div>
        <div className="pl-3 text-right">
          <p className="font-utility text-[10px] uppercase tracking-[0.28em] text-white/55">away {away.flagEmoji}</p>
          <h2 className="font-display mt-2 text-[2.25rem] font-extrabold leading-none tracking-[-0.06em]">{away.name}</h2>
          <p className="mt-2 text-sm text-white/70">Confidence average 78%</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["City table", "#1 Mississauga"],
          ["Current streak", "4 straight"],
          ["Private league", "Office World Cup Challenge"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-[20px] border border-white/10 bg-white/6 p-3">
            <p className="font-utility text-[10px] uppercase tracking-[0.24em] text-white/55">{label}</p>
            <p className="mt-2 text-base font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PersonalityCard() {
  const insight = classifyPersonality();

  return (
    <Surface className="p-6">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-1 text-[color:var(--cobalt)]" />
        <div>
          <p className="font-utility text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">Fan personality</p>
          <h2 className="font-display mt-2 text-2xl font-extrabold tracking-[-0.05em] text-[color:var(--ink)]">{insight.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{insight.body}</p>
        </div>
      </div>
    </Surface>
  );
}
