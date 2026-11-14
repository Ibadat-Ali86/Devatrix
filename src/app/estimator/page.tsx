import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectEstimator from "@/components/ProjectEstimator";
import ComparisonMatrix from "@/components/ComparisonMatrix";
import { Calculator, ShieldCheck, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function EstimatorPage() {
  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-28 pb-12 sm:pb-20">
        
        {/* Header */}
        <section className="relative py-16 sm:py-20 border-b border-white/5 bg-gradient-to-b from-obsidian-900 to-obsidian-950 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-mono text-brand-400">
              <Calculator className="w-3.5 h-3.5" />
              <span>INTERACTIVE COST & ARCHITECTURE ESTIMATOR</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Scope Your System. <br />
              <span className="text-brand-400">Generate A Mutual Bilateral NDA.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Eliminate agency guesswork. Configure your system archetypes, pod sizes, and delivery cadence to receive a deliverable-gated proposal backed by an instant Silicon Valley bilateral non-disclosure agreement.
            </p>
          </div>
        </section>

        {/* Project Estimator Component */}
        <div className="py-12">
          <ProjectEstimator />
        </div>

        {/* Comparison Matrix */}
        <ComparisonMatrix />

      </main>

      <Footer />
    </div>
  );
}
