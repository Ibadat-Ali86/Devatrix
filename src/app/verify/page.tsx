import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationLookup from "@/components/VerificationLookup";
import { ShieldCheck, FileCheck2, Lock, Award, CheckCircle2 } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-24">
        
        {/* Header (Cinematic Dark Tech Hero) */}
        <section className="relative py-20 border-b border-white/5 bg-obsidian-950 text-white overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>OFFICIAL CREDENTIAL VERIFICATION ENGINE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Cryptographic Credential Registry. <br />
              <span className="text-brand-400">Zero Tamper Proof.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Authenticate the credentials, specialized tracks, and academic authenticity of Devatrix Senior Engineers and Vanguard Fellows against our immutable record ledger.
            </p>
          </div>
        </section>

        {/* Verification Engine Container (Clean Light Section) */}
        <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <VerificationLookup />

          {/* Verification Protocol Explainer - Preserving 3 columns on all viewports */}
          <div className="mt-12 sm:mt-20 grid grid-cols-3 gap-2 sm:gap-6 pt-8 sm:pt-12 border-t border-slate-200 font-mono text-[9px] sm:text-xs">
            <div className="p-2.5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 space-y-1 sm:space-y-2 shadow-xs">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mb-0.5 sm:mb-1" />
              <h4 className="font-bold text-slate-900 uppercase text-[9px] sm:text-xs truncate">SHA-256 Checksum</h4>
              <p className="text-slate-600 text-[8.5px] sm:text-[11px] leading-relaxed font-sans line-clamp-3 sm:line-clamp-none">
                Every certificate issuance is hashed with the engineer&apos;s verified public key, creating a permanent tamper-evident cryptographic fingerprint.
              </p>
            </div>

            <div className="p-2.5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 space-y-1 sm:space-y-2 shadow-xs">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 mb-0.5 sm:mb-1" />
              <h4 className="font-bold text-slate-900 uppercase text-[9px] sm:text-xs truncate">Employer Trust</h4>
              <p className="text-slate-600 text-[8.5px] sm:text-[11px] leading-relaxed font-sans line-clamp-3 sm:line-clamp-none">
                Global enterprises and recruiters can verify verified production hours, security clearance levels, and technical specialization tracks instantly.
              </p>
            </div>

            <div className="p-2.5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 space-y-1 sm:space-y-2 shadow-xs">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-0.5 sm:mb-1" />
              <h4 className="font-bold text-slate-900 uppercase text-[9px] sm:text-xs truncate">Peer-Reviewed</h4>
              <p className="text-slate-600 text-[8.5px] sm:text-[11px] leading-relaxed font-sans line-clamp-3 sm:line-clamp-none">
                Devatrix Fellow credentials are only issued upon successful completion of 6 months of production client code contributions verified by Senior Staff.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
