import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Code2 } from "lucide-react";

export default function FeaturedWork({ cmsCaseStudies }: { cmsCaseStudies?: Array<{ id: string; title: string; summary: string; badge: string }> }) {
  const defaultCaseStudies = [
    {
      id: "case-study-saas",
      title: "Multi-Tenant SaaS Platform & Subscription Engine",
      sector: "Modern Web & Cloud SaaS",
      metric: "< 150ms",
      metricLabel: "Global API Response Latency",
      desc: "Engineered a modern full-stack multi-tenant SaaS application with automated Stripe billing, granular role-based permissions (RBAC), and real-time webhook synchronization.",
      tags: ["Next.js 14", "React 19", "TypeScript", "PostgreSQL", "Stripe"],
    },
    {
      id: "case-study-ai",
      title: "AI Knowledge Base & Semantic Search Assistant",
      sector: "Applied AI & Vector Search",
      metric: "Sub-Second",
      metricLabel: "Vector Query & Generation",
      desc: "Built an intelligent document ingestion pipeline that indexes unstructured contracts and technical manuals for semantic search and question answering using Retrieval-Augmented Generation (RAG).",
      tags: ["Python", "FastAPI", "Vector DB", "LlamaIndex", "Docker"],
    },
    {
      id: "case-study-telemetry",
      title: "Real-Time Telemetry & Dispatch Operations Console",
      sector: "Real-Time Systems & WebSockets",
      metric: "Live Sync",
      metricLabel: "Bi-Directional State Streaming",
      desc: "Developed a high-responsiveness web operations console providing live field team dispatch tracking, interactive map telemetry, and instant notification alerts via bi-directional WebSockets.",
      tags: ["React", "Node.js", "WebSockets", "Redis Pub/Sub", "Tailwind CSS"],
    },
  ];

  const caseStudies = cmsCaseStudies !== undefined ? cmsCaseStudies.map((item, index) => {
    const original = defaultCaseStudies.find((study) => study.id === item.id) ?? defaultCaseStudies[index % defaultCaseStudies.length];
    return { ...original, title: item.title, desc: item.summary, sector: item.badge };
  }) : defaultCaseStudies;

  return (
    <section className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/60 inline-block">
              ENGINEERING SHOWCASE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
              Featured Case Studies <br className="hidden sm:inline" />
              <span className="font-editorial italic font-normal text-amber-700">Delivered to Production</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Explore how our engineering pods solve complex technical challenges with measurable business outcomes.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/work"
              className="dx-btn-secondary px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs inline-flex items-center gap-2"
            >
              <span>View All Case Studies</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* 3 Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {caseStudies.map((study) => (
            <div
              key={study.title}
              className="dx-card p-6 sm:p-8 flex flex-col justify-between group hover:border-amber-400"
            >
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-mono font-bold text-amber-800">
                    {study.sector}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-500">
                    Verified Deployment
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors mb-3 font-sans leading-snug">
                  {study.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                  {study.desc}
                </p>
              </div>

              <div>
                {/* Metric Box */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 mb-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
                    {study.metric}
                  </div>
                  <div className="text-xs text-slate-600 font-sans mt-0.5 font-medium">
                    {study.metricLabel}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {study.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
