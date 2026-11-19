import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, GitPullRequest, Award, FileCode } from "lucide-react";

export default function WhyDevatrix() {
  const comparisons = [
    {
      num: "01",
      dimension: "Code Artifacts & Repositories",
      statusQuo: "Toy Jupyter notebooks, local code snippets, and unversioned tutorial exercises.",
      devatrixWay: "Public GitHub repositories with clean commits, branch protection, and automated CI/CD checks.",
      benefit: "Recruiter-Auditable Portfolio",
    },
    {
      num: "02",
      dimension: "Engineering Feedback & Reviews",
      statusQuo: "Automated multiple-choice quizzes, peer evaluations, or zero architectural oversight.",
      devatrixWay: "Line-by-line pull request audits by senior staff architects on security, performance, and structure.",
      benefit: "Staff-Level Code Mentorship",
    },
    {
      num: "03",
      dimension: "Completion Credentials",
      statusQuo: "Unverifiable static PDF certificates easily falsified and ignored by hiring managers.",
      devatrixWay: "Cryptographically verifiable credentials with permanent SHA-256 IDs linked to submitted PRs.",
      benefit: "Indisputable Technical Proof",
    },
    {
      num: "04",
      dimension: "Client IP & Deliverable Sovereignty",
      statusQuo: "Murky IP assignment, hidden vendor lock-in, and unpredictable hourly invoice creep.",
      devatrixWay: "100% Day-One client IP ownership, fixed-scope milestone sprints, and clean documentation.",
      benefit: "Zero Intellectual Property Risk",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Pedagogy */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/60 inline-block">
              THE APPRENTICESHIP STANDARD
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans leading-tight">
              Real Production Code, <br />
              <span className="font-editorial italic font-normal text-amber-700">Never Simulated Exercises.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Most online courses teach you how to copy code from a tutorial. Devatrix immerses you in the actual cadence of an elite engineering organization: writing testable features, defending pull request design choices, and maintaining high software reliability.
            </p>

            {/* Quick Proof Badges */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>6-Week Sprints configured around university exam schedules</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Top performers receive direct fast-track junior engineer interviews</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Official Letter of Recommendation (LOR) for verified distinctions</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="dx-btn-secondary px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs inline-flex items-center gap-2"
              >
                <span>Read About Our Pedagogy &amp; Mentors</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>
            </div>
          </div>

          {/* Right Column: Comparison Matrix (No AI-slop icons, clean technical layout) */}
          <div className="lg:col-span-7 space-y-4">
            {comparisons.map((item) => (
              <div
                key={item.num}
                className="dx-card p-6 border border-slate-200/90 hover:border-amber-400 transition-all space-y-3"
              >
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
                      Generic Courses &amp; Bootcamps
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
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
