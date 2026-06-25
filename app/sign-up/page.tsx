import Link from "next/link";
import { AuthForm } from "@/components/Forms";

export default function SignUpPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-65px)] max-w-md content-center px-4 py-10">
      <h1 className="text-3xl font-black text-slate-950">Create your fan profile</h1>
      <p className="mt-2 text-slate-600">Pick your country, city, favourite team, and prediction style after signup.</p>
      <div className="mt-6"><AuthForm mode="sign-up" /></div>
      <p className="mt-4 text-sm text-slate-600">Already registered? <Link href="/sign-in" className="font-black text-emerald-700 hover:underline">Sign in</Link></p>
    </main>
  );
}
