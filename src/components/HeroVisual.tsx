"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  Cpu, 
  Database, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Zap, 
  Layers, 
  CheckCircle2,
  Server,
  Network
} from "lucide-react";

export default function HeroVisual() {
  const [activeNode, setActiveNode] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotate through active nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const nodes = [
    { name: "Sovereign AI Mesh", status: "Active • 24.8k tokens/s", ping: "8ms", color: "text-brand-400 border-brand-500/40 bg-brand-500/10" },
    { name: "Event Stream Bus", status: "Active • 120k msg/s", ping: "2ms", color: "text-cyber-cyan border-cyber-cyan/40 bg-cyber-cyan/10" },
    { name: "Zero-Trust Security Mesh", status: "Strict • mTLS 1.3", ping: "0.4ms", color: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10" },
    { name: "Distributed Ledger & DB", status: "p99 14ms • Raft Consensus", ping: "11ms", color: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-2xl mx-auto lg:max-w-none group perspective-1000"
    >
      {/* Ambient Gradient Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 via-cyber-cyan/20 to-amber-600/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>

      {/* Main Glass Console Chassis */}
      <div 
        style={{
          transform: `rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative rounded-2xl bg-obsidian-900/90 border border-white/10 p-4 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden"
      >
        {/* Top Console Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="ml-2 text-slate-400 flex items-center gap-1.5 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-brand-400" />
              dx-topology-runtime v4.8.2 [us-west / eu-central]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE TOPOLOGY
            </span>
          </div>
        </div>

        {/* Central Kinetic Neural Mesh Visualizer */}
        <div className="relative my-6 py-6 px-4 bg-obsidian-950/80 rounded-xl border border-white/5 overflow-hidden">
          
          {/* Background Grid & Circuit Lines */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
          
          {/* Animated Connecting SVG Circuit Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
            <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
            <line x1="30%" y1="80%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
            <line x1="70%" y1="80%" x2="50%" y2="50%" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
          </svg>

          {/* Core Central Node */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center my-4">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/30 via-obsidian-900 to-amber-600/20 border-2 border-brand-500/60 shadow-xl shadow-brand-500/20 p-2">
              <Cpu className="w-10 h-10 text-brand-400 animate-pulse-slow" />
              <div className="absolute -inset-2 rounded-2xl border border-brand-500/20 animate-ping opacity-20"></div>
            </div>
            <div className="mt-2.5">
              <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                Devatrix Core Cluster
              </span>
              <p className="text-[11px] font-mono text-brand-400">
                128 Cores • 100Gbps Mesh • Raft Active
              </p>
            </div>
          </div>

          {/* Surrounding Microservice Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 mt-6">
            {nodes.map((node, i) => (
              <div
                key={node.name}
                className={`p-3 rounded-lg border transition-all duration-300 font-mono text-left cursor-default ${
                  activeNode === i 
                    ? node.color + " scale-[1.03] shadow-lg" 
                    : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-semibold truncate">{node.name}</span>
                  <span className="text-[9px] text-slate-500">{node.ping}</span>
                </div>
                <div className="text-[10px] truncate opacity-90">{node.status}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Live Code & Telemetry Stream Streamer */}
        <div className="bg-obsidian-950 p-3.5 rounded-xl border border-white/5 font-mono text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-[10px] border-b border-white/5 pb-1">
            <span>REAL-TIME KERNEL EVENTS</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 0 ERRORS DETECTED
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-600">[00:14.28]</span>
            <span className="text-brand-400">AGENT_DISPATCH:</span>
            <span className="text-slate-300">Swarm orchestrated 14 micro-agents with consensus latency 12ms</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-slate-600">[00:14.29]</span>
            <span className="text-cyber-cyan">K8S_AUTOSCALE:</span>
            <span>Allocated 32 worker pods in us-west-2, warm buffer 99.98%</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-slate-600">[00:14.30]</span>
            <span className="text-emerald-400">ZERO_TRUST_AUDIT:</span>
            <span>All bilateral mTLS certificates verified • SOC2 Type II compliant</span>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center font-mono">
          <div>
            <div className="text-lg font-bold text-white">99.998%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">SLA Guarantee</div>
          </div>
          <div>
            <div className="text-lg font-bold text-brand-400">14.2 ms</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">p99 Latency</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyber-cyan">180K+</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">TPS Throughput</div>
          </div>
        </div>

      </div>
    </div>
  );
}
