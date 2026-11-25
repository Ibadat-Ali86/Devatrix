"use client";

import React from "react";
import Link from "next/link";
import { 
  Users2, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Terminal,
  Clock,
  GitBranch
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function StudioEngagementModels() {
  const models = [
    {
      id: "pods",
      badge: "AUTONOMOUS SQUADS",
      recommended: true,
      title: "Dedicated Senior Engineering Pods",
      tagline: "Turnkey Velocity for Scaling Product Roadmaps",
      desc: "Self-governing, cross-functional engineering pods staffed exclusively by vetted senior staff engineers, architects, and QA leads. Integrated seamlessly into your existing GitHub, Jira, and Slack workflows.",
      specs: [
        { label: "Delivery Cadence", value: "2-Week Agile Sprints • Bi-Weekly Demos" },
        { label: "Pod Composition", value: "Principal Architect + 2-4 Senior Engineers + QA" },
        { label: "Communication", value: "Direct Slack / Discord • Daily Async Standups" },
        { label: "IP Ownership", value: "100% Day-One Assignment (Zero Lock-In)" },
      ],
      highlights: [
        "Staff-level engineers only — zero junior bait-and-switch",
        "Direct pull request ownership with full automated test suites",
        "Seamless timezone alignment across US, EMEA, and APAC",
        "Autonomous backlog grooming and technical debt mitigation",
      ],
      ctaText: "Configure Your Pod",
      ctaLink: "/estimator",
      icon: Users2,
    },
    {
      id: "milestones",
      badge: "DETERMINISTIC SCOPE",
      recommended: false,
      title: "Fixed-Price Milestone Sprints",
      tagline: "Outcome-Gated Delivery with Zero Budget Overrun",
      desc: "Clear milestones, deterministic deliverables, and locked pricing. You pay strictly upon verified staging deployment, passing automated CI/CD test gates, and engineering sign-off.",
      specs: [
        { label: "Delivery Cadence", value: "Milestone-Gated Sprints (2 to 8 Weeks)" },
        { label: "Billing Terms", value: "100% Fixed-Price per Verified Deliverable" },
        { label: "Verification", value: "Automated CI/CD Gating & Staging Acceptance" },
        { label: "Confidentiality", value: "Silicon Valley Bilateral NDA in 60 Seconds" },
      ],
      highlights: [
        "Precise architectural specifications before writing code",
        "Zero invoice creep or unexpected billable hours",
        "Deliverable-gated payments: pay strictly for working code",
        "Comprehensive documentation, IaC scripts, and full git history",
      ],
      ctaText: "Scope Milestone Sprint",
      ctaLink: "/estimator",
      icon: Layers,
    },
    {
      id: "advisory",
      badge: "STRATEGIC LEADERSHIP",
      recommended: false,
      title: "Architecture Advisory & Fractional CTO",
      tagline: "Executive Technical Leadership & Security Auditing",
      desc: "High-impact architectural audits, multi-cloud infrastructure cost reduction, compliance hardening (SOC 2, ISO 27001), and sovereign AI roadmap formulation for high-growth ventures.",
      specs: [
        { label: "Engagement Type", value: "Monthly Executive Retainer or Sprint Audit" },
        { label: "Core Focus", value: "Scalability, Security, Compliance & Cloud Cost" },
        { label: "Deliverables", value: "Production ADRs, Threat Models & Benchmarks" },
        { label: "Objectivity", value: "100% Vendor-Neutral Technology Guidance" },
      ],
      highlights: [
        "AST security reviews and vulnerability triage before audits",
        "Database query profiling and sub-20ms p99 latency tuning",
        "Multi-cloud cost reduction across AWS, GCP, and Azure",
        "Production LLM, RAG, and AI agent feasibility roadmaps",
      ],
      ctaText: "Request Architecture Consultation",
      ctaLink: "/contact",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="engagement-models" className="py-20 sm:py-28 bg-[#FAF9F6] text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3.5 py-1 rounded-full border border-amber-300/60 inline-flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>B2B DELIVERY FRAMEWORKS • STUDIO ENGAGEMENT</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
              Studio Engagement Models. <br />
              <span className="font-editorial italic font-normal text-amber-700">Tailored for Velocity &amp; Sovereignty.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Whether embedding an autonomous senior squad to accelerate roadmap velocity or executing a fixed-scope milestone with deterministic pricing, our delivery models prioritize transparency, code quality, and 100% client IP ownership.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Delivery Archetype Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {models.map((model, idx) => {
            const Icon = model.icon;
            return (
              <ScrollReveal
                key={model.id}
                delay={idx * 0.1}
                direction="up"
                distance={24}
                className="h-full flex"
              >
                <div 
                  className={`dx-card p-6 sm:p-8 flex flex-col justify-between w-full relative transition-all duration-300 ${
                    model.recommended 
                      ? "border-amber-400/80 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/40" 
                      : "hover:border-slate-300"
                  }`}
                >
                  {model.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-[#061833] text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-sm">
                      MOST POPULAR FOR SCALE
                    </div>
                  )}

                  <div>
                    {/* Top Bar: Icon, Badge, Tagline */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center p-2.5 ${
                        model.recommended 
                          ? "bg-amber-50 text-amber-800 border border-amber-200" 
                          : "bg-slate-100 text-slate-800 border border-slate-200"
                      }`}>
                        <Icon className="w-full h-full" />
                      </div>
                      <span className="font-mono text-[10px] sm:text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200/80">
                        {model.badge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 font-sans leading-tight">
                      {model.title}
                    </h3>

                    <p className="text-xs font-mono text-amber-700 font-semibold mb-3">
                      {model.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                      {model.desc}
                    </p>

                    {/* Specifications Grid */}
                    <div className="bg-[#FAF9F6] rounded-xl p-3.5 border border-slate-200/80 space-y-2 mb-6">
                      {model.specs.map((spec) => (
                        <div key={spec.label} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-0.5 sm:gap-2">
                          <span className="font-mono text-slate-500 text-[11px]">{spec.label}:</span>
                          <span className="font-semibold text-slate-900 text-right">{spec.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-2.5 mb-6">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                        Guaranteed Delivery Standards:
                      </div>
                      {model.highlights.map((item) => (
                        <div key={item} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-snug">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href={model.ctaLink}
                      className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        model.recommended
                          ? "bg-[#061833] text-white hover:bg-slate-900 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200"
                      }`}
                    >
                      <span>{model.ctaText}</span>
                      <ArrowRight className="w-4 h-4 text-amber-500" />
                    </Link>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
