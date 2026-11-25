"use client";

import React from "react";
import { Check, X, Zap, Sparkles, Shield, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function ComparisonMatrix() {
  const comparisonRows = [
    {
      metric: "Delivery & Billing Structure",
      legacy: "Hourly time & material billing with continuous invoice creep and zero cost predictability.",
      devatrix: "Milestone-gated, fixed-scope outcome sprints. You pay strictly for verified working deliverables.",
      advantage: "Zero billing leakage",
    },
    {
      metric: "Engineering Velocity & AI Augmentation",
      legacy: "Manual boilerplate authoring, 3–4 week onboarding ramp-up, repetitive sprint churn.",
      devatrix: "AI-accelerated engineering pipelines with custom autonomous agent swarms delivering 3.2x sprint throughput.",
      advantage: "3.2x faster time to market",
    },
    {
      metric: "Code Quality & Vulnerability Auditing",
      legacy: "Manual peer reviews, delayed integration testing, vulnerabilities caught late in staging.",
      devatrix: "Continuous zero-defect CI/CD with automated AST fuzzing, static binary analysis, and 95%+ unit test coverage.",
      advantage: "Zero-defect guarantee",
    },
    {
      metric: "Intellectual Property & Sovereignty",
      legacy: "Murky IP assignment, dependency on proprietary vendor lock-in libraries, slow handover.",
      devatrix: "100% Day-One Client IP sovereignty. Clean, fully documented source code with automated IaC deployment scripts.",
      advantage: "100% Sovereign ownership",
    },
    {
      metric: "Talent Caliber & Seniority",
      legacy: "Bait-and-switch staffing: Senior architects pitch the deal, junior engineers write the code.",
      devatrix: "Dedicated pods staffed exclusively by vetted Senior Staff Engineers and Devatrix Vanguard Fellows.",
      advantage: "Top 2% vetted engineers",
    },
    {
      metric: "Legal & Bilateral Confidentiality",
      legacy: "Lengthy multi-week NDA redlines before any technical architecture discussion can begin.",
      devatrix: "Instant automated Bilateral NDA generator with standard Silicon Valley IP terms executed in 60 seconds.",
      advantage: "Instant 60-second NDA",
    },
  ];

  return (
    <section className="relative py-20 sm:py-28 bg-[#FAF9F6] text-slate-900 border-y border-slate-200/80 overflow-hidden">
      {/* Subtle ambient light patterns */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-xs font-mono font-semibold text-amber-900 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>THE OUTCOME REVOLUTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
              Stop Buying Hours. <br />
              <span className="font-editorial italic font-normal text-amber-700">
                Start Buying Guaranteed Outcomes.
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Traditional IT consultancies profit when projects run over budget and take longer. Devatrix is built from the ground up on deliverable-gated velocity, transparent pricing, and 100% software sovereignty.
            </p>
          </div>
        </ScrollReveal>

        {/* ========================================================================= */}
        {/* DESKTOP TABLE VIEW (Visible on md and larger) */}
        {/* ========================================================================= */}
        <div className="hidden md:block">
          <ScrollReveal direction="up" delay={0.15}>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              
              {/* Header Row */}
              <div className="grid grid-cols-12 border-b border-slate-200 text-xs font-mono">
                <div className="p-4 lg:p-5 col-span-4 bg-slate-50 font-bold uppercase tracking-wider text-slate-600 flex items-center">
                  Dimension / Deliverable
                </div>
                <div className="p-4 lg:p-5 col-span-4 bg-rose-50/70 text-rose-800 font-bold uppercase tracking-wider border-l border-slate-200 flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Legacy Agency Model</span>
                </div>
                <div className="p-4 lg:p-5 col-span-4 bg-amber-50/80 text-amber-900 font-bold uppercase tracking-wider border-l border-slate-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500/20 shrink-0" />
                  <span>Devatrix AI Model</span>
                </div>
              </div>

              {/* Data Rows */}
              <div className="divide-y divide-slate-100">
                {comparisonRows.map((row) => (
                  <div 
                    key={row.metric} 
                    className="grid grid-cols-12 text-sm hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Metric Title & Advantage Tag */}
                    <div className="p-4 lg:p-5 col-span-4 flex flex-col justify-center bg-white">
                      <span className="font-bold text-slate-900 leading-snug">{row.metric}</span>
                      <span className="inline-flex items-center gap-1 mt-1 text-xs font-mono text-amber-800 font-semibold">
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>{row.advantage}</span>
                      </span>
                    </div>

                    {/* Legacy Column */}
                    <div className="p-4 lg:p-5 col-span-4 text-slate-600 bg-rose-50/[0.2] border-l border-slate-200 flex items-start gap-2.5">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5 text-rose-600" />
                      </span>
                      <span className="text-xs lg:text-sm leading-relaxed">{row.legacy}</span>
                    </div>

                    {/* Devatrix Column */}
                    <div className="p-4 lg:p-5 col-span-4 text-slate-900 bg-amber-50/[0.25] border-l border-slate-200 flex items-start gap-2.5 font-medium">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-amber-800 font-bold" />
                      </span>
                      <span className="text-xs lg:text-sm leading-relaxed text-slate-800">{row.devatrix}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </ScrollReveal>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE CARD VIEW (Visible only on screens < md) */}
        {/* ========================================================================= */}
        <div className="md:hidden space-y-4">
          {comparisonRows.map((row, idx) => (
            <ScrollReveal key={row.metric} delay={idx * 0.05} direction="up" distance={16}>
              <div className="dx-card p-5 space-y-4 border border-slate-200 bg-white shadow-sm">
                
                {/* Metric Title & Advantage Badge */}
                <div className="flex flex-col gap-1 pb-3 border-b border-slate-100">
                  <span className="text-sm font-bold text-slate-900 leading-snug">
                    {row.metric}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 w-fit">
                    <Zap className="w-3 h-3 text-amber-600" />
                    <span>{row.advantage}</span>
                  </span>
                </div>

                {/* Devatrix Outcome (Highlighted First) */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-900">
                    <Check className="w-3.5 h-3.5 text-amber-700" />
                    <span>Devatrix Outcome Model</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {row.devatrix}
                  </p>
                </div>

                {/* Legacy Agency Model */}
                <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-800">
                    <X className="w-3.5 h-3.5 text-rose-600" />
                    <span>Legacy Agency Model</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {row.legacy}
                  </p>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
