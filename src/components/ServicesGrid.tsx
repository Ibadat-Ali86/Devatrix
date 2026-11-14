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
    <section id="services" className="py-24 bg-slate-50 text-slate-900 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/80 border border-brand-300 text-xs font-mono font-semibold text-brand-900 mb-3">
              <Layers className="w-3.5 h-3.5 text-brand-600" />
              <span>3-TIER CAPABILITY TAXONOMY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Enterprise Engineering. <br />
              <span className="text-brand-600">Modular by Design.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
              From mission-critical distributed systems to sovereign on-premise AI agents and pre-engineered software accelerators.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm font-mono text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "all" 
                  ? "bg-brand-500 text-obsidian-950 font-bold shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Capabilities (9)
            </button>
            <button
              onClick={() => setActiveTab("core")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "core" 
                  ? "bg-brand-500 text-obsidian-950 font-bold shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Core Systems
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "ai" 
                  ? "bg-brand-500 text-obsidian-950 font-bold shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sovereign AI
            </button>
            <button
              onClick={() => setActiveTab("accelerators")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "accelerators" 
                  ? "bg-brand-500 text-obsidian-950 font-bold shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              IP Accelerators
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`group relative p-6 sm:p-7 rounded-2xl transition-all duration-300 flex flex-col justify-between bg-white border ${
                  service.accent 
                    ? "border-brand-300 shadow-md shadow-brand-500/5 hover:border-brand-500 hover:shadow-xl" 
                    : "border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl"
                }`}
              >
                <div>
                  {/* Top Bar: Tier & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                      {service.tier}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      service.accent 
                        ? "bg-brand-50 text-brand-800 border-brand-200 font-bold" 
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {service.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center p-2.5 transition-transform group-hover:scale-105 ${
                      service.accent 
                        ? "bg-brand-100 text-brand-700 border border-brand-200" 
                        : "bg-slate-100 text-slate-800 border border-slate-200 group-hover:text-brand-600"
                    }`}>
                      <Icon className="w-full h-full" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {service.desc}
                  </p>
                </div>

                {/* Tech Tags & CTA */}
                <div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 mb-4">
                    {service.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link 
                    href="/estimator"
                    className="inline-flex items-center text-xs font-mono font-semibold text-brand-700 group-hover:text-brand-800 gap-1.5 group/link"
                  >
                    <span>Architecture Deep Dive</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
