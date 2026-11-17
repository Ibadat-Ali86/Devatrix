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
  Building2
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "Custom Software Development",
    budget: "$25,000 – $50,000",
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
        body: JSON.stringify({ ...formData, source: "contact" }),
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
    label: "Core Engineering Center",
    workModel: "Remote-First Delivery Model",
    hours: "Monday – Friday | 9:00 AM – 6:00 PM PKT",
    overlap: "Flexible timezone overlap with North America, UK, Europe & Middle East clients.",
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-20">
        
        {/* Enterprise Hero Banner (Brand Navy #061833) */}
        <section className="relative py-20 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-300">
              <Mail className="w-3.5 h-3.5 text-brand-500" />
              <span>LET&apos;S START A CONVERSATION</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Get in Touch with <br />
              <span className="text-brand-500">Our Technical Team</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Whether you need to architect a new platform, scale an existing system, or build a dedicated engineering pod, we&apos;re here to help.
            </p>
          </div>
        </section>

        {/* Form and Global Offices Section (Clean White / Slate Pearl) */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Form */}
              <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-md">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-sm text-slate-600 mb-8 font-normal">
                  Fill out the form below and an engineering lead will get back to you within 24 hours.
                </p>

                {submitted ? (
                  <div className="text-center py-12 space-y-4 bg-brand-50 border border-brand-200 rounded-xl p-8">
                    <CheckCircle2 className="w-12 h-12 text-brand-600 mx-auto" />
                    <h3 className="text-xl font-bold text-slate-900">Thank You, {formData.name}!</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Your inquiry has been received. Our team will review your requirements and reach out to <span className="font-semibold text-slate-900">{formData.email}</span> shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                    <div className="grid grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Alex Mercer"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5">
                          Company *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Acme Global Inc"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5">
                          Service
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                        >
                          <option value="Custom Software Development">Custom Software</option>
                          <option value="Enterprise Cloud & DevOps">Cloud & DevOps</option>
                          <option value="AI & Machine Learning">AI & Machine Learning</option>
                          <option value="Web & Mobile Applications">Web & Mobile Apps</option>
                          <option value="Dedicated Engineering Pods">Engineering Pods</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Project Overview *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us about your project goals, technical requirements, and target timeline..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                      ></textarea>
                    </div>

                    {submitError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/25 hover:brightness-105 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <span>{submitting ? "Sending Inquiry..." : "Submit Inquiry"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Engineering Base & Direct Contact */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 block mb-1">
                    ENGINEERING BASE
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Location & Collaboration
                  </h2>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-brand-500/40 hover:shadow-md transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brand-600" />
                      <h4 className="text-lg font-bold text-slate-900">{deliveryHub.location}</h4>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-brand-50 text-brand-800 border border-brand-200">
                      {deliveryHub.label}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 font-medium">
                    {deliveryHub.workModel}
                  </p>
                  
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {deliveryHub.overlap}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{deliveryHub.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <span>Direct Developer & Architect Communication</span>
                    </div>
                  </div>
                </div>

                {/* Direct Contact Card */}
                <div className="p-6 rounded-2xl bg-brand-50 border border-brand-200 text-xs space-y-3">
                  <span className="text-brand-900 font-bold uppercase tracking-wider block">
                    Direct Contact & Inquiries:
                  </span>
                  <div className="space-y-2 text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Primary Email:</span>
                      <a 
                        href="mailto:devatrixtechnologies@gmail.com" 
                        className="text-brand-800 font-bold underline break-all text-sm"
                      >
                        devatrixtechnologies@gmail.com
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Direct WhatsApp:</span>
                      <a 
                        href="https://wa.me/923156179410" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-sm hover:underline"
                      >
                        <span>+92 315 6179410</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">Chat Online</span>
                      </a>
                    </div>
                  </div>

                  {/* Social Profile Links */}
                  <div className="pt-3 border-t border-brand-200 flex items-center gap-3">
                    <a
                      href="https://www.linkedin.com/company/devatrix-technologies/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-brand-300 text-slate-800 hover:text-brand-600 font-bold text-xs"
                    >
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href="https://www.instagram.com/devatrix_technologies?srtk=aHNrM2N2ZGF2OHY5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-brand-300 text-slate-800 hover:text-brand-600 font-bold text-xs"
                    >
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

                {/* Engagement Commitments */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 text-xs space-y-2.5">
                  <span className="text-slate-900 font-bold uppercase tracking-wider block mb-1">
                    What to Expect:
                  </span>
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>Response within 24 business hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>Introductory technical discovery call</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>Mutual Non-Disclosure Agreement (NDA) on request</span>
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
