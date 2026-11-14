import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, Award, Laptop, Users, CheckCircle2 } from "lucide-react";

export default function InternshipBanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-[#061833] text-white border-b border-white/10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-xs font-mono font-medium text-brand-400">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>APPLICATIONS NOW OPEN FOR 2026 COHORT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Launch Your Engineering Career with Devatrix Internships
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Designed for university students and fresh graduates in Lahore & remote. Work on real production SaaS, build applied AI chatbots, and receive direct 1-on-1 mentorship from senior architects.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
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

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/internships/apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-500/25 font-sans"
            >
              <span>Apply for Internship</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/internships"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 font-semibold text-xs tracking-wider transition-all font-sans"
            >
              <span>View All 7 Tracks</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}