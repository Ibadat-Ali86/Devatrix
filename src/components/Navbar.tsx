"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Case Studies", href: "/work" },
    { name: "Estimator", href: "/estimator" },
    { name: "About", href: "/about" },
    { name: "Internships", href: "/internships", highlight: "Cohort '27" },
  ];

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div 
        className={`pointer-events-auto max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 bg-[#061833]/95 text-white border border-slate-700/80 shadow-[0_20px_50px_-8px_rgba(2,10,24,0.65)] ring-1 ring-white/10 backdrop-blur-2xl ${
          scrolled ? "py-2 shadow-2xl border-white/20 bg-[#061833]/98" : ""
        }`}
      >
        {/* Brand Logo Lockup */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 p-1.5 transition-transform group-hover:scale-105 shadow-sm">
            <Image
              src="/logo-transparent.png"
              alt="Devatrix"
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-base sm:text-lg font-extrabold tracking-tight leading-none text-white">
              Devatrix
            </span>
            <span className="text-[10px] tracking-wider uppercase font-bold mt-0.5 font-mono text-amber-400">
              Technologies
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "text-amber-400 bg-white/10 font-bold shadow-xs"
                    : link.highlight
                    ? "text-amber-200 hover:text-white hover:bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-amber-500/25 text-amber-300 border border-amber-400/40">
                    {link.highlight}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          {/* Learner Portal Sign-in */}
          <Link
            href="/portal/sign-in"
            className="px-4 py-2 text-xs font-bold rounded-full transition shadow-xs text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 bg-white/5 hover:bg-white/10"
          >
            Learner Portal
          </Link>

          {/* Scope Project / Estimator Button */}
          <Link
            href="/estimator"
            className="dx-btn-primary px-5 py-2 text-xs font-extrabold tracking-wide uppercase transition shadow-md shadow-amber-500/25 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full flex items-center gap-1.5"
          >
            <span>Scope Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/estimator"
            className="dx-btn-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 rounded-full"
          >
            <span>Scope</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 transition"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Mobile Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[-1] pointer-events-auto lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="pointer-events-auto max-w-sm sm:max-w-md mx-auto mt-2 p-4 rounded-3xl backdrop-blur-2xl shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200 lg:hidden bg-[#061833]/98 border border-slate-700 text-white">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold transition ${
                    pathname === link.href
                      ? "bg-white/10 text-amber-400 font-bold"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-amber-500/25 text-amber-300 border border-amber-400/40">
                      {link.highlight}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/portal/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center min-h-10 px-4 rounded-full border border-slate-700 text-slate-200 hover:bg-white/5 text-xs font-bold transition"
              >
                Learner Portal Sign-in
              </Link>
              <Link
                href="/estimator"
                onClick={() => setMobileMenuOpen(false)}
                className="dx-btn-primary flex items-center justify-center min-h-11 px-4 text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 rounded-full gap-2"
              >
                <span>Launch Project Estimator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
