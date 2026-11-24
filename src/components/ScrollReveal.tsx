"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  scale?: number;
  blur?: boolean;
  once?: boolean;
}

/**
 * ScrollReveal provides buttery-smooth viewport entry animations as the user scrolls through the page.
 * Features subtle blur-to-focus transitions, directional offsets, and respects prefers-reduced-motion.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 20,
  scale,
  blur = true,
  once = true,
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
      initial={{
        opacity: 0,
        ...offset,
        ...(scale !== undefined ? { scale } : {}),
        ...(blur ? { filter: "blur(4px)" } : {}),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        ...(scale !== undefined ? { scale: 1 } : {}),
        ...(blur ? { filter: "blur(0px)" } : {}),
      }}
      viewport={{ once, margin: "0px 0px -10px 0px", amount: "some" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier for natural physical response
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
