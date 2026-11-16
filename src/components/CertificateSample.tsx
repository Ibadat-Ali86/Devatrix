"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Award, ShieldCheck } from "lucide-react";

function SignatureMark({ premium }: { premium: boolean }) {
  const ink = premium ? "#9a6a12" : "#173660";

  return (
    <div className="mx-auto flex h-12 max-w-56 items-end justify-center" aria-label="Illustrative Devatrix signature mark">
      <svg viewBox="0 0 250 54" className="h-12 w-full" role="img" aria-label="Decorative Devatrix signature mark">
        <path
          d="M8 38c9-20 13-26 18-26 7 0-3 31 1 31 3 0 16-24 22-24 4 0-5 20-1 21 5 1 20-20 26-19 5 1-2 17 3 18 5 1 17-12 24-16 5-2 8 0 7 4-2 7-12 16-17 19 9-4 25-21 32-27 5-4 7-2 6 4-2 9-13 21-12 23 2 3 11-6 18-13 6-6 11-8 14-6 3 2-1 10 1 12 3 2 13-5 21-10 8-5 17-8 25-7 7 1 9 5 15 5 6 0 10-4 15-7"
          fill="none"
          stroke={ink}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.25"
        />
        <path d="M14 47c48 3 126 2 214-4" fill="none" stroke={ink} strokeLinecap="round" strokeWidth="1.2" opacity=".5" />
      </svg>
    </div>
  );
}

export default function CertificateSample() {
  const [style, setStyle] = useState<"simple" | "premium">("simple");
  const premium = style === "premium";

  return (
    <section className="bg-[#f3f6fa] px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="certificate-sample-title">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800"><Award className="h-4 w-4"/>Completion recognition</p>
          <h2 id="certificate-sample-title" className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-[#061833] sm:text-4xl">Preview the certificate format</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">Learners can review a private, personalized certificate preview after their internship milestones are approved. The public sample here uses illustrative details only.</p>
          <div className="mt-6 inline-flex rounded-lg border border-slate-300 bg-white p-1" role="group" aria-label="Choose sample certificate style">
            {(["simple", "premium"] as const).map((item) => <button key={item} type="button" onClick={() => setStyle(item)} aria-pressed={style === item} className={`min-h-10 rounded-md px-4 text-sm font-semibold capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${style === item ? "bg-[#061833] text-white" : "text-slate-700 hover:bg-slate-100"}`}>{item}</button>)}
          </div>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">Both formats recognize the same completion. Premium is a presentation choice; honors and performance distinctions are earned separately.</p>
          <Link href="/portal/sign-in" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-500 px-5 text-sm font-bold text-[#061833] transition hover:bg-amber-400">Sign in for your private preview<ArrowRight className="h-4 w-4"/></Link>
          <p className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-700"/>Personal certificate details are protected by portal sign-in.</p>
        </div>

        <div className={`relative mx-auto w-full max-w-2xl p-2.5 sm:p-3 ${premium ? "bg-[#d7a83e] shadow-[0_20px_55px_-30px_rgba(6,24,51,.55)]" : "bg-[#061833]"}`}>
          <div className={`relative min-h-[390px] overflow-hidden px-5 py-7 text-center sm:min-h-[440px] sm:px-10 sm:py-9 ${premium ? "border border-[#eedaa8] bg-[#fffdf7]" : "border border-slate-200 bg-white"}`}>
            {premium && <div className="pointer-events-none absolute inset-2 border border-[#e9d29b]" aria-hidden="true"/>}
            {premium && <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#eddcae]" aria-hidden="true"/>}
            {premium && <div className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full border border-[#eddcae]" aria-hidden="true"/>}

            <div className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-xl p-2 ${premium ? "bg-[#061833] shadow-md shadow-slate-900/15" : "bg-[#061833]"}`}>
              <Image src="/logo-transparent.png" alt="Devatrix Technologies core logo" width={52} height={56} className="h-11 w-11 object-contain" />
            </div>
            <p className="relative mt-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-600 sm:text-xs">Devatrix Technologies</p>
            {premium && <p className="relative mx-auto mt-4 inline-flex rounded-full border border-[#dfc47f] px-3 py-1 text-[9px] font-bold uppercase tracking-[.17em] text-[#795510]">Premium format · Sample</p>}
            <h3 className={`relative mt-5 font-serif font-semibold text-[#061833] ${premium ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}>Certificate of Completion</h3>
            <div className={`relative mx-auto mt-3 h-px w-16 ${premium ? "bg-[#d7a83e]" : "bg-slate-200"}`} aria-hidden="true" />
            <p className="relative mt-4 text-xs text-slate-600 sm:text-sm">This certifies that</p>
            <p className={`relative mt-1 font-semibold text-[#061833] ${premium ? "text-2xl sm:text-3xl" : "text-lg sm:text-2xl"}`}>Huzaifa Islam</p>
            <p className="relative mx-auto mt-3 max-w-md text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">has completed the six-week <strong>Applied AI &amp; Agent Engineering</strong> internship program.</p>

            <div className="relative mx-auto mt-4 max-w-60">
              <SignatureMark premium={premium}/>
              <div className={`mx-auto -mt-1 max-w-56 border-t pt-1.5 ${premium ? "border-[#caa84f]" : "border-slate-400"}`}>
                <p className="text-xs font-semibold text-[#061833]">Authorized Signatory</p>
                <p className="text-[10px] text-slate-500">Devatrix Technologies</p>
              </div>
            </div>
            <div className={`relative mt-4 inline-flex rounded-full px-3 py-1.5 text-[9px] font-bold tracking-[.12em] sm:text-[10px] ${premium ? "bg-[#f3ead2] text-[#614814]" : "bg-slate-100 text-slate-600"}`}>ILLUSTRATIVE PREVIEW · NOT ISSUED</div>
          </div>
        </div>
      </div>
    </section>
  );
}
