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
  Send
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
    <section id="estimator" className="py-24 bg-obsidian-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-mono text-brand-400 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>TRANSPARENT ARCHITECTURE CALCULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Scope Your System. <br />
            <span className="text-brand-400">Receive An Automated Bilateral NDA.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Configure your technical requirements to generate instant timeline and sprint budgets, backed by a mutual non-disclosure agreement.
          </p>
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-obsidian-900/60 p-6 sm:p-8 rounded-2xl border border-white/10 space-y-8 backdrop-blur-xl">
            
            {/* Step 1: Project Archetype */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-3">
                1. Select Architecture Archetype
              </label>
              <div className="grid grid-cols-2 gap-3">
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
                    className={`p-3.5 rounded-xl border text-left transition-all font-mono ${
                      projectType === item.id 
                        ? "bg-brand-500/15 border-brand-500/60 text-white shadow-md shadow-brand-500/10" 
                        : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-1">{item.label}</div>
                    <span className="text-xs text-brand-400">{item.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Dedicated Pod Scale */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-3">
                2. Pod Scale & Team Composition
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "mvp", title: "Core MVP Pod", size: "2-3 Engineers", desc: "Prototype & Launch" },
                  { id: "scaleup", title: "Scale-Up Pod", size: "4-6 Engineers", desc: "Production Scale" },
                  { id: "enterprise", title: "Enterprise Fleet", size: "8-12+ Engineers", desc: "Global Footprint" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTeamScale(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      teamScale === item.id 
                        ? "bg-brand-500/15 border-brand-500/60 text-white shadow-md shadow-brand-500/10" 
                        : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <div className="text-xs font-bold text-white font-mono">{item.title}</div>
                    <div className="text-[11px] text-brand-400 font-mono mt-0.5">{item.size}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Timeline & Delivery Speed */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-3">
                3. Delivery Velocity
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTimeline("standard")}
                  className={`p-3.5 rounded-xl border text-left transition-all font-mono ${
                    timeline === "standard" 
                      ? "bg-brand-500/15 border-brand-500/60 text-white" 
                      : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <div className="text-xs font-bold text-white">Standard Cadence</div>
                  <div className="text-xs text-slate-400 mt-0.5">Two-week sprint reviews & staging QA</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTimeline("fast")}
                  className={`p-3.5 rounded-xl border text-left transition-all font-mono ${
                    timeline === "fast" 
                      ? "bg-brand-500/15 border-brand-500/60 text-white shadow-md shadow-brand-500/10" 
                      : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <div className="text-xs font-bold text-brand-400 flex items-center gap-1">
                    <span>Accelerated Fast-Track</span>
                    <Sparkles className="w-3 h-3 text-brand-400" />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Continuous delivery + dual shift pods</div>
                </button>
              </div>
            </div>

          </div>

          {/* Results & Bilateral NDA Form Column */}
          <div className="lg:col-span-5 bg-gradient-to-b from-brand-500/10 via-obsidian-900 to-obsidian-950 p-6 sm:p-8 rounded-2xl border border-brand-500/30 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-wider">
                Instant System Estimate
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Deliverable-Gated
              </span>
            </div>

            {/* Estimated Values Display */}
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs text-slate-400 font-mono">Estimated Investment Range:</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-1">
                  ${estimate.minBudget.toLocaleString()} – ${estimate.maxBudget.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-2">USD</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block">Target Timeline:</span>
                  <span className="text-white font-bold text-sm">~{estimate.weeks} Weeks</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Engineering Pod:</span>
                  <span className="text-brand-400 font-bold text-sm">{estimate.engineers} Senior Engineers</span>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            {submitted ? (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white font-mono">Bilateral NDA Dispatched!</h4>
                <p className="text-xs text-slate-300">
                  Our Silicon Valley legal team has dispatched the bilateral agreement to <span className="text-brand-400">{formData.email}</span>. A Principal Architect will reach out within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    Your Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer, CTO"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-xs sm:text-[11px] font-mono text-slate-300 block mb-1">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-obsidian-950 border border-white/10 rounded-lg px-2.5 sm:px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-[11px] font-mono text-slate-300 block mb-1">
                      Company Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-obsidian-950 border border-white/10 rounded-lg px-2.5 sm:px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                    />
                  </div>
                </div>

                {/* Bilateral NDA Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg bg-obsidian-950/70 border border-brand-500/20 hover:border-brand-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={requireNda}
                      onChange={(e) => setRequireNda(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 text-brand-500 focus:ring-brand-500/20 bg-obsidian-900"
                    />
                    <div className="text-[11px] leading-tight">
                      <span className="font-semibold text-white flex items-center gap-1">
                        <Lock className="w-3 h-3 text-brand-400" />
                        Execute Instant Bilateral NDA
                      </span>
                      <span className="text-slate-400 block text-xs mt-0.5">
                        Guarantees mutual confidentiality & client IP protection before roadmap review.
                      </span>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-r from-brand-400 to-amber-600 text-obsidian-950 font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate NDA & Lock Consultation</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
