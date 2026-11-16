"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";

export default function AdminSignInForm() {
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
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Unable to sign in. Check your details and try again.");
        setPending(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-5">
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold">Email address</label>
        <input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} className="min-h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100" />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold">Password</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={1024} className="min-h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100" />
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      <button disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#071a36] px-4 text-sm font-bold text-white hover:bg-[#102b51] disabled:cursor-wait disabled:opacity-70">
        {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Signing in…" : "Sign in securely"}{!pending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      </button>
    </form>
  );
}
