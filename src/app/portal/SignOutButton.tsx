"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function signOut() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/portal/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Sign-out failed");
      router.replace("/portal/sign-in");
      router.refresh();
    } catch {
      setError("Unable to sign out. Please try again.");
      setPending(false);
    }
  }
  return <div className="text-right"><button type="button" onClick={signOut} disabled={pending} className="rounded-lg border border-slate-400 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60">{pending ? "Signing out..." : "Sign out"}</button>{error && <p role="alert" className="mt-2 text-xs text-red-200">{error}</p>}</div>;
}
