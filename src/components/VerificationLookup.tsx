"use client";

import React, { useState } from "react";
import { 
  FileCheck2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Award, 
  User, 
  Calendar, 
  Hash,
  Sparkles
} from "lucide-react";

interface CredentialResult {
  id: string;
  recipient: string;
  role: string;
  track: string;
  institution: string;
  issuedOn: string;
  status: "ACTIVE_VERIFIED" | "REVOKED";
  hash: string;
}

export default function VerificationLookup() {
  const [certId, setCertId] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CredentialResult | null>(null);

  const runLookup = async (rawId: string) => {
    const cleanId = rawId.trim().toUpperCase();
    if (!cleanId) return;
    setLoading(true);
    setSearched(false);
    setResult(null);
    try {
      const res = await fetch(`/api/verify?id=${encodeURIComponent(cleanId)}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.found && data.credential) {
        setResult(data.credential as CredentialResult);
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    void runLookup(certId);
  };

  const fillSample = (sampleId: string) => {
    setCertId(sampleId);
    void runLookup(sampleId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Input Box */}
      <form onSubmit={handleLookup} className="relative mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl border border-slate-300 focus-within:border-brand-500 shadow-md">
          <div className="relative flex-1 w-full flex items-center pl-3">
            <Search className="w-4 h-4 text-brand-600 mr-2 shrink-0" />
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="Enter Certificate ID (e.g. DVX-ENG-2026-9041)"
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 font-mono focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-400 to-amber-600 text-obsidian-950 font-mono text-xs font-bold uppercase tracking-wider hover:brightness-105 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? "Verifying..." : "Verify Credential"}</span>
          </button>
        </div>

        {/* Quick Sample Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-[11px] text-slate-600">
          <span className="text-slate-500 font-medium">Test Sample IDs:</span>
          <button
            type="button"
            onClick={() => fillSample("DVX-ENG-2026-9041")}
            className="px-2.5 py-0.5 rounded bg-white border border-slate-200 hover:border-brand-500 text-brand-800 font-semibold shadow-xs"
          >
            DVX-ENG-2026-9041
          </button>
          <button
            type="button"
            onClick={() => fillSample("DVX-VAN-2026-0128")}
            className="px-2.5 py-0.5 rounded bg-white border border-slate-200 hover:border-brand-500 text-blue-700 font-semibold shadow-xs"
          >
            DVX-VAN-2026-0128
          </button>
          <button
            type="button"
            onClick={() => fillSample("DVX-ARC-2025-4192")}
            className="px-2.5 py-0.5 rounded bg-white border border-slate-200 hover:border-brand-500 text-emerald-700 font-semibold shadow-xs"
          >
            DVX-ARC-2025-4192
          </button>
        </div>
      </form>

      {/* Verification Result Card */}
      {searched && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
          {result ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-brand-300 shadow-xl relative overflow-hidden font-mono">
              
              {/* Verified Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm tracking-wider uppercase">
                    OFFICIALLY VERIFIED & AUTHENTIC
                  </span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-brand-50 text-brand-900 border border-brand-200 font-bold">
                  ID: {result.id}
                </span>
              </div>

              {/* Credential Data Grid - Preserving 2 columns */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 text-xs sm:text-xs">
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1 text-xs sm:text-xs truncate">
                    <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                    CERTIFIED ENGINEER:
                  </span>
                  <div className="text-xs sm:text-base font-bold text-slate-900 font-sans truncate">{result.recipient}</div>
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1 text-xs sm:text-xs truncate">
                    <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-600 shrink-0" />
                    ACCREDITED ROLE:
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-brand-700 truncate">{result.role}</div>
                </div>

                <div className="space-y-0.5 sm:space-y-1 col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium text-xs sm:text-xs">ENGINEERING TRACK & SPECIALIZATION:</span>
                  <div className="text-slate-800 font-semibold text-[11px] sm:text-xs">{result.track}</div>
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-slate-500 font-medium text-xs sm:text-xs">ACADEMIC / CAMPUS ORIGIN:</span>
                  <div className="text-slate-700 font-semibold text-xs sm:text-xs truncate">{result.institution}</div>
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1 text-xs sm:text-xs truncate">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                    DATE OF ATTESTATION:
                  </span>
                  <div className="text-slate-700 font-semibold text-xs sm:text-xs">{result.issuedOn}</div>
                </div>

                <div className="space-y-0.5 sm:space-y-1 col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium flex items-center gap-1 text-xs">
                    <Hash className="w-3 h-3 text-slate-400" />
                    CRYPTOGRAPHIC SHA-256 RECORD HASH:
                  </span>
                  <div className="text-xs text-slate-600 break-all bg-slate-50 p-2.5 rounded border border-slate-200">
                    {result.hash}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>ISSUING AUTHORITY: DEVATRIX ENGINEERING STANDARDS COUNCIL</span>
                <span className="text-emerald-700 font-bold">STATUS: COMPLIANT</span>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3 font-mono">
              <XCircle className="w-8 h-8 text-rose-600 mx-auto" />
              <h4 className="text-sm font-bold text-rose-900 uppercase">Credential Not Found</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                No matching active credential was found for identifier &ldquo;{certId}&rdquo;. Please verify the certificate ID format or contact devatrixtechnologies@gmail.com.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
