"use client";

import React from "react";
import { Marquee } from "@/components/ui/3d-testimonails";
import { CheckCircle2, ShieldCheck, Sparkles, Building2, GraduationCap, Cpu } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Authentic Brand & Academic Emblems (SVGs)                                  */
/* -------------------------------------------------------------------------- */

function ReactNextIcon() {
  return (
    <div className="flex items-center -space-x-1 shrink-0">
      <svg className="w-6 h-6 text-[#00D8FF]" viewBox="0 0 115.3 100" fill="currentColor">
        <circle cx="57.6" cy="50" r="8.4" />
        <path d="M57.6,0C40.7,0,26.4,7.4,17.4,19.3c-9.1,12-11.7,27.1-7.3,42.4C14.5,77,28.8,84.4,37.8,96.3c9,11.9,23.3,19.3,40.2,19.3 c16.9,0,31.2-7.4,40.2-19.3c9-11.9,11.7-27.1,7.3-42.4c-4.4-15.3-18.7-22.7-27.7-34.6C88.8,7.4,74.5,0,57.6,0z" fill="none" stroke="currentColor" strokeWidth="4.5" transform="rotate(30 57.6 50)" />
        <path d="M57.6,0C40.7,0,26.4,7.4,17.4,19.3c-9.1,12-11.7,27.1-7.3,42.4C14.5,77,28.8,84.4,37.8,96.3c9,11.9,23.3,19.3,40.2,19.3 c16.9,0,31.2-7.4,40.2-19.3c9-11.9,11.7-27.1,7.3-42.4c-4.4-15.3-18.7-22.7-27.7-34.6C88.8,7.4,74.5,0,57.6,0z" fill="none" stroke="currentColor" strokeWidth="4.5" transform="rotate(90 57.6 50)" />
        <path d="M57.6,0C40.7,0,26.4,7.4,17.4,19.3c-9.1,12-11.7,27.1-7.3,42.4C14.5,77,28.8,84.4,37.8,96.3c9,11.9,23.3,19.3,40.2,19.3 c16.9,0,31.2-7.4,40.2-19.3c9-11.9,11.7-27.1,7.3-42.4c-4.4-15.3-18.7-22.7-27.7-34.6C88.8,7.4,74.5,0,57.6,0z" fill="none" stroke="currentColor" strokeWidth="4.5" transform="rotate(150 57.6 50)" />
      </svg>
      <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black border border-white/40">
        N
      </div>
    </div>
  );
}

function TypeScriptIcon() {
  return (
    <div className="w-6 h-6 rounded-md bg-[#3178C6] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
      TS
    </div>
  );
}

function PythonIcon() {
  return (
    <svg className="w-6 h-6 shrink-0" viewBox="0 0 128 128">
      <path fill="#3776AB" d="M63.8 6.4c-26.6 0-25 11.5-25 11.5l.1 11.9h25.4v3.6H29.1S13 31.7 13 58.3c0 26.6 14.1 25.7 14.1 25.7h8.4v-11.8s-.5-14.1 13.9-14.1h24s13.4.2 13.4-13.1V20s1.9-13.6-23-13.6zm-13.7 7.2c2.4 0 4.4 2 4.4 4.4 0 2.4-2 4.4-4.4 4.4-2.4 0-4.4-2-4.4-4.4 0-2.4 2-4.4 4.4-4.4z" />
      <path fill="#FFD43B" d="M64.2 121.6c26.6 0 25-11.5 25-11.5l-.1-11.9H63.7v-3.6h35.2s16.1 1.7 16.1-24.9c0-26.6-14.1-25.7-14.1-25.7h-8.4v11.8s.5 14.1-13.9 14.1h-24s-13.4-.2-13.4 13.1V108s-1.9 13.6 23 13.6zm13.7-7.2c-2.4 0-4.4-2-4.4-4.4 0-2.4 2-4.4 4.4-4.4 2.4 0 4.4 2 4.4 4.4 0 2.4-2 4.4-4.4 4.4z" />
    </svg>
  );
}

function AwsIcon() {
  return (
    <div className="w-7 h-5 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <path d="M22 28 C22 22, 28 17, 36 17 C44 17, 49 22, 49 28 L49 38 L43 38 L43 36 C41 38, 38 39, 34 39 C27 39, 22 35, 22 28 Z M43 27 C43 23, 40 21, 36 21 C31 21, 28 23, 28 27 C28 31, 31 34, 35 34 C40 34, 43 31, 43 27 Z" fill="#232F3E" />
        <path d="M53 18 L58 18 L64 34 L70 18 L75 18 L81 34 L87 18 L92 18 L84 38 L79 38 L73 23 L67 38 L62 38 Z" fill="#232F3E" />
        <path d="M12 44 C35 55, 68 55, 90 44" fill="none" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" />
        <path d="M84 41 L92 44 L87 50 Z" fill="#FF9900" />
      </svg>
    </div>
  );
}

function DockerIcon() {
  return (
    <svg className="w-6 h-6 text-[#2496ED] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186zm0 2.715h2.118a.186.186 0 00.186-.186V6.289a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.888c0 .102.082.186.185.186zm-2.954 0h2.119a.186.186 0 00.186-.186V6.289a.186.186 0 00-.186-.186H8.075a.185.185 0 00-.185.186v1.888c0 .102.083.186.185.186zm-2.954 0h2.119a.186.186 0 00.185-.186V6.289a.186.186 0 00-.185-.186H5.12a.186.186 0 00-.185.186v1.888c0 .102.083.186.185.186zm5.908 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.954 0h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186H8.075a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.954 0h2.119a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H5.12a.186.186 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.954 0h2.119a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H2.166a.186.186 0 00-.186.185v1.888c0 .102.083.185.186.185zM23.998 11.7c-.302-.19-.77-.32-1.32-.32-.23 0-.46.02-.69.07-.15-.72-.54-1.34-1.12-1.82-.69-.58-1.57-.86-2.58-.86-.11 0-.22 0-.32.01-.27-.61-.71-1.13-1.28-1.5-.66-.43-1.45-.66-2.31-.66-.18 0-.36.01-.54.03-.36-1.51-1.48-2.67-2.94-3.1-.38-.11-.78-.17-1.19-.17-.18 0-.35.01-.52.03V3.39c0-.49-.4-.89-.89-.89H4.23c-.49 0-.89.4-.89.89v8.31C1.48 11.7.01 13.17 0 14.97c0 2.21 1.79 4.01 4.01 4.01h15.98c2.21 0 4.01-1.79 4.01-4.01 0-1.16-.5-2.2-1.29-2.93.8-.18 1.29-.34 1.29-.34z" />
    </svg>
  );
}

function PostgresSupabaseIcon() {
  return (
    <div className="flex items-center -space-x-1 shrink-0">
      <div className="w-5 h-5 rounded-full bg-[#4169E1] text-white flex items-center justify-center font-bold text-[9px] shadow-xs">
        PG
      </div>
      <div className="w-5 h-5 rounded-full bg-[#3ECF8E] text-slate-950 flex items-center justify-center text-[10px] font-black border border-white">
        ⚡
      </div>
    </div>
  );
}

function TailwindIcon() {
  return (
    <svg className="w-6 h-6 text-[#38BDF8] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
    </svg>
  );
}

function RedisIcon() {
  return (
    <div className="w-6 h-6 rounded-md bg-[#DC382D] text-white flex items-center justify-center font-black text-[9px] shadow-xs shrink-0">
      RD
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* University Shields & Insignias                                              */
/* -------------------------------------------------------------------------- */

function UniversityBadge({ code, color, label }: { code: string; color: string; label: string }) {
  return (
    <div className={`w-8 h-8 rounded-xl ${color} text-white flex items-center justify-center font-black text-xs shadow-xs border border-white/30 shrink-0`}>
      {code}
    </div>
  );
}

export default function TrustTicker() {
  // Lane 1: Prestigious Pakistani & Global Universities
  const universities = [
    {
      code: "FAST",
      name: "FAST-NUCES",
      detail: "Computer Science & Software",
      color: "bg-[#062047]",
    },
    {
      code: "NUST",
      name: "NUST SEECS",
      detail: "Computing & Electrical Engineering",
      color: "bg-[#0B3C5D]",
    },
    {
      code: "GIKI",
      name: "GIK Institute",
      detail: "Engineering Sciences & CS",
      color: "bg-[#7A1C1C]",
    },
    {
      code: "LUMS",
      name: "LUMS",
      detail: "Syed Babar Ali School of Science",
      color: "bg-[#0F5132]",
    },
    {
      code: "UET",
      name: "UET Lahore",
      detail: "Computer Engineering & AI",
      color: "bg-[#842029]",
    },
    {
      code: "ITU",
      name: "ITU Lahore",
      detail: "Artificial Intelligence & Data",
      color: "bg-[#1D4ED8]",
    },
    {
      code: "CUI",
      name: "COMSATS Univ",
      detail: "Information Tech & Robotics",
      color: "bg-[#1E293B]",
    },
    {
      code: "PU",
      name: "PUCIT / Punjab Univ",
      detail: "Computing & System Architecture",
      color: "bg-[#312E81]",
    },
  ];

  // Lane 2: Production Stacks in Devatrix
  const techStacks = [
    {
      icon: <ReactNextIcon />,
      name: "Next.js & React 19",
      detail: "Modern Full-Stack & SSR",
    },
    {
      icon: <TypeScriptIcon />,
      name: "TypeScript 5",
      detail: "Strict Architecture & Types",
    },
    {
      icon: <PythonIcon />,
      name: "Python & PyTorch",
      detail: "RAG & Agent Engineering",
    },
    {
      icon: <AwsIcon />,
      name: "AWS Cloud",
      detail: "Architecture & Serverless",
    },
    {
      icon: <DockerIcon />,
      name: "Docker & Kubernetes",
      detail: "Containerized Microservices",
    },
    {
      icon: <PostgresSupabaseIcon />,
      name: "PostgreSQL & Supabase",
      detail: "ACID & Vector Data Stores",
    },
    {
      icon: <TailwindIcon />,
      name: "Tailwind CSS",
      detail: "Design Systems & Radix UI",
    },
    {
      icon: <RedisIcon />,
      name: "Redis & Vector DBs",
      detail: "Low-Latency Semantic Search",
    },
  ];

  const trustPoints = [
    "100% Client IP Sovereignty",
    "6-Week Outcome-Driven Sprints",
    "Verified GitHub Milestone PRs",
    "Direct Senior Architect Mentorship",
    "Cryptographic Certificate Verification",
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FAF9F6] border-b border-slate-200/80 relative overflow-hidden select-none" aria-label="Ecosystem & Academic Partnerships">
      
      {/* Corner Fading Effects: Gradient masks on both left and right edges */}
      <div className="pointer-events-none absolute left-0 inset-y-0 w-20 sm:w-40 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/90 to-transparent z-20" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 inset-y-0 w-20 sm:w-40 bg-gradient-to-l from-[#FAF9F6] via-[#FAF9F6]/90 to-transparent z-20" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        {/* Subtle Section Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/60 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>TOP UNIVERSITY TALENT × MODERN PRODUCTION STACKS</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061833] tracking-tight font-sans">
          Connecting Ambitious Engineers With Enterprise Architectures
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Over 1,200+ candidates from premier engineering universities build, test, and ship production software through Devatrix apprenticeships and client cohorts.
        </p>
      </div>

      {/* Marquee Container with dual continuous scrolling lanes */}
      <div className="space-y-3 sm:space-y-4 relative w-full overflow-hidden">
        
        {/* Lane 1: Top Universities (Left to Right moving ticker) */}
        <div className="w-full">
          <Marquee 
            pauseOnHover 
            reverse 
            repeat={4} 
            className="[--duration:36s] [--gap:0.875rem] py-1"
          >
            {universities.map((uni) => (
              <div
                key={uni.name}
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer shrink-0"
              >
                <UniversityBadge code={uni.code} color={uni.color} label={uni.name} />
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                    {uni.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {uni.detail}
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Lane 2: Production Engineering Tech Stacks (Left to Right moving ticker) */}
        <div className="w-full">
          <Marquee 
            pauseOnHover 
            repeat={4} 
            className="[--duration:30s] [--gap:0.875rem] py-1"
          >
            {techStacks.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer shrink-0"
              >
                {tech.icon}
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                    {tech.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {tech.detail}
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

      </div>

      {/* Compact Trust Guarantees Ribbon (Eliminates awkward white space) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-sans text-slate-700">
          {trustPoints.map((point) => (
            <div
              key={point}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-xs font-semibold hover:border-amber-400 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
