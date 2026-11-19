"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Play,
  Star
} from "lucide-react";
import Hero3DTestimonials from "@/components/Hero3DTestimonials";

export default function EnterpriseHero({ copy }: { copy?: { title: string; highlight: string; summary: string } }) {
  return (
    <section data-navbar-theme="light" className="relative pt-28 sm:pt-36 pb-12 sm:pb-16 bg-[#FAF9F6] text-slate-900 overflow-hidden">
      
      {/* Background Decorative Grid Lines (Refined Editorial Style) */}
      <div 
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* ========================================================================= */}
        {/* HERO ROW: Left Value Proposition & Right 3-Mentors Hook */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Headings, Badge, CTAs, Trust Proof */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Small Eyebrow Hook Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-bold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="font-mono text-[11px] uppercase tracking-wider font-extrabold">
                #1 ACCELERATOR FOR PRODUCTION ENGINEERING
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.65rem] font-black tracking-tight text-slate-950 leading-[1.12]">
              {copy?.title ?? <>Flexible &amp; Scalable.</>} <br />
              <span>Where Real Engineers</span> <br />
              <span className="font-editorial italic font-normal text-amber-600">
                {copy?.highlight ?? "Are Built."}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
              {copy?.summary ?? "Taking weeks, not years. Learn alongside principal architects, ship production cloud and AI platforms, and graduate with verified public GitHub pull requests."}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/internships/apply"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#061833] text-white hover:bg-slate-900 text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
              >
                <span>Apply for 2027 Cohort</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-3 text-slate-800 hover:text-slate-950 font-bold text-sm tracking-wide group transition-colors"
              >
                <span className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </span>
                <span>Internship Flow</span>
              </a>
            </div>

            {/* Trust Proof Metrics (Relating 2026 Historical Performance) */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] ring-2 ring-white">HU</span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] ring-2 ring-white">FA</span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-[10px] ring-2 ring-white">NU</span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-[10px] ring-2 ring-white">IT</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="text-amber-500 flex">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                    </span>
                    4.92 / 5.0 Rating · 1,200+ Alumni in 2026
                  </div>
                  <div className="text-[11px] text-slate-500">FAST, NUST, ITU &amp; global 2026 talent</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-700 border-l border-slate-200 pl-6">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Verified Public GitHub PRs</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D Perspective Animated Verified Testimonials Marquee */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center">
            
            {/* Subtle Concentric Radar Grid Rings Behind 3D Stage */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full border border-slate-300/60 opacity-60"></div>
              <div className="absolute w-[240px] sm:w-[360px] h-[240px] sm:h-[360px] rounded-full border border-dashed border-slate-300/70"></div>
            </div>

            {/* The 3D Perspective Marquee Component */}
            <Hero3DTestimonials />

          </div>

        </div>

      </div>

    </section>
  );
}
