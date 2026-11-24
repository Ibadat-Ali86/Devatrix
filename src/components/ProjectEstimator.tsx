"use client";

import React, { useState } from "react";
import { 
  Calculator, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  FileText,
  Clock,
  Users2,
  Check,
  Cpu,
  Cloud,
  Smartphone,
  Zap
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

  const archetypeOptions = [
    { 
      id: "ai", 
      label: "Sovereign AI & Agent Swarms", 
      tag: "Most Requested",
      icon: Cpu,
      desc: "Private LLMs, RAG, pgvector & agentic tool swarms"
    },
    { 
      id: "cloud", 
      label: "Distributed Cloud & Backend", 
      tag: "High Throughput",
      icon: Cloud,
      desc: "Go/Node.js microservices, Kubernetes & event streaming"
    },
    { 
      id: "webmobile", 
      label: "Enterprise Web & Mobile", 
      tag: "Full-Stack",
      icon: Smartphone,
      desc: "Next.js 16 platforms & native React Native/Flutter apps"
    },
    { 
      id: "accelerators", 
      label: "IP Accelerators Integration", 
      tag: "Fast Deploy",
      icon: Zap,
      desc: "Pre-built FlowEngine™, GuardAPI™ & PayPulse™ modules"
    },
  ];

  const scaleOptions = [
    { 
      id: "mvp", 
      title: "Core MVP Pod", 
      size: "2–3 Engineers", 
      desc: "Prototype & Launch",
      lead: "1 Architect + 2 Full-Stack"
    },
    { 
      id: "scaleup", 
      title: "Scale-Up Pod", 
      size: "4–6 Engineers", 
      desc: "Production Scale",
      lead: "1 Architect + 4 Senior + 1 QA"
    },
    { 
      id: "enterprise", 
      title: "Enterprise Fleet", 
      size: "8–12+ Engineers", 
      desc: "Global Footprint",
      lead: "2 Architects + Multi-squad"
    },
  ];

  return (
    <section 
      id="estimator-calculator" 
      data-navbar-theme="light"
      className="py-12 sm:py-20 bg-[#FAF9F6] relative text-slate-900 border-b border-slate-200/80 overflow-hidden"
    >
      {/* Subtle warm gold ambient lighting (Strictly zero blue) */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[350px] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Controls Column (Pure White Card with Amber Highlights) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-9 rounded-3xl border border-slate-200 shadow-xl space-y-8">
            
            {/* Step 1: Project Archetype */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Select Architecture Archetype</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">Click to select</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {archetypeOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = projectType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProjectType(item.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer group ${
                        isSelected 
                          ? "bg-amber-50/70 border-amber-500 text-slate-950 shadow-md shadow-amber-500/15 ring-2 ring-amber-400/30" 
                          : "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/20 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center p-1.5 transition-colors ${
                          isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-100 text-slate-600 group-hover:text-amber-700 group-hover:bg-amber-100/60"
                        }`}>
                          <Icon className="w-full h-full" />
                        </div>

                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-amber-400"></div>
                        )}
                      </div>

                      <div className="text-sm font-bold text-slate-950 mb-1 font-sans">{item.label}</div>
                      <div className="text-[11px] text-amber-800 font-mono font-bold mb-1">{item.tag}</div>
                      <p className="text-xs text-slate-600 leading-snug">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Dedicated Pod Scale */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Pod Scale &amp; Team Composition</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">Select pod size</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {scaleOptions.map((item) => {
                  const isSelected = teamScale === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTeamScale(item.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer group flex flex-col justify-between ${
                        isSelected 
                          ? "bg-amber-50/70 border-amber-500 text-slate-950 shadow-md shadow-amber-500/15 ring-2 ring-amber-400/30" 
                          : "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/20 shadow-xs"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-amber-800 font-bold">{item.desc}</span>
                          {isSelected ? (
                            <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                          )}
                        </div>

                        <div className="text-sm font-bold text-slate-950 font-sans">{item.title}</div>
                        <div className="text-xs text-amber-700 font-mono mt-1 font-extrabold">{item.size}</div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-200 text-[11px] text-slate-600 font-mono">
                        {item.lead}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Timeline & Delivery Speed */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Delivery Velocity</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">Choose cadence</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setTimeline("standard")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                    timeline === "standard" 
                      ? "bg-amber-50/70 border-amber-500 text-slate-950 shadow-md shadow-amber-500/15 ring-2 ring-amber-400/30" 
                      : "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/20 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-bold text-slate-950 font-sans">Standard Cadence</div>
                    {timeline === "standard" && (
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Two-week sprint reviews, bi-weekly demos &amp; staging QA</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimeline("fast")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                    timeline === "fast" 
                      ? "bg-amber-50/70 border-amber-500 text-slate-950 shadow-md shadow-amber-500/15 ring-2 ring-amber-400/30" 
                      : "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/20 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-bold text-amber-800 font-sans flex items-center gap-1.5">
                      <span>Accelerated Fast-Track</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    {timeline === "fast" && (
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Continuous integration + daily async reviews &amp; dual-shift pods</div>
                </button>
              </div>
            </div>

          </div>

          {/* Results & Bilateral NDA Form Column (Clean White & Yellow Gold Accent, Zero Blue) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-2xl relative ring-1 ring-amber-300/40">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>Instant System Estimate</span>
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                Deliverable-Gated
              </span>
            </div>

            {/* Estimated Values Display */}
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs text-slate-500 font-mono block">Estimated Investment Range:</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-mono mt-1 tracking-tight">
                  ${estimate.minBudget.toLocaleString()} – ${estimate.maxBudget.toLocaleString()}
                  <span className="text-xs font-normal text-slate-500 ml-2">USD</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <span className="text-slate-600 block text-[11px] flex items-center gap-1.5 font-sans">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Target Timeline</span>
                  </span>
                  <span className="text-slate-950 font-bold text-sm sm:text-base mt-1 block">~{estimate.weeks} Weeks</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <span className="text-slate-600 block text-[11px] flex items-center gap-1.5 font-sans">
                    <Users2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dedicated Pod</span>
                  </span>
                  <span className="text-amber-800 font-bold text-sm sm:text-base mt-1 block">{estimate.engineers} Senior Engineers</span>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            {submitted ? (
              <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-amber-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-950 font-mono">Bilateral NDA Dispatched!</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  Our Silicon Valley legal team has dispatched the mutual non-disclosure agreement to <span className="text-amber-800 font-bold">{formData.email}</span>. A Principal Architect will reach out within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-800 block mb-1.5">
                    Your Full Name &amp; Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer, CTO"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
                    className="dx-estimator-input w-full bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25 transition-all font-sans font-medium shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-800 block mb-1.5">
                      Corporate Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
                      className="dx-estimator-input w-full bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25 transition-all font-sans font-medium shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-800 block mb-1.5">
                      Company Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
                      className="dx-estimator-input w-full bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25 transition-all font-sans font-medium shadow-xs"
                    />
                  </div>
                </div>

                {/* Bilateral NDA Checkbox (Clean Amber Card, Zero Blue) */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300/80 hover:border-amber-400 transition-all shadow-xs">
                    <input
                      type="checkbox"
                      checked={requireNda}
                      onChange={(e) => setRequireNda(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-amber-400 text-amber-500 focus:ring-amber-500/30 accent-amber-500 cursor-pointer"
                    />
                    <div className="text-xs leading-snug">
                      <span className="font-bold text-slate-950 flex items-center gap-1.5 text-xs sm:text-sm">
                        <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                        Execute Instant Silicon Valley Bilateral NDA
                      </span>
                      <span className="text-slate-700 block text-xs mt-1 leading-relaxed">
                        Guarantees mutual confidentiality and 100% Day-One client IP protection before roadmap review.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Submit Action (Yellow Button with Dark Text) */}
                <button
                  type="submit"
                  className="w-full mt-3 py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <FileText className="w-4 h-4 text-slate-950" />
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
