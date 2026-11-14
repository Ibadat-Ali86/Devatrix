"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle, 
  ArrowLeft,
  Upload,
  FileText
} from "lucide-react";

const trackList = [
  "Frontend & Full-Stack Web Engineering",
  "Artificial Intelligence & Custom Agents",
  "Data Science & Predictive Modeling",
  "Data Analytics & Business Intelligence",
  "React Native Mobile App Development",
  "Flutter Mobile App Development"
];

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const initialTrackParam = searchParams.get("track") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    university: "",
    track: trackList[0],
    duration: "6 Weeks (Intensive Virtual Sprint)",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resumeUrl: "",
    statement: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedCandidate, setSubmittedCandidate] = useState<{
    candidateId: string;
    fullName: string;
    track: string;
  } | null>(null);

  useEffect(() => {
    if (initialTrackParam) {
      // Find matching track case-insensitively or exact
      const matched = trackList.find(
        (t) => t.toLowerCase() === initialTrackParam.toLowerCase() ||
               t.toLowerCase().includes(initialTrackParam.toLowerCase())
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, track: matched }));
      }
    }
  }, [initialTrackParam]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");

    try {
      const submission = new FormData();
      submission.append("fullName", formData.fullName);
      submission.append("email", formData.email);
      submission.append("whatsapp", formData.whatsapp);
      submission.append("university", formData.university);
      submission.append("track", formData.track);
      submission.append("duration", formData.duration);
      submission.append("githubUrl", formData.githubUrl);
      submission.append("linkedinUrl", formData.linkedinUrl);
      submission.append("portfolioUrl", formData.portfolioUrl);
      submission.append("resumeUrl", formData.resumeUrl);
      submission.append("statement", formData.statement);
      if (resumeFile) {
        submission.append("resumeFile", resumeFile);
      }

      const res = await fetch("/api/internships/apply", {
        method: "POST",
        body: submission,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormStatus("success");
        setSubmittedCandidate({
          candidateId: data.candidateId,
          fullName: formData.fullName,
          track: formData.track,
        });
      } else {
        setFormStatus("error");
        setErrorMessage(data.error || "Unable to submit your application. Please check your fields and try again.");
      }
    } catch (err: any) {
      console.error("Internship submission error:", err);
      setFormStatus("error");
      setErrorMessage("Network error occurred while submitting your application. Please try again.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/internships"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Internship Tracks & Details</span>
        </Link>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-mono font-medium text-brand-800 mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
          <span>BATCH 2026 COHORT • 6 WEEKS VIRTUAL SPRINT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
          Apply for Devatrix 6-Week Internship
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Complete the official intake below. Selected candidates are notified within 2 to 3 business days with offer letters and sprint blueprints.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
        {formStatus === "success" && submittedCandidate ? (
          <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                APPLICATION REGISTERED
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                Congratulations, {submittedCandidate.fullName}!
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your application for <span className="font-bold text-slate-900">{submittedCandidate.track}</span> has been successfully received and added to our review queue.
              </p>
            </div>

            {/* Candidate ID Display Box */}
            <div className="p-5 rounded-2xl bg-[#061833] text-white max-w-md mx-auto space-y-3 shadow-lg">
              <span className="text-[11px] font-mono text-slate-400 block tracking-wider uppercase">
                Official Assigned Candidate ID
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-mono font-black text-brand-400 tracking-wider">
                  {submittedCandidate.candidateId}
                </span>
                <button
                  onClick={() => copyToClipboard(submittedCandidate.candidateId)}
                  className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
                  title="Copy Candidate ID"
                >
                  {copiedId ? "Copied!" : "Copy"}
                </button>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Save this ID for reference when receiving your offer letter.
              </span>
            </div>

            {/* Next Steps Guidance */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2 text-xs text-slate-700">
              <span className="font-bold text-slate-900 font-sans block text-sm mb-1">
                Next Steps in Your Onboarding:
              </span>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-brand-600">1.</span>
                <span>Our lead architects will review your background, skills, and submitted credentials.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-brand-600">2.</span>
                <span>Approved candidates receive an official Devatrix Offer Letter via email.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-brand-600">3.</span>
                <span>You will be added to the cohort communication channel for milestone guidelines.</span>
              </div>
            </div>

            {/* Action Links */}
            <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs">
              <a
                href={`https://wa.me/923156179410?text=Hello%20Devatrix%20Technologies,%20I%20have%20submitted%20my%20internship%20application%20with%20Candidate%20ID:%20${submittedCandidate.candidateId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Support (+92 315 6179410)</span>
              </a>
              <button
                onClick={() => {
                  setFormStatus("idle");
                  setSubmittedCandidate(null);
                  setResumeFile(null);
                  setFormData({
                    fullName: "",
                    email: "",
                    whatsapp: "",
                    university: "",
                    track: trackList[0],
                    duration: "6 Weeks (Intensive Virtual Sprint)",
                    githubUrl: "",
                    linkedinUrl: "",
                    portfolioUrl: "",
                    resumeUrl: "",
                    statement: "",
                  });
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200 transition-colors"
              >
                <span>Submit Another Application</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6 text-sm">
            {formStatus === "error" && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Hamza Ahmed"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="hamza@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 3XX XXXXXXX"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
                  University & Grad Year *
                </label>
                <input
                  type="text"
                  required
                  placeholder="FAST (CS 2026)"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
                  Track of Interest *
                </label>
                <select
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 sm:px-4 sm:py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-[11px] sm:text-sm"
                >
                  {trackList.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
                  Duration
                </label>
                <input
                  type="text"
                  readOnly
                  value="6 Weeks Sprint"
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-slate-800 font-medium text-xs sm:text-sm cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Resume / CV Upload & Link Section (Optional) */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block font-sans">
                Resume / CV (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="w-full text-[10px] sm:text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] sm:file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer bg-slate-50 border border-slate-300 rounded-xl p-1"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="Or Google Drive link"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                  />
                </div>
              </div>
              <p className="text-[9.5px] sm:text-[11px] text-slate-500 font-normal">
                Upload PDF/DOC (up to 10MB) or provide a public cloud link.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
                  GitHub Profile (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                Portfolio / Live Projects URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://yourportfolio.dev or project link"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                Favorite Project & Why You Want to Join Devatrix *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Briefly describe a technical project you built, programming languages you enjoy, and what practical skills you aim to achieve during this 6-week internship..."
                value={formData.statement}
                onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="w-full py-4 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/25 hover:brightness-105 flex items-center justify-center gap-2 font-sans"
            >
              {formStatus === "submitting" ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Registering Application & Generating CID...</span>
                </span>
              ) : (
                <>
                  <span>Submit 6-Week Internship Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 font-normal">
              By submitting, your application is saved to our talent database and syncs automatically with HR review systems.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function InternshipApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <Navbar />
      <main className="flex-1 pt-14 sm:pt-20">
        <Suspense fallback={<div className="py-24 text-center text-xs font-mono text-slate-500">Loading Application Form...</div>}>
          <ApplyFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
