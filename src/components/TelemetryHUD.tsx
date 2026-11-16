"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Server, 
  Zap, 
  Globe2, 
  CheckCircle2 
} from "lucide-react";

export default function TelemetryHUD() {
  const [rps, setRps] = useState(184200);
  const [latency, setLatency] = useState(14.2);
  const [activeNodes, setActiveNodes] = useState(1420);

  // Subtle real-time jitter to convey live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setRps((prev) => prev + Math.floor(Math.random() * 800) - 400);
      setLatency((prev) => +(14.2 + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-obsidian-950/90 border-y border-white/10 backdrop-blur-md py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        
        {/* Left Status Indicator */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-white font-semibold">DEVATRIX PRODUCTION MESH:</span>
          <span className="text-emerald-400 font-bold">ALL 12 REGIONS NOMINAL</span>
        </div>

        {/* Live Metrics Ticker */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-300">
          
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-slate-500">GLOBAL TPS:</span>
            <span className="text-white font-bold">{rps.toLocaleString()} req/s</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-500">p99 LATENCY:</span>
            <span className="text-white font-bold">{latency} ms</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="text-slate-500">K8S PODS:</span>
            <span className="text-white font-bold">{activeNodes} Warm</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-500">SLA:</span>
            <span className="text-white font-bold">99.998% Uptime</span>
          </div>

        </div>

        {/* Live Audit Tag */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
            SOC2 TYPE II VERIFIED
          </span>
          <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
            ZERO-TRUST ENFORCED
          </span>
        </div>

      </div>
    </div>
  );
}
