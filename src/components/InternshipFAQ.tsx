"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export default function InternshipFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who is eligible to apply for the 2027 Devatrix cohorts?",
      a: "Undergraduate students, fresh graduates, and self-taught developers across Computer Science, Software Engineering, IT, Data Science, and related STEM fields from any recognized university. Building on over 1,200+ engineers trained across our 2026 batches, we look for foundational coding knowledge, curiosity, and commitment to build real software.",
    },
    {
      q: "Is the internship format remote or on-site?",
      a: "The program is 100% remote-first and virtual with flexible asynchronous milestones. Weekly deliverables and pull requests are managed through GitHub and the Learner Portal. Optional in-person meetups and engineering workshops are held at our Lahore center.",
    },
    {
      q: "What is the weekly time commitment required?",
      a: "The program requires approximately 6 to 8 hours per week. Sprints are self-paced within weekly deadlines so you can seamlessly balance your coursework, semester projects, and university exams without conflict.",
    },
    {
      q: "Is there any application or registration fee?",
      a: "No. Applying for Devatrix internship cohorts is 100% free. We review applications strictly based on technical interest, academic background, and passion for building production-grade software.",
    },
    {
      q: "How are milestones submitted and evaluated?",
      a: "You submit your public GitHub repository links directly through the Devatrix Learner Portal. Our staff architects review your pull requests for architecture, code quality, and security, complemented by automated CI/CD pipeline tests.",
    },
    {
      q: "Will I receive an official Certificate and Letter of Recommendation (LOR)?",
      a: "Yes. All learners who complete the 6 milestone deliverables receive an official, industry-recognized Devatrix Certificate with a permanent cryptographic hash verifiable at /verify. High-achieving top performers receive Gold Honors and an official Letter of Recommendation (LOR).",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight font-sans">
            Frequently Asked <span className="font-editorial italic font-normal text-amber-700">Questions.</span>
          </h2>

          <p className="text-base text-slate-600 font-normal">
            Everything you need to know about eligibility, schedule flexibility, pull request reviews, and certification.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200/90 bg-[#FAF9F6] overflow-hidden transition-all duration-200 hover:border-amber-400"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-sans focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <span className={`w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 bg-amber-50 border-amber-300 text-amber-800" : "text-slate-500"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-200/60 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
