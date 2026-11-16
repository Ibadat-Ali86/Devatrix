import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, Award, Users, CheckCircle2, Sparkles, Code2 } from "lucide-react";

export default function VanguardShowcase() {
  const universities = [
    { name: "FAST-NUCES", campuses: "Islamabad, Lahore, Karachi, Peshawar" },
    { name: "NUST (SEECS)", campuses: "Islamabad" },
    { name: "LUMS (SSE)", campuses: "Lahore" },
    { name: "GIKI", campuses: "Topi, Swabi" },
    { name: "UET Lahore", campuses: "Main Campus" },
    { name: "ITU", campuses: "Information Technology University" },
  ];

  return (
    <section className="py-24 bg-white text-slate-900 border-t border-slate-200 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Fellowship Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-semibold text-blue-800">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>THE ELITE STUDENT FELLOWSHIP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Devatrix Vanguard™ <br />
              <span className="text-brand-600">Campus Engineering Residency.</span>
            </h2>

            <p className="text-base text-slate-600 leading-relaxed font-normal">
              We do not run generic internships. The Devatrix Vanguard is a highly selective 6-month elite residency where top computer science scholars from Pakistan&apos;s leading universities build and ship production code alongside Senior Staff Architects.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-2 font-mono">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-brand-600">3,400+</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Applicants Annually</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">Top 2.5%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Acceptance Rate</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold text-emerald-600">100%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">FT Employment Offer</div>
              </div>
            </div>

            {/* Residency Perks */}
            <div className="space-y-2.5 pt-2 text-sm text-slate-700 font-mono text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>$800/mo paid fellowship stipend + M3 Pro MacBook hardware provision</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-on-1 weekly technical mentorship with Principal Distributed Systems Architects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified tamper-proof Devatrix Fellow Credential listed on the public registry</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/vanguard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 text-obsidian-950 font-mono text-xs font-bold uppercase tracking-wider hover:brightness-105 shadow-md shadow-brand-500/20 transition-all"
              >
                <span>Apply For Vanguard 2026</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/careers"
                className="text-xs font-mono font-semibold text-slate-600 hover:text-brand-600 transition-colors"
              >
                Explore Senior Lateral Roles →
              </Link>
            </div>
          </div>

          {/* Right Column: Campus Network Grid */}
          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-mono">
              <span className="text-slate-700 font-bold uppercase tracking-wider">
                Vanguard Campus Network
              </span>
              <span className="text-brand-700 font-bold">Cohort 2026</span>
            </div>

            <div className="space-y-3">
              {universities.map((uni) => (
                <div
                  key={uni.name}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-brand-500/40 hover:shadow-sm transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 font-mono transition-colors">
                      {uni.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {uni.campuses}
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Active Chapter
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <p className="text-[11px] font-mono text-slate-500">
                Are you a campus lead? <Link href="/vanguard#ambassador" className="text-brand-700 font-semibold hover:underline">Apply as Campus Ambassador</Link>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
