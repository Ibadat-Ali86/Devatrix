import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, Award, Laptop, Users, CheckCircle2, GitPullRequest, ShieldCheck } from "lucide-react";

export default function InternshipBanner() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="rounded-3xl bg-gradient-to-br from-[#061833] via-[#092244] to-[#061833] border border-slate-700/80 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          
          {/* Subtle ambient gold radial */}
          <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>DEVATRIX FELLOWSHIP · OUR SOFTWARE HOUSE ALSO TRAINS ELITE TALENT</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-sans leading-tight">
                Step Into the Arena: <br className="hidden sm:inline" />
                <span className="font-editorial italic font-normal text-amber-400">Real Sprints. Real Code. Real Impact.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
                Beyond client delivery, our software house operates an elite 6-week engineering fellowship for ambitious university scholars in Lahore and remote. You will submit verified GitHub pull requests, receive line-by-line feedback from staff architects, and graduate with an indisputable portfolio.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  6-Week Production Sprints
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  1:1 Architect Code Review
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Verified Credential &amp; LOR
                </span>
              </div>

            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/internships/apply"
                className="dx-btn-primary px-6 py-3.5 text-xs sm:text-sm font-extrabold tracking-wide uppercase font-sans text-center"
              >
                <span>Apply for Internship</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/internships"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs sm:text-sm tracking-wide transition-all font-sans text-center"
              >
                <span>View All 6 Tracks</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
