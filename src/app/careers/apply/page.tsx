"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  MessageCircle, 
  Building2,
  Calendar,
  Upload,
  FileText
} from "lucide-react";

const roleOptions = [
  "General / Future Engineering Roles",
  "Senior Distributed Systems Engineer",
  "Principal AI & Machine Learning Architect",
  "Senior Full-Stack Next.js Engineer",
  "Lead Cloud Platform & DevOps Engineer",
  "Mobile App Engineer (React Native / Flutter)",
  "Backend & Database Engineer (Node.js / Python / Go)",
  "Frontend React / Next.js Specialist",
  "Data Scientist / Predictive Modeler",
  "Data Analyst / Business Intelligence",
  "QA / Test Automation Engineer",
  "Other Specialization"
];

function CareerApplyFormContent() {
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "Lahore, Pakistan (or Remote)",
    role: roleOptions[0],
    experience: "1 to 3 Years (Junior Engineer)",
    previousCompany: "",
    previousSalary: "",
    expectedSalary: "",
    noticePeriod: "Immediate (Available Now)",
    linkedinUrl: "",
    githubUrl: "",
    resumeUrl: "",
    coverNote: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedApp, setSubmittedApp] = useState<{
    applicationId: string;
    fullName: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    if (initialRoleParam) {
      const matched = roleOptions.find(
        (r) => r.toLowerCase() === initialRoleParam.toLowerCase() ||
               r.toLowerCase().includes(initialRoleParam.toLowerCase())
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, role: matched }));
      }
    }
  }, [initialRoleParam]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");

    try {
      const submission = new FormData();
      submission.append("fullName", formData.fullName);
      submission.append("email", formData.email);
      submission.append("phone", formData.phone);
      submission.append("location", formData.location);
      submission.append("role", formData.role);
      submission.append("experience", formData.experience);
      submission.append("previousCompany", formData.previousCompany);
      submission.append("previousSalary", formData.previousSalary);
      submission.append("expectedSalary", formData.expectedSalary);
      submission.append("noticePeriod", formData.noticePeriod);
      submission.append("linkedinUrl", formData.linkedinUrl);
      submission.append("githubUrl", formData.githubUrl);
      submission.append("resumeUrl", formData.resumeUrl);
      submission.append("coverNote", formData.coverNote);
      if (resumeFile) {
        submission.append("resumeFile", resumeFile);
      }

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: submission,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormStatus("success");
        setSubmittedApp({
          applicationId: data.applicationId,
          fullName: formData.fullName,
          role: formData.role,
        });
      } else {
        setFormStatus("error");
        setErrorMessage(data.error || "Failed to submit your application. Please check your inputs.");
      }
    } catch (err: any) {
      console.error("Career submission error:", err);
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
          href="/careers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Open Positions & Culture</span>
        </Link>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-mono font-medium text-brand-800 mb-3">
          <Briefcase className="w-3.5 h-3.5 text-brand-600" />
          <span>OPEN TALENT INTAKE • ENGINEERING AT DEVATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
          Job Application at Devatrix
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Applying for a featured vacancy or submitting a general application to our talent pool? Share your background below.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
        {formStatus === "success" && submittedApp ? (
          <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                APPLICATION RECEIVED
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                Thank You, {submittedApp.fullName}!
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your application for <span className="font-bold text-slate-900">{submittedApp.role}</span> has been securely registered in our talent pipeline.
              </p>
            </div>

            {/* Candidate ID Display Box */}
            <div className="p-5 rounded-2xl bg-[#061833] text-white max-w-md mx-auto space-y-3 shadow-lg">
              <span className="text-[11px] font-mono text-slate-400 block tracking-wider uppercase">
                Official Application Reference ID
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-mono font-black text-brand-400 tracking-wider">
                  {submittedApp.applicationId}
                </span>
                <button
                  onClick={() => copyToClipboard(submittedApp.applicationId)}
                  className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
                  title="Copy Application ID"
                >
                  {copiedId ? "Copied!" : "Copy"}
                </button>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Save this reference ID for correspondence with our talent leads.
              </span>
            </div>

            {/* Next Steps Guidance */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2 text-xs text-slate-700">
              <span className="font-bold text-slate-900 font-sans block text-sm mb-1">
                What Happens Next:
              </span>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-brand-600">1.</span>
                <span>Our tech leads review your resume, experience, and GitHub/LinkedIn credentials.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-brand-600">2.</span>
                <span>Shortlisted candidates are invited for a 45-minute technical conversation.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-brand-600">3.</span>
                <span>General submissions remain in our active talent pool for priority consideration.</span>
              </div>
            </div>

            {/* Action Links */}
            <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs">
              <a
                href={`https://wa.me/923156179410?text=Hello%20Devatrix%20Technologies,%20I%20have%20submitted%20my%20job%20application%20with%20Reference%20ID:%20${submittedApp.applicationId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Talent Team (+92 315 6179410)</span>
              </a>
              <button
                onClick={() => {
                  setFormStatus("idle");
                  setSubmittedApp(null);
                  setResumeFile(null);
                  setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    location: "Lahore, Pakistan (or Remote)",
                    role: roleOptions[0],
                    experience: "1 to 3 Years (Junior Engineer)",
                    previousCompany: "",
                    previousSalary: "",
                    expectedSalary: "",
                    noticePeriod: "Immediate (Available Now)",
                    linkedinUrl: "",
                    githubUrl: "",
                    resumeUrl: "",
                    coverNote: "",
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

            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Qureshi"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="asad@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Phone & Current Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 3XX XXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  Current Location / City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lahore, Pakistan or Remote"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Target Role & Total Experience - Defined explicitly per user specification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  Target Role / Discipline *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  Total Professional Experience *
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                >
                  <option value="Fresher / Entry-Level (< 1 Year)">Fresher / Entry-Level (&lt; 1 Year)</option>
                  <option value="1 to 3 Years (Junior Engineer)">1 to 3 Years (Junior Engineer)</option>
                  <option value="3 to 5 Years (Mid-Level Engineer)">3 to 5 Years (Mid-Level Engineer)</option>
                  <option value="5+ Years (Senior / Lead Architect)">5+ Years (Senior / Lead Architect)</option>
                </select>
              </div>
            </div>

            {/* Previous Company & Job Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                Previous / Current Company & Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. Software Engineer at Systems Ltd / Freelance"
                value={formData.previousCompany}
                onChange={(e) => setFormData({ ...formData, previousCompany: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
              />
            </div>

            {/* Previous Salary & Expected Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  Current / Previous Salary (PKR / Mo)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 200,000 PKR or Confidential"
                  value={formData.previousSalary}
                  onChange={(e) => setFormData({ ...formData, previousSalary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  Expected Salary (PKR / Mo) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 300,000 PKR / Negotiable"
                  value={formData.expectedSalary}
                  onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Notice Period */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                Notice Period / Earliest Availability *
              </label>
              <select
                value={formData.noticePeriod}
                onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
              >
                <option value="Immediate (Available Now)">Immediate (Available Now)</option>
                <option value="1 to 2 Weeks">1 to 2 Weeks</option>
                <option value="30 Days (Standard Notice)">30 Days (Standard Notice)</option>
                <option value="More than 30 Days">More than 30 Days</option>
              </select>
            </div>

            {/* CV / Resume Upload & Link */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-sans">
                Resume / CV *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer bg-slate-50 border border-slate-300 rounded-xl p-1.5"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="Or paste Google Drive / Dropbox link"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Upload PDF/DOC (up to 10MB) or provide a public Google Drive / Dropbox link.
              </p>
            </div>

            {/* LinkedIn & GitHub Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  LinkedIn Profile URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/yourhandle"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                  GitHub Profile / Portfolio Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/yourhandle"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Short Summary Note */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 font-sans">
                Brief Note / Core Technical Strengths (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Briefly highlight your primary technical stack, proudest achievement, or reasons for applying to Devatrix..."
                value={formData.coverNote}
                onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
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
                  <span>Registering Application...</span>
                </span>
              ) : (
                <>
                  <span>Submit Job Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 font-normal">
              Your details are securely stored in our confidential talent registry and reviewed by our Principal Architects.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CareerApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <Navbar />
      <main className="flex-1 pt-20">
        <Suspense fallback={<div className="py-24 text-center text-xs font-mono text-slate-500">Loading Application Form...</div>}>
          <CareerApplyFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
