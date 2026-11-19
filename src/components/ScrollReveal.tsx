"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
}

/**
 * ScrollReveal provides buttery-smooth viewport entry animations as the user scrolls through the page.
 * Respects system prefers-reduced-motion settings.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 24,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitialOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth custom cubic-bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
