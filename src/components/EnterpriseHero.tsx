"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronRight, CheckCircle2, Code2, Cpu, Globe2, ShieldCheck } from "lucide-react";

export default function EnterpriseHero() {
  const techStack = [
    { name: "SaaS & MVP Platforms", tag: "Rapid Product Launch" },
    { name: "Custom AI Chatbots", tag: "Intelligent RAG Agents" },
    { name: "AI & Data Science", tag: "Predictive Analytics" },
    { name: "Enterprise Cloud", tag: "AWS, Azure & Docker" },
    { name: "High-Velocity APIs", tag: "Scalable Microservices" },
    { name: "Web & Mobile Apps", tag: "iOS, Android & Next.js" },
  ];

  return (
    <section className="relative min-h-0 sm:min-h-screen flex flex-col justify-start sm:justify-between pt-16 sm:pt-28 pb-0 bg-[#061833] text-white overflow-hidden">
      
      {/* Ambient Lighting & Geometric Curve (Systems Limited inspired) */}
      <div className="absolute top-0 -right-6 sm:right-0 w-[115%] sm:w-full lg:w-2/3 h-full pointer-events-none overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[160px]"></div>
        
        {/* Elegant Abstract 3D Ribbon / Flow */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-60" 
          viewBox="0 0 800 800" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.85">
            <path 
              d="M300 100 C 500 200, 700 100, 750 400 C 800 650, 500 750, 350 700 C 200 650, 150 450, 300 350 C 450 250, 650 350, 700 500" 
              stroke="url(#gradient-amber-blue)" 
              strokeWidth="2.5" 
              strokeDasharray="6 8"
            />
            <path 
              d="M350 150 C 550 250, 720 180, 760 450 C 790 680, 520 770, 390 720 C 240 670, 200 500, 340 400 C 480 300, 680 400, 720 550" 
              stroke="url(#gradient-gold)" 
              strokeWidth="1.5" 
              opacity="0.6"
            />
            <path 
              d="M400 200 C 580 300, 750 250, 780 500 C 800 700, 550 800, 420 750 C 280 700, 250 550, 380 450 C 520 350, 700 450, 740 600" 
              stroke="url(#gradient-blue)" 
              strokeWidth="1" 
              opacity="0.4"
            />
          </g>
          <defs>
            <linearGradient id="gradient-amber-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="gradient-gold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Hero Content - Locked to left on both mobile and laptop, leaving the right side empty */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 w-full my-0 sm:my-auto pt-2 pb-2.5 sm:py-4">
        <div className="w-[64%] sm:w-full max-w-[64%] sm:max-w-2xl lg:max-w-3xl space-y-2 sm:space-y-5">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[7px] sm:text-xs font-mono font-medium text-slate-300 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
            <span className="truncate">ENGINEERING DIGITAL EXCELLENCE SINCE 2022</span>
          </div>

          {/* Primary Headline (Exact Brand Theme) */}
          <h1 className="text-[17px] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.18] font-sans">
            Software Solutions <br />
            That Create <span className="text-brand-500">Real Value</span>
          </h1>

          {/* Subheadline */}
          <p className="text-[8.5px] sm:text-base text-slate-300 leading-snug sm:leading-relaxed font-normal font-sans">
            A modern engineering studio delivering custom web, mobile, cloud architectures, and practical AI solutions with an uncompromising focus on quality, reliability, and client success.
          </p>

          {/* Dual CTAs */}
          <div className="pt-0.5 sm:pt-2 flex flex-row items-center gap-1.5 sm:gap-3.5">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-7 py-1.5 sm:py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-[8.5px] sm:text-sm tracking-wide uppercase transition-all shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:brightness-105 font-sans group shrink-0"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-7 py-1.5 sm:py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30 font-semibold text-[8.5px] sm:text-sm tracking-wide transition-all backdrop-blur-sm font-sans shrink-0"
            >
              <span>Our Services</span>
              <ChevronRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-slate-400" />
            </Link>
          </div>

          {/* Key Value Pillars - 90+ Projects Delivered */}
          <div className="pt-2 sm:pt-5 grid grid-cols-3 gap-1.5 sm:gap-6 border-t border-white/10 w-full max-w-lg">
            <div>
              <div className="text-xs sm:text-2xl font-extrabold text-white font-sans">100%</div>
              <div className="text-[6.5px] sm:text-xs text-slate-400 mt-0.5 font-sans leading-tight">Client IP Ownership</div>
            </div>
            <div>
              <div className="text-xs sm:text-2xl font-extrabold text-brand-500 font-sans">90+</div>
              <div className="text-[6.5px] sm:text-xs text-slate-400 mt-0.5 font-sans leading-tight">Projects Delivered</div>
            </div>
            <div>
              <div className="text-xs sm:text-2xl font-extrabold text-blue-400 font-sans">Agile</div>
              <div className="text-[6.5px] sm:text-xs text-slate-400 mt-0.5 font-sans leading-tight">Milestone Sprints</div>
            </div>
          </div>

        </div>
      </div>

      {/* Integrated Capabilities & Solutions Bar - Exactly 6 cards across in one row on all screen sizes */}
      <div className="relative z-10 w-full pt-2 pb-3 sm:pt-4 sm:pb-5 border-t border-white/10 mt-3 sm:mt-auto bg-black/35 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <p className="text-[8px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 text-center mb-1.5 sm:mb-3 font-semibold">
            ENGINEERED WITH MODERN TECHNOLOGIES & BEST PRACTICES
          </p>

          <div className="grid grid-cols-6 gap-1 sm:gap-3 items-stretch">
            {techStack.map((tech) => (
              <div 
                key={tech.name}
                className="h-[48px] sm:h-[74px] flex flex-col justify-center text-center px-0.5 sm:px-2.5 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 hover:border-brand-500/40 hover:bg-white/[0.06] transition-all group shadow-sm"
              >
                <div className="text-[7.5px] sm:text-[13px] font-bold text-slate-200 group-hover:text-brand-400 transition-colors font-sans truncate w-full leading-tight">
                  {tech.name}
                </div>
                <div className="text-[6.5px] sm:text-[10px] text-slate-400 font-mono mt-0.5 truncate w-full">
                  {tech.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
