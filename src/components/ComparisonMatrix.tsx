"use client";

import React from "react";
import { Check, X, Zap, Shield, Clock, Award, Sparkles } from "lucide-react";

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
    <section className="relative py-24 bg-white text-slate-900 border-y border-slate-200 overflow-hidden">
      {/* Subtle ambient light patterns */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-mono font-semibold text-brand-800 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>THE OUTCOME REVOLUTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Stop Buying Hours. <br />
            <span className="text-brand-600">
              Start Buying Guaranteed Outcomes.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Traditional IT consultancies profit when projects run over budget and take longer. Devatrix is built from the ground up on outcome-driven velocity and software sovereignty.
          </p>
        </div>

        {/* Matrix Container */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 text-xs font-mono">
            <div className="p-4 sm:p-5 md:col-span-4 bg-slate-50 font-bold uppercase tracking-wider text-slate-600 flex items-center">
              Dimension / Deliverable
            </div>
            <div className="p-4 sm:p-5 md:col-span-4 bg-rose-50/70 text-rose-800 font-bold uppercase tracking-wider border-t md:border-t-0 md:border-l border-slate-200 flex items-center gap-2">
              <X className="w-4 h-4 text-rose-600" />
              <span>Legacy Agency Model (Buying Hours)</span>
            </div>
            <div className="p-4 sm:p-5 md:col-span-4 bg-amber-50/80 text-amber-900 font-bold uppercase tracking-wider border-t md:border-t-0 md:border-l border-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-600 fill-brand-500/20" />
              <span>Devatrix AI-Native Model (Outcomes)</span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {comparisonRows.map((row, idx) => (
              <div 
                key={row.metric} 
                className="grid grid-cols-1 md:grid-cols-12 text-sm hover:bg-slate-50/70 transition-colors"
              >
                {/* Metric Title & Advantage Tag */}
                <div className="p-4 sm:p-5 md:col-span-4 flex flex-col justify-center bg-white">
                  <span className="font-bold text-slate-900">{row.metric}</span>
                  <span className="inline-block mt-1 text-[11px] font-mono text-brand-700 font-semibold">
                    ⚡ Advantage: {row.advantage}
                  </span>
                </div>

                {/* Legacy Column */}
                <div className="p-4 sm:p-5 md:col-span-4 text-slate-600 bg-rose-50/[0.25] md:border-l border-slate-150 flex items-start gap-2.5">
                  <span className="w-4 h-4 mt-0.5 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shrink-0">
                    <X className="w-2.5 h-2.5 text-rose-600" />
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed">{row.legacy}</span>
                </div>

                {/* Devatrix Column */}
                <div className="p-4 sm:p-5 md:col-span-4 text-slate-900 bg-amber-50/[0.3] md:border-l border-slate-150 flex items-start gap-2.5 font-medium">
                  <span className="w-4 h-4 mt-0.5 rounded-full bg-brand-100 border border-brand-300 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-brand-700 font-bold" />
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed text-slate-800">{row.devatrix}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
