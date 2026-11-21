"use client";

import React, { useState } from "react";
import { 
  Calculator, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  FileText,
  Clock,
  Layers,
  Send,
  Users2
} from "lucide-react";

export default function ProjectEstimator() {
  const [projectType, setProjectType] = useState<string>("ai");
  const [teamScale, setTeamScale] = useState<string>("scaleup");
  const [timeline, setTimeline] = useState<string>("accelerated");
  const [requireNda, setRequireNda] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    notes: ""
  });

  // Calculate estimated investment and sprint count
  const calculateEstimate = () => {
    let baseWeeks = 10;
    let baseBudget = 35000;
    let engineers = 4;

    if (projectType === "cloud") {
      baseWeeks = 8;
      baseBudget = 40000;
      engineers = 4;
    } else if (projectType === "ai") {
      baseWeeks = 12;
      baseBudget = 55000;
      engineers = 5;
    } else if (projectType === "webmobile") {
      baseWeeks = 10;
      baseBudget = 32000;
      engineers = 3;
    } else if (projectType === "accelerators") {
      baseWeeks = 6;
      baseBudget = 28000;
      engineers = 3;
    }

    if (teamScale === "mvp") {
      baseBudget *= 0.7;
      engineers = 2;
    } else if (teamScale === "enterprise") {
      baseBudget *= 1.8;
      engineers = 8;
    }

    if (timeline === "fast") {
      baseWeeks = Math.max(4, Math.round(baseWeeks * 0.6));
    }

    return {
      weeks: baseWeeks,
      minBudget: Math.round(baseBudget * 0.9 / 1000) * 1000,
      maxBudget: Math.round(baseBudget * 1.25 / 1000) * 1000,
      engineers: engineers,
    };
  };

  const estimate = calculateEstimate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="estimator-calculator" className="py-12 sm:py-16 bg-[#061833] relative text-white border-b border-white/10 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white/[0.03] p-6 sm:p-8 rounded-2xl border border-white/10 space-y-8 backdrop-blur-xl">
            
            {/* Step 1: Project Archetype */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 block mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Select Architecture Archetype</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "ai", label: "Sovereign AI & Agent Swarms", tag: "Most Requested" },
                  { id: "cloud", label: "Distributed Cloud & Backend", tag: "High Throughput" },
                  { id: "webmobile", label: "Enterprise Web & Mobile", tag: "Full-Stack" },
                  { id: "accelerators", label: "IP Accelerators Integration", tag: "Fast Deploy" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProjectType(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all font-mono ${
                      projectType === item.id 
                        ? "bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40" 
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-white mb-1">{item.label}</div>
                    <span className="text-[11px] text-amber-400 font-semibold">{item.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Dedicated Pod Scale */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 block mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Pod Scale &amp; Team Composition</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "mvp", title: "Core MVP Pod", size: "2-3 Engineers", desc: "Prototype & Launch" },
                  { id: "scaleup", title: "Scale-Up Pod", size: "4-6 Engineers", desc: "Production Scale" },
                  { id: "enterprise", title: "Enterprise Fleet", size: "8-12+ Engineers", desc: "Global Footprint" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTeamScale(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      teamScale === item.id 
                        ? "bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40" 
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-white font-mono">{item.title}</div>
                    <div className="text-xs text-amber-400 font-mono mt-0.5 font-semibold">{item.size}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Timeline & Delivery Speed */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 block mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Delivery Velocity</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTimeline("standard")}
                  className={`p-4 rounded-xl border text-left transition-all font-mono ${
                    timeline === "standard" 
                      ? "bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40" 
                      : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold text-white">Standard Cadence</div>
                  <div className="text-xs text-slate-400 mt-1">Two-week sprint reviews &amp; staging QA</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTimeline("fast")}
                  className={`p-4 rounded-xl border text-left transition-all font-mono ${
                    timeline === "fast" 
                      ? "bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40" 
                      : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                    <span>Accelerated Fast-Track</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Continuous delivery + dual shift pods</div>
                </button>
              </div>
            </div>

          </div>

          {/* Results & Bilateral NDA Form Column */}
          <div className="lg:col-span-5 bg-white/[0.05] p-6 sm:p-8 rounded-2xl border border-amber-500/40 shadow-2xl relative backdrop-blur-xl ring-1 ring-amber-500/20">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant System Estimate</span>
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold">
                Deliverable-Gated
              </span>
            </div>

            {/* Estimated Values Display */}
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs text-slate-300 font-mono">Estimated Investment Range:</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1 tracking-tight">
                  ${estimate.minBudget.toLocaleString()} – ${estimate.maxBudget.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-2">USD</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Timeline:</span>
                  <span className="text-white font-bold text-sm sm:text-base mt-0.5 block">~{estimate.weeks} Weeks</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Engineering Pod:</span>
                  <span className="text-amber-400 font-bold text-sm sm:text-base mt-0.5 block">{estimate.engineers} Senior Engineers</span>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            {submitted ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white font-mono">Bilateral NDA Dispatched!</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our Silicon Valley legal team has dispatched the mutual non-disclosure agreement to <span className="text-amber-400 font-semibold">{formData.email}</span>. A Principal Architect will reach out within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    Your Full Name &amp; Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer, CTO"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Company Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition-all"
                    />
                  </div>
                </div>

                {/* Bilateral NDA Checkbox (High Contrast & Clear) */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl bg-white/[0.06] border border-amber-500/30 hover:border-amber-500/50 hover:bg-white/[0.08] transition-all">
                    <input
                      type="checkbox"
                      checked={requireNda}
                      onChange={(e) => setRequireNda(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-amber-400/50 text-amber-500 focus:ring-amber-500/30 bg-black/40 accent-amber-500"
                    />
                    <div className="text-xs leading-snug">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Execute Instant Silicon Valley Bilateral NDA
                      </span>
                      <span className="text-slate-300 block text-[11px] mt-1 leading-normal">
                        Guarantees mutual confidentiality and 100% Day-One client IP protection before roadmap review.
                      </span>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#061833] font-mono text-xs font-extrabold uppercase tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate NDA &amp; Lock Consultation</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
