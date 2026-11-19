import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Mail, MessageCircle, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="dx-public dx-reading min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-20">
        
        {/* Hero Banner (#061833) */}
        <section className="relative py-12 sm:py-20 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-xs font-mono font-medium text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
              <span>LEGAL & COMPLIANCE</span>
            </div>
            <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              How Devatrix Technologies LLC handles, protects, and respects your data and intellectual property.
            </p>
            <div className="text-xs sm:text-xs font-mono text-slate-400">
              Last Updated: November 2026 • Effective Date: January 2022
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-10 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none space-y-8 sm:space-y-12 text-slate-700 leading-relaxed text-xs sm:text-base">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                1. Overview & Commitment
              </h2>
              <p>
                Devatrix Technologies LLC (&ldquo;Devatrix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an engineering studio and software house based in Lahore, Pakistan, operating with a remote-first delivery model serving clients worldwide. We are deeply committed to safeguarding the privacy and confidentiality of our clients, prospective partners, applicants, and website visitors.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                2. 100% Client Intellectual Property (IP) Sovereignty
              </h2>
              <p>
                Any proprietary algorithms, source code, data pipelines, business logic, design assets, and confidential technical documentation provided by or developed for our clients remain <strong>100% the exclusive property of the client from Day One</strong>. We never use client proprietary code or datasets to train public machine learning models or reuse client IP across external projects.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                3. Information We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Contact & Project Inquiries:</strong> Name, work email address, WhatsApp/phone number, organization name, and technical project scope submitted through our contact forms or direct communications.
                </li>
                <li>
                  <strong>Career & Internship Applications:</strong> Educational background, university affiliation, resumes, GitHub repositories, portfolio links, and contact information for recruitment evaluation.
                </li>
                <li>
                  <strong>Technical Telemetry:</strong> Standard non-identifiable web traffic metrics (browser type, operating system, and pages visited) used solely to optimize website performance and user experience.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                4. Bilateral Non-Disclosure Agreements (NDAs)
              </h2>
              <p>
                Prior to any technical architecture deep-dives or exchange of proprietary requirements, Devatrix executes bilateral mutual Non-Disclosure Agreements (NDAs) upon request. All team members, engineers, and interns operate under strict legal confidentiality agreements.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                5. Data Security & Storage
              </h2>
              <p>
                We enforce multi-factor authentication, end-to-end encryption in transit (HTTPS / TLS 1.3), encrypted repositories, and role-based access control across all engineering workstations and staging cloud environments.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                6. Contact Our Privacy & Legal Team
              </h2>
              <p className="text-sm text-slate-600">
                For questions regarding this policy, bilateral NDAs, or your personal information, reach out directly to our team:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-600" />
                  <span className="font-semibold text-slate-900">Email:</span>
                  <a href="mailto:devatrixtechnologies@gmail.com" className="text-brand-700 underline font-semibold">
                    devatrixtechnologies@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-900">WhatsApp:</span>
                  <a href="https://wa.me/923156179410" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">
                    +92 315 6179410
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
