import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExecutiveCTA from "@/components/ExecutiveCTA";
import { 
  Globe2, 
  MapPin, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Building2,
  ShieldCheck,
  HeartHandshake
} from "lucide-react";

export default function AboutPage() {
  const operationalPillars = [
    {
      title: "Lahore, Pakistan",
      role: "Core Engineering Center",
      badge: "Software House",
      desc: "Our primary software house where architectural design, full-stack web and mobile development, and applied AI systems are built and verified.",
      focus: "Custom Software Development, Web & Mobile Platforms, Cloud Infrastructure",
    },
    {
      title: "Remote-First Delivery",
      role: "Worldwide Client Reach",
      badge: "Operating Model",
      desc: "Operating with a remote-first mindset enabling transparent communication, milestone demonstrations, and flexible timezone overlap with international partners.",
      focus: "Agile Sprints, Daily Slack/Video Syncs, Continuous Staging Deployments",
    },
    {
      title: "Modern Tech Standards",
      role: "Software Craftsmanship",
      badge: "Client Guarantees",
      desc: "Committed to 100% Day-One client IP ownership, zero vendor lock-in, automated testing pipelines, and clean modular architecture from the first commit.",
      focus: "100% Code Sovereignty, Automated CI/CD, Zero-Defect Delivery",
    },
  ];

  const leadership = [
    {
      name: "Umair ul Hassan",
      role: "Founder & Chief Technology Architect",
      bio: "Veteran software architect with over a decade of experience designing high-concurrency distributed platforms and modern enterprise architectures.",
    },
    {
      name: "Khurram Shehzad",
      role: "VP of Enterprise Solutions",
      bio: "18+ years leading large-scale digital modernization programs for tier-1 financial and commercial institutions.",
    },
    {
      name: "Dr. Ayesha Malik",
      role: "Head of Artificial Intelligence",
      bio: "PhD in Machine Learning, directing our applied enterprise AI and autonomous workflow integration teams.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <Navbar />

      <main className="flex-1 pt-20">
        
        {/* Enterprise Hero Banner (#061833) */}
        <section className="relative py-20 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-300">
              <Globe2 className="w-3.5 h-3.5 text-brand-500" />
              <span>THE DEVATRIX STORY</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Engineering Digital Solutions <br />
              <span className="text-brand-500">That Create Real Value.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Devatrix Technologies was founded on a simple principle: build reliable, high-performance software that solves real business problems.
            </p>
          </div>
        </section>

        {/* Operational Pillars Grid (Clean Light Section) */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono text-brand-600 font-bold uppercase tracking-widest block mb-2">
              HOW WE OPERATE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
              Engineering Base & Operating Principles
            </h2>
          </div>

          {/* 3 Pillars in a row on all screens */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-8">
            {operationalPillars.map((item) => (
              <div
                key={item.title}
                className="p-3 sm:p-8 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500/40 hover:bg-white hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <span className="text-[7.5px] sm:text-xs font-mono font-bold text-brand-700 bg-brand-50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-brand-200 truncate">
                      {item.badge}
                    </span>
                    <span className="text-[7.5px] sm:text-xs text-slate-500 font-mono font-medium truncate">
                      {item.role}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-2xl font-bold text-slate-900 font-sans mb-1.5 sm:mb-3 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-[10px] sm:text-sm text-slate-600 leading-relaxed font-normal mb-2 sm:mb-6 line-clamp-3 sm:line-clamp-none">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 sm:pt-4 border-t border-slate-200 text-[8.5px] sm:text-xs text-slate-600">
                  <span className="text-slate-900 font-bold block mb-0.5">Focus:</span>
                  <span className="line-clamp-2">{item.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership (Clean Light Pearl) */}
        <section className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono text-brand-600 font-bold uppercase tracking-widest block mb-2">
                EXECUTIVE LEADERSHIP
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                Hands-On Engineering Leadership
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadership.map((leader) => (
                <div
                  key={leader.name}
                  className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-brand-500/40 hover:shadow-xl transition-all space-y-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center font-mono font-black text-brand-700 text-lg">
                    {leader.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-sans">{leader.name}</h3>
                    <div className="text-xs font-bold text-brand-700 mt-0.5">{leader.role}</div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {leader.bio}
                  </p>
                </div>
              ))}
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
