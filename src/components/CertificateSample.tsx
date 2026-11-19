"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Award, ShieldCheck, CheckCircle2, Sparkles, ExternalLink } from "lucide-react";

/**
 * Authentic digital cursive executive signature for the CEO & Founder.
 * Rendered via flowing vector paths with natural fountain-pen pressure variations,
 * loops, and a swift dynamic baseline underline flourish.
 */
function DigitalCeoSignature({ premium }: { premium: boolean }) {
  const inkColor = premium ? "url(#goldInkGrad)" : "#0a1f3d";

  return (
    <div className="relative mx-auto flex h-10 sm:h-12 w-full max-w-[150px] sm:max-w-[180px] items-center justify-center select-none" aria-label="Digital signature of Devatrix CEO & Founder">
      <svg
        viewBox="0 0 220 58"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label="CEO & Founder Authentic Digital Signature"
      >
        <defs>
          <linearGradient id="goldInkGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="30%" stopColor="#d97706" />
            <stop offset="65%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <filter id="subtleInkShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0.4" dy="0.6" stdDeviation="0.4" floodColor="#000000" floodOpacity={premium ? "0.2" : "0.15"} />
          </filter>
        </defs>

        <g filter="url(#subtleInkShadow)">
          {/* Initial cursive capital 'S' flourish with loop */}
          <path
            d="M 16 38 C 12 24, 20 12, 30 10 C 38 8, 42 20, 34 32 C 28 42, 20 48, 16 46 C 13 44, 18 34, 28 28 C 36 24, 46 22, 54 30 C 58 34, 52 44, 60 40"
            fill="none"
            stroke={inkColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cursive ligatures connecting smoothly */}
          <path
            d="M 60 40 C 64 36, 68 25, 74 27 C 78 29, 72 42, 80 38 C 86 34, 90 26, 96 28 C 100 30, 94 42, 104 36 C 110 32, 114 18, 118 16 C 120 14, 118 30, 116 40 C 118 38, 124 30, 130 30 C 134 30, 130 40, 136 36"
            fill="none"
            stroke={inkColor}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crossbar on the 't' stem */}
          <path
            d="M 108 22 C 114 21, 124 20, 128 21"
            fill="none"
            stroke={inkColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Surname capital 'S' flourish and sweeping ending loop */}
          <path
            d="M 144 42 C 140 30, 146 14, 156 12 C 164 10, 162 24, 154 34 C 150 40, 144 44, 150 42 C 158 38, 168 26, 174 28 C 178 30, 172 40, 180 36 C 186 32, 190 24, 194 24 C 198 24, 194 36, 200 32"
            fill="none"
            stroke={inkColor}
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dynamic underline swash flourish */}
          <path
            d="M 24 50 C 60 52, 120 51, 185 43 C 200 41, 210 37, 216 33"
            fill="none"
            stroke={inkColor}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          {/* Punctuation ink point */}
          <circle cx="196" cy="20" r="1.3" fill={inkColor} />
        </g>
      </svg>
    </div>
  );
}

/**
 * Official state seal / crest emblem for the bottom-right of the certificate.
 * In Simple format, renders a crisp official circular crest in refined slate/navy.
 * In Premium format, renders a 3D embossed metallic gold seal medallion with ribbons.
 */
function OfficialSeal({ premium }: { premium: boolean }) {
  if (premium) {
    return (
      <div className="relative mx-auto flex flex-col items-center justify-center">
        {/* Ribbon tails hanging below medal */}
        <div className="absolute -bottom-3 flex justify-center gap-1 pointer-events-none" aria-hidden="true">
          <div className="w-3 h-5 bg-gradient-to-b from-amber-600 to-amber-700 -rotate-12 [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)] shadow-sm" />
          <div className="w-3 h-5 bg-gradient-to-b from-amber-600 to-amber-700 rotate-12 [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)] shadow-sm" />
        </div>
        {/* 3D embossed gold medal */}
        <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-0.5 shadow-md border border-amber-300">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-1 text-center shadow-inner">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-dashed border-amber-200/90 bg-amber-600/90 text-amber-100">
              <span className="text-[6px] sm:text-[7px] font-mono font-black tracking-widest uppercase">DEVATRIX</span>
              <span className="text-[8px] sm:text-[9px] text-amber-200">★ ★ ★</span>
              <span className="text-[5px] sm:text-[6px] font-bold tracking-tight text-amber-100 uppercase">HONORS</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex flex-col items-center justify-center select-none" aria-label="Official Devatrix Academy seal">
      {/* Refined official academy seal in deep navy/slate */}
      <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-[1.5px] border-slate-700 bg-slate-50/80 p-0.5 shadow-sm">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-dashed border-slate-600 text-slate-800">
          <span className="text-[6px] font-mono font-extrabold tracking-widest uppercase text-slate-700">DEVATRIX</span>
          <span className="text-[7px] text-slate-700">★ ★ ★</span>
          <span className="text-[5px] font-bold tracking-wider text-slate-600 uppercase">SEAL</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Corner filigree / ornamental bracket for the Premium certificate format.
 */
function CornerFiligree({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const transformClass = {
    "top-left": "",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90",
  }[position];

  const posClass = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-2 right-2",
  }[position];

  return (
    <div className={`absolute ${posClass} w-8 h-8 pointer-events-none text-amber-600/80 ${transformClass}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <path d="M4 36 V12 C4 7.5 7.5 4 12 4 H36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 32 V14 C8 10.7 10.7 8 14 8 H32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M4 4 L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function CertificateSample() {
  const [style, setStyle] = useState<"simple" | "premium">("simple");
  const premium = style === "premium";

  // Authentic student name for certificate preview (matches reference screenshot)
  const recipientName = "Kajal Gupta";

  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 border-b border-slate-200/80" aria-labelledby="certificate-sample-title">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
        
        {/* Left column: Explanatory copy & controls */}
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/60">
            <Award className="h-4 w-4 text-amber-700"/>
            ACADEMIC CREDENTIAL
          </span>

          <h2 id="certificate-sample-title" className="mt-4 text-3xl font-extrabold tracking-tight text-[#061833] sm:text-4xl lg:text-5xl font-sans">
            Cryptographically Verifiable <br />
            <span className="font-editorial italic font-normal text-amber-700">Recognition of Mastery</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
            Learners receive a permanent public verification URL and cryptographically signed certificate upon completing all six weekly milestone pull requests. Recruiters can independently inspect student code commits and rubric scorecards.
          </p>

          {/* Simple vs Premium Format Toggle */}
          <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-100 p-1" role="group" aria-label="Choose sample certificate style">
            {(["simple", "premium"] as const).map((item) => (
              <button 
                key={item} 
                type="button" 
                onClick={() => setStyle(item)} 
                aria-pressed={style === item} 
                className={`min-h-9 rounded-full px-5 text-xs font-bold capitalize transition-all ${
                  style === item 
                    ? "bg-[#061833] text-white shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item === "simple" ? "Simple Format" : "Premium Format"}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Student ID: DVX/2026/0842</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Devatrix Core Logo Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Public GitHub Pull Requests Attached</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link 
              href="/portal/sign-in" 
              className="dx-btn-primary px-6 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wide inline-flex items-center gap-2"
            >
              <span>Sign in to Preview Your Credential</span>
              <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link 
              href="/verify" 
              className="dx-btn-secondary px-5 py-3 text-xs sm:text-sm font-bold inline-flex items-center gap-2"
            >
              <span>Test Credential Lookup</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            </Link>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0"/>
            Personal milestone and certificate details are secured behind learner authentication.
          </p>
        </div>

        {/* Right column: Exact Certificate Preview Card */}
        <div className="relative mx-auto w-full max-w-2xl">
          
          {/* Certificate Container with outer matting */}
          <div className={`relative w-full rounded-2xl sm:rounded-3xl p-3 sm:p-5 transition-all duration-300 ${
            premium 
              ? "bg-gradient-to-tr from-[#784a04] via-[#d4af37] to-[#804e05] shadow-[0_24px_60px_-15px_rgba(212,175,55,0.45)]" 
              : "bg-[#061833] shadow-2xl"
          }`}>

            {/* The Certificate Sheet */}
            <div className={`relative w-full rounded-xl sm:rounded-2xl overflow-hidden px-3.5 py-6 sm:px-9 sm:py-9 text-center transition-all ${
              premium 
                ? "bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F5ECE0] border-2 border-[#c59d3f] ring-2 ring-[#e8d28e]/50 ring-offset-2 ring-offset-[#fffdf9]" 
                : "bg-white border-2 border-slate-900/90 shadow-sm"
            }`}>

              {/* Top-Left Corner Accent: Orange Angled Tab (Exact match to reference) */}
              {!premium && (
                <div className="absolute top-0 left-0 w-16 h-12 sm:w-20 sm:h-14 overflow-hidden pointer-events-none" aria-hidden="true">
                  <svg viewBox="0 0 80 56" className="w-full h-full" fill="none">
                    <path d="M0 0 H75 L62 14 H14 V52 L0 42 Z" fill="#F59E0B" />
                  </svg>
                </div>
              )}

              {/* Premium Corner Filigrees */}
              {premium && (
                <>
                  <CornerFiligree position="top-left" />
                  <CornerFiligree position="top-right" />
                  <CornerFiligree position="bottom-left" />
                  <CornerFiligree position="bottom-right" />
                  {/* Subtle Guilloche Watermark Pattern */}
                  <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#92400e_1px,transparent_1px)] [background-size:16px_16px]"
                    aria-hidden="true" 
                  />
                </>
              )}

              {/* Top Row: Logo Lockup on Left, Core Company Logo & Student ID on Right (No QR Code!) */}
              <div className="relative flex items-start justify-between gap-4 pt-1 sm:pt-2 px-1">
                
                {/* Top-Left: Devatrix Brand Lockup */}
                <div className="flex items-center gap-2.5 text-left z-10">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#061833] p-1.5 shadow-sm border border-slate-200/80 shrink-0">
                    <Image
                      src="/logo-transparent.png"
                      alt="Devatrix"
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-black tracking-wider text-[#061833] leading-none">
                      DEVATRIX
                    </div>
                    <div className="text-[8px] sm:text-[9px] font-bold tracking-widest text-blue-600 uppercase mt-0.5">
                      ACADEMY &amp; STUDIO
                    </div>
                    <div className="text-[7px] sm:text-[8px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
                      YOUR TALENT, OUR ARCHITECTURE
                    </div>
                  </div>
                </div>

                {/* Top-Right: Core Company Logo (Replacing QR Code) & Student ID */}
                <div className="flex flex-col items-center text-center z-10">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden p-1 flex items-center justify-center shadow-sm ${
                    premium 
                      ? "bg-[#061833] border-2 border-amber-500 ring-2 ring-amber-300/40 shadow-md" 
                      : "bg-[#061833] border border-slate-300/90"
                  }`}>
                    <Image
                      src="/images/logo-core.png"
                      alt="Devatrix Verified Core Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <span className="mt-1 text-[8px] sm:text-[9px] font-mono font-bold tracking-tight text-slate-700">
                    Student ID: DVX/2026/0842
                  </span>
                </div>

              </div>

              {/* Premium Honors Ribbon Pill */}
              {premium && (
                <div className="relative mt-2 sm:mt-3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/40 bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-amber-500/15 px-3 py-0.5 text-[8px] sm:text-[9px] font-mono font-extrabold uppercase tracking-widest text-[#784f09]">
                    <Sparkles className="h-3 w-3 text-amber-600" />
                    ✦ DISTINGUISHED GOLD HONORS · MERIT SCHOLAR ✦
                  </span>
                </div>
              )}

              {/* Main Certificate Title Header */}
              <div className="relative mt-4 sm:mt-5">
                <h3 className={`font-black tracking-[0.08em] uppercase leading-tight ${
                  premium 
                    ? "text-2xl sm:text-4xl lg:text-[40px] text-[#061833] drop-shadow-sm" 
                    : "text-2xl sm:text-4xl lg:text-[38px] text-[#0f2444]"
                }`}>
                  CERTIFICATE
                </h3>
                <p className="mt-0.5 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.24em] text-slate-700 uppercase">
                  OF COMPLETION
                </p>
                {/* Horizontal Divider Line */}
                <div className={`mx-auto mt-2 h-[2px] w-28 sm:w-36 ${
                  premium ? "bg-gradient-to-r from-transparent via-amber-600 to-transparent" : "bg-slate-300"
                }`} aria-hidden="true" />
              </div>

              {/* Presentation Text */}
              <p className="relative mt-3 sm:mt-4 text-xs sm:text-sm font-medium tracking-wide text-slate-700">
                This Certificate Is Proudly Presented To
              </p>

              {/* Recipient Name in Flowing Cursive Script (Matches reference image) */}
              <p className={`relative my-1 sm:my-2 font-cursive select-none tracking-wide text-3xl sm:text-4xl md:text-5xl leading-tight ${
                premium 
                  ? "bg-gradient-to-r from-[#593902] via-[#a16207] to-[#451a03] bg-clip-text text-transparent font-normal drop-shadow-sm" 
                  : "text-slate-900 font-normal"
              }`}>
                {recipientName}
              </p>

              {/* Body Citation Paragraph */}
              <p className="relative mx-auto max-w-lg text-[10px] sm:text-xs leading-relaxed text-slate-600 font-sans px-2">
                Was an active Participant at Devatrix Virtual Apprenticeship Program in Full Stack Web Engineering Internship with dedication and hard work. We really appreciate your efforts taken and wish you all the best for the further.
              </p>

              {/* Sprint Dates (Anchored in 2026 data as per system rules) */}
              <p className="relative mt-1 text-[10px] sm:text-xs font-semibold text-slate-800">
                1st July 2026 to 15th August 2026
              </p>

              {/* Bottom Row: Signature, Date of Issue, Official Seal */}
              <div className="relative mt-5 sm:mt-7 pt-2 border-t border-slate-100/60 grid grid-cols-3 items-end gap-2 sm:gap-4">
                
                {/* Column 1: CEO & Founder Digital Signature */}
                <div className="text-center">
                  <DigitalCeoSignature premium={premium} />
                  <div className={`mx-auto w-24 sm:w-36 h-[1.5px] mt-1 mb-1 ${
                    premium ? "bg-amber-600/80" : "bg-slate-800"
                  }`} />
                  <p className="text-[9px] sm:text-[11px] font-bold tracking-wider text-slate-800 uppercase">
                    CEO &amp; Founder
                  </p>
                </div>

                {/* Column 2: Date of Issue */}
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-800 mb-1">
                    1st September 2026
                  </p>
                  <div className={`mx-auto w-24 sm:w-36 h-[1.5px] mb-1 ${
                    premium ? "bg-amber-600/80" : "bg-slate-800"
                  }`} />
                  <p className="text-[9px] sm:text-[11px] font-bold tracking-wider text-slate-800 uppercase">
                    Date of Issue
                  </p>
                </div>

                {/* Column 3: Official Seal / Crest */}
                <div className="text-center">
                  <OfficialSeal premium={premium} />
                </div>

              </div>

            </div>

          </div>

          {/* Overlapping Bottom-Right Status Badge (Exact match to reference screenshot) */}
          <div className="absolute -bottom-4 right-1 sm:-bottom-5 sm:-right-2 z-20 flex items-center gap-2 sm:gap-2.5 rounded-2xl bg-white px-3 py-1.5 sm:px-4 sm:py-2.5 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.18)] border border-slate-100 transition-transform hover:scale-105">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
              <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                STATUS
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Verified &amp; Valid {premium && <span className="text-amber-600 text-[10px] ml-0.5">(Honors)</span>}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
