"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle 
} from "lucide-react";
import { DEFAULT_FOOTER_SETTINGS, parseFooterSettings } from "@/lib/content/footer";

export default function Footer() {
  const [footer, setFooter] = useState(DEFAULT_FOOTER_SETTINGS);

  useEffect(() => {
    let active = true;
    fetch("/api/public/content", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (active && data?.footer) setFooter(parseFooterSettings(data.footer)); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const whatsappUrl = `https://wa.me/${footer.whatsappNumber.replace(/\D/g, "")}`;

  return (
    <footer className="bg-[#040e1f] text-slate-300 font-sans border-t border-slate-800/80 relative overflow-hidden">
      {/* Main 5-Column Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-800">
          
          {/* Column 1: Brand & Operational Status (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-sm group-hover:scale-105 transition-transform">
                <Image
                  src="/logo-transparent.png"
                  alt="Devatrix"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  Devatrix
                </span>
                <span className="text-[10px] tracking-wider uppercase text-amber-400 font-bold font-mono">
                  Academy &amp; Engineering Studio
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {footer.description}
            </p>

            {/* Live Operational & Admissions Status Indicator */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 max-w-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Admissions Active · Batch 2027.1</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Applications reviewed on a rolling basis. Direct line of architect code reviews.
              </p>
            </div>

            {/* Proof Points */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              {footer.proofPoints.map((point) => (
                <span key={point} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {point}
                </span>
              ))}
            </div>

            {/* Social Channels */}
            <div className="pt-1 flex items-center gap-2.5">
              <a
                href={footer.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-all border border-white/10 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53A1.53 1.53 0 0 0 6.46 5.7a1.53 1.53 0 0 0-1.53 1.53 1.53 1.53 0 0 0 1.53 1.53m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
                </svg>
              </a>

              <a
                href={footer.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-all border border-white/10 flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white text-slate-300 transition-all border border-white/10 flex items-center justify-center"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: 2027 Cohort Tracks (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              2027 Cohort Tracks
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/internships#tracks" className="hover:text-amber-400 transition-colors">
                  Applied AI &amp; Agents
                </Link>
              </li>
              <li>
                <Link href="/internships#tracks" className="hover:text-amber-400 transition-colors">
                  Frontend &amp; Next.js 16
                </Link>
              </li>
              <li>
                <Link href="/internships#tracks" className="hover:text-amber-400 transition-colors">
                  DevOps &amp; Cloud (Docker)
                </Link>
              </li>
              <li>
                <Link href="/internships#tracks" className="hover:text-amber-400 transition-colors">
                  Data Science &amp; Analytics
                </Link>
              </li>
              <li>
                <Link href="/internships#tracks" className="hover:text-amber-400 transition-colors">
                  React Native &amp; Mobile
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/internships" className="text-amber-400 hover:underline font-bold text-xs inline-flex items-center gap-1 font-mono">
                  <span>View All 6 Syllabi</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Studio Engineering (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Engineering Studio
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">
                  Custom SaaS &amp; MVPs
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">
                  Enterprise Cloud &amp; DevOps
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-400 transition-colors">
                  Sovereign AI &amp; RAG
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-amber-400 transition-colors">
                  Production Case Studies
                </Link>
              </li>
              <li>
                <Link href="/estimator" className="hover:text-amber-400 transition-colors">
                  Project Cost Estimator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Verification & Trust (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Trust &amp; Verification
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/verify" className="hover:text-amber-400 transition-colors text-amber-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Certificate</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/sign-in" className="hover:text-amber-400 transition-colors">
                  Learner Portal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  Architecture Principles
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-amber-400 transition-colors">
                  Staff Engineering Roles
                </Link>
              </li>
              <li>
                <Link href="/admin/sign-in" className="hover:text-slate-200 transition-colors text-slate-500 text-xs">
                  Reviewer Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Regional Hub & Direct Contact (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Engineering Base
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{footer.officeCity}</span>
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">{footer.officeDescription}</p>
              </div>
              <div>
                <p className="font-bold text-white">{footer.remoteTitle}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">{footer.remoteDescription}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <a 
                  href={`mailto:${footer.contactEmail}`}
                  className="text-amber-400 hover:underline font-semibold block break-all text-[11px]"
                >
                  {footer.contactEmail}
                </a>
                <a 
                  href={whatsappUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>{footer.whatsappLabel}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclosures Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {footer.legalName}. {footer.copyrightText}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/contact" className="hover:text-amber-400 text-amber-400 font-semibold">
              Get in Touch
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
