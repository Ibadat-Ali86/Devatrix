"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Lock,
  Sparkles,
  Users2,
  Layers,
  MessageSquare
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requireNda, setRequireNda] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    engagementModel: "Dedicated Senior Engineering Pod",
    budget: "$35,000 – $75,000",
    timeline: "Within 2–4 Weeks",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          name: formData.name,
          email: formData.email,
          company: formData.company,
          service: formData.engagementModel,
          budget: formData.budget,
          message: formData.message,
          metadata: {
            requireNda,
            timeline: formData.timeline,
          },
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data?.error || "Unable to submit your inquiry. Please try again.");
      }
    } catch {
      setSubmitError("Network error while sending inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deliveryHub = {
    location: "Lahore, Pakistan",
    label: "Core Engineering Center & Campus",
    workModel: "Remote-First Delivery Model",
    hours: "Monday – Friday | 9:00 AM – 6:00 PM PKT",
    overlap: "Seamless daily timezone overlap with North America (EST/PST), UK/Europe (GMT/CET), and Middle East (GST) clients.",
  };

  const engagementOptions = [
    "Dedicated Senior Engineering Pod",
    "Fixed-Price Milestone Sprint",
    "Architecture Advisory & Fractional CTO",
    "Custom Software & Cloud Engineering",
    "Applied AI & Machine Learning",
  ];

  const budgetOptions = [
    "< $25,000 USD",
    "$25,000 – $50,000 USD",
    "$50,000 – $100,000 USD",
    "$100,000+ USD",
  ];

  return (
    <div className="dx-public min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-[#061833]">
      <Navbar />

      <main className="flex-1 pt-16 sm:pt-24">
        
        {/* ========================================================================= */}
        {/* Enterprise Hero Banner (#061833 Deep Navy Theme) */}
        {/* ========================================================================= */}
        <section data-navbar-theme="dark" className="relative py-20 sm:py-28 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          {/* Ambient Lighting Accents */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            
            {/* Eyebrow Badge */}
            <div className="animate-hero-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono font-bold tracking-wider text-amber-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>LET&apos;S START A CONVERSATION • DIRECT TECHNICAL LINE</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="animate-hero-reveal text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-sans max-w-4xl mx-auto">
              Get in Touch with <br />
              <span className="font-editorial italic font-normal text-amber-400">
                Our Senior Technical Team.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-hero-reveal text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Whether you need to architect a mission-critical platform, scale roadmap velocity with dedicated engineering pods, or schedule an executive technical audit, we are here to help.
            </p>

            {/* Trust Proof Points Strip */}
            <div className="animate-hero-reveal pt-6 sm:pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-sans">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">24-Hour Technical SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">Silicon Valley Bilateral NDA</span>
              </div>
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Direct Principal Architect Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">Lahore Hub • Worldwide Delivery</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* Form and Global Delivery Center Section */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#FAF9F6] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              
              {/* Left Column: Interactive Proposal & Inquiry Form */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xl space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-mono font-bold text-amber-800 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>PROJECT DISCOVERY &amp; CONSULTATION</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                    Send Us an Inquiry
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 leading-relaxed">
                    Provide details about your project goals. A Principal Architect or Senior Staff Engineer will review your requirements and respond within 24 hours.
                  </p>
                </div>

                {submitted ? (
                  <div className="text-center py-12 space-y-4 bg-emerald-50 border border-emerald-200 rounded-xl p-8">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="text-xl font-bold text-slate-900 font-sans">Inquiry Received, {formData.name}!</h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out. Our engineering leadership is reviewing your specifications and will send a detailed follow-up to <span className="font-semibold text-slate-900">{formData.email}</span> within 24 business hours.
                    </p>
                    {requireNda && (
                      <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs text-emerald-800 font-mono inline-block">
                        🔒 Silicon Valley Bilateral NDA will be attached to our initial correspondence.
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                    
                    {/* Engagement Model Selector */}
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        Engagement Model / Interest Area *
                      </label>
                      <select
                        value={formData.engagementModel}
                        onChange={(e) => setFormData({ ...formData, engagementModel: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all font-sans"
                      >
                        {engagementOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name & Work Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Alex Mercer"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                          Corporate Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="alex@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Company & Budget Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                          Company Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Acme Global Inc"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                          Estimated Investment Budget
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all font-sans"
                        >
                          {budgetOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Project Overview */}
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Project Overview &amp; Technical Requirements *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Describe your architecture requirements, target systems, timeline urgency, or pod staffing needs..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all leading-relaxed"
                      ></textarea>
                    </div>

                    {/* Bilateral NDA Option */}
                    <div className="pt-1">
                      <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors">
                        <input
                          type="checkbox"
                          checked={requireNda}
                          onChange={(e) => setRequireNda(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/30 accent-amber-500"
                        />
                        <div className="text-xs leading-snug">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            Request Mutual Bilateral NDA Before Discovery Call
                          </span>
                          <span className="text-slate-500 block text-[11px] mt-0.5">
                            Guarantees complete mutual confidentiality and protect your proprietary roadmaps from day one.
                          </span>
                        </div>
                      </label>
                    </div>

                    {submitError && (
                      <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {submitError}
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#061833] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer font-sans disabled:opacity-60"
                    >
                      <span>{submitting ? "Submitting Inquiry..." : "Submit Inquiry to Engineering Team"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </form>
                )}
              </div>

              {/* Right Column: Global Base & Direct Communication */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/60 inline-block mb-2">
                    ENGINEERING CAMPUS
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
                    Location &amp; Worldwide Delivery
                  </h2>
                </div>

                {/* Campus Card */}
                <div className="dx-card p-6 sm:p-7 space-y-4 border border-slate-200/90 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 font-sans">{deliveryHub.location}</h4>
                        <span className="text-[11px] font-mono text-slate-500">Global Engineering Operations</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/80">
                      CORE CENTER
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    {deliveryHub.workModel}
                  </p>
                  
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {deliveryHub.overlap}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-sans">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{deliveryHub.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Direct Senior Developer &amp; Architect Line</span>
                    </div>
                  </div>
                </div>

                {/* Direct Contact Card */}
                <div className="dx-card p-6 sm:p-7 border border-amber-300/80 bg-gradient-to-br from-white via-amber-50/20 to-white shadow-sm space-y-4">
                  <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider block">
                    Direct Contact &amp; Messaging:
                  </span>
                  
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-mono">Primary Email:</span>
                      <a 
                        href="mailto:devatrixtechnologies@gmail.com" 
                        className="text-slate-900 font-bold underline hover:text-amber-700 break-all transition-colors"
                      >
                        devatrixtechnologies@gmail.com
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px] font-mono">Direct WhatsApp Line:</span>
                      <a 
                        href="https://wa.me/923156179410" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:underline mt-0.5"
                      >
                        <span>+92 315 6179410</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Online
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Verified Social Channels */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
                    <a
                      href="https://www.linkedin.com/company/devatrix-technologies/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                    >
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href="https://www.instagram.com/devatrix_technologies?srtk=aHNrM2N2ZGF2OHY5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                    >
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

                {/* What to Expect Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 text-xs space-y-2.5 font-sans">
                  <span className="text-slate-900 font-bold uppercase tracking-wider block mb-1 font-mono text-[11px]">
                    What to Expect:
                  </span>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Response within 24 business hours guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Introductory technical discovery call with Lead Architect</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Silicon Valley Bilateral NDA executed prior to discovery</span>
                  </div>
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
