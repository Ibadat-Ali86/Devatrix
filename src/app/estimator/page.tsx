import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectEstimator from "@/components/ProjectEstimator";
import ComparisonMatrix from "@/components/ComparisonMatrix";
import { Calculator, ShieldCheck, Lock, CheckCircle2, Zap } from "lucide-react";

export const metadata = {
  title: "Interactive System Architecture & Cost Estimator | Devatrix",
  description: "Configure your technical requirements to generate instant timeline and sprint budgets, backed by a mutual non-disclosure agreement and 100% Day-One IP ownership.",
};

export default function EstimatorPage() {
  return (
    <div className="dx-public dx-estimator min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-[#061833] overflow-x-clip">
      <Navbar />

      <main className="flex-1 pt-16 sm:pt-24">
        
        {/* ========================================================================= */}
        {/* Executive Hero Banner (#061833 Dark Navy Theme) */}
        {/* ========================================================================= */}
        <section data-navbar-theme="dark" className="relative py-20 sm:py-28 border-b border-white/10 bg-[#061833] text-white overflow-hidden">
          {/* Ambient Lighting Accents */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            
            {/* Eyebrow Badge */}
            <div className="animate-hero-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono font-bold tracking-wider text-amber-300 shadow-sm">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>INTERACTIVE SYSTEM ARCHITECTURE &amp; COST ESTIMATOR</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="animate-hero-reveal text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-sans max-w-4xl mx-auto">
              Scope Your System Architecture. <br />
              <span className="font-editorial italic font-normal text-amber-400">
                Generate An Instant Bilateral NDA.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-hero-reveal text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Eliminate agency guesswork and billing leakage. Configure your technical archetypes, dedicated pod size, and delivery velocity to receive an instant sprint proposal backed by an automated Silicon Valley mutual non-disclosure agreement.
            </p>

            {/* Proof Points Strip */}
            <div className="animate-hero-reveal pt-6 sm:pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-sans">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">100% Day-One IP Sovereignty</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Instant Silicon Valley Bilateral NDA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">Deliverable-Gated Sprint Invoicing</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* Project Estimator Calculator Component */}
        {/* ========================================================================= */}
        <ProjectEstimator />

        {/* ========================================================================= */}
        {/* Comparison Matrix Component (Outcome Revolution) */}
        {/* ========================================================================= */}
        <ComparisonMatrix />

      </main>

      <Footer />
    </div>
  );
}
