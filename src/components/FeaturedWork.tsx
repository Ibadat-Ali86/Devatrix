import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Code2 } from "lucide-react";

export default function FeaturedWork() {
  const caseStudies = [
    {
      title: "Multi-Tenant SaaS Platform & Subscription Engine",
      sector: "Modern Web & Cloud SaaS",
      metric: "< 150ms",
      metricLabel: "Global API Response Latency",
      desc: "Engineered a modern full-stack multi-tenant SaaS application with automated Stripe billing, granular role-based permissions (RBAC), and real-time webhook synchronization.",
      tags: ["Next.js 14", "React 19", "TypeScript", "PostgreSQL", "Prisma", "Stripe"],
    },
    {
      title: "AI Knowledge Base & Intelligent Document Assistant",
      sector: "Applied AI & Semantic Search",
      metric: "Sub-Second",
      metricLabel: "Retrieval & Query Response",
      desc: "Built an intelligent document ingestion pipeline that indexes unstructured contracts and technical manuals for semantic search and question answering using Retrieval-Augmented Generation (RAG).",
      tags: ["Python", "FastAPI", "Qdrant Vector DB", "LlamaIndex", "OpenAI API", "Docker"],
    },
    {
      title: "Real-Time Operational Telemetry & Dispatch Console",
      sector: "Real-Time Systems & WebSockets",
      metric: "Real-Time",
      metricLabel: "Live Bi-Directional State Sync",
      desc: "Developed a high-responsiveness web operations console providing live field team dispatch tracking, interactive map telemetry, and instant notification alerts via bi-directional WebSockets.",
      tags: ["React", "Node.js", "WebSockets", "Redis Pub/Sub", "Leaflet", "Tailwind CSS"],
    },
  ];

  return (
    <section className="py-12 sm:py-24 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-16">
          <div>
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-brand-600 mb-1.5 sm:mb-2 block">
              ENGINEERING SHOWCASE
            </span>
            <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-sans">
              Featured Case Studies <br className="hidden sm:inline" />
              <span className="text-brand-600">Built for Modern Businesses</span>
            </h2>
          </div>
          <Link
            href="/work"
            className="mt-3 md:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors font-sans"
          >
            <span>View All Case Studies</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        {/* 3 Case Study Cards - Preserving 3-column layout on all viewports */}
        <div className="grid grid-cols-3 gap-2 sm:gap-8">
          {caseStudies.map((study) => (
            <div
              key={study.title}
              className="p-2.5 sm:p-8 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-brand-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-xs sm:shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <span className="text-[9px] sm:text-xs font-mono font-bold text-brand-700 bg-brand-50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded border border-brand-200 truncate">
                    {study.sector}
                  </span>
                  <span className="hidden sm:inline text-xs font-mono text-slate-400 font-medium">
                    Verified Work
                  </span>
                </div>

                <h3 className="text-xs sm:text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1.5 sm:mb-3 font-sans line-clamp-2">
                  {study.title}
                </h3>

                <p className="text-[10px] sm:text-sm text-slate-600 leading-relaxed font-normal mb-3 sm:mb-6 line-clamp-2 sm:line-clamp-none">
                  {study.desc}
                </p>
              </div>

              <div>
                {/* Highlight Metric */}
                <div className="p-2 sm:p-4 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100 mb-2 sm:mb-4">
                  <div className="text-sm sm:text-3xl font-extrabold text-slate-900 font-sans">
                    {study.metric}
                  </div>
                  <div className="text-[9px] sm:text-xs text-slate-500 font-sans mt-0.5 truncate">
                    {study.metricLabel}
                  </div>
                </div>

                <div className="hidden sm:flex flex-wrap gap-1.5 pt-2">
                  {study.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600"
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
