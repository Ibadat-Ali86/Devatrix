"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/3d-testimonails";
import { Star, ShieldCheck } from "lucide-react";

const devatrixTestimonials = [
  {
    name: "Hamza Tariq",
    username: "@hamzatariq",
    body: "Building a multi-tenant SaaS with real GitHub PR reviews taught me more in 6 weeks than university coursework.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Full-Stack Graduate",
    country: "🇵🇰 Pakistan",
  },
  {
    name: "Zainab Malik",
    username: "@zainab.ai",
    body: "Built a production RAG pipeline with vector search and rate limiting. Having that public repo helped me ace interviews!",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "AI & Agent Engineer",
    country: "🇵🇰 Pakistan",
  },
  {
    name: "David Sterling",
    username: "@sterling.uk",
    body: "Devatrix delivered our fintech MVP in 8 weeks with 100% IP handover. Their milestone transparency was exceptional.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Enterprise Partner",
    country: "🇬🇧 UK",
  },
  {
    name: "Ayesha Noor",
    username: "@ayeshanoor",
    body: "DevOps track gave me hands-on Terraform, Docker, and Kubernetes CI/CD. Landed a cloud engineer role in 3 weeks!",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    role: "Cloud DevOps Graduate",
    country: "🇵🇰 Pakistan",
  },
  {
    name: "Marcus Vance",
    username: "@marcus.v",
    body: "Senior engineering discipline and verified GitHub pull requests. Devatrix graduates code like senior developers.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "US Startup Founder",
    country: "🇺🇸 USA",
  },
  {
    name: "Bilal Mansoor",
    username: "@bilal.arch",
    body: "Architectural code reviews were tough and uncompromising. Exactly what I needed to bridge the university-to-industry gap.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    role: "Gold Honors Graduate",
    country: "🇵🇰 Pakistan",
  },
  {
    name: "Kajal Gupta",
    username: "@kajal.g",
    body: "The 6-week curriculum is intense, modern, and production-tested. Earned my verified academic credential!",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    role: "Web Engineer",
    country: "🇮🇳 India",
  },
  {
    name: "Sarah Jenkins",
    username: "@sjenkins",
    body: "We hired two graduates directly through their public verify ledger. Zero guesswork on their actual code competence.",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    role: "VP Engineering",
    country: "🇨🇦 Canada",
  },
];

function HeroTestimonialCard({ img, name, username, body, country, role }: (typeof devatrixTestimonials)[number]) {
  return (
    <Card className="w-52 sm:w-60 bg-white/95 border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all rounded-2xl group cursor-pointer">
      <CardContent className="p-3.5 sm:p-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 border border-slate-200 shrink-0">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <figcaption className="text-xs font-bold text-slate-900 flex items-center gap-1 truncate">
              <span>{name}</span>
              <span className="text-[10px]">{country}</span>
            </figcaption>
            <p className="text-[10px] font-mono text-slate-500 truncate">{role}</p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-amber-400 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-current" />
          ))}
          <span className="text-[9px] font-mono text-emerald-600 font-bold ml-1.5 flex items-center gap-0.5">
            <ShieldCheck className="w-2.5 h-2.5" />
            Verified
          </span>
        </div>

        <blockquote className="mt-2 text-[11px] sm:text-xs text-slate-600 leading-snug line-clamp-3 italic">
          &ldquo;{body}&rdquo;
        </blockquote>
      </CardContent>
    </Card>
  );
}

export default function Hero3DTestimonials() {
  return (
    <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden [perspective:800px] select-none">
      
      {/* Live Trust Header Pill */}
      <div className="absolute top-2 z-30 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs text-[10px] font-mono font-bold text-slate-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>1,200+ VERIFIED 2026 ALUMNI &amp; ENTERPRISE REVIEWS</span>
      </div>

      {/* 3D Tilted Marquee Stage */}
      <div
        className="flex flex-row items-center gap-3 sm:gap-4 shrink-0"
        style={{
          transform:
            "translateX(-25px) translateY(0px) translateZ(-40px) rotateX(16deg) rotateY(-10deg) rotateZ(16deg)",
        }}
      >
        {/* Column 1: Downward */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:38s]">
          {devatrixTestimonials.map((review) => (
            <HeroTestimonialCard key={`h1-${review.username}`} {...review} />
          ))}
        </Marquee>

        {/* Column 2: Upward */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:44s]">
          {devatrixTestimonials.map((review) => (
            <HeroTestimonialCard key={`h2-${review.username}`} {...review} />
          ))}
        </Marquee>

        {/* Column 3: Downward */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:50s]">
          {devatrixTestimonials.map((review) => (
            <HeroTestimonialCard key={`h3-${review.username}`} {...review} />
          ))}
        </Marquee>
      </div>

      {/* Gradient fade masks for seamless 3D depth fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF9F6] via-[#FAF9F6]/85 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/85 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FAF9F6] to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FAF9F6] to-transparent z-20" />
    </div>
  );
}
