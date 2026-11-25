import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExecutiveCTA from "@/components/ExecutiveCTA";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildPageMetadata, SITE_URL } from "@/lib/seo/metadata";
import { 
  Briefcase, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Clock, 
  Sparkles, 
  Code2, 
  ShieldCheck, 
  TrendingUp,
  Layers,
  GraduationCap
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers & Open Software Engineering Roles",
  description:
    "Join Devatrix Technologies. Explore full-time remote and Lahore hybrid engineering openings in distributed systems, AI/ML architecture, full-stack web, mobile development, and DevOps.",
  path: "/careers",
  keywords: [
    "Devatrix careers",
    "Devatrix jobs",
    "software engineer jobs Lahore",
    "remote AI engineer jobs Pakistan",
    "full-stack developer jobs Devatrix",
  ],
});

const careersSchema = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Careers at Devatrix Technologies",
    url: `${SITE_URL}/careers`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  },
];

export default function CareersPage() {
  const roles = [
    {
      title: "Senior Distributed Systems Engineer",
      team: "Core Platform & Infrastructure",
      locations: ["Lahore, PK (Hybrid)", "Remote"],
      type: "Full-Time",
      experience: "5+ Years (Senior / Lead Architect)",
      desc: "Architect and build high-throughput microservices in Go and Rust handling large-scale message streams with sub-20ms p99 latencies.",
      tags: ["Go", "Rust", "Kafka", "Kubernetes", "gRPC"],
    },
    {
      title: "Principal AI & Machine Learning Architect",
      team: "AI Solutions Pod",
      locations: ["Lahore, PK (Hybrid)", "Remote"],
      type: "Full-Time",
      experience: "5+ Years (Senior / Lead Architect)",
      desc: "Design and implement custom enterprise LLM workflows, private retrieval-augmented generation (RAG) pipelines, and intelligent process automation.",
      tags: ["Python", "FastAPI", "Vector Search", "LLMs", "LangChain"],
    },
    {
      title: "Senior Full-Stack Next.js Engineer",
      team: "Enterprise Web Products",
      locations: ["Lahore, PK (Hybrid)", "Remote"],
      type: "Full-Time",
      experience: "3 to 5 Years (Mid-Level Engineer)",
      desc: "Build mission-critical web applications with Next.js, React 19, and TypeScript, delivering instant page loads, clean UI architectures, and robust state management.",
      tags: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    },
    {
      title: "Lead Cloud Platform & DevOps Engineer",
      team: "Cloud & Reliability",
      locations: ["Lahore, PK (Hybrid)", "Remote"],
      type: "Full-Time",
      experience: "4 to 7 Years (Lead Level)",
      desc: "Own infrastructure automation across AWS and GCP using Terraform, maintain high-availability Kubernetes clusters, and establish GitOps CI/CD pipelines.",
      tags: ["AWS", "GCP", "Terraform", "Kubernetes", "Docker", "CI/CD"],
    },
  ];

  return (
    <div className="dx-public min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <JsonLd data={careersSchema} />
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-20">
        
        {/* Enterprise Hero Banner (#061833) */}
        <section data-navbar-theme="dark" className="relative py-20 sm:py-24 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400 bg-brand-500/10 px-3.5 py-1.5 rounded-full border border-brand-500/20 inline-block mb-4">
              JOIN THE DEVATRIX ENGINEERING CORPS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight leading-tight max-w-4xl mx-auto mb-6">
              Build Production-Critical Systems. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-amber-200">
                Work With Top 1% Engineering Talent.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We design and ship mission-critical software for global enterprises and high-growth scaleups. We maintain high standards, zero operational fluff, and provide competitive global compensation.
            </p>
          </div>
        </section>

        {/* Culture & Engineering Standards */}
        <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
                  <Code2 className="w-6 h-6 text-brand-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans mb-2">High Engineering Autonomy</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Engineers own their system architectures end-to-end. No unnecessary middle management or endless status meetings — just pure technical focus.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans mb-2">Rigorous Code Quality</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Strict static analysis, mandatory unit testing, zero vulnerabilities, and clean, documented architecture. We build systems designed to run reliably for decades.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans mb-2">Tier-1 Market Compensation</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We reward technical excellence with top-percentile salary benchmarks, performance-based bonuses, and comprehensive health and wellness coverage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Engineering Roles */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 inline-block mb-3">
                  CURRENT OPENINGS
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
                  Open Positions
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-0">
                All roles available for Lahore campus (hybrid) or remote throughout Pakistan.
              </p>
            </div>

            <div className="space-y-4">
              {roles.map((role, idx) => (
                <div 
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                          {role.team}
                        </span>
                        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                          {role.type}
                        </span>
                        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                          {role.experience}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans group-hover:text-brand-700 transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                        {role.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {role.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[11px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0">
                      <div className="space-y-1 text-left lg:text-right">
                        {role.locations.map((loc, lIdx) => (
                          <div key={lIdx} className="flex items-center gap-1.5 text-xs text-slate-500 lg:justify-end">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{loc}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={`/careers/apply?role=${encodeURIComponent(role.title)}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider group-hover:bg-brand-600 transition-colors shadow-sm"
                      >
                        <span>Apply for Role</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* General Open Application Callout */}
            <div className="mt-8 p-6 sm:p-8 rounded-2xl border border-dashed border-slate-300 bg-white text-center">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans mb-2">
                Don&apos;t see your exact engineering domain listed?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-4 leading-relaxed">
                We are continually scouting exceptional backend, frontend, systems, security, and AI talent. Send an open application with your portfolio and GitHub profile.
              </p>
              <Link
                href="/careers/apply?role=General%20%2F%20Future%20Engineering%20Roles"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Submit General Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Global Executive CTA */}
        <ExecutiveCTA />

      </main>

      <Footer />
    </div>
  );
}
