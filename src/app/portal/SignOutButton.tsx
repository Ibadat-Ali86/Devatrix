"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton({ className }: { className?: string }) {
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

  return (
    <div className="relative inline-block text-right">
      <button
        type="button"
        onClick={signOut}
        disabled={pending}
        className={
          className ||
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 hover:text-white border border-white/15 transition-all disabled:opacity-60 cursor-pointer shadow-xs"
        }
      >
        <LogOut className="w-3.5 h-3.5 text-slate-300" />
        <span>{pending ? "Signing out..." : "Sign out"}</span>

      </button>
      {error && (
        <p role="alert" className="absolute right-0 top-full mt-1 text-[11px] text-rose-400 whitespace-nowrap bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
          {error}
        </p>
      )}
    </div>
  );
}

