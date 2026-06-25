import { AppShell } from "@/components/worldcup";
import { teams } from "@/lib/worldcup";

export default function OnboardingPage() {
  return (
    <AppShell title="Set up your fan profile" eyebrow="Onboarding">
      <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">Display name<input name="displayName" className="rounded-md border border-slate-300 px-3 py-2" placeholder="Ved" /></label>
          <label className="grid gap-2 text-sm font-bold">Favourite team<select name="favouriteTeamId" className="rounded-md border border-slate-300 px-3 py-2">{teams.map((team) => <option key={team.id} value={team.id}>{team.flagEmoji} {team.name}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold">Country you support<input name="supportedCountry" className="rounded-md border border-slate-300 px-3 py-2" placeholder="Canada" /></label>
          <label className="grid gap-2 text-sm font-bold">City<input name="city" className="rounded-md border border-slate-300 px-3 py-2" placeholder="Mississauga" /></label>
          <label className="grid gap-2 text-sm font-bold">Country<input name="country" className="rounded-md border border-slate-300 px-3 py-2" placeholder="Canada" /></label>
          <label className="grid gap-2 text-sm font-bold">School/workplace/community<input name="schoolOrWorkplace" className="rounded-md border border-slate-300 px-3 py-2" placeholder="Office League" /></label>
        </div>
        <label className="grid gap-2 text-sm font-bold">Prediction style preference<select name="predictionStyle" className="rounded-md border border-slate-300 px-3 py-2"><option>Safe</option><option>Bold</option><option>Chaos</option><option>Defensive</option><option>Neutral</option></select></label>
        <button className="rounded-md bg-emerald-600 px-4 py-3 font-black text-white">Finish onboarding</button>
      </form>
    </AppShell>
  );
}
