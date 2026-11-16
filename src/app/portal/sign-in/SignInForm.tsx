"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";

export default function SignInForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/portal/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Unable to sign in. Please try again.");
        setPending(false);
        return;
      }
      router.replace("/portal");
      router.refresh();
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="portal-email" className="mb-2 block text-sm font-semibold text-slate-800">Email address</label>
        <input id="portal-email" name="email" type="email" required autoComplete="username" maxLength={254} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="portal-password" className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
        <input id="portal-password" name="password" type="password" required autoComplete="current-password" maxLength={1024} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{error}</p>}
      <button type="submit" disabled={pending} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-400 disabled:cursor-wait disabled:opacity-70">
        {pending ? "Signing in..." : "Sign in"}<ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <p className="flex items-start gap-2 text-xs leading-5 text-slate-600"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Portal access is available to authorized interns.</p>
    </form>
  );
}
