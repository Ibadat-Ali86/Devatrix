import React from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

export default function ExecutiveCTA() {
  return (
    <section className="relative py-24 bg-[#061833] text-white overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">
          START THE CONVERSATION
        </span>

        <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight font-sans">
          Ready to Build Software <br />
          That Creates <span className="text-brand-500">Real Value?</span>
        </h2>

        <p className="text-xs sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal font-sans">
          Schedule an introductory discovery session with our engineering leads to discuss your technical challenges, architecture requirements, and delivery timeline.
        </p>

        <div className="pt-2 sm:pt-4 flex flex-row items-center justify-center gap-2.5 sm:gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-[11px] sm:text-sm tracking-wide uppercase transition-all shadow-lg shadow-brand-500/30 hover:brightness-105 font-sans shrink-0"
          >
            <span>Schedule Consultation</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>

          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30 font-semibold text-[11px] sm:text-sm tracking-wide transition-all font-sans shrink-0"
          >
            <span>Case Studies</span>
          </Link>
        </div>

        {/* Engineering Hub & Delivery Strip */}
        <div className="pt-8 sm:pt-12 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-xs sm:text-xs text-slate-300 font-sans">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-500" />
            <span>Lahore, Pakistan (Engineering Hub)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
            <span>Remote-First Worldwide Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Direct Technical Communication</span>
          </div>
        </div>

      </div>
    </section>
  );
}
