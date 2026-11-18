import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnterpriseHero from "@/components/EnterpriseHero";
import CoreCapabilities from "@/components/CoreCapabilities";
import WhyDevatrix from "@/components/WhyDevatrix";
import FeaturedWork from "@/components/FeaturedWork";
import InternshipBanner from "@/components/InternshipBanner";
import CertificateSample from "@/components/CertificateSample";
import ExecutiveCTA from "@/components/ExecutiveCTA";
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
  const cmsCaseStudies = content?.filter((item) => item.content_type === "case_study").slice(0, 3).map((item) => ({ id: item.slug, title: item.title, summary: item.summary, badge: item.badge }));
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <JsonLd data={homeSchema} />
      
      {/* Clean Enterprise Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* 1. Cinematic Enterprise Hero (Inspired by Systems Limited & Arbisoft) */}
        <EnterpriseHero copy={homeHero ? { title: homeHero.title, highlight: homeHero.badge, summary: homeHero.summary } : undefined} />

        {/* 2. Comprehensive Core Services & Solutions Grid */}
        <CoreCapabilities />

        {/* 3. Why Choose Devatrix: Proven Value Pillars & Key Metrics */}
        <WhyDevatrix />

        {/* 4. Featured Case Studies & Production Impact */}
        <FeaturedWork cmsCaseStudies={cmsCaseStudies} />

        {/* 5. Internships & Talent Accelerator Spotlight */}
        <InternshipBanner />

        {/* 6. Generic public certificate sample; personalized previews stay private */}
        <CertificateSample />

        {/* 7. Executive Consultation CTA */}
        <ExecutiveCTA />

      </main>

      {/* Prestigious Global Enterprise Footer */}
      <Footer />

    </div>
  );
}
