import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, GraduationCap, Building2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function ExecutiveCTA() {
  return (
    <section className="relative py-20 sm:py-28 bg-[#061833] text-white overflow-hidden border-t border-slate-800">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal direction="up" delay={0.1} distance={24} className="space-y-7">
        
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
          START THE CONVERSATION
        </span>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-sans">
          Whether Accelerating Your Career or <br />
          <span className="font-editorial italic font-normal text-amber-400">Shipping a Production Platform.</span>
        </h2>

        <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Apply to our upcoming 6-week intensive engineering cohort, or partner with our senior software engineering pods to bring your product vision to life.
        </p>

        {/* Dual Track CTAs */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/internships/apply"
            className="dx-btn-primary px-7 py-4 text-xs sm:text-sm font-extrabold tracking-wide uppercase font-sans shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Apply for 2027 Cohort</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs sm:text-sm tracking-wide transition-all backdrop-blur-md shrink-0"
          >
            <Building2 className="w-4 h-4 text-slate-300" />
            <span>Hire Our Engineering Pods</span>
          </Link>
        </div>

        {/* Engineering Hub & Delivery Strip */}
        <div className="pt-10 sm:pt-14 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-300 font-sans">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Lahore, Pakistan (Engineering Hub &amp; Campus)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Remote-First Worldwide Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Direct Architect Communication</span>
          </div>
        </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
