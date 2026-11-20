import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudioEngagementModels from "@/components/StudioEngagementModels";
import ServicesGrid from "@/components/ServicesGrid";
import SovereigntyGuarantees from "@/components/SovereigntyGuarantees";
import ExecutiveCTA from "@/components/ExecutiveCTA";
import ScrollReveal from "@/components/ScrollReveal";
import { getPublishedSiteContent } from "@/lib/content/server";
import { 
  Code2, 
  Cloud, 
  Cpu, 
  Smartphone, 
  ArrowRight,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Calculator,
  Lock,
  Users2,
  Sparkles,
  Zap
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const content = await getPublishedSiteContent();
  const intro = content?.find((item) => item.slug === "services-hero");

  const defaultServiceDetails = [
    {
      title: "Custom Software Engineering",
      tagline: "High-Performance Systems & Microservices",
      desc: "We design and build bespoke software tailored to solve complex operational challenges. Our architectures prioritize modularity, horizontal scalability, and zero downtime.",
      deliverables: [
        "Distributed Microservice Architecture (Go, Node.js, Python)",
        "High-Throughput Event Streaming (Kafka & RabbitMQ)",
        "Robust REST, GraphQL & gRPC API Infrastructure",
        "Legacy Monolith Modernization & Cloud Migration",
      ],
      techStack: ["Go", "Node.js", "Python", "gRPC", "Kafka", "PostgreSQL", "Redis"],
      icon: Code2,
    },
    {
      title: "Enterprise Cloud & DevOps",
      tagline: "Resilient Multi-Cloud Architecture",
      desc: "Accelerate your software delivery lifecycle with automated CI/CD pipelines, automated infrastructure as code (IaC), and production Kubernetes clusters.",
      deliverables: [
        "Multi-Region AWS & Azure Architecture Design",
        "Automated Terraform & OpenTofu Provisioning",
        "Production Kubernetes (EKS/AKS) Setup & Management",
        "24/7 Monitoring, Logging & SRE Observability",
      ],
      techStack: ["AWS", "Azure", "Kubernetes", "Terraform", "Docker", "Datadog", "GitHub Actions"],
      icon: Cloud,
    },
    {
      title: "AI & Machine Learning Solutions",
      tagline: "Pragmatic Intelligence for Real ROI",
      desc: "Transform your proprietary enterprise data into automated competitive advantages with custom LLM integrations, retrieval pipelines, and predictive models.",
      deliverables: [
        "Domain-Specific LLM Fine-Tuning & Prompt Pipelines",
        "Enterprise Retrieval-Augmented Generation (RAG)",
        "Intelligent Process & Document Automation",
        "Predictive Analytics & Real-Time Computer Vision",
      ],
      techStack: ["Python", "FastAPI", "Qdrant", "pgvector", "vLLM", "LangGraph", "PyTorch"],
      icon: Cpu,
    },
    {
      title: "Web & Mobile Applications",
      tagline: "Modern, Reactive Cross-Platform Products",
      desc: "Deliver fluid digital experiences across web, iOS, and Android. Engineered with Next.js, React 19, Flutter, and native mobile technologies.",
      deliverables: [
        "High-Speed Enterprise Next.js Web Platforms",
        "Cross-Platform Native Mobile Apps (Flutter / React Native)",
        "Real-Time Collaborative WebSockets Applications",
        "Progressive Web Apps (PWA) with Offline Capabilities",
      ],
      techStack: ["Next.js 16", "React 19", "TypeScript", "Flutter", "React Native", "Tailwind CSS"],
      icon: Smartphone,
    },
  ];

  const services = content?.filter((item) => item.content_type === "service") ?? [];
  const serviceDetails = defaultServiceDetails.map((service, index) => {
    const slugMap = [
      "service-custom-software",
      "service-cloud-devops",
      "service-ai-ml",
      "service-web-mobile",
    ];
    const editable = services.find((item) => item.slug === slugMap[index]);
    if (editable) {
      return {
        ...service,
        title: editable.title || service.title,
        tagline: editable.badge || service.tagline,
        desc: editable.summary || service.desc,
      };
    }
    return service;
  });

  return (
    <div className="dx-public min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-[#061833]">
      <Navbar />

      <main className="flex-1 pt-16 sm:pt-24">
        
        {/* ========================================================================= */}
        {/* Enterprise Hero Banner (#061833 Deep Luxury Navy & Amber) */}
        {/* ========================================================================= */}
        <section data-navbar-theme="dark" className="relative py-20 sm:py-32 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          {/* Ambient Lighting Accents */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[320px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[450px] h-[280px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            
            {/* Eyebrow Badge */}
            <div
              className="animate-hero-reveal inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono font-bold tracking-wider text-amber-300 shadow-sm"
              style={{ animationDelay: "60ms" }}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>DX STUDIO CAPABILITIES • 2026-2027 ENTERPRISE ROADMAP</span>
            </div>

            {/* Editorial Headline */}
            <h1
              className="animate-hero-reveal text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-sans max-w-4xl mx-auto"
              style={{ animationDelay: "140ms" }}
            >
              {intro?.title ? (
                <>
                  {intro.title} <br />
                  <span className="font-editorial italic font-normal text-amber-400">
                    {intro.badge || "Engineered for Scale."}
                  </span>
                </>
              ) : (
                <>
                  Enterprise Software Services, <br />
                  <span className="font-editorial italic font-normal text-amber-400">
                    Engineered for Scale &amp; Real ROI.
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p
              className="animate-hero-reveal text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
              style={{ animationDelay: "220ms" }}
            >
              {intro?.summary ?? "From mission-critical distributed architectures to sovereign AI agent systems and dedicated senior engineering pods. Zero tech debt. Zero vendor lock-in."}
            </p>

            {/* Action Buttons */}
            <div
              className="animate-hero-reveal pt-3 flex flex-wrap items-center justify-center gap-4"
              style={{ animationDelay: "300ms" }}
            >
              <a
                href="#engagement-models"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-[#061833] text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group shrink-0"
              >
                <span>Explore Delivery Pods</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                href="/estimator"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs sm:text-sm tracking-wide transition-all backdrop-blur-md shrink-0"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Interactive Cost Estimator</span>
              </Link>
            </div>

            {/* Trust Proof Points Strip */}
            <div
              className="animate-hero-reveal pt-8 sm:pt-10 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-sans"
              style={{ animationDelay: "380ms" }}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">100% Day-One IP Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">SOC 2 / ISO 27001 Aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">Top 2% Vetted Staff Engineers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">Direct Slack &amp; Bi-Weekly Sprints</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* Studio Engagement Models (Dedicated Pods, Milestones, Advisory) */}
        {/* ========================================================================= */}
        <StudioEngagementModels />

        {/* ========================================================================= */}
        {/* Detailed Service Deep Dives (#solutions) */}
        {/* ========================================================================= */}
        <section id="solutions" className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
            
            {/* Section Header */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3.5 py-1 rounded-full border border-amber-300/60 inline-block mb-3">
                  TECHNICAL SPECS &amp; DELIVERABLES
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
                  Detailed Service Specifications. <br />
                  <span className="font-editorial italic font-normal text-amber-700">Production-Grade Standards.</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  Each engagement is anchored by battle-tested architecture blueprints, comprehensive deliverable checklists, and strict code quality verification.
                </p>
              </div>
            </ScrollReveal>

            {/* 2x2 Service Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              {serviceDetails.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <ScrollReveal
                    key={service.title}
                    delay={idx * 0.1}
                    direction="up"
                    distance={24}
                    className="h-full flex"
                  >
                    <div className="dx-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between w-full hover:border-amber-400/80 transition-all duration-300">
                      <div>
                        {/* Top Row: Icon & Tagline */}
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center p-3 text-amber-800">
                            <Icon className="w-full h-full" />
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded border border-amber-200/80">
                            {service.tagline}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-sans leading-tight">
                          {service.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                          {service.desc}
                        </p>

                        {/* Technology Stack Badges */}
                        <div className="mb-6">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                            Architecture &amp; Tooling:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {service.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Deliverables Checklist */}
                        <div className="pt-4 border-t border-slate-100 mb-6">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 font-mono">
                            Verified Deliverables:
                          </h4>
                          <ul className="space-y-2">
                            {service.deliverables.map((item) => (
                              <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href="/estimator"
                          className="inline-flex items-center text-xs font-mono font-bold text-amber-800 hover:text-amber-900 gap-1.5 group/link"
                        >
                          <span>Scope this architecture</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                        <span className="text-[11px] font-mono text-slate-400">
                          100% IP Ownership
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* Capability Taxonomy & IP Accelerators (3-Tier Interactive Filter) */}
        {/* ========================================================================= */}
        <ServicesGrid />

        {/* ========================================================================= */}
        {/* Client Sovereignty & Engineering Standards Charter */}
        {/* ========================================================================= */}
        <SovereigntyGuarantees />

        {/* ========================================================================= */}
        {/* Executive Consultation CTA */}
        {/* ========================================================================= */}
        <ExecutiveCTA />

      </main>

      <Footer />
    </div>
  );
}
