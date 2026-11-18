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
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  ShieldCheck, 
  TrendingUp,
  Server
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Case Studies & Engineering Portfolio",
  description:
    "Review Devatrix Technologies production case studies: multi-tenant SaaS subscription engines, applied AI RAG platforms, cross-platform mobile apps, and high-availability cloud architectures.",
  path: "/work",
  keywords: [
    "Devatrix portfolio",
    "Devatrix case studies",
    "multi-tenant SaaS case study",
    "enterprise AI case studies",
    "software engineering projects Pakistan",
  ],
});

const workSchema = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Case Studies", path: "/work" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Devatrix Technologies Case Studies & Engineering Portfolio",
    url: `${SITE_URL}/work`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  },
];

export default async function WorkPage() {
  const content = await getPublishedSiteContent();
  const intro = content?.find((item) => item.slug === "work-hero");
  const defaultCaseStudies = [
    {
      title: "Multi-Tenant SaaS Platform & Subscription Engine",
      sector: "Modern Web & Cloud SaaS",
      metric: "< 150ms",
      metricLabel: "Global API Response Latency",
      summary: "Architected a full-stack multi-tenant SaaS application with automated organization onboarding, Stripe subscription billing, role-based access control (RBAC), and team workspace collaboration.",
      challenge: "Managing strict tenant data isolation, automated billing state webhooks, and fast queries across rapidly growing user databases without monolithic architectural bloat.",
      outcome: "Zero data leakage across organizations, sub-150ms global API response times, and automated self-serve billing workflows handling subscription upgrades and cancellations effortlessly.",
      tags: ["Next.js 14", "React 19", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "Tailwind CSS"],
    },
    {
      title: "AI Knowledge Base & Intelligent Document Assistant",
      sector: "Applied AI & Semantic Search",
      metric: "Sub-Second",
      metricLabel: "Retrieval & Query Response",
      summary: "Engineered an intelligent document ingestion and indexing pipeline that vectorizes internal documentation, contracts, and knowledge bases for conversational search using Retrieval-Augmented Generation (RAG).",
      challenge: "Teams were losing productive hours manually searching through unstructured PDFs, vendor agreements, and technical manuals using rudimentary keyword matching.",
      outcome: "Instant semantic retrieval with verified citation source attribution, delivering sub-second accurate answers while maintaining complete data privacy and access governance.",
      tags: ["Python", "FastAPI", "Qdrant Vector DB", "LlamaIndex", "OpenAI API", "Docker", "RAG"],
    },
    {
      title: "Real-Time Operational Telemetry & Dispatch Console",
      sector: "Real-Time Systems & WebSockets",
      metric: "Real-Time",
      metricLabel: "Live Bi-Directional State Sync",
      summary: "Developed a high-responsiveness web operations console providing live field team dispatch tracking, interactive map telemetry, and instant notification alerts via bi-directional WebSockets.",
      challenge: "Legacy polling-based architectures caused noticeable UI latency, stale dispatch status, and heavy redundant server load during peak operational hours.",
      outcome: "Eliminated continuous polling overhead with persistent WebSocket event streams, providing sub-100ms state propagation across concurrent dispatcher screens.",
      tags: ["React", "Node.js", "WebSockets", "Redis Pub/Sub", "Leaflet", "Tailwind CSS", "Express"],
    },
    {
      title: "Headless E-Commerce & Real-Time Inventory Engine",
      sector: "Digital Commerce & Retail",
      metric: "99.9%",
      metricLabel: "Inventory Sync Accuracy",
      summary: "Designed and built an end-to-end headless commerce storefront and inventory management backend with real-time stock reservations, dynamic variant pricing, and automated order fulfillment integrations.",
      challenge: "Inventory desync between multichannel sales and warehouse stock was causing overselling during high-traffic flash campaigns and slow catalog load times.",
      outcome: "Sub-second storefront rendering, atomic stock reservations preventing any overselling, and automated invoice and tracking updates.",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Redis Caching", "Stripe API", "Tailwind CSS"],
    },
  ];
  const cmsStudies = content?.filter((item) => item.content_type === "case_study") ?? [];
  const caseStudies = content === null ? defaultCaseStudies : defaultCaseStudies.flatMap((study, index) => {
    const editable = cmsStudies.find((item) => item.slug === ["case-study-saas", "case-study-ai", "case-study-telemetry", "case-study-commerce"][index]);
    return editable ? [{ ...study, title: editable.title, summary: editable.summary, sector: editable.badge }] : [];
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <JsonLd data={workSchema} />
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-20">
        
        {/* Enterprise Hero Banner (#061833) */}
        <section className="relative py-20 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-300">
              <Activity className="w-3.5 h-3.5 text-brand-500" />
              <span>REAL-WORLD SOFTWARE ARCHITECTURES</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {intro?.title ?? <>Selected Case Studies. <br />Built with</>} <span className="text-brand-500">{intro?.badge ?? "Modern Craftsmanship."}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              {intro?.summary ?? "Explore how we design and deploy clean, scalable software solutions across SaaS, Applied AI, Real-Time WebSockets, and E-Commerce."}
            </p>
          </div>
        </section>

        {/* Case Studies Deep Dive List */}
        <section className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-16">
          {caseStudies.map((study) => (
            <div
              key={study.title}
              className="p-4 sm:p-12 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200 hover:border-brand-500/40 hover:bg-white hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div className="flex flex-row items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200 mb-4 sm:mb-8">
                <div>
                  <span className="text-xs sm:text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md border border-brand-200 uppercase tracking-wider block w-fit mb-1.5 sm:mb-2">
                    {study.sector}
                  </span>
                  <h2 className="text-base sm:text-3xl font-extrabold text-slate-900 font-sans leading-tight">
                    {study.title}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl sm:text-4xl font-extrabold text-brand-600 font-sans">
                    {study.metric}
                  </div>
                  <div className="text-xs sm:text-xs text-slate-500 font-semibold mt-0.5">
                    {study.metricLabel}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start">
                <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                  <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-normal">
                    {study.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-2">
                    <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200">
                      <span className="text-xs sm:text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1">
                        The Challenge:
                      </span>
                      <p className="text-xs sm:text-xs text-slate-600 leading-relaxed">
                        {study.challenge}
                      </p>
                    </div>

                    <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200">
                      <span className="text-xs sm:text-xs font-bold text-brand-700 uppercase tracking-wider block mb-1">
                        The Solution & Impact:
                      </span>
                      <p className="text-xs sm:text-xs text-slate-600 leading-relaxed">
                        {study.outcome}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-2 sm:space-y-4">
                  <h4 className="text-xs sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {study.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs sm:text-xs font-mono px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 sm:pt-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors uppercase tracking-wider"
                    >
                      <span>Inquire About Similar Architecture</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Executive Consultation CTA */}
        <ExecutiveCTA />

      </main>

      <Footer />
    </div>
  );
}
