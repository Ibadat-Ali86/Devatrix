import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, ShieldCheck, Award, Lock, MessageCircle, Mail, Globe2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#040E20] border-t border-white/10 pt-16 pb-12 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Multi-Column Grid - 2 columns on mobile, 5 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <Image
                  src="/logo-transparent.png"
                  alt="Devatrix"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  Devatrix
                </span>
                <span className="text-[10px] tracking-widest uppercase text-slate-400 font-medium -mt-0.5">
                  Technologies
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-normal">
              A modern software house delivering custom SaaS platforms, AI chatbots, mobile applications, and cloud architecture for businesses worldwide.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
                100% Code Ownership
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
                Clean Architecture
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
                Agile Sprints
              </span>
            </div>

            {/* Social Channels */}
            <div className="pt-3 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/devatrix-technologies/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-brand-500 hover:text-obsidian-950 text-slate-300 transition-all border border-white/10"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53A1.53 1.53 0 0 0 6.46 5.7a1.53 1.53 0 0 0-1.53 1.53 1.53 1.53 0 0 0 1.53 1.53m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/devatrix_technologies?srtk=aHNrM2N2ZGF2OHY5"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-brand-500 hover:text-obsidian-950 text-slate-300 transition-all border border-white/10"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://wa.me/923156179410"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500 hover:text-white text-slate-300 transition-all border border-white/10"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-normal">
              <li>
                <Link href="/services" className="hover:text-brand-400 transition-colors">
                  Custom Software Development
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-400 transition-colors">
                  Enterprise Cloud & DevOps
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-400 transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-400 transition-colors">
                  Web & Mobile Applications
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-400 transition-colors">
                  UI/UX & Product Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-normal">
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-brand-400 transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-brand-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/internships" className="hover:text-brand-400 transition-colors text-brand-400 font-semibold flex items-center gap-1.5">
                  <span>Internships</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 font-mono">Open</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Engineering Base & Direct Reach */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-4">
              Engineering Base
            </h4>
            <div className="space-y-3 text-xs text-slate-400 font-sans">
              <div>
                <p className="font-semibold text-white">Lahore, Pakistan</p>
                <p className="text-slate-500">Software Engineering & Operations</p>
              </div>
              <div>
                <p className="font-semibold text-white">Remote-First Delivery</p>
                <p className="text-slate-500">Serving Clients Worldwide</p>
              </div>
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <a 
                  href="mailto:devatrixtechnologies@gmail.com" 
                  className="text-brand-400 hover:underline font-semibold block break-all"
                >
                  devatrixtechnologies@gmail.com
                </a>
                <a 
                  href="https://wa.me/923156179410" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>+92 315 6179410 (WhatsApp)</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclosures */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <div>
            © {new Date().getFullYear()} Devatrix Technologies LLC. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/contact" className="hover:text-brand-400 text-brand-500 font-semibold">
              Get in Touch
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
