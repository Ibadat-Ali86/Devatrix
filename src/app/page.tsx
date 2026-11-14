import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnterpriseHero from "@/components/EnterpriseHero";
import CoreCapabilities from "@/components/CoreCapabilities";
import WhyDevatrix from "@/components/WhyDevatrix";
import FeaturedWork from "@/components/FeaturedWork";
import InternshipBanner from "@/components/InternshipBanner";
import ExecutiveCTA from "@/components/ExecutiveCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      
      {/* Clean Enterprise Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* 1. Cinematic Enterprise Hero (Inspired by Systems Limited & Arbisoft) */}
        <EnterpriseHero />

        {/* 2. Comprehensive Core Services & Solutions Grid */}
        <CoreCapabilities />

        {/* 3. Why Choose Devatrix: Proven Value Pillars & Key Metrics */}
        <WhyDevatrix />

        {/* 4. Featured Case Studies & Production Impact */}
        <FeaturedWork />

        {/* 5. Internships & Talent Accelerator Spotlight */}
        <InternshipBanner />

        {/* 6. Executive Consultation CTA */}
        <ExecutiveCTA />

      </main>

      {/* Prestigious Global Enterprise Footer */}
      <Footer />

    </div>
  );
}
