import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnterpriseHero from "@/components/EnterpriseHero";
import TrustTicker from "@/components/TrustTicker";
import WhyDevatrix from "@/components/WhyDevatrix";
import CoreCapabilities from "@/components/CoreCapabilities";
import FeaturedWork from "@/components/FeaturedWork";
import InternshipBanner from "@/components/InternshipBanner";
import ExecutiveCTA from "@/components/ExecutiveCTA";
import ScrollReveal from "@/components/ScrollReveal";
import JsonLd from "@/components/JsonLd";
import { getPublishedSiteContent } from "@/lib/content/server";
import { buildPageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Devatrix Technologies | AI Software House, Custom SaaS & Engineering Internships",
  absoluteTitle: true,
  description:
    "Devatrix Technologies is a modern AI-native software house building custom SaaS platforms, autonomous AI agents, full-stack web & mobile apps, enterprise cloud systems, and verified 6-week virtual internships.",
  path: "/",
  keywords: [
    "Devatrix Technologies official website",
    "Devatrix software development company",
    "custom SaaS MVP development",
    "AI chatbot and RAG agent engineering",
    "Next.js React Native Flutter software house",
    "software house in Lahore Pakistan",
  ],
});

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#service`,
  name: SITE_NAME,
  alternateName: "Devatrix",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  email: "devatrixtechnologies@gmail.com",
  telephone: "+92-315-6179410",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  sameAs: [
    "https://www.linkedin.com/company/devatrix-technologies/",
    "https://www.instagram.com/devatrix_technologies",
    "https://github.com/devatrixtechnologies",
  ],
};

export default async function HomePage() {
  const content = await getPublishedSiteContent();
  const homeHero = content?.find((item) => item.slug === "home-hero");
  const cmsCaseStudies = content
    ?.filter((item) => item.content_type === "case_study")
    ?.map((item) => ({
      id: item.slug,
      title: item.title,
      summary: item.summary ?? "",
      badge: item.badge ?? "",
    }));

  return (
    <div className="dx-public min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      <JsonLd data={homeSchema} />
      
      {/* Floating Island Navigation (Adaptive, Non-Blinking Dark Navy Capsule) */}
      <Navbar />

      {/* Main Content: Trust-First Industrial Software House with Single Internship Section at the End */}
      <main className="flex-1">
        
        {/* 1. Flagship Hero with 3D Testimonials Card Showcase & Software House Value Proposition */}
        <EnterpriseHero copy={homeHero ? { title: homeHero.title, highlight: homeHero.badge, summary: homeHero.summary } : undefined} />

        {/* 2. Enterprise Tech Stacks & Academic Trust Ticker */}
        <ScrollReveal direction="up" delay={0.1}>
          <TrustTicker />
        </ScrollReveal>

        {/* 3. The Architectural Standard: Senior Squads vs Traditional Outsource Agencies */}
        <WhyDevatrix />

        {/* 4. Industrial Architecture Solutions & Core Capabilities */}
        <CoreCapabilities />

        {/* 5. Production Blueprints & Delivered Case Studies */}
        <FeaturedWork cmsCaseStudies={cmsCaseStudies && cmsCaseStudies.length > 0 ? cmsCaseStudies : undefined} />

        {/* 6. The Single Dedicated Internship Section: Devatrix Engineering Fellowship */}
        <InternshipBanner />

        {/* 7. Final Executive Project Scoping & Architecture Consultation CTA */}
        <ExecutiveCTA />

      </main>

      {/* Harmonized Global Footer */}
      <Footer />

    </div>
  );
}
