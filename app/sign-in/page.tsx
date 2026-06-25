import Link from "next/link";
import { AuthForm } from "@/components/Forms";

export default function SignInPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-65px)] max-w-md content-center px-4 py-10">
      <h1 className="text-3xl font-black text-slate-950">Welcome back</h1>
      <p className="mt-2 text-slate-600">Sign in to predict matches, keep your streak alive, and follow your leaderboards.</p>
      <div className="mt-6"><AuthForm mode="sign-in" /></div>
      <p className="mt-4 text-sm text-slate-600">New here? <Link href="/sign-up" className="font-black text-emerald-700 hover:underline">Create an account</Link></p>
    </main>
  );
}
