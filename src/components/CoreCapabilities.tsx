import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, GitBranch, Terminal } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function CoreCapabilities() {
  const tracks = [
    {
      id: "01",
      title: "Frontend & Full-Stack Web Engineering",
      tagline: "React 19, Next.js 16 App Router & TypeScript",
      desc: "Architect high-performance web applications with Server Components, optimistic UI updates, multi-tenant authentication, and server-side PostgreSQL integration.",
      capstone: "Delivered: Multi-tenant SaaS with Stripe billing and RBAC permissions",
      tools: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    },
    {
      id: "02",
      title: "Applied AI & Agent Engineering",
      tagline: "Production RAG, Vector Search & Autonomous Tooling",
      desc: "Implement enterprise retrieval-augmented generation pipelines, schema-constrained function calling, vector indexing with pgvector, and multi-agent coordination.",
      capstone: "Delivered: Hybrid semantic document search engine with sub-50ms latency",
      tools: ["Python", "FastAPI", "Qdrant / pgvector", "LlamaIndex", "LangChain"],
    },
    {
      id: "03",
      title: "Enterprise Cloud & DevOps Infrastructure",
      tagline: "Docker, Kubernetes & Automated CI/CD Pipelines",
      desc: "Provision production infrastructure as code with Terraform, containerize microservices with multi-stage non-root Docker builds, and configure zero-downtime rolling deploys.",
      capstone: "Delivered: Automated GitHub Actions CI/CD to AWS with rolling healthchecks",
      tools: ["Docker", "Kubernetes", "AWS", "Terraform", "GitHub Actions"],
    },
    {
      id: "04",
      title: "Data Engineering & Real-Time Analytics",
      tagline: "Statistical Modeling, Feature Pipelines & SQL Warehouses",
      desc: "Translate raw relational and event streams into decision models. Perform data quality audits, build Star-Schema models in Power BI, and write high-efficiency analytical CTEs.",
      capstone: "Delivered: Production revenue churn predictor and executive telemetry dashboard",
      tools: ["Python", "Pandas", "PostgreSQL", "Power BI", "Scikit-Learn"],
    },
    {
      id: "05",
      title: "Cross-Platform Mobile App Engineering",
      tagline: "React Native & Flutter Native-Performance Mobile",
      desc: "Build fluid, responsive iOS and Android applications with offline-first synchronization, native device sensor integration, and automated release builds.",
      capstone: "Delivered: Real-time telemetry mobile companion with push notifications",
      tools: ["React Native", "Flutter", "TypeScript", "Zustand", "REST APIs"],
    },
    {
      id: "06",
      title: "Dedicated Senior Engineering Pods",
      tagline: "Autonomous Product Delivery for Client Partners",
      desc: "Scale your software roadmap with self-managed pods of vetted senior staff engineers, architects, and QA leads. 100% Day-One IP ownership guaranteed.",
      capstone: "Delivered: Full-cycle architecture and MVP delivery within 6 to 8 weeks",
      tools: ["Senior Pods", "100% IP Sovereignty", "Milestone Sprints", "SOC 2 Aligned"],
    },
  ];

  return (
    <section id="solutions" className="py-20 sm:py-28 bg-[#FAF9F6] text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/60 inline-block mb-3">
              INDUSTRIAL ARCHITECTURE • CORE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
              Industrial Architecture &amp; <br />
              <span className="font-editorial italic font-normal text-amber-700">Modern Software Solutions</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              From high-throughput cloud backends and enterprise SaaS platforms to applied AI workflows and dedicated engineering pods, explore our core solution capabilities.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 Engineering Blueprint Cards with Staggered ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tracks.map((track, idx) => (
            <ScrollReveal
              key={track.id}
              delay={(idx % 3) * 0.1}
              direction="up"
              distance={24}
              className="h-full"
            >
              <div className="dx-card p-6 sm:p-8 flex flex-col justify-between h-full group hover:border-amber-400">
                <div>
                  {/* Track Index and Tagline */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/80">
                      SOLUTION {track.id}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-slate-500">
                      Production-Grade
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 font-sans leading-snug group-hover:text-amber-800 transition-colors">
                    {track.title}
                  </h3>

                  <p className="text-xs font-mono text-amber-700 font-semibold mb-3">
                    {track.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                    {track.desc}
                  </p>
                </div>

                <div>
                  {/* Real Production Capstone Callout */}
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-slate-200/80 mb-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold mb-1">
                      Verified Production Deliverable
                    </div>
                    <div className="text-xs font-semibold text-slate-800 leading-snug">
                      {track.capstone}
                    </div>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pb-4 mb-4 border-b border-slate-100">
                    {track.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/estimator"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors font-sans"
                  >
                    <span>Scope This Solution / Pod</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
