"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Cpu, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  Database, 
  Smartphone, 
  Globe, 
  Bot, 
  ArrowRight, 
  Zap, 
  Code2, 
  Sparkles,
  Server,
  CloudCog
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function ServicesGrid() {
  const [activeTab, setActiveTab] = useState<"all" | "core" | "ai" | "accelerators">("all");

  const services = [
    // Tier 1: Core Engineering
    {
      category: "core",
      tier: "Tier 1: Core Engineering",
      title: "Distributed Cloud & Backend Architecture",
      desc: "Microservices and event-driven systems built for horizontal scale, handling millions of requests with sub-20ms p99 latencies.",
      icon: Server,
      tags: ["Go", "Rust", "Node.js", "Kubernetes", "gRPC", "Kafka"],
      badge: "Scale-Ready",
    },
    {
      category: "core",
      tier: "Tier 1: Core Engineering",
      title: "Mission-Critical Web & Mobile Platforms",
      desc: "Enterprise Next.js web applications and native iOS/Android experiences engineered with high-density UI and zero frame drops.",
      icon: Globe,
      tags: ["React 19", "Next.js", "TypeScript", "Swift", "Kotlin", "Flutter"],
      badge: "High Performance",
    },
    {
      category: "core",
      tier: "Tier 1: Core Engineering",
      title: "DevSecOps & Multi-Cloud Infrastructure",
      desc: "Automated Terraform / OpenTofu pipelines, zero-trust perimeter configurations, and continuous ISO/SOC2 compliance monitoring.",
      icon: CloudCog,
      tags: ["AWS", "Azure", "GCP", "Docker", "Terraform", "ArgoCD"],
      badge: "Zero-Downtime",
    },

    // Tier 2: Sovereign AI
    {
      category: "ai",
      tier: "Tier 2: Sovereign AI",
      title: "Autonomous Agent Swarms",
      desc: "Hierarchical AI swarms executing complex, multi-step asynchronous business workflows with deterministic verification checks.",
      icon: Bot,
      tags: ["Multi-Agent Systems", "LangGraph", "AutoGPT", "Tool Calling", "RAG"],
      badge: "AI-Native",
    },
    {
      category: "ai",
      tier: "Tier 2: Sovereign AI",
      title: "Fine-Tuned Local & Private LLMs",
      desc: "Domain-adapted open-weights LLMs (Llama 3, Mistral, DeepSeek) self-hosted on client infrastructure with 100% data privacy.",
      icon: Cpu,
      tags: ["vLLM", "Ollama", "LoRA", "HuggingFace", "On-Premises AI"],
      badge: "100% Private",
    },
    {
      category: "ai",
      tier: "Tier 2: Sovereign AI",
      title: "Enterprise Vector Knowledge Bases",
      desc: "Sub-second hybrid semantic search over terabytes of unstructured corporate documentation, contracts, and codebases.",
      icon: Database,
      tags: ["Qdrant", "Pinecone", "Milvus", "pgvector", "Hybrid RAG"],
      badge: "Sub-Second Search",
    },

    // Tier 3: Devatrix IP Accelerators
    {
      category: "accelerators",
      tier: "Tier 3: IP Accelerators",
      title: "Devatrix FlowEngine™",
      desc: "Sub-millisecond distributed workflow orchestrator that coordinates distributed microservices with zero database bottleneck.",
      icon: Zap,
      tags: ["Proprietary Engine", "Event Mesh", "Zero-Latency", "SDK Included"],
      badge: "Proprietary IP",
      accent: true,
    },
    {
      category: "accelerators",
      tier: "Tier 3: IP Accelerators",
      title: "Devatrix GuardAPI™",
      desc: "Real-time automated API threat detection, rate-limiting, and PII anonymization gateway with built-in audit trails.",
      icon: ShieldCheck,
      tags: ["Zero-Trust", "OWASP Top 10", "PII Redaction", "WAF"],
      badge: "Proprietary IP",
      accent: true,
    },
    {
      category: "accelerators",
      tier: "Tier 3: IP Accelerators",
      title: "Devatrix PayPulse™",
      desc: "High-throughput financial ledger and multi-rail payment settlement middleware with automatic bilateral reconciliation.",
      icon: Code2,
      tags: ["Fintech", "Double-Entry Ledger", "Stripe / Swift", "PCI-DSS"],
      badge: "Proprietary IP",
      accent: true,
    },
  ];

  const filteredServices = activeTab === "all" 
    ? services 
    : services.filter(s => s.category === activeTab);

  return (
    <section id="services-grid" className="py-20 sm:py-28 bg-[#FAF9F6] text-slate-900 relative border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-xs font-mono font-semibold text-amber-900 mb-3">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>3-TIER CAPABILITY TAXONOMY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
                Enterprise Engineering. <br />
                <span className="font-editorial italic font-normal text-amber-700">Modular by Design.</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
                From mission-critical distributed systems to sovereign on-premise AI agents and pre-engineered software accelerators.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 bg-white p-1.5 rounded-xl border border-slate-200/90 shadow-sm font-mono text-xs shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === "all" 
                    ? "bg-[#061833] text-white font-bold shadow-sm" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                All Capabilities (9)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("core")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === "core" 
                    ? "bg-[#061833] text-white font-bold shadow-sm" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Core Systems
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ai")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === "ai" 
                    ? "bg-[#061833] text-white font-bold shadow-sm" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Sovereign AI
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("accelerators")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === "accelerators" 
                    ? "bg-[#061833] text-white font-bold shadow-sm" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                IP Accelerators
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <ScrollReveal
                key={service.title}
                delay={(idx % 3) * 0.08}
                direction="up"
                distance={20}
                className="h-full flex"
              >
                <div
                  className={`dx-card group relative p-6 sm:p-7 flex flex-col justify-between w-full transition-all duration-300 ${
                    service.accent 
                      ? "border-amber-300/90 shadow-md shadow-amber-500/5 hover:border-amber-500" 
                      : "hover:border-slate-300"
                  }`}
                >
                  <div>
                    {/* Top Bar: Tier & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                        {service.tier}
                      </span>
                      <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                        service.accent 
                          ? "bg-amber-50 text-amber-800 border-amber-200 font-bold" 
                          : "bg-slate-100 text-slate-700 border-slate-200/80 font-medium"
                      }`}>
                        {service.badge}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center p-2.5 transition-transform group-hover:scale-105 ${
                        service.accent 
                          ? "bg-amber-50 text-amber-800 border border-amber-200" 
                          : "bg-slate-100 text-slate-800 border border-slate-200 group-hover:text-amber-700"
                      }`}>
                        <Icon className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors font-sans leading-snug">
                        {service.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                      {service.desc}
                    </p>
                  </div>

                  {/* Tech Tags & CTA */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 mb-4">
                      {service.tags.map(tag => (
                        <span 
                          key={tag}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link 
                      href="/estimator"
                      className="inline-flex items-center text-xs font-mono font-semibold text-amber-800 hover:text-amber-900 gap-1.5 group/link"
                    >
                      <span>Architecture Deep Dive</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
