import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExecutiveCTA from "@/components/ExecutiveCTA";
import { 
  Briefcase, 
  MapPin, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  HeartHandshake,
  Laptop,
  GraduationCap
} from "lucide-react";

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
      team: "Cloud Reliability & Platform",
      locations: ["Lahore, PK (Hybrid)", "Remote"],
      type: "Full-Time",
      experience: "5+ Years (Senior / Lead Architect)",
      desc: "Manage multi-region AWS and Azure environments, design automated Terraform IaC modules, and ensure 99.99% cluster reliability.",
      tags: ["AWS", "Azure", "Terraform", "Kubernetes", "CI/CD"],
    },
  ];

  const perks = [
    {
      icon: HeartHandshake,
      title: "Comprehensive Health Coverage",
      desc: "Complete medical and hospitalization coverage for you and your dependents.",
    },
    {
      icon: Laptop,
      title: "Top-Tier Hardware",
      desc: "Equipped with high-performance Apple Silicon MacBook Pro workstations.",
    },
    {
      icon: Sparkles,
      title: "Continuous Professional Growth",
      desc: "Subsidized cloud certifications (AWS/Azure/GCP), technical courses, and resources.",
    },
    {
      icon: Clock,
      title: "Healthy Work-Life Balance",
      desc: "Flexible hybrid working model with remote-first autonomy and paid time off.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-20">
        
        {/* Enterprise Hero Banner (#061833) */}
        <section className="relative py-20 sm:py-24 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-300">
              <Briefcase className="w-3.5 h-3.5 text-brand-500" />
              <span>CAREERS & TALENT NETWORK • LAHORE & REMOTE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Build Impactful Software. <br />
              <span className="text-brand-500">Grow With Leaders.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Join an engineering-first culture where craftsmanship and architecture rigor are recognized, celebrated, and rewarded.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/careers/apply"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/25"
              >
                <span>Submit Job Application</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#openings"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs tracking-wider transition-all"
              >
                <span>View Featured Roles</span>
              </a>
            </div>
          </div>
        </section>

        {/* Culture & Perks Section */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 block mb-2">
                BENEFITS & CULTURE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                Why Engineers Thrive at Devatrix
              </h2>
            </div>

            {/* Perks Grid - 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {perks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={perk.title}
                    className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-brand-500/40 hover:shadow-lg transition-all space-y-2 sm:space-y-3"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center p-1.5 sm:p-2 text-brand-600">
                      <Icon className="w-full h-full" />
                    </div>
                    <h3 className="text-xs sm:text-lg font-bold text-slate-900 font-sans leading-tight">{perk.title}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed font-normal">{perk.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Positions List */}
        <section id="openings" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 block mb-2">
                FEATURED OPENINGS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                Active Roles ({roles.length})
              </h2>
            </div>
            <div className="mt-4 md:mt-0 text-xs font-mono text-slate-500 font-medium">
              Competitive compensation • Health benefits • Flexible hybrid & remote setup
            </div>
          </div>

          {/* Student & Graduate Internship Callout */}
          <div className="mb-10 p-6 rounded-2xl bg-brand-50/70 border border-brand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-800 block">
                STUDENTS & FRESH GRADUATES
              </span>
              <h4 className="text-base font-bold text-slate-900 font-sans">
                Looking for 6-Week Virtual Internships?
              </h4>
              <p className="text-xs text-slate-600">
                Explore our dedicated 6-week mentorship sprints across Web, AI, Backend, Flutter, React Native, Data Science, and Data Analytics.
              </p>
            </div>
            <Link
              href="/internships"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shrink-0"
            >
              <span>Explore Internships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-6">
            {roles.map((role) => (
              <div
                key={role.title}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500/40 hover:bg-white hover:shadow-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
              >
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-800 border border-brand-200 font-sans">
                      {role.team}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 font-sans">
                      {role.type}
                    </span>
                    <span className="text-xs text-slate-500 font-medium font-sans">
                      {role.locations.join(" • ")}
                    </span>
                    <span className="text-xs font-mono text-brand-700 bg-brand-50/80 px-2 py-0.5 rounded">
                      {role.experience}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 font-sans transition-colors">
                    {role.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {role.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {role.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    href={`/careers/apply?role=${encodeURIComponent(role.title)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
                  >
                    <span>Apply for this Role</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Open Talent Pool Banner for Anyone Applying Without Open Post */}
          <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-[#061833] text-white border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
                OPEN TALENT INTAKE
              </span>
              <h3 className="text-2xl font-black font-sans text-white">
                Don't See Your Exact Role Open? Apply Anyway.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We are always seeking exceptional engineers and architects. Submit your resume, previous experience, and salary expectations to our active talent registry.
              </p>
            </div>
            <Link
              href="/careers/apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/25 shrink-0"
            >
              <span>Submit General Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Executive Consultation CTA */}
        <ExecutiveCTA />

      </main>

      <Footer />
    </div>
  );
}
