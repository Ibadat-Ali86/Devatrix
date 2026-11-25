"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VanguardShowcase from "@/components/VanguardShowcase";
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Award, 
  Terminal, 
  Calendar,
  Send,
  BookOpen
} from "lucide-react";

export default function VanguardPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "FAST-NUCES",
    graduationYear: "2027",
    github: "",
    specialization: "Distributed Systems & Go",
  });

  const syllabus = [
    {
      month: "Month 1 & 2",
      title: "Foundations of High-Concurrency & Systems Architecture",
      topics: "Memory layouts in Go & Rust, TCP/UDP sockets, gRPC, Protocol Buffers, and Raft consensus protocols.",
    },
    {
      month: "Month 3 & 4",
      title: "Distributed Microservices & Event Stream Engineering",
      topics: "Kafka partitioning, event-driven architectures, distributed caching, and zero-trust mTLS security meshes.",
    },
    {
      month: "Month 5 & 6",
      title: "Production Client Deployment & Sovereign AI Agents",
      topics: "Autonomous agent swarms, vector databases, multi-cloud Kubernetes deployments, and automated CI/CD pipelines.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="dx-public min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-24">
        
        {/* Header (Cinematic Dark Tech Hero) */}
        <section className="relative py-20 border-b border-white/5 bg-obsidian-950 text-white overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-cyber-blue/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-cyber-cyan/30 text-xs font-mono text-cyber-cyan">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>DEVATRIX VANGUARD™ COHORT 2027</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              The Elite Engineering Residency <br />
              <span className="text-brand-400">For Pakistan&apos;s Top Scholars.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              6 months of intense real-world engineering alongside Principal Architects. We do not fetch coffee—we ship mission-critical code to global clients.
            </p>
          </div>
        </section>

        {/* Vanguard Showcase Component (Clean Light Section) */}
        <VanguardShowcase />

        {/* 6-Month Intensive Residency Syllabus (Clean Light Pearl) */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono text-brand-700 font-bold uppercase tracking-widest block mb-2">
              CURRICULUM & ROTATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
              The 6-Month Vanguard Syllabus
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {syllabus.map((s) => (
              <div
                key={s.month}
                className="p-2.5 sm:p-8 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-brand-500/40 hover:shadow-xl transition-all space-y-2 sm:space-y-4 shadow-xs sm:shadow-sm"
              >
                <span className="text-xs sm:text-xs font-mono font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-brand-50 text-brand-900 border border-brand-200">
                  {s.month}
                </span>
                <h3 className="text-xs sm:text-lg font-bold text-slate-900 font-mono line-clamp-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3 sm:line-clamp-none">{s.topics}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Application Form (Clean White Container) */}
        <section id="apply" className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-mono text-brand-700 font-bold uppercase tracking-widest block mb-2">
                APPLICATIONS OPEN
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-mono">
                Apply for Vanguard Cohort 2027
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Eligible students must be graduating in 2026 or 2027 from recognized Computer Science or Software Engineering faculties.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4 font-mono">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900">Application Received!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you, <span className="text-brand-700 font-bold">{formData.name}</span>. Our Vanguard Admissions Board will review your GitHub repositories and reach out for the Round 1 Technical Jam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bilal Haider"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Academic / University Email</label>
                      <input
                        type="email"
                        required
                        placeholder="bilal@isb.nu.edu.pk"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">University Institution</label>
                      <select
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 shadow-xs truncate"
                      >
                        <option value="FAST-NUCES">FAST-NUCES (All Campuses)</option>
                        <option value="NUST">NUST (SEECS / SCME)</option>
                        <option value="LUMS">LUMS (SSE)</option>
                        <option value="GIKI">GIKI (Swabi)</option>
                        <option value="UET">UET Lahore</option>
                        <option value="ITU">ITU Lahore</option>
                        <option value="Other">Other International / Leading University</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">GitHub Profile or Technical Portfolio URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/yourhandle"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 shadow-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-brand-400 to-amber-600 text-obsidian-950 font-bold uppercase tracking-wider hover:brightness-105 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Vanguard Application</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
