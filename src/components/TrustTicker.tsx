import React from "react";
import { ShieldCheck, Award, Cpu, Globe, CheckCircle2 } from "lucide-react";

export default function TrustTicker() {
  const clients = [
    { name: "Next.js & React 19", sector: "Modern Web Frontend" },
    { name: "TypeScript & Node.js", sector: "Scalable Backend APIs" },
    { name: "Python & Applied AI", sector: "Intelligent Workflows & RAG" },
    { name: "Go & Microservices", sector: "High-Throughput Services" },
    { name: "AWS & Multi-Cloud", sector: "Cloud Infrastructure" },
    { name: "Docker & Kubernetes", sector: "Zero-Downtime Deployment" },
  ];

  const badges = [
    "100% Client IP Sovereignty",
    "Modern Clean Architecture",
    "Agile Milestone Sprints",
    "Automated CI/CD Testing",
    "Direct Engineer Access",
    "Remote-First Collaboration",
  ];

  return (
    <div className="py-14 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subhead */}
        <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold mb-8">
          TRUSTED BY LEADERS IN FINANCIAL SERVICES, HEALTHCARE, & GLOBAL INFRASTRUCTURE
        </p>

        {/* Client Logos / Identity Grid - 3 columns on mobile, 6 on desktop */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {clients.map((client) => (
            <div
              key={client.name}
              className="p-2 sm:p-4 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80 hover:border-brand-500/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-center text-center group"
            >
              <span className="text-[10px] sm:text-sm font-bold text-slate-900 group-hover:text-brand-700 font-mono tracking-tight transition-colors truncate">
                {client.name}
              </span>
              <span className="text-[8px] sm:text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                {client.sector}
              </span>
            </div>
          ))}
        </div>

        {/* Regulatory & Cloud Partnership Badges */}
        <div className="mt-8 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-slate-700">
          {badges.map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
