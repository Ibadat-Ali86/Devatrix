"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck, LockKeyhole } from "lucide-react";

const ringSizes = [300, 372, 452, 542, 644, 758, 884, 1000];

interface ProSignInAnimationProps {
  onSuccessRedirect?: string;
  className?: string;
}

export function ProSignInAnimation({
  onSuccessRedirect = "/portal",
  className = "",
}: ProSignInAnimationProps) {
  const portalRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const portal = portalRef.current;
    if (!portal) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    let frame: number;
    let px = 0;
    let py = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const animate = () => {
      px += (targetX - px) * 0.05;
      py += (targetY - py) * 0.05;

      portal.style.setProperty("--tx", `${px * -14}px`);
      portal.style.setProperty("--ty", `${py * -10}px`);

      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

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
      ref={portalRef}
      className={`floo-signin flex flex-col justify-between py-6 px-4 sm:px-8 ${hovering ? "is-hovering" : ""} ${className}`}
    >
      {/* Background portal subtle glow */}
      <div className="glow" aria-hidden="true" />

      {/* Orbiting Concentric Radar Rings with Devatrix Gold / Amber Gradient */}
      <svg className="rings" viewBox="0 0 2000 2000" aria-hidden="true">
        <defs>
          <linearGradient
            id="floo-arc-gradient"
            gradientUnits="userSpaceOnUse"
            x1="300"
            y1="300"
            x2="1700"
            y2="1700"
          >
            <stop stopColor="#F59E0B" />
            <stop offset=".55" stopColor="#D97706" />
            <stop offset="1" stopColor="#061833" />
          </linearGradient>
        </defs>

        <circle className="wave" cx="1000" cy="1000" r="300" />
        <circle className="wave wave-b" cx="1000" cy="1000" r="300" />

        {ringSizes.map((radius, index) => {
          const length = 9 + (index % 3) * 5;

          return (
            <React.Fragment key={radius}>
              <circle
                className="base"
                cx="1000"
                cy="1000"
                r={radius}
              />
              <circle
                className={`arc ${index % 2 ? "reverse" : ""}`}
                cx="1000"
                cy="1000"
                r={radius}
                pathLength="100"
                strokeDasharray={`${length} ${100 - length}`}
                style={{
                  // @ts-expect-error CSS custom variable
                  "--duration": `${38 + index * 12}s`,
                  animationDelay: `${-index * 7.3}s`,
                }}
              />
            </React.Fragment>
          );
        })}
      </svg>

      {/* Top Header: Devatrix Brand & Navigation */}
      <header className="top w-full">
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

        <div className="join">
          <span className="hidden sm:inline text-xs font-medium text-slate-500">
            Authorized fellows &amp; internees
          </span>
          <Link href="/" className="text-xs font-semibold">
            ← Home
          </Link>
        </div>
      </header>

      {/* Central Sign-In Container */}
      <main className="col my-auto py-12">
        {/* Shield Icon Lockup */}
        <div className="mark rise flex items-center justify-center mx-auto mb-3">
          <div className="w-14 h-14 rounded-2xl bg-[#061833] text-amber-400 flex items-center justify-center shadow-lg border border-slate-800">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
        </div>

        {/* Heading & Context */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/70 text-[11px] font-mono font-bold tracking-wider uppercase mb-2">
          <span>LEARNER PORTAL • BATCH 2027</span>
        </div>

        <h1 className="rise text-2xl sm:text-3xl font-extrabold text-[#061833] tracking-tight">
          Welcome back.
        </h1>
        <p className="sub rise text-xs sm:text-sm text-slate-600">
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
      </main>

      {/* Footer Navigation */}
      <footer className="foot w-full pt-6 border-t border-slate-200/60">
        <span className="text-xs text-slate-500">
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
