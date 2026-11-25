"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  FileCheck, 
  KeyRound, 
  GitBranch, 
  GitPullRequest, 
  Award, 
  ChevronRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function InternshipFlow() {
  const steps = [
    {
      step: "01",
      title: "Apply & Choose Your Track",
      subtitle: "Fast Intake · 6 Specialized Domains",
      desc: "Complete the online intake form in under 3 minutes. Select from 6 intensive engineering domains including Applied AI, Next.js Full-Stack, Cloud & DevOps, Mobile, and Data Science.",
      badge: "Open Admissions",
      icon: FileCheck,
      details: ["Zero application fee", "All university disciplines welcome", "Flexible remote format"],
    },
    {
      step: "02",
      title: "Onboarding & Portal Access",
      subtitle: "Private Learner Workspace",
      desc: "Accepted candidates receive an official acceptance notice and single-use secure link to configure their private learner portal and unique tracking identifier.",
      badge: "Verified Identity",
      icon: KeyRound,
      details: ["Single-use password setup", "Private milestone dashboard", "Pre-cohort environment guide"],
    },
    {
      step: "03",
      title: "Hands-on Milestone Sprints",
      subtitle: "Predefined Industry Projects",
      desc: "Work on structured, assignment-based deliverables rather than passive video lectures. Architect modular systems, write tests, and commit code directly to your public GitHub.",
      badge: "Public GitHub Portfolio",
      icon: GitBranch,
      details: ["6 structured weekly sprints", "Real-world engineering specs", "100% Day-One code ownership"],
    },
    {
      step: "04",
      title: "Line-by-Line Architect Review",
      subtitle: "Senior Engineering Oversight",
      desc: "Submit your repository links through the portal. Staff engineers review your pull requests for architectural design, security, and cleanliness, backed by automated CI test runs.",
      badge: "Staff-Level Mentorship",
      icon: GitPullRequest,
      details: ["Production PR feedback", "Automated GitHub checks", "Direct milestone sign-off"],
    },
    {
      step: "05",
      title: "Evaluation & Cryptographic Credential",
      subtitle: "Indisputable Career Proof",
      desc: "Graduate with an industry-recognized completion certificate featuring a permanent SHA-256 hash verifiable at /verify. Top performers earn Gold Honors and fast-track interviews.",
      badge: "Verified Certificate",
      icon: Award,
      details: ["Permanent /verify lookup", "Official Letter of Recommendation (LOR)", "Studio referral fast-track"],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#FAF9F6] text-slate-900 border-b border-slate-200/80 relative overflow-hidden">
      
      {/* Subtle Ambient Radial Grid */}
      <div 
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>INTERNSHIP CADENCE • STEP-BY-STEP ROADMAP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight font-sans leading-tight">
              How The Program Works, <br />
              <span className="font-editorial italic font-normal text-amber-700">
                From Day One to Verified Graduation.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              No ambiguous tasks or passive video watching. Devatrix utilizes an assignment-based, milestone-driven internship flow that mirrors real software engineering teams.
            </p>
          </div>
        </ScrollReveal>

        {/* 5-Step Connected Flow (Desktop 5-col / Tablet 2-col / Mobile 1-col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-4 relative">
          
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={item.step}
                delay={idx * 0.1}
                direction="up"
                distance={20}
                className={idx === 4 ? "sm:col-span-2 lg:col-span-1 max-w-md sm:max-w-none mx-auto w-full h-full" : "h-full"}
              >
                <div 
                  className="relative flex flex-col justify-between h-full p-5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Step Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl bg-[#061833] text-amber-400 font-mono font-black text-sm flex items-center justify-center shadow-xs">
                        {item.step}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-amber-700" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-sans leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-mono text-amber-700 font-semibold mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  {/* Step Sub-points */}
                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                    {item.details.map((point) => (
                      <div key={point} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}

        </div>

        {/* Bottom Fast-Track Callout */}
        <ScrollReveal direction="up" delay={0.15} distance={20}>
          <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  100% Free Application &amp; Flexible Academic Schedule
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Building on our proven 2026 track record, virtual 6-week 2027 cohorts accommodate university classes and semester exams.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/internships/apply"
                className="dx-btn-primary px-6 py-3 text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 rounded-full"
              >
                <span>Apply for 2027 Cohort</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>

    </section>
  );
}
