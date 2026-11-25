"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * SmoothScrollManager provides:
 * 1. Global buttery-smooth momentum scrolling powered by Lenis (hardware-accelerated 60/120fps physics).
 * 2. An ultra-sleek, hardware-accelerated top scroll progress bar tracking page depth from 0% to 100%.
 * 3. A floating, accessible "Scroll to top" button with smooth easing that appears when scrolled past 320px.
 * 4. Interception of internal anchor links (#hash) to ensure smooth animated scrolling with navbar offset.
 */
export default function SmoothScrollManager() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();

  // Smooth spring physics for the top progress bar to avoid sudden jumps
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Respect system preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let animationFrameId: number | undefined;

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.4,
      });

      window.__lenis = lenis;

      const raf = (time: number) => {
        lenis?.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      };
      animationFrameId = requestAnimationFrame(raf);
    }

    const unsubscribe = scrollY.on("change", (latest) => {
      setShowScrollTop(latest > 320);
    });

    // Smooth scroll handler for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const id = href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          const navOffset = 90; // Accounts for fixed floating navbar

          if (window.__lenis) {
            window.__lenis.scrollTo(element, {
              offset: -navOffset,
              duration: 1.15,
            });
          } else {
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - navOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }

          // Update URL hash without jumping
          window.history.pushState(null, "", href);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    return () => {
      unsubscribe();
      document.removeEventListener("click", handleAnchorClick);
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
      if (lenis) {
        lenis.destroy();
        delete window.__lenis;
      }
    };
  }, [scrollY]);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.25 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* 1. Global Page Scroll Progress Indicator Bar (Top Edge) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 z-[70] origin-left pointer-events-none shadow-[0_0_8px_rgba(245,158,11,0.6)]"
        style={{ scaleX }}
        aria-hidden="true"
      />

      {/* 2. Floating Smooth Scroll-to-Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 p-3 sm:p-3.5 rounded-full bg-[#061833]/90 text-white border border-slate-700/80 shadow-[0_8px_24px_rgba(6,24,51,0.35)] backdrop-blur-md hover:bg-slate-900 hover:border-amber-400/80 transition-colors group focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          aria-label="Scroll back to top"
          title="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
          <span className="sr-only">Scroll to top</span>
        </motion.button>
      )}
    </>
  );
}
