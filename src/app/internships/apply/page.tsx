"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandLoader from "@/components/BrandLoader";
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
  "Full-Stack Web Development",
  "Applied AI & Agent Engineering",
  "Machine Learning & Data Science",
  "Data Analytics & Business Intelligence",
  "AI Engineer & Forward Deployed Engineer (FDE)",
  "DevOps Engineer & Cloud Infrastructure",
  "React Native Mobile App Development",
  "Flutter Mobile App Development"
];

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const initialTrackParam = searchParams.get("track") || "";

  const [trackOptions, setTrackOptions] = useState(trackList);
  useEffect(() => {
    let active = true;
    fetch("/api/public/content", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (active && data?.available && Array.isArray(data.tracks)) setTrackOptions(data.tracks.map((track: { title?: unknown }) => typeof track.title === "string" ? track.title : "").filter(Boolean)); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const [formData, setFormData] = useState(() => {
    const initialTrack = trackList.find(
      (track) => track.toLowerCase() === initialTrackParam.toLowerCase() ||
        track.toLowerCase().includes(initialTrackParam.toLowerCase()),
    ) || trackList[0];
    return {
    fullName: "",
    email: "",
    whatsapp: "",
    university: "",
    track: initialTrack,
    duration: "6 Weeks (Intensive Virtual Sprint)",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resumeUrl: "",
    statement: "",
    };
  });
  const selectedTrack = trackOptions.includes(formData.track)
    ? formData.track
    : trackOptions.find((track) => track.toLowerCase() === initialTrackParam.toLowerCase()) || trackOptions[0] || "";

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const submissionId = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedCandidate, setSubmittedCandidate] = useState<{
    fullName: string;
    track: string;
    email: string;
    receiptEmailSent: boolean;
  } | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formStatus === "submitting") return;
    setFormStatus("submitting");
    setErrorMessage("");
    if (!selectedTrack) {
      setFormStatus("error");
      setErrorMessage("Applications are currently closed while no internship tracks are published.");
      return;
    }

    try {
      const submission = new FormData();
      if (!submissionId.current) submissionId.current = crypto.randomUUID();
      submission.append("submissionId", submissionId.current);
      submission.append("fullName", formData.fullName);
      submission.append("email", formData.email);
      submission.append("whatsapp", formData.whatsapp);
      submission.append("university", formData.university);
      submission.append("track", selectedTrack);
      submission.append("duration", formData.duration);
      submission.append("githubUrl", formData.githubUrl);
      submission.append("linkedinUrl", formData.linkedinUrl);
      submission.append("portfolioUrl", formData.portfolioUrl);
      submission.append("resumeUrl", formData.resumeUrl);
      submission.append("statement", formData.statement);

      const res = await fetch("/api/internships/apply", {
        method: "POST",
        body: submission,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        submissionId.current = null;
        setFormStatus("success");
        setSubmittedCandidate({
          fullName: formData.fullName,
          track: selectedTrack,
          email: formData.email,
          receiptEmailSent: Boolean(data.receiptEmailSent),
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
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                {submittedCandidate.receiptEmailSent
                  ? `A receipt was sent to ${submittedCandidate.email}.`
                  : "No test receipt was sent; instant email is restricted to the allowlisted local test address."}
                {" "}This receipt does not include portal credentials or your private tracking reference.
              </p>
            </div>

            {/* Next Steps Guidance */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2 text-xs text-slate-700">
              <span className="font-bold text-slate-900 font-sans block text-sm mb-1">
                Next Steps in Your Onboarding:
              </span>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-brand-600">1.</span>
                <span>Our team will review your background, skills, and application.</span>
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
                href="https://wa.me/923156179410?text=Hello%20Devatrix%20Technologies%2C%20I%20have%20submitted%20an%20internship%20application."
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
                  setFormData({
                    fullName: "",
                    email: "",
                    whatsapp: "",
                    university: "",
                    track: trackOptions[0] || "",
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
                <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
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
                <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
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
                <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
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
                <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
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
                <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
                  Track of Interest *
                </label>
                <select
                  value={selectedTrack}
                  required
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 sm:px-4 sm:py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-[11px] sm:text-sm"
                >
                  {trackOptions.length === 0 && <option value="">No tracks are accepting applications</option>}
                  {trackOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
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
              <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block font-sans">
                Resume / CV (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    disabled
                    className="w-full text-xs sm:text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] sm:file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer bg-slate-50 border border-slate-300 rounded-xl p-1"
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
              <p className="text-xs sm:text-[11px] text-slate-500 font-normal">
                File uploads are coming later. You can provide a résumé link for now.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
              <div>
                <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
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
                <label className="text-xs sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1 sm:mb-1.5 font-sans">
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
                <span>Sending application...</span>
              ) : (
                <>
                  <span>Submit 6-Week Internship Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {formStatus === "submitting" && <BrandLoader context="application" />}
            <p className="text-[11px] text-center text-slate-500 font-normal">
              By submitting, your application is saved for review by the Devatrix team.
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
