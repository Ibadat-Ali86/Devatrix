"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

// Routes whose initial top hero section has a dark background (#061833)
const DARK_HERO_ROUTES = [
  "/internships",
  "/services",
  "/about",
  "/work",
  "/careers",
  "/terms",
  "/privacy",
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Initial check based on current pathname
  const hasDarkHero = useMemo(() => {
    if (!pathname) return false;
    return DARK_HERO_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
  }, [pathname]);

  // Dynamic scroll theme: tracks whether scrolled and what section is underneath
  const [scrolled, setScrolled] = useState(false);
  const [scrolledDark, setScrolledDark] = useState<boolean | null>(null);

  // Derived theme: at top of page, use route's hero theme. When scrolled, use sampled background luminance.
  const isDarkBackground = (scrolled && scrolledDark !== null) ? scrolledDark : hasDarkHero;

  // Dynamic scroll & element-luminance detection:
  // Dynamically inspects what section/color is passing beneath the floating navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrolled = scrollY > 20;
      setScrolled(isScrolled);

      // If at top of the page (< 80px), revert to the known hero theme for the route
      if (scrollY < 80) {
        setScrolledDark(null);
        return;
      }

      // When scrolled past the top hero, sample the element underneath the navbar center
      try {
        const sampleX = window.innerWidth / 2;
        const sampleY = 44; // Center height of floating capsule
        const element = document.elementFromPoint(sampleX, sampleY);
        
        if (!element) return;

        // Traverse up to find the closest element with a theme attribute or background color
        let cur: HTMLElement | null = element as HTMLElement;
        let detectedDark: boolean | null = null;

        while (cur && cur !== document.body && cur !== document.documentElement) {
          // Check explicit data attribute first
          const themeAttr = cur.getAttribute("data-navbar-theme") || cur.getAttribute("data-theme");
          if (themeAttr === "dark") {
            detectedDark = true;
            break;
          } else if (themeAttr === "light") {
            detectedDark = false;
            break;
          }

          // Check computed background color
          const bg = window.getComputedStyle(cur).backgroundColor;
          if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
            const rgb = bg.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const [r, g, b] = rgb.map(Number);
              // Calculate perceived luminance (standard formula)
              const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
              detectedDark = luminance < 140; // Dark background if luminance is low
              break;
            }
          }
          cur = cur.parentElement;
        }

        if (detectedDark !== null) {
          setScrolledDark(detectedDark);
        }
      } catch {
        // Fallback gracefully
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Run initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasDarkHero]);

  const navLinks = [
    { name: "Internships", href: "/internships", highlight: "Cohort '27" },
    { name: "Services", href: "/services" },
    { name: "Case Studies", href: "/work" },
    { name: "About", href: "/about" },
    { name: "Verify", href: "/verify" },
  ];

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div 
        className={`pointer-events-auto max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
          isDarkBackground
            ? "bg-white/95 text-slate-900 border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] ring-1 ring-black/5"
            : "bg-[#061833]/95 text-white border border-slate-700/80 shadow-[0_20px_50px_-8px_rgba(2,10,24,0.65)] ring-1 ring-white/10"
        } backdrop-blur-2xl ${
          scrolled ? "py-2" : ""
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
            <span className={`text-base sm:text-lg font-extrabold tracking-tight leading-none ${
              isDarkBackground ? "text-slate-950" : "text-white"
            }`}>
              Devatrix
            </span>
            <span className={`text-[10px] tracking-wider uppercase font-bold mt-0.5 font-mono ${
              isDarkBackground ? "text-amber-600" : "text-amber-400"
            }`}>
              Academy &amp; Studio
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
                  isDarkBackground
                    ? isActive
                      ? "text-[#061833] bg-slate-100 font-bold shadow-xs"
                      : link.highlight
                      ? "text-amber-700 hover:text-slate-950 hover:bg-slate-100"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    : isActive
                    ? "text-amber-400 bg-white/10 font-bold shadow-xs"
                    : link.highlight
                    ? "text-amber-200 hover:text-white hover:bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && (
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold animate-pulse ${
                    isDarkBackground
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-amber-500/25 text-amber-300 border border-amber-400/40"
                  }`}>
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
            className={`px-4 py-2 text-xs font-bold rounded-full transition shadow-xs ${
              isDarkBackground
                ? "text-slate-800 hover:text-slate-950 border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100"
                : "text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 bg-white/5 hover:bg-white/10"
            }`}
          >
            Learner Portal
          </Link>

          {/* Apply for Cohort Button */}
          <Link
            href="/internships/apply"
            className="dx-btn-primary px-5 py-2 text-xs font-extrabold tracking-wide uppercase transition shadow-md shadow-amber-500/25 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/internships/apply"
            className="dx-btn-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 rounded-full"
          >
            <span>Apply</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
              isDarkBackground
                ? "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
                : "border-slate-700 bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800"
            }`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`pointer-events-auto max-w-md mx-auto mt-2 p-4 rounded-3xl backdrop-blur-2xl shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200 lg:hidden ${
          isDarkBackground
            ? "bg-white/98 border border-slate-200 text-slate-900"
            : "bg-[#061833]/98 border border-slate-700 text-white"
        }`}>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold transition ${
                  isDarkBackground
                    ? pathname === link.href
                      ? "bg-slate-100 text-slate-950 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                    : pathname === link.href
                    ? "bg-white/10 text-amber-400 font-bold"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && (
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                    isDarkBackground
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-amber-500/25 text-amber-300 border border-amber-400/40"
                  }`}>
                    {link.highlight}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className={`pt-3 mt-3 border-t flex flex-col gap-2 ${
            isDarkBackground ? "border-slate-200" : "border-slate-800"
          }`}>
            <Link
              href="/portal/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-center min-h-10 px-4 rounded-full border text-xs font-bold transition ${
                isDarkBackground
                  ? "border-slate-300 text-slate-800 hover:bg-slate-50"
                  : "border-slate-700 text-slate-200 hover:bg-white/5"
              }`}
            >
              Learner Portal Sign-in
            </Link>
            <Link
              href="/internships/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="dx-btn-primary flex items-center justify-center min-h-11 px-4 text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 rounded-full"
            >
              <span>Apply for 2027 Cohort</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
