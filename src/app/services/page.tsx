import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoreCapabilities from "@/components/CoreCapabilities";
import ExecutiveCTA from "@/components/ExecutiveCTA";
import { 
  Code2, 
  Cloud, 
  Cpu, 
  Smartphone, 
  Palette, 
  Users2, 
  ArrowRight,
  CheckCircle2,
  Terminal,
  Layers,
  ShieldCheck,
  Server
} from "lucide-react";

export default function ServicesPage() {
  const serviceDetails = [
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
      icon: Smartphone,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-20">
        
        {/* Enterprise Hero Banner (#061833) */}
        <section className="relative py-20 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-300">
              <Layers className="w-3.5 h-3.5 text-brand-500" />
              <span>END-TO-END TECHNOLOGY CAPABILITIES</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Enterprise Software Services. <br />
              <span className="text-brand-500">Engineered for Scale.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              From mission-critical distributed architectures to modern cloud platforms and practical enterprise AI integration.
            </p>
          </div>
        </section>

        {/* 6-Card Services Overview Grid */}
        <CoreCapabilities />

        {/* Detailed Service Deep Dives */}
        <section id="solutions" className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 mb-2 block">
                TECHNICAL SPECS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                Detailed Service Specifications
              </h2>
            </div>

            {/* 2x2 Grid on all screens */}
            <div className="grid grid-cols-2 gap-3 sm:gap-8">
              {serviceDetails.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="p-4 sm:p-10 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-brand-500/40 hover:shadow-xl transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center p-1.5 sm:p-3 text-brand-600 mb-3 sm:mb-6">
                        <Icon className="w-full h-full" />
                      </div>

                      <span className="text-xs sm:text-xs font-mono font-bold text-brand-700 uppercase tracking-wider block mb-1">
                        {service.tagline}
                      </span>
                      <h3 className="text-sm sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-4 font-sans leading-tight">
                        {service.title}
                      </h3>

                      <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed font-normal mb-3 sm:mb-6 line-clamp-3 sm:line-clamp-none">
                        {service.desc}
                      </p>
                    </div>

                    <div className="pt-3 sm:pt-6 border-t border-slate-100">
                      <h4 className="text-xs sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 sm:mb-3">
                        Deliverables:
                      </h4>
                      <ul className="space-y-1.5 sm:space-y-2.5">
                        {service.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-1.5 sm:gap-2.5 text-xs sm:text-sm text-slate-700 leading-tight">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Executive Consultation CTA */}
        <ExecutiveCTA />

      </main>

      <Footer />
    </div>
  );
}
