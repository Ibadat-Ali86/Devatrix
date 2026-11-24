import React from "react";
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
import { getPublishedSiteContent } from "@/lib/content/server";

export const dynamic = "force-dynamic";

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
