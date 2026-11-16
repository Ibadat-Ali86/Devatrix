"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExecutiveCTA from "@/components/ExecutiveCTA";
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  Cpu, 
  Award, 
  Clock, 
  Layers, 
  MapPin, 
  Info, 
  X, 
  Check, 
  HelpCircle, 
  Smartphone, 
  BarChart3, 
  PieChart, 
  FileText,
  Briefcase
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  category: string;
  badge: string;
  icon: any;
  desc: string;
  skills: string[];
  duration: string;
  commitment: string;
  prerequisites: string[];
  deliverables: { week: string; title: string; desc: string }[];
  outcomes: string[];
}

export default function InternshipsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalTrack, setModalTrack] = useState<Track | null>(null);
  const [cmsContent, setCmsContent] = useState<{ available: boolean; tracks: Array<{ id: string; title: string; summary: string; badge: string }>; announcement: { title: string; summary: string } | null } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/public/content", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (active && data) setCmsContent(data); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const categories = [
    "All",
    "Web & Full-Stack",
    "Artificial Intelligence",
    "AI Engineering & FDE",
    "DevOps & Cloud",
    "Data Science",
    "Data Analytics",
    "Mobile Apps"
  ];

  const tracks: Track[] = [
    {
      id: "web-fullstack",
      title: "Frontend & Full-Stack Web Engineering",
      category: "Web & Full-Stack",
      badge: "Next.js & React 19",
      icon: Code2,
      desc: "Learn to build high-performance web applications using modern React 19, Next.js App Router, TypeScript, and Tailwind CSS with real API integrations.",
      skills: ["React 19", "Next.js 14+", "TypeScript", "Tailwind CSS", "REST & GraphQL APIs"],
      duration: "6 Weeks (Intensive Virtual Sprint)",
      commitment: "6 to 8 Hours / Week (Flexible)",
      prerequisites: [
        "Core knowledge of HTML, CSS, and modern JavaScript (ES6+)",
        "Basic familiarity with React components, props, and hooks",
        "Understanding of Git version control and clean code principles"
      ],
      deliverables: [
        { week: "Weeks 1–2", title: "Component System & Responsive Layout", desc: "Build a production-grade UI design system with Tailwind CSS and responsive navigation." },
        { week: "Weeks 3–4", title: "State Architecture & REST API Hooks", desc: "Integrate asynchronous data fetching, dynamic pagination, and robust client-side validation." },
        { week: "Weeks 5–6", title: "Full-Stack SaaS MVP with Auth & DB", desc: "Deploy a live production full-stack application with database persistence and public URL." }
      ],
      outcomes: [
        "Verified Devatrix Certificate of Completion",
        "Distinguished 'Top Performer' Gold Badge for High Achievers",
        "Official Letter of Recommendation (LOR) for Top Performers",
        "Direct fast-track interview for junior developer roles"
      ]
    },
    {
      id: "ai-agents",
      title: "Applied AI & Agent Engineering",
      category: "Artificial Intelligence",
      badge: "LLM Apps, RAG & Evaluation",
      icon: Cpu,
      desc: "Build and evaluate a focused LLM application: connect a model API, ground answers in source material, add tool use, and ship a tested service.",
      skills: ["Python", "LLM APIs", "Prompt & Output Validation", "RAG & Vector Search", "FastAPI", "Evaluation & Guardrails"],
      duration: "6 Weeks (Intensive Virtual Sprint)",
      commitment: "6 to 8 Hours / Week (Flexible)",
      prerequisites: [
        "Working Python fundamentals: functions, modules, and virtual environments",
        "Basic HTTP, REST API, JSON, and Git knowledge",
        "A laptop able to run Python projects; model API use may require a provider account"
      ],
      deliverables: [
        { week: "Week 1", title: "Model APIs & Reliable Outputs", desc: "Call a hosted model from Python, manage configuration safely, validate structured responses, and record a small baseline evaluation set." },
        { week: "Week 2", title: "Search & Grounded Answers", desc: "Prepare a small document collection, compare chunking and retrieval choices, and return answers with source references." },
        { week: "Week 3", title: "Tools, Workflows & Guardrails", desc: "Add one bounded tool or workflow, validate inputs, handle failures, and require human review for consequential actions." },
        { week: "Week 4", title: "Service & Test Design", desc: "Expose the application through FastAPI, write tests for core paths, and handle timeouts and provider errors." },
        { week: "Week 5", title: "Evaluation & Deployment", desc: "Measure answer quality, latency, and token use on a fixed test set; package and deploy the service with logs and safe secret handling." },
        { week: "Week 6", title: "Capstone & Technical Review", desc: "Demonstrate a documented AI application with reproducible tests, known limitations, and a short evaluation report." }
      ],
      outcomes: [
        "A deployed, tested LLM application with a documented evaluation set",
        "Experience with retrieval, tool use, output validation, and failure handling",
        "A Git repository and concise architecture and limitations write-up",
        "Completion recognition based on the published program requirements"
      ]
    },
    {
      id: "data-science",
      title: "Machine Learning & Data Science",
      category: "Data Science",
      badge: "Python, Statistics & ML",
      icon: BarChart3,
      desc: "Take a supervised learning problem from data checks and a baseline through model validation, error analysis, and a reproducible final report.",
      skills: ["Python", "Pandas & NumPy", "Statistics", "Scikit-learn", "Feature Engineering", "Model Evaluation"],
      duration: "6 Weeks (Intensive Virtual Sprint)",
      commitment: "6 to 8 Hours / Week (Flexible)",
      prerequisites: [
        "Python basics: data types, functions, and working in notebooks",
        "High-school algebra and introductory statistics are helpful",
        "Comfort with CSV files and willingness to explain analytical choices"
      ],
      deliverables: [
        { week: "Week 1", title: "Problem Framing & Data Quality", desc: "Define a prediction question and target, inspect a provided dataset, and document missing values, leakage risks, and assumptions." },
        { week: "Week 2", title: "Exploration & Baselines", desc: "Use Pandas and visual summaries to understand distributions; build a simple baseline before more complex models." },
        { week: "Week 3", title: "Features & Reproducible Pipelines", desc: "Prepare numeric and categorical features with Scikit-learn pipelines and keep transformations inside the training workflow." },
        { week: "Week 4", title: "Model Training & Validation", desc: "Train suitable classification or regression models, select metrics tied to the problem, and validate with held-out data or cross-validation." },
        { week: "Week 5", title: "Error Analysis & Interpretation", desc: "Inspect false positives and missed cases, compare model behavior across relevant groups, and explain limits without overstating results." },
        { week: "Week 6", title: "Capstone & Reproducible Report", desc: "Deliver a clean notebook or Python package, saved evaluation results, and a short report covering performance and next steps." }
      ],
      outcomes: [
        "A reproducible supervised-learning project with a defensible baseline",
        "Practice selecting metrics, validating models, and analyzing errors",
        "A Git repository with data provenance, assumptions, and limitations documented",
        "Completion recognition based on the published program requirements"
      ]
    },
    {
      id: "data-analytics",
      title: "Data Analytics & Business Intelligence",
      category: "Data Analytics",
      badge: "SQL, Power BI & KPI Reporting",
      icon: PieChart,
      desc: "Turn a business question into a trusted analysis: query and model data, define clear KPIs, build a usable Power BI report, and explain findings.",
      skills: ["SQL", "Excel", "Power Query", "Power BI", "Data Modeling", "DAX Fundamentals", "Data Storytelling"],
      duration: "6 Weeks (Intensive Virtual Sprint)",
      commitment: "6 to 8 Hours / Week (Flexible)",
      prerequisites: [
        "Basic spreadsheet skills such as formulas, sorting, and filtering",
        "No prior SQL required; clear reasoning and attention to detail are expected",
        "Access to Power BI Desktop is recommended for the dashboard capstone"
      ],
      deliverables: [
        { week: "Week 1", title: "Business Questions & Spreadsheet Analysis", desc: "Translate a brief into measurable questions; inspect and clean a small dataset in Excel." },
        { week: "Week 2", title: "SQL for Analysis", desc: "Use SELECT, filters, joins, aggregations, CASE, and introductory CTEs to answer questions from relational data." },
        { week: "Week 3", title: "Data Quality & KPI Definitions", desc: "Check duplicates, missing values, and metric edge cases; write clear KPI definitions and assumptions." },
        { week: "Week 4", title: "Power Query & BI Data Models", desc: "Transform data in Power Query and build a simple star-schema model with appropriate relationships." },
        { week: "Week 5", title: "Power BI Measures & Reporting", desc: "Create core DAX measures, select readable visuals, and add filters that support common stakeholder questions." },
        { week: "Week 6", title: "Dashboard Review & Insight Brief", desc: "Present a checked dashboard, explain two evidence-backed findings, and list caveats and recommended follow-up analysis." }
      ],
      outcomes: [
        "A Power BI report with documented measures, data model, and assumptions",
        "Practice with SQL joins, data checks, KPI definitions, and business communication",
        "A short insight brief that distinguishes evidence from recommendation",
        "Completion recognition based on the published program requirements"
      ]
    },
    {
      id: "ai-fde",
      title: "AI Engineer & Forward Deployed Engineer (FDE)",
      category: "AI Engineering & FDE",
      badge: "Applied AI Delivery",
      icon: Cpu,
      desc: "Build a bounded AI solution around a real workflow: discover requirements, integrate APIs and data, evaluate behavior, and deploy a documented pilot.",
      skills: ["Python", "REST APIs", "LLM Integration", "Customer Discovery", "Docker", "Evaluation & Observability", "Technical Handover"],
      duration: "6 Weeks (Intensive Virtual Sprint)",
      commitment: "6 to 8 Hours / Week (Flexible)",
      prerequisites: [
        "Working knowledge of Python or TypeScript and Git",
        "Basic web APIs, JSON, and command-line familiarity",
        "Interest in translating user workflows into practical software; prior LLM experience is helpful, not required"
      ],
      deliverables: [
        { week: "Week 1", title: "Workflow Discovery & Success Measures", desc: "Interview a project stakeholder or use a supplied brief; map the current workflow, constraints, users, and measurable success criteria." },
        { week: "Week 2", title: "Solution Design & Data Integration", desc: "Propose a small architecture, identify data and access boundaries, and connect a sample API or approved dataset." },
        { week: "Week 3", title: "Applied AI Prototype", desc: "Build a scoped AI feature with validated inputs and outputs, clear fallback behavior, and human review where needed." },
        { week: "Week 4", title: "Evaluation & System Integration", desc: "Create representative test cases, assess quality and failure modes, and integrate the feature into a usable service or workflow." },
        { week: "Week 5", title: "Deployment & Operational Checks", desc: "Package and deploy a pilot using Docker or an approved platform; add basic logs, configuration checks, and a rollback note." },
        { week: "Week 6", title: "Customer Demo & Handover", desc: "Present the working pilot against agreed measures and hand over setup instructions, limitations, support notes, and next steps." }
      ],
      outcomes: [
        "A deployed pilot tied to a defined workflow and success criteria",
        "Experience combining AI application work with integration and delivery",
        "A test set, demo, and handover guide that make the work reviewable",
        "Completion recognition based on the published program requirements"
      ]
    },
    {
      id: "react-native",
      title: "React Native Mobile App Development",
      category: "Mobile Apps",
      badge: "iOS & Android (Expo & CLI)",
      icon: Smartphone,
      desc: "Develop high-performance cross-platform mobile apps for iOS and Android using React Native, TypeScript, Expo, and modern state management.",
      skills: ["React Native", "TypeScript", "Expo", "Redux Toolkit / Zustand", "REST APIs", "AsyncStorage"],
      duration: "6 Weeks (Intensive Virtual Sprint)",
      commitment: "6 to 8 Hours / Week (Flexible)",
      prerequisites: [
        "Good understanding of JavaScript / TypeScript and React fundamentals (JSX, hooks)",
        "Familiarity with mobile UI paradigms, flexbox layout, and touch interactions",
        "A physical smartphone (iOS/Android) with Expo Go or local emulator"
      ],
      deliverables: [
        { week: "Weeks 1–2", title: "Mobile UI Layout & Stack Navigation", desc: "Build responsive mobile screens with React Navigation (tabs, stacks) and custom UI styling." },
        { week: "Weeks 3–4", title: "State Management & REST API Hooks", desc: "Integrate dynamic API calls, data caching, offline persistence, and error boundaries." },
        { week: "Weeks 5–6", title: "Complete Production App & APK Build", desc: "Build an end-to-end mobile application with device permissions, push notifications, and release APK generation." }
      ],
      outcomes: [
        "Verified Devatrix Certificate of Completion",
        "Distinguished 'Top Performer' Gold Badge for High Achievers",
        "Installable Android APK and clean GitHub repository",
        "Direct consideration for junior mobile engineer openings"
      ]
    },
    {
      id: "flutter",
      title: "Flutter Mobile App Development",
      category: "Mobile Apps",
      badge: "Dart & Material UI",
      icon: Layers,
      desc: "Build beautiful, natively compiled multi-platform applications from a single codebase using Flutter, Dart, Provider/Bloc, and Firebase.",
      skills: ["Flutter", "Dart", "Provider / Bloc", "Firebase Auth & Firestore", "REST APIs", "Material & Cupertino UI"],
      duration: "6 Weeks (Intensive Virtual Sprint)",
      commitment: "6 to 8 Hours / Week (Flexible)",
      prerequisites: [
        "Basic programming knowledge in Dart, Java, C++, or OOP concepts",
        "Understanding of UI widget trees, stateful/stateless widgets",
        "Flutter SDK installed with Android Studio or VS Code"
      ],
      deliverables: [
        { week: "Weeks 1–2", title: "Widget Architecture & Custom Theme", desc: "Craft pixel-perfect Flutter UI layouts with smooth animations, custom themes, and navigation." },
        { week: "Weeks 3–4", title: "State Management & API / Firebase Sync", desc: "Manage application state with Provider/Bloc, connect to REST endpoints or Firebase Firestore." },
        { week: "Weeks 5–6", title: "Production Cross-Platform App & Release Build", desc: "Implement local caching with Hive/SQLite and generate signed APK releases." }
      ],
      outcomes: [
        "Verified Devatrix Certificate of Completion",
        "Distinguished 'Top Performer' Gold Badge for High Achievers",
        "Production mobile portfolio asset showcasing clean Dart architecture",
        "Priority interview pipeline for Flutter developer roles"
      ]
    },
    {
      id: "devops-engineering",
      title: "DevOps Engineer & Cloud Infrastructure",
      category: "DevOps & Cloud",
      badge: "Linux, Docker, CI/CD & Terraform",
      icon: Layers,
      desc: "Build a practical delivery pipeline: strengthen Linux and Git foundations, containerize an application, automate CI/CD, provision cloud infrastructure with Terraform, and deploy a monitored capstone.",
      skills: ["Linux & Bash", "Git & GitHub", "Docker & Compose", "GitHub Actions CI/CD", "Terraform (IaC)", "AWS or Azure fundamentals", "Kubernetes fundamentals", "Monitoring & runbooks"],
      duration: "6 Weeks (Intensive Virtual Sprint)",
      commitment: "6 to 8 Hours / Week (Flexible)",
      prerequisites: [
        "Basic programming or scripting familiarity and comfort using a terminal",
        "Basic Git knowledge; Linux administration and Kubernetes experience are not required",
        "A cloud account may be needed for the final lab; cloud usage can incur provider charges, so students must follow the cohort budget and cleanup guidance"
      ],
      deliverables: [
        { week: "Week 1", title: "Linux, Git & Networking Foundations", desc: "Use shell commands, permissions, processes, logs, Git branches and pull requests; trace a simple service across DNS, HTTP, and ports; write a repeatable setup script and troubleshooting notes." },
        { week: "Week 2", title: "Containerize an Application", desc: "Build and run a Docker image, configure environment variables safely, add a health check, and run an application with its dependency using Docker Compose." },
        { week: "Week 3", title: "Build a CI Pipeline", desc: "Create a GitHub Actions workflow that runs checks and tests on pull requests, builds a versioned container image, and keeps deployment credentials out of source control." },
        { week: "Week 4", title: "Infrastructure as Code with Terraform", desc: "Describe a small cloud environment in Terraform, inspect a plan before applying it, use variables and outputs, and document safe state and resource cleanup practices." },
        { week: "Week 5", title: "Deploy & Operate a Workload", desc: "Deploy the container to the cohort's selected cloud or sandbox environment; practice Kubernetes workload, service, rollout, and health-probe fundamentals in a local or provided cluster." },
        { week: "Week 6", title: "Capstone, Observability & Handover", desc: "Demonstrate the end-to-end pipeline, inspect logs and basic service health, document a rollback and incident checklist, review security and cost controls, and clean up lab resources." }
      ],
      outcomes: [
        "A version-controlled infrastructure and CI/CD project with a documented deployment path",
        "Hands-on practice with Linux, containers, Terraform, cloud fundamentals, and Kubernetes concepts",
        "A capstone runbook covering health checks, rollback, security, and cleanup",
        "Completion recognition based on the published program requirements"
      ]
    }
  ];

  const cmsTrackMap = new Map((cmsContent?.tracks ?? []).map((item) => [item.id, item]));
  const visibleTracks = cmsContent?.available
    ? tracks.flatMap((track) => {
        const item = cmsTrackMap.get(track.id);
        return item ? [{ ...track, title: item.title, desc: item.summary || track.desc, badge: item.badge || track.badge }] : [];
      })
    : tracks;
  const filteredTracks = selectedCategory === "All"
    ? visibleTracks
    : visibleTracks.filter(t => t.category === selectedCategory);

  // All 4 Highlights are highlighted with badges, amber borders, and balanced short descriptions
  const highlights = [
    {
      title: "Career Readiness & Interview Mastery",
      desc: "Receive curated ATS-ready CV templates, technical interview question blueprints, and 1-on-1 portfolio review.",
      badgeText: "CAREER TOOLKIT",
    },
    {
      title: "1-on-1 Architect Mentorship",
      desc: "Receive weekly code reviews, system design guidance, and best-practice feedback from tech leads.",
      badgeText: "DIRECT MENTORSHIP",
    },
    {
      title: "Merit-Based 'Top Performer' Honors",
      desc: "Top performers earn a prestigious gold badge on their official verified credential and an executive LOR.",
      badgeText: "PREMIUM DISTINCTION",
    },
    {
      title: "Direct Job Placement Pathway",
      desc: "High-performing cohort graduates are fast-tracked directly into Junior Software Engineer roles at Devatrix.",
      badgeText: "CAREER ACCELERATOR",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Online Application",
      desc: "Submit your details, background, and select your preferred 6-week engineering track."
    },
    {
      step: "02",
      title: "Offer Letter Dispatched",
      desc: "Approved applicants receive an official Devatrix Offer Letter via email within 2-3 days."
    },
    {
      step: "03",
      title: "Milestone Task Blueprints",
      desc: "Receive comprehensive architecture specifications and starter repositories for your track."
    },
    {
      step: "04",
      title: "Build & Commit Code",
      desc: "Develop production-ready features, push clean Git commits, and deploy live demonstrations."
    },
    {
      step: "05",
      title: "Senior Code Review",
      desc: "Engineering leads audit your pull requests, security practices, code modularity, and tests."
    },
    {
      step: "06",
      title: "Verified Certificate & Honors",
      desc: "Graduate with a permanent credential, 'Top Performer' gold badge distinction, and job fast-track."
    }
  ];

  const faqs = [
    {
      q: "Is this internship 100% remote or on-site in Lahore?",
      a: "The program is 100% remote-first! Students and graduates from Lahore and all across Pakistan (and internationally) can complete the internship without relocating. Remote standups and mentorship happen via Slack and Google Meet."
    },
    {
      q: "What is the duration and weekly time commitment?",
      a: "The internship is a structured 6-week intensive engineering sprint requiring approximately 6 to 8 hours per week. It is completely flexible and self-paced so you can easily balance university coursework, midterms, and semester exams."
    },
    {
      q: "Will I receive a certificate or Letter of Recommendation (LOR)?",
      a: "Yes! Every candidate who completes all 6-week milestones receives an official, tamper-proof Devatrix Certificate of Completion with a unique Verification ID. Exceptional interns who demonstrate outstanding technical execution are awarded a premium certificate with a prestigious 'Top Performer' gold badge and an executive Letter of Recommendation (LOR) signed by our Principal Architect."
    },
    {
      q: "Who is eligible to apply?",
      a: "Undergraduate and graduate students pursuing CS, SE, IT, Data Science, or related engineering degrees, as well as fresh graduates and passionate self-taught developers with a public GitHub presence or coding background."
    },
    {
      q: "How will my submission be verified?",
      a: "Once you submit the online application form, your application is received for review by our team."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-obsidian-950">
      <Navbar />

      <main className="flex-1 pt-14 sm:pt-20">
        {cmsContent?.announcement && <aside className="flex items-center justify-center gap-2 bg-amber-400 px-4 py-3 text-center text-sm font-semibold text-[#071a36]"><Sparkles className="h-4 w-4 shrink-0" aria-hidden="true"/><span>{cmsContent.announcement.title}{cmsContent.announcement.summary ? ` — ${cmsContent.announcement.summary}` : ""}</span></aside>}
        
        {/* Hero Section (#061833) */}
        <section className="relative py-20 sm:py-24 bg-[#061833] text-white overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-300">
              <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
              <span>DEVATRIX ACCELERATOR • BATCH 2026 APPLICATIONS OPEN</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Software Engineering Internships. <br />
              <span className="text-brand-500">Fast-Track Your Tech Career.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Bridge the gap between academic coursework and real production systems. In 6 intensive weeks, build live SaaS platforms, applied AI chatbots, mobile apps, data science models, or BI analytics under 1-on-1 architect mentorship.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                Lahore, Pakistan & 100% Remote
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                6 Weeks (Structured Virtual Sprint)
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Award className="w-3.5 h-3.5 text-brand-400" />
                Verified Certificate & Top Performer Honors
              </span>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/internships/apply"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-500/25 font-sans"
              >
                <span>Apply for Internship</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#tracks"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs tracking-wider transition-all font-sans"
              >
                <span>Explore {visibleTracks.length} Specialized Tracks</span>
              </a>
            </div>
          </div>
        </section>

        {/* Program Highlights - ALL 4 Highlighted with Amber Badges & Balanced Short Lines */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 block mb-2">
                WHY CHOOSE DEVATRIX
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                Engineered for Developers Who Want Real Impact
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-b from-brand-50/60 to-white border-2 border-brand-500/80 shadow-md shadow-brand-500/10 ring-1 ring-brand-500/20 transition-all space-y-2 sm:space-y-3 relative flex flex-col justify-between"
                >
                  <div className="space-y-1.5 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-brand-500 text-obsidian-950 shadow-sm flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-xs sm:text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-brand-500 text-obsidian-950">
                        {item.badgeText}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-lg font-bold text-slate-900 font-sans leading-snug">{item.title}</h3>
                    <p className="text-xs sm:text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6-Step Visual Journey Stepper */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 block mb-2">
                ROADMAP & CURRICULUM
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                The 6-Step Devatrix Internship Journey
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                A structured, outcome-driven 6-week engineering sprint from application to verified credential.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {steps.map((st) => (
                <div
                  key={st.step}
                  className="group relative flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-brand-400/60 hover:bg-white sm:p-7"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <span className="text-xl font-bold font-mono tracking-tight text-brand-600 sm:text-2xl">
                        {st.step}
                      </span>
                      <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 text-xs sm:text-xs font-mono font-bold">
                        ✓
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 font-sans">{st.title}</h3>
                    <p className="text-sm leading-6 text-slate-600 font-normal">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialized Tracks Catalog */}
        <section id="tracks" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 block mb-2">
              SPECIALIZED DISCIPLINES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
              Choose Your 6-Week Internship Track
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Select your focus area to view 6-week curriculum specifications, deliverables, and prerequisites.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold font-sans transition-all border ${
                  selectedCategory === cat
                    ? "bg-[#061833] text-white border-[#061833] shadow-md shadow-[#061833]/20"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Track Cards Grid - Exactly 3 columns on all screens (3 on top, 3 on bottom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
            {filteredTracks.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  className="p-2 sm:p-7 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500/50 hover:bg-white hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <span className="text-xs sm:text-xs font-mono font-bold text-brand-700 bg-brand-50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-brand-200 truncate max-w-[80%]">
                        {t.badge}
                      </span>
                      <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-brand-600 shrink-0" />
                    </div>

                    <h3 className="text-[11px] sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2 font-sans leading-tight line-clamp-2">
                      {t.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2 sm:mb-6 font-normal line-clamp-2 sm:line-clamp-none">
                      {t.desc}
                    </p>

                    <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-6 pt-1.5 sm:pt-4 border-t border-slate-200 text-xs sm:text-xs text-slate-600">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-500">Duration:</span>
                        <span className="font-semibold text-slate-800">6 Weeks</span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-500">Commit:</span>
                        <span className="font-semibold text-slate-800">6-8h/wk</span>
                      </div>
                    </div>

                    <div className="mb-2 sm:mb-6 hidden sm:block">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 font-sans">
                        Technologies & Tools:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {t.skills.map((s) => (
                          <span
                            key={s}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-3">
                    <button
                      onClick={() => setModalTrack(t)}
                      className="flex-1 py-1 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs sm:text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">Syllabus</span>
                    </button>
                    <Link
                      href={`/internships/apply?track=${encodeURIComponent(t.title)}`}
                      className="flex-1 py-1 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-brand-500 hover:bg-brand-600 text-obsidian-950 text-xs sm:text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-md shadow-brand-500/20"
                    >
                      <span className="truncate">Apply</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Apply Callout Banner */}
          <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-[#061833] text-white border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
                BATCH 2026 INTAKE
              </span>
              <h3 className="text-2xl font-black font-sans text-white">
                Ready to Accelerate Your Engineering Career?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Applications are reviewed on a rolling basis. Submit your details to secure your spot in the upcoming cohort.
              </p>
            </div>
            <Link
              href="/internships/apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/25 shrink-0"
            >
              <span>Click to Apply</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Modal: Interactive Track Detail (Syllabus & Deliverables) */}
        {modalTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative p-6 sm:p-8 space-y-6">
              {/* Modal Close Button */}
              <button
                onClick={() => setModalTrack(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div>
                <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200 inline-block mb-3">
                  {modalTrack.badge}
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-sans">
                  {modalTrack.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {modalTrack.desc}
                </p>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block font-mono">Format & Location</span>
                  <span className="font-bold text-slate-900 font-sans">100% Virtual / Remote</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-mono">Duration</span>
                  <span className="font-bold text-slate-900 font-sans">{modalTrack.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-mono">Weekly Commitment</span>
                  <span className="font-bold text-slate-900 font-sans">{modalTrack.commitment}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-mono">Mentorship</span>
                  <span className="font-bold text-slate-900 font-sans">1-on-1 Code Reviews</span>
                </div>
              </div>

              {/* Prerequisites */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 font-sans">
                  Prerequisites & Foundation:
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {modalTrack.prerequisites.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Milestone Deliverables Breakdown (6 Weeks) */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 font-sans">
                  6-Week Milestone Sprint Deliverables:
                </h4>
                <div className="space-y-3">
                  {modalTrack.deliverables.map((d, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-brand-700">{d.week}</span>
                        <span className="font-bold text-slate-900">{d.title}</span>
                      </div>
                      <p className="text-slate-600 font-normal leading-relaxed">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion Benefits & Top Performer Badge */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 font-sans">
                  Graduation Outcomes & Honors:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {modalTrack.outcomes.map((o, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">{o}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Action CTA */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setModalTrack(null)}
                  className="px-5 py-2.5 rounded-full text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Close
                </button>
                <Link
                  href={`/internships/apply?track=${encodeURIComponent(modalTrack.title)}`}
                  className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-obsidian-950 text-xs font-bold transition-all shadow-md shadow-brand-500/25 flex items-center gap-2"
                >
                  <span>Apply for this Track</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 block mb-2">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-sans">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((f, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <h3 className="text-base font-bold text-slate-900 font-sans">{f.q}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8 font-normal">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Executive CTA */}
        <ExecutiveCTA />

      </main>

      <Footer />
    </div>
  );
}
