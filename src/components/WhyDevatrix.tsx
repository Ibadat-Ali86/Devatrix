import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, Users, CheckCircle2, Globe2, ArrowRight } from "lucide-react";

export default function WhyDevatrix() {
  const pillars = [
    {
      title: "Deliverable-Backed Execution",
      desc: "We align directly with your business goals. Every phase is tied to tangible, verified milestones so you always have full visibility into sprint progress.",
    },
    {
      title: "100% Day-One IP Sovereignty",
      desc: "You retain full ownership of all source code, architecture documentation, infrastructure scripts, and intellectual property from the first commit.",
    },
    {
      title: "Senior Engineering Pods",
      desc: "No bait-and-switch staffing. Your projects are architected and developed by vetted senior engineers with deep production distributed systems expertise.",
    },
    {
      title: "Agile Remote-First Delivery",
      desc: "Based in Lahore, Pakistan and operating as a remote-first software engineering house, delivering clear milestone demos, transparent communication, and flexible timezone alignment for clients worldwide.",
    },
  ];

  return (
    <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 block">
              WHY DEVATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-sans">
              A Trusted Partner <br />
              <span className="text-brand-600">Built for Scale</span>
            </h2>
            <p className="text-base text-slate-600 leading-relaxed font-normal">
              We bridge strategic consulting with deep hands-on software craftsmanship, helping high-growth businesses and enterprises navigate technological change with confidence.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800 transition-colors font-sans"
              >
                <span>Learn More About Our Company</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Pillars 2x2 Grid on all screens */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500/40 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mb-2 sm:mb-4">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2 font-sans leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-[10px] sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
