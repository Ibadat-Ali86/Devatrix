"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, CircleAlert, LoaderCircle, ShieldCheck } from "lucide-react";

export default function SetPasswordForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "link" | "ready" | "error" | "saving">("checking");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [setupToken, setSetupToken] = useState<{ email: string; tokenHash: string } | null>(null);
  const initialSetupToken = useRef<{ email: string; tokenHash: string } | null>(null);

  useEffect(() => {
    let active = true;
    async function verifySetupLink() {
      if (!configured) {
        setMessage("Portal account setup is temporarily unavailable. Please contact the Devatrix team.");
        setState("error");
        return;
      }
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const tokenHash = params.get("token_hash");
      const email = params.get("email");
      if (tokenHash && email) {
        initialSetupToken.current = { email, tokenHash };
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        if (active) { setSetupToken(initialSetupToken.current); setState("link"); }
        return;
      }
      if (initialSetupToken.current) {
        if (active) { setSetupToken(initialSetupToken.current); setState("link"); }
        return;
      }
      try {
        const response = await fetch("/api/portal/setup/session", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "This setup link is invalid or has expired.");
        if (active) setState("ready");
      } catch (reason) {
        if (active) { setMessage(reason instanceof Error ? reason.message : "This setup link is invalid or has expired."); setState("error"); }
      }
    }
    void verifySetupLink();
    return () => { active = false; };
  }, [configured]);

  async function verifySetupLink() {
    if (!setupToken) return;
    setState("checking");
    setMessage("");
    try {
      const response = await fetch("/api/portal/setup/session", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(setupToken),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "This setup link is invalid or has expired.");
      initialSetupToken.current = null;
      setSetupToken(null);
      setState("ready");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "This setup link is invalid or has expired.");
      setState("error");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (password.length < 12) { setMessage("Choose a password with at least 12 characters."); return; }
    if (password !== confirmation) { setMessage("The passwords do not match. Check them and try again."); return; }
    setState("saving");
    try {
      const response = await fetch("/api/portal/setup/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn’t save your password.");
      router.replace("/portal");
      router.refresh();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "We couldn’t save your password. Please try again.");
      setState("ready");
    }
  }

  return <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
    <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><ShieldCheck className="h-6 w-6" aria-hidden="true"/></div>
    <h1 className="text-2xl font-bold tracking-tight text-[#061833] sm:text-3xl">Set up your portal password</h1>
    <p className="mt-3 text-sm leading-6 text-slate-600">Create a password for your Devatrix learner account. Your setup link verifies your email and works only once.</p>
    {state === "checking" && <div role="status" className="mt-7 flex items-center gap-2 text-sm font-medium text-slate-600"><LoaderCircle className="h-4 w-4 animate-spin text-amber-600"/>{setupToken ? "Verifying your email…" : "Checking your secure setup session…"}</div>}
    {state === "error" && <div role="alert" className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-800"><span className="inline-flex items-start gap-2"><CircleAlert className="mt-1 h-4 w-4 shrink-0"/>{message}</span><a className="mt-2 block font-semibold underline underline-offset-2" href="/contact">Contact the Devatrix team</a></div>}
    {state === "link" && <div className="mt-7 space-y-4"><p className="text-sm leading-6 text-slate-600">Select continue to verify this email and activate your secure password setup. This step is manual so email scanners do not use your one-time link.</p><button type="button" onClick={() => void verifySetupLink()} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#061833] px-4 text-sm font-semibold text-white transition hover:bg-[#10284a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Verify email and continue<ArrowRight className="h-4 w-4"/></button></div>}
    {(state === "ready" || state === "saving") && <form onSubmit={submit} className="mt-7 space-y-4">
      <label className="block text-sm font-semibold text-slate-800">New password<input type="password" autoComplete="new-password" required minLength={12} maxLength={256} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100" placeholder="At least 12 characters"/></label>
      <label className="block text-sm font-semibold text-slate-800">Confirm password<input type="password" autoComplete="new-password" required minLength={12} maxLength={256} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100" placeholder="Enter your new password again"/></label>
      {message && <p role="alert" className="text-sm leading-5 text-rose-700">{message}</p>}
      <p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"/>Use a unique password that you do not use on another site.</p>
      <button type="submit" disabled={state === "saving"} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#061833] px-4 text-sm font-semibold text-white transition hover:bg-[#10284a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-wait disabled:opacity-70">{state === "saving" ? "Saving password…" : "Save password and continue"}<ArrowRight className="h-4 w-4"/></button>
    </form>}
  </div>;
}
