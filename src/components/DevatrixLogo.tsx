"use client";

import React from "react";
import Image from "next/image";

interface DevatrixLogoProps {
  variant?: "dark" | "light" | "circle";
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  subtext?: string;
}

export default function DevatrixLogo({
  variant = "dark",
  size = "md",
  showWordmark = true,
  subtext = "Technologies",
}: DevatrixLogoProps) {
  const iconDimensions = {
    sm: { width: 32, height: 32, box: "w-8 h-8" },
    md: { width: 40, height: 40, box: "w-10 h-10" },
    lg: { width: 54, height: 54, box: "w-14 h-14" },
  }[size];

  const logoSrc = variant === "light" 
    ? "/logo-navy-transparent.png" 
    : "/logo-transparent.png";

  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Exact Falcon Logo Emblem */}
      <div 
        className={`relative ${iconDimensions.box} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}
      >
        {variant === "circle" ? (
          <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-brand-500/20 via-obsidian-900 to-obsidian-950 p-[1px] border border-brand-500/30 shadow-lg shadow-brand-500/10">
            <div className="w-full h-full bg-obsidian-950 rounded-[11px] p-1 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo-transparent.png"
                alt="Devatrix Logo"
                width={iconDimensions.width}
                height={iconDimensions.height}
                className="object-contain"
                priority
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={logoSrc}
              alt="Devatrix Logo"
              width={iconDimensions.width}
              height={iconDimensions.height}
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
        )}

        {/* Live Status Pip */}
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-500 rounded-full border-2 border-obsidian-950 shadow-sm animate-pulse"></div>
      </div>

      {/* Exact Typography Lockup */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span 
              className={`text-lg sm:text-xl font-black tracking-tight font-sans transition-colors ${
                variant === "light" 
                  ? "text-slate-900 group-hover:text-brand-700" 
                  : "text-white group-hover:text-brand-400"
              }`}
            >
              DEVATRIX
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-500 border border-brand-500/20 font-mono font-bold tracking-wider uppercase">
              AI-NATIVE
            </span>
          </div>
          <span 
            className={`text-[10px] tracking-widest uppercase font-mono font-semibold ${
              variant === "light" ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
}
