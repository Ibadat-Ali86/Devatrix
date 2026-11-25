import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function WhyDevatrix() {
  const comparisons = [
    {
      num: "01",
      dimension: "Delivery Cadence & Accountability",
      statusQuo: "Unpredictable hourly billing, scope creep, and months of unvalidated requirement drift.",
      devatrixWay: "2-week milestone sprints, fixed-price predictability, and continuous staging deployments.",
      benefit: "Deterministic Velocity",
    },
    {
      num: "02",
      dimension: "Talent Seniority & Staffing",
      statusQuo: "Senior partners pitch the contract, then delegate execution to unsupervised junior developers.",
      devatrixWay: "Dedicated squads staffed exclusively by vetted senior staff architects and engineers.",
      benefit: "Staff-Level Only",
    },
    {
      num: "03",
      dimension: "Code Quality & Vulnerability Auditing",
      statusQuo: "Minimal test coverage, manual superficial reviews, and vulnerabilities caught late in production.",
      devatrixWay: "Zero-defect CI/CD pipelines, automated AST security analysis, and 95%+ test coverage.",
      benefit: "Zero-Defect SLA",
    },
    {
      num: "04",
      dimension: "Intellectual Property & Sovereignty",
      statusQuo: "Murky IP assignment, hidden proprietary vendor lock-in, and painful handovers.",
      devatrixWay: "100% Day-One client IP ownership, 60-second bilateral NDA, and clean documented git history.",
      benefit: "100% Sovereign IP",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <ScrollReveal direction="up" delay={0.1}>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/60 inline-block">
                THE ARCHITECTURAL STANDARD
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans leading-tight mt-3">
                Real Production Engineering, <br />
                <span className="font-editorial italic font-normal text-amber-700">Never Compromised Quality.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mt-4">
                Most software agencies rely on junior bait-and-switch staffing and unverified code churn. Devatrix provides autonomous senior squads and milestone-gated delivery, building resilient architectures with 100% client IP sovereignty.
              </p>

              {/* Quick Proof Badges */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Staff-level engineers and principal architects on every engagement</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated CI/CD test gates &amp; AST security scans before staging</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Day-One client IP ownership and clean git repositories</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/services"
                  className="dx-btn-secondary px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs inline-flex items-center gap-2"
                >
                  <span>Explore Delivery Frameworks</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Comparison Matrix (Preserving exact clean technical layout) */}
          <div className="lg:col-span-7 space-y-4">
            {comparisons.map((item, idx) => (
              <ScrollReveal
                key={item.num}
                delay={idx * 0.1}
                direction="up"
                distance={20}
              >
                <div className="dx-card p-6 border border-slate-200/90 hover:border-amber-400 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        [{item.num}]
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 font-sans">
                        {item.dimension}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.benefit}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    {/* Status Quo */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 space-y-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
                        Traditional Outsource Agencies
                      </span>
                      <p className="leading-relaxed">{item.statusQuo}</p>
                    </div>

                    {/* Devatrix Way */}
                    <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 text-slate-800 space-y-1 font-medium">
                      <span className="font-mono text-[10px] uppercase font-bold text-amber-800 block">
                        The Devatrix Standard
                      </span>
                      <p className="leading-relaxed text-slate-900">{item.devatrixWay}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
