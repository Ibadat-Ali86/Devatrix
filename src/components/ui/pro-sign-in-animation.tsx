"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";

interface ProSignInAnimationProps {
  onSuccessRedirect?: string;
  className?: string;
}

export function ProSignInAnimation({
  onSuccessRedirect = "/portal",
  className = "",
}: ProSignInAnimationProps) {
  const [hovering, setHovering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/portal/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Invalid credentials or unauthorized account. Please check with your program coordinator.");
        setPending(false);
        return;
      }

      router.replace(onSuccessRedirect);
      router.refresh();
    } catch {
      setError("Unable to connect to authorization server. Please verify your connection.");
      setPending(false);
    }
  }

  return (
    <div
      className={`floo-signin min-h-screen flex flex-col justify-between py-6 px-4 sm:px-8 relative overflow-hidden select-none ${className}`}
    >
      {/* Subtle ambient corner glow (clean & professional without distracting full-page rings) */}
      <div 
        className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px]" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#061833]/10 blur-[120px]" 
        aria-hidden="true" 
      />

      {/* Top Header: Devatrix Brand & Navigation */}
      <header className="top w-full max-w-5xl mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#061833] flex items-center justify-center p-1.5 shadow-sm border border-slate-700/80 group-hover:border-amber-400 transition-colors">
            <Image
              src="/logo-transparent.png"
              alt="Devatrix"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-extrabold tracking-tight text-[#061833] leading-none">
              Devatrix
            </span>
            <span className="text-[9px] tracking-wider uppercase font-bold mt-0.5 font-mono text-amber-600">
              Technologies
            </span>
          </div>
        </Link>

        <div className="join flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-medium text-slate-500">
            Authorized fellows &amp; internees
          </span>
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200/90 hover:border-amber-400 text-xs font-bold text-slate-800 transition-all shadow-xs"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Central Sign-In Container (Elevated, Clean & Focused) */}
      <main className="col my-auto py-8 sm:py-12 z-10 w-full max-w-[420px] mx-auto">
        <div className="rounded-3xl bg-white/95 border border-slate-200/90 shadow-xl p-6 sm:p-9 text-center backdrop-blur-md">
          
          {/* Professional Anime Developer Mentor Avatar (Replacing Previous Dark Icon Box) */}
          <div className="relative mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24 select-none group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 blur-md opacity-35 group-hover:opacity-55 transition-opacity pointer-events-none"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-400/90 shadow-md bg-[#061833]">
              <Image
                src="/images/learner-anime-avatar.jpg"
                alt="Devatrix Learner Portal Mentor Avatar"
                width={96}
                height={96}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <div 
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#061833] border-2 border-white flex items-center justify-center text-amber-400 shadow-xs" 
              title="Verified Learner Session"
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            </div>
          </div>

          {/* Heading & Context (Batch 2027 removed) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-950 border border-amber-300/80 text-[11px] font-mono font-bold tracking-wider uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>DEVATRIX LEARNER PORTAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#061833] tracking-tight mt-1 mb-1">
            Welcome back.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Sign in to access your track curriculum, milestone PRs &amp; verified credentials.
          </p>

          {/* Functional Authentication Form (Authorized Internees Only - No Google, No GitHub) */}
          <form onSubmit={handleSignIn} className="space-y-4 text-left">
            {/* Email Field */}
            <div className="field-container">
              <label htmlFor="learner-email" className="field-label">
                Registered Email Address
              </label>
              <div className="field">
                <Mail className="ic" aria-hidden="true" />
                <input
                  id="learner-email"
                  type="email"
                  required
                  autoComplete="username"
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@university.edu"
                  disabled={pending}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="field-container">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="learner-password" className="field-label mb-0">
                  Password
                </label>
                <Link
                  href="/contact"
                  className="forgot"
                  title="Passwords are set via your accepted application link"
                >
                  Need access help?
                </Link>
              </div>
              <div className="field">
                <Lock className="ic" aria-hidden="true" />
                <input
                  id="learner-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  maxLength={1024}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={pending}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs leading-relaxed"
              >
                {error}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              className="primary"
              type="submit"
              disabled={pending}
              onPointerEnter={() => setHovering(true)}
              onPointerLeave={() => setHovering(false)}
            >
              <span>{pending ? "Authenticating Session..." : "Sign in to Learner Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security & Access Restriction Callout */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
              <LockKeyhole className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Restricted to accepted Devatrix fellows &amp; internees</span>
            </div>
          </form>

        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="foot w-full max-w-5xl mx-auto pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
        <span className="text-xs text-slate-500 text-center sm:text-left">
          &copy; 2026 Devatrix Technologies LLC. Sovereign software delivery.
        </span>
        <nav className="flex gap-4 text-xs font-semibold text-slate-600">
          <Link href="/internships" className="hover:text-slate-900 transition-colors">
            Tracks
          </Link>
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-slate-900 transition-colors">
            Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}

// Default export compatible with demo previews
export const Component = ProSignInAnimation;
export default ProSignInAnimation;
