import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExecutiveCTA from "@/components/ExecutiveCTA";
import JsonLd from "@/components/JsonLd";
import { getPublishedSiteContent } from "@/lib/content/server";
import { buildBreadcrumbJsonLd, buildPageMetadata, SITE_URL } from "@/lib/seo/metadata";
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

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "About Devatrix Technologies | AI-Native Software House",
  description:
    "Learn about Devatrix Technologies — our engineering center in Lahore, Pakistan, our remote-first global delivery model, 100% client IP ownership commitment, and talent development mission.",
  path: "/about",
  keywords: [
    "About Devatrix",
    "About Devatrix Technologies",
    "Devatrix Lahore",
    "software house Lahore Pakistan",
    "remote software engineering partner",
  ],
});

const aboutSchema = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Devatrix Technologies",
    url: `${SITE_URL}/about`,
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  },
];

export default async function AboutPage() {
  const content = await getPublishedSiteContent();
  const intro = content?.find((item) => item.slug === "about-hero");
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


  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <JsonLd data={aboutSchema} />
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-20">
        
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
              {intro?.title ?? <>Engineering Digital Solutions <br />That Create</>} <span className="text-brand-500">{intro?.badge ?? "Real Value."}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              {intro?.summary ?? "Devatrix Technologies was founded on a simple principle: build reliable, high-performance software that solves real business problems."}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-8">
            {operationalPillars.map((item) => (
              <div
                key={item.title}
                className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-brand-500/40 sm:p-7"
              >
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="max-w-full rounded-md border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-mono font-bold leading-5 text-brand-700">
                      {item.badge}
                    </span>
                    <span className="text-xs font-mono font-medium leading-5 text-slate-600">
                      {item.role}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900 font-sans mb-1.5 sm:mb-3 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 sm:pt-4 border-t border-slate-200 text-xs sm:text-xs text-slate-600">
                  <span className="text-slate-900 font-bold block mb-0.5">Focus:</span>
                  <span className="leading-relaxed">{item.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Collaboration approach */}
        <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
            <div>
              <h2 className="max-w-md text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Good software starts with a good working relationship.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                From the first conversation to delivery, we focus on clear communication and decisions that support your goals.
              </p>
              <Link href="/contact" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-slate-900 underline underline-offset-4 hover:text-brand-700">
                Start a conversation <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              <div className="py-6 sm:grid sm:grid-cols-[1fr_1.4fr] sm:gap-6">
                <h3 className="text-lg font-semibold text-slate-900">Understand</h3>
                <p className="mt-2 leading-7 text-slate-600 sm:mt-0">We begin with your goals, your users, and the challenges you want to solve.</p>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-[1fr_1.4fr] sm:gap-6">
                <h3 className="text-lg font-semibold text-slate-900">Build together</h3>
                <p className="mt-2 leading-7 text-slate-600 sm:mt-0">We turn requirements into a practical plan and keep communication open as the work progresses.</p>
              </div>
              <div className="py-6 sm:grid sm:grid-cols-[1fr_1.4fr] sm:gap-6">
                <h3 className="text-lg font-semibold text-slate-900">Deliver with care</h3>
                <p className="mt-2 leading-7 text-slate-600 sm:mt-0">We focus on useful, maintainable software and a clear handover for the people using it.</p>
              </div>
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
