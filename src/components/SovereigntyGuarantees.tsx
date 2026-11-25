"use client";

import React from "react";
import Link from "next/link";
import { 
  Lock, 
  FileCode, 
  Terminal, 
  Users2, 
  ShieldCheck, 
  ArrowRight, 
  Calculator,
  CheckCircle2
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function SovereigntyGuarantees() {
  const guarantees = [
    {
      icon: Lock,
      title: "100% Day-One IP Sovereignty",
      badge: "CLIENT OWNERSHIP",
      desc: "All source code, pull requests, architecture design documents, and cloud provisioning scripts belong 100% to your entity from day one. Zero proprietary runtime locks or licensing royalties.",
    },
    {
      icon: FileCode,
      title: "Silicon Valley Bilateral NDA",
      badge: "60-SECOND EXECUTION",
      desc: "Protect your proprietary roadmap instantly. Our automated legal generator issues standard Silicon Valley mutual non-disclosure agreements before any technical discovery call.",
    },
    {
      icon: Terminal,
      title: "Production CI/CD Quality Gates",
      badge: "ZERO-DEFECT POLICY",
      desc: "Every commit undergoes automated AST linting, unit test coverage gates (>90%), non-root multi-stage container builds, and security scans before staging deployment.",
    },
    {
      icon: Users2,
      title: "Direct Staff Architect Line",
      badge: "ZERO MIDDLEMEN",
      desc: "No sales intermediary telephone games. You collaborate directly with principal architects and staff engineers in your Slack channel and during bi-weekly sprint demos.",
    },
  ];

  return (
    <section data-navbar-theme="dark" className="py-20 sm:py-28 bg-[#061833] text-white relative border-y border-white/10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[250px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono font-bold tracking-wider text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>THE DEVATRIX CLIENT SOVEREIGNTY CHARTER</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-sans">
              Architectural Guarantees. <br />
              <span className="font-editorial italic font-normal text-amber-400">Security &amp; Full IP Sovereignty.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Enterprise engineering requires institutional trust. We structure every client partnership with clear legal boundaries, rigorous code reviews, and transparent sprint accountability.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Trust Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 items-stretch mb-14">
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={item.title}
                delay={idx * 0.08}
                direction="up"
                distance={20}
                className="h-full flex"
              >
                <div className="p-6 sm:p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.07] transition-all flex flex-col justify-between w-full backdrop-blur-sm">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center p-2 text-amber-400">
                        <Icon className="w-full h-full" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-sans leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Contractually Guaranteed</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Interactive Estimator Callout Strip */}
        <ScrollReveal direction="up" delay={0.2} distance={20}>
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-blue-600/15 to-amber-500/15 p-6 sm:p-8 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Instant Transparency</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                Ready to scope your system architecture &amp; generate a bilateral NDA?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal">
                Use our interactive cost estimator to configure pod sizes, system archetypes, and delivery cadences in under 60 seconds.
              </p>
            </div>

            <Link
              href="/estimator"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#061833] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 shrink-0"
            >
              <span>Launch Cost Estimator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
