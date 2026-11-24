"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle } from "lucide-react";

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
      setError("Unable to sign out.");
      setPending(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={signOut}
        disabled={pending}
        title="Sign out of learner portal"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-60"
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-rose-600" />
        ) : (
          <LogOut className="h-3.5 w-3.5 text-slate-500 group-hover:text-rose-600" />
        )}
        <span>{pending ? "Signing out…" : "Sign out"}</span>
      </button>
      {error && (
        <p role="alert" className="absolute right-0 top-11 z-50 whitespace-nowrap rounded-md bg-rose-600 px-2 py-1 text-[11px] font-medium text-white shadow-md">
          {error}
        </p>
      )}
    </div>
  );
}
