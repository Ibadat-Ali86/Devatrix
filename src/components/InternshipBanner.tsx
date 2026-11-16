import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, Award, Laptop, Users, CheckCircle2 } from "lucide-react";

export default function InternshipBanner() {
  return (
    <section className="py-10 sm:py-20 bg-gradient-to-br from-slate-900 to-[#061833] text-white border-b border-white/10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="p-4 sm:p-12 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-xs sm:text-xs font-mono font-medium text-brand-400">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>APPLICATIONS NOW OPEN FOR 2026 COHORT</span>
            </div>

            <h2 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Launch Your Engineering Career with Devatrix Internships
            </h2>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal">
              Designed for university students and fresh graduates in Lahore & remote. Work on real production SaaS, build applied AI chatbots, and receive direct 1-on-1 mentorship from senior architects.
            </p>

            <div className="pt-1 sm:pt-2 flex flex-wrap gap-2.5 sm:gap-4 text-xs sm:text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                "Top Performer" Honors
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                6-Week Intensive Sprint
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                Verified Credential & LOR
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-row lg:flex-col gap-2.5 sm:gap-3">
            <Link
              href="/internships/apply"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs sm:text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-500/25 font-sans"
            >
              <span>Apply for Internship</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>

            <Link
              href="/internships"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 font-semibold text-xs sm:text-xs tracking-wider transition-all font-sans"
            >
              <span>View All 6 Tracks</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}