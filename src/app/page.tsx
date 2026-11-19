import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnterpriseHero from "@/components/EnterpriseHero";
import TrustTicker from "@/components/TrustTicker";
import WhyDevatrix from "@/components/WhyDevatrix";
import InternshipFlow from "@/components/InternshipFlow";
import CoreCapabilities from "@/components/CoreCapabilities";
import CertificateSample from "@/components/CertificateSample";
import LearnerTestimonials from "@/components/LearnerTestimonials";
import InternshipFAQ from "@/components/InternshipFAQ";
import ExecutiveCTA from "@/components/ExecutiveCTA";
import ScrollReveal from "@/components/ScrollReveal";
import { getPublishedSiteContent } from "@/lib/content/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublishedSiteContent();
  const homeHero = content?.find((item) => item.slug === "home-hero");

  return (
    <div className="dx-public min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Floating Island Navigation (Adaptive Dual-Mode Contrast) */}
      <Navbar />

      {/* Main Content with CodeAlpha-Inspired Professional Educational Flow */}
      <main className="flex-1">
        
        {/* 1. Flagship Hero with 3-Mentors Portrait Hook & Trust Proof (Above-the-fold immediate render) */}
        <EnterpriseHero copy={homeHero ? { title: homeHero.title, highlight: homeHero.badge, summary: homeHero.summary } : undefined} />

        {/* 2. Institutional & Academic Trust Ticker */}
        <ScrollReveal>
          <TrustTicker />
        </ScrollReveal>

        {/* 3. Why Choose Us: The Apprenticeship Standard vs Status Quo */}
        <ScrollReveal>
          <WhyDevatrix />
        </ScrollReveal>

        {/* 4. Internship Flow: 5-Stage Step-by-Step Cadence Roadmap */}
        <ScrollReveal>
          <InternshipFlow />
        </ScrollReveal>

        {/* 5. Available Internship Domains & Specialization Tracks */}
        <ScrollReveal>
          <CoreCapabilities />
        </ScrollReveal>

        {/* 6. Cryptographically Verifiable Academic Credential Preview */}
        <ScrollReveal>
          <CertificateSample />
        </ScrollReveal>

        {/* 7. Student Community & Alumni Success Stories */}
        <ScrollReveal>
          <LearnerTestimonials />
        </ScrollReveal>

        {/* 8. Frequently Asked Questions (FAQ) */}
        <ScrollReveal>
          <InternshipFAQ />
        </ScrollReveal>

        {/* 9. Final Cohort Intake Application CTA */}
        <ScrollReveal>
          <ExecutiveCTA />
        </ScrollReveal>

      </main>

      {/* Harmonized Global Footer */}
      <Footer />

    </div>
  );
}
