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
        
        {/* 1. Flagship Hero with 3-Mentors Portrait Hook & Trust Proof */}
        <EnterpriseHero copy={homeHero ? { title: homeHero.title, highlight: homeHero.badge, summary: homeHero.summary } : undefined} />

        {/* 2. Institutional & Academic Trust Ticker */}
        <TrustTicker />

        {/* 3. Why Choose Us: The Apprenticeship Standard vs Status Quo */}
        <WhyDevatrix />

        {/* 4. Internship Flow: 5-Stage Step-by-Step Cadence Roadmap */}
        <InternshipFlow />

        {/* 5. Available Internship Domains & Specialization Tracks */}
        <CoreCapabilities />

        {/* 6. Cryptographically Verifiable Academic Credential Preview */}
        <CertificateSample />

        {/* 7. Student Community & Alumni Success Stories */}
        <LearnerTestimonials />

        {/* 8. Frequently Asked Questions (FAQ) */}
        <InternshipFAQ />

        {/* 9. Final Cohort Intake Application CTA */}
        <ExecutiveCTA />

      </main>

      {/* Harmonized Global Footer */}
      <Footer />

    </div>
  );
}
