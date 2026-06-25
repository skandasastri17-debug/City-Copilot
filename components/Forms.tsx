export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";

  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {isSignUp ? (
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Display name
          <input className="rounded-md border border-slate-300 px-3 py-3 font-normal" name="displayName" autoComplete="name" placeholder="Ved" />
        </label>
      ) : null}
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Email
        <input className="rounded-md border border-slate-300 px-3 py-3 font-normal" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Password
        <input className="rounded-md border border-slate-300 px-3 py-3 font-normal" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} />
      </label>
      <button className="rounded-md bg-emerald-600 px-4 py-3 font-black text-white" type="submit">
        {isSignUp ? "Create account" : "Sign in"}
      </button>
      <p className="text-sm text-slate-600">Supabase auth-ready UI. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to connect real authentication.</p>
    </form>
  );
}

export function OpportunityForm({ action, submitLabel = "Save" }: { action?: (formData: FormData) => void | Promise<void>; submitLabel?: string }) {
  return (
    <form action={action} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Title
        <input name="title" className="rounded-md border border-slate-300 px-3 py-3 font-normal" placeholder="WorldCup Pulse admin placeholder" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Description
        <textarea name="description" rows={4} className="rounded-md border border-slate-300 px-3 py-3 font-normal" />
      </label>
      <button className="rounded-md bg-emerald-600 px-4 py-3 font-black text-white" type="submit">{submitLabel}</button>
    </form>
  );
}
