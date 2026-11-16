import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileCheck, Shield, Mail, MessageCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-20">
        
        {/* Hero Banner (#061833) */}
        <section className="relative py-12 sm:py-20 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-xs font-mono font-medium text-slate-300">
              <FileCheck className="w-3.5 h-3.5 text-brand-500" />
              <span>TERMS & CONDITIONS</span>
            </div>
            <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Standards and conditions governing technical engineering engagements with Devatrix Technologies LLC.
            </p>
            <div className="text-xs sm:text-xs font-mono text-slate-400">
              Last Updated: November 2026 • Established 2022
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-10 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none space-y-8 sm:space-y-12 text-slate-700 leading-relaxed text-xs sm:text-base">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                1. Acceptance of Terms
              </h2>
              <p>
                By engaging Devatrix Technologies LLC (&ldquo;Devatrix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) for software engineering, web application development, cloud infrastructure, AI/ML integration, or consulting services, or by using our website, you agree to comply with and be bound by these Terms of Service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                2. Scope of Services & Sprints
              </h2>
              <p>
                Devatrix delivers software solutions through agile, milestone-gated development sprints. Each sprint deliverables, milestones, acceptance criteria, and technical architecture specifications are detailed in mutually agreed Statements of Work (SOW).
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                3. Intellectual Property (IP) Sovereignty
              </h2>
              <p>
                Upon satisfaction of agreed milestone compensation, <strong>all custom software, source code, database architectures, and documentation produced for the client become 100% the unencumbered intellectual property of the client</strong>. Devatrix claims zero ongoing royalty or ownership rights over client deliverables.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                4. Quality Assurance & Warranties
              </h2>
              <p>
                We build according to modern software craftsmanship standards, incorporating automated unit testing, CI/CD verification pipelines, and secure coding practices. All deliverables undergo acceptance testing prior to production handover.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                5. Confidentiality & Bilateral NDA
              </h2>
              <p>
                Both parties agree to hold all proprietary trade secrets, user data, server credentials, and commercial strategies in strict confidence, during and after the engagement term.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                6. Governing Law
              </h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to conflict of law principles. Any legal disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in Lahore, Pakistan.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                7. Contact Our Legal & Executive Team
              </h2>
              <p className="text-sm text-slate-600">
                For contract inquiries, Statements of Work, or legal questions:
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