"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Solutions", href: "/services#solutions" },
    { name: "Case Studies", href: "/work" },
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Internships", href: "/internships", highlight: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#061833] border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo Lockup */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <Image
                src="/logo-transparent.png"
                alt="Devatrix Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain drop-shadow"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-black tracking-tight text-white font-sans leading-none">
                Devatrix
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-300 font-semibold mt-1 font-sans">
                Technologies
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors font-sans flex items-center gap-1.5 ${
                    isActive
                      ? "text-brand-400"
                      : link.highlight 
                        ? "text-brand-300 hover:text-brand-200"
                        : "text-slate-200 hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      Apply
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Clean Enterprise Action CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 hover:brightness-105 font-sans"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-slate-200 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#061833] border-b border-white/10 px-6 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 text-base font-semibold text-slate-200 hover:text-brand-400 font-sans"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-brand-500 text-obsidian-950 font-bold text-xs uppercase font-sans"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
