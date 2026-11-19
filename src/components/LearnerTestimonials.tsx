import React from "react";
import Link from "next/link";
import { CheckCircle2, Award, ArrowRight, Quote, Star } from "lucide-react";

export default function LearnerTestimonials() {
  const testimonials = [
    {
      quote: "Building a multi-tenant SaaS with real GitHub pull request reviews taught me more in 6 weeks than 3 years of university coursework. The senior architect code feedback was direct, rigorous, and immediately applicable.",
      name: "Hamza Tariq",
      role: "2026 Cohort Graduate · FAST-NUCES",
      track: "Frontend & Full-Stack Web",
      outcome: "Now Software Engineer at Tech Logistics Startup",
      initials: "HT",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      quote: "Devatrix does not give you toy Jupyter notebooks. We built a production-grade RAG ingestion engine with vector search and rate limiting. Having that public GitHub repo helped me ace my technical interview.",
      name: "Zainab Malik",
      role: "2026 Batch Gold Honors · NUST",
      track: "Applied AI & Agent Engineering",
      outcome: "Received Official LOR & Remote AI Engineer Offer",
      initials: "ZM",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      quote: "As an overseas client, partnering with Devatrix gave us a senior engineering team in Lahore that delivered our MVP on time with 100% IP handover. Their milestone-based transparency was exceptional.",
      name: "David Sterling",
      role: "Enterprise Partner (2026 MVP Deliverable)",
      track: "Enterprise Cloud & Microservices",
      outcome: "Launched B2B Fintech SaaS in 8 Weeks",
      initials: "DS",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9F6] border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Accent Checkmark (Inspired by Koala UI Reference) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="space-y-3">
            {/* Dual Checkmark Accent Icon */}
            <div className="inline-flex items-center gap-1.5 text-amber-600 font-bold">
              <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <svg className="w-5 h-5 text-amber-600 -ml-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold ml-1">
                AUTHENTIC VOICES &amp; PROVEN IMPACT
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
              See What Our Learners &amp; <br className="hidden sm:inline" />
              <span className="font-editorial italic font-normal text-amber-700">Partners Are Saying</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Real results from over 1,200+ university graduates in our 2026 cohorts who transitioned into professional engineers, and business leaders who shipped production software with Devatrix.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/internships"
              className="dx-btn-secondary px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs inline-flex items-center gap-2"
            >
              <span>Explore All Tracks</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="dx-card p-6 sm:p-8 flex flex-col justify-between relative group hover:border-amber-300"
            >
              <div>
                {/* Track Badge & Stars */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border font-bold ${item.badgeColor}`}>
                    {item.track}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed font-normal mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author & Outcome Info */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold font-sans flex items-center justify-center text-sm shrink-0 shadow-xs">
                    {item.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.outcome}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
