# Devatrix Technologies • System Architecture & Platform Documentation
**Corporate Platform Specification & Future Portal Architectural Blueprint**  
*Document Version: 1.0.0 • Published: November 2026 • Status: Production & Approved*

---

## Executive Summary

Devatrix Technologies is an elite, remote-first modern software house founded in **2022** and based in **Lahore, Pakistan**. Devatrix builds mission-critical digital products, high-throughput backend APIs, applied artificial intelligence workflows, data science platforms, and scalable cross-platform mobile applications for high-growth startups and global enterprises.

This technical documentation provides a dual-part reference:
1. **Part I: Complete Web Platform Architecture** — Comprehensive documentation of the public corporate website, design system, theme tokens, navigation, route inventory, interactive modals, form lifecycles, and data storage workflows.
2. **Part II: Future Independent Portal System Blueprint** — Exhaustive architectural specification for the upcoming standalone Devatrix Candidate & Cohort Management Portal (`portal.devatrix.com`), detailing identity management, 6-week milestone tracking, automated credentialing with "Top Performer" honors, database schemas, and operational dashboards.

---

## Corporate Directory & Contact Metadata

| Attribute | Official Verified Value |
| :--- | :--- |
| **Organization Name** | Devatrix Technologies |
| **Established Year** | 2022 |
| **Operating Model** | Modern Software House • Remote-First |
| **Headquarters** | Lahore, Pakistan |
| **Primary Email** | `devatrixtechnologies@gmail.com` |
| **Official WhatsApp** | `+92 315 6179410` |
| **LinkedIn Page** | [linkedin.com/company/devatrix-technologies/](https://www.linkedin.com/company/devatrix-technologies/) |
| **Instagram Profile** | [instagram.com/devatrix_technologies](https://www.instagram.com/devatrix_technologies?srtk=aHNrM2N2ZGF2OHY5) |
| **GitHub Repository** | [github.com/umairulhassancs/Devatrix](https://github.com/umairulhassancs/Devatrix) |
| **Production Metric** | 90+ Projects Delivered • 99.4% SLA • \$14M+ Client Value |

---

# Part I: Web Platform Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │               Devatrix Web Platform                    │
                    │               (Next.js 14 App Router)                  │
                    └──────────────────────────┬─────────────────────────────┘
                                               │
             ┌─────────────────────────────────┼────────────────────────────────┐
             │                                 │                                │
             ▼                                 ▼                                ▼
   ┌───────────────────┐             ┌───────────────────┐            ┌───────────────────┐
   │   Public Routes   │             │ Dedicated Portals │            │  Serverless APIs  │
   ├───────────────────┤             ├───────────────────┤            ├───────────────────┤
   │ / (Home)          │             │ /internships      │            │ /api/internships/ │
   │ /services         │             │ /internships/apply│            │       apply       │
   │ /work             │             │ /careers          │            │ /api/careers/     │
   │ /about            │             │ /careers/apply    │            │       apply       │
   │ /vanguard         │             └─────────┬─────────┘            └─────────┬─────────┘
   │ /verify           │                       │                                │
   │ /estimator        │                       └────────────────┬───────────────┘
   │ /contact          │                                        │
   │ /privacy & /terms │                                        ▼
   └───────────────────┘                      ┌──────────────────────────────────┐
                                              │    Dual Persistence Engine       │
                                              ├──────────────────────────────────┤
                                              │ 1. Local JSON (data/*.json)      │
                                              │ 2. Resumes (public/uploads/)     │
                                              │ 3. Google Sheets Webhook (Async) │
                                              └──────────────────────────────────┘
```

### 1. Technology Stack

- **Framework**: Next.js 14.2.18 (App Router, Server Components & Client Hydration)
- **Language**: TypeScript 5.x (Strict type safety across routes and handlers)
- **Styling**: Tailwind CSS 3.4.1 (Utility-first, responsive dark theme tokens)
- **Iconography**: Lucide React (Ultra-lightweight tree-shaken SVG icons)
- **Runtime**: Node.js 18+ / 20+ Serverless Execution
- **Deployment Target**: Vercel Cloud Platform with Edge Caching & Automated CI/CD

---

### 2. Design System & Theme Tokens

The Devatrix user interface is built upon a **Deep Midnight Navy** aesthetic accented by **Electric Blue** and **Merit Gold/Amber**.

#### 2.1 Color Palette

| Token Name | Hex Code | Tailwind Equivalent | Role & Application |
| :--- | :--- | :--- | :--- |
| **Deep Void** | `#030712` | `gray-950` | Primary page canvas background |
| **Midnight Navy** | `#0B132B` | `navy-950` | Radial hero glows, card bases, headers |
| **Surface Dark** | `#0F172A` | `slate-900` | Primary container & card surface fill |
| **Surface Elevated**| `#1E293B` | `slate-800` | Interactive card hovers, modal overlays |
| **Border Subtle** | `rgba(255,255,255,0.06)` | `white/5` | Muted division lines, HUD borders |
| **Border Highlight**| `rgba(255,255,255,0.12)` | `white/10` | Card borders, form input outlines |
| **Primary Accent** | `#3B82F6` | `blue-500` | Buttons, links, primary highlights |
| **Accent Glow** | `#2563EB` | `blue-600` | Focused button states, radial gradients |
| **Merit Gold** | `#F59E0B` | `amber-500` | Top Performer badge, honors highlights |
| **Deep Amber** | `#D97706` | `amber-600` | Badge borders, high-impact cards |
| **Text Primary** | `#F8FAFC` | `slate-50` | Headings, titles, high-contrast labels |
| **Text Secondary**| `#94A3B8` | `slate-400` | Body copy, descriptions, placeholders |
| **Text Muted** | `#64748B` | `slate-500` | Captions, secondary timestamps, tags |

#### 2.2 Typography
- **Primary Body & Headings**: Geist Sans (`font-sans`), with fallbacks `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- **Telemetry & Monospace**: Geist Mono (`font-mono`), applied to candidate IDs, duration badges, tech pills, and telemetry HUD indicators.

#### 2.3 Glassmorphism & UI Accents
- **Glassmorphic Hud**: Background `rgba(15, 23, 42, 0.75)` with `backdrop-filter: blur(16px)` and `border: 1px solid rgba(255, 255, 255, 0.08)`.
- **Card Hover Effects**: Subtle scale `hover:scale-[1.01]`, border transition to `border-blue-500/30`, and amber accent elevation `border-amber-500/40`.

---

### 3. Global Structural Components

#### 3.1 Global Navigation Header (`src/components/Navbar.tsx`)
The navbar floats persistently at the viewport top with automated scroll-aware backdrop blurring:
- **Brand Identity**: Features the Devatrix vector logo and clean sans typography with "EST. 2022" badge.
- **Navigation Links**:
  - `Services` (`/services`)
  - `Work` (`/work`)
  - `About` (`/about`)
  - `Internships` (`/internships`) — Highlighted with an animated pulsing indicator
  - `Careers` (`/careers`)
  - `Vanguard` (`/vanguard`)
  - `Verify` (`/verify`)
  - `Estimator` (`/estimator`)
- **Direct Actions**: "Initialize Project" button routing directly to `/contact`.
- **Mobile Navigation Drawer**: Fully responsive slide-down menu featuring one-touch navigation and quick links to WhatsApp and LinkedIn.

#### 3.2 Global Footer (`src/components/Footer.tsx`)
The footer anchors the platform with corporate governance, contact metadata, and technical status:
- **Corporate Info**: Devatrix Technologies, Established 2022. Modern Software House • Lahore, Pakistan (Remote-First).
- **Communication Hub**:
  - WhatsApp: `+92 315 6179410` (Direct `https://wa.me/923156179410` action)
  - Official Email: `devatrixtechnologies@gmail.com`
  - Instagram: `https://www.instagram.com/devatrix_technologies?srtk=aHNrM2N2ZGF2OHY5`
  - LinkedIn: `https://www.linkedin.com/company/devatrix-technologies/`
- **Sitemap Links**: Solutions, Platform, Company, Careers, Internships, Terms of Service, Privacy Policy.
- **Telemetry HUD**: Displays real-time operational status: `All Systems Operational • Node: LHE-01`.

---

### 4. Page-by-Page Technical Directory

#### 4.1 Home Page (`/`)
- **Hero Section**: High-impact enterprise headline, "90+ Projects Delivered" trust badge, call-to-action buttons for Project Initiation and Internship/Careers explorer.
- **Technology HUD**: 6 symmetric technology cards highlighting SaaS & MVP Development, AI & Custom Chatbots, Machine Learning & Data Science, Enterprise Cloud & DevOps, High-Performance APIs, and Web & Mobile Applications.
- **Trust Ticker**: 4 empirical metrics: 90+ Projects Delivered, 99.4% Production Uptime SLA, \$14M+ Client Value Unlocked, 12+ Enterprise Partners.
- **Core Capabilities & Featured Work**: Interactive project showcases with metrics, deliverable summaries, and technology stacks.
- **Why Devatrix**: Technical differentiation matrix comparing Devatrix's senior engineering culture versus traditional offshore agencies.

#### 4.2 Services Catalog (`/services`)
Comprehensive breakdown of engineering offerings, architectural deliverables, and technology stacks:
1. SaaS & MVP Development
2. AI & Custom Chatbots (RAG, LLM orchestration, custom tool calling)
3. Machine Learning & Predictive Data Science
4. Enterprise Cloud & DevOps (AWS, Docker, CI/CD, Terraform)
5. High-Throughput APIs & Distributed Microservices
6. Cross-Platform Mobile Apps (React Native & Flutter)

#### 4.3 Portfolio & Case Studies (`/work`)
In-depth production case studies detailing client challenges, architectural solutions, technology matrices, and empirical outcomes.

#### 4.4 About Us (`/about`)
Narrative of Devatrix's founding in 2022 in Lahore, Pakistan, engineering philosophy, remote-first operational framework, and leadership standards.

#### 4.5 Vanguard Engineering (`/vanguard`)
High-intensity acceleration program for high-velocity software delivery, dedicated tech leads, and zero-compromise architectural blueprints.

#### 4.6 Credential Verification Lookup (`/verify`)
Public lookup engine enabling clients, recruiters, and institutions to verify issued credentials and letters of recommendation by entering their unique ID (e.g., `DEV-INT-2026-XXXX`).

#### 4.7 Project Estimator (`/estimator`)
Interactive client-facing calculator calculating realistic budget ranges and timeline estimates based on project scope, platform selection, authentication requirements, and AI integrations.

#### 4.8 Contact & Inquiries (`/contact`)
Business inquiry form, direct WhatsApp initiation, email routing, and consultation calendar integration.

#### 4.9 Legal Governance (`/privacy` & `/terms`)
Formal privacy policies and terms of service governing client data confidentiality, intellectual property ownership, remote engineering SLAs, and candidate data retention.

---

### 5. Specialized Portals: Internships & Careers

#### 5.1 Internships Portal (`/internships`)
Designed to cultivate top-tier engineering talent through rigorous, real-world project sprints.

##### 5.1.1 The 4 Merit Feature Highlight Cards
The internships page features 4 prominent cards with **Amber/Gold borders and distinct badges**:
1. **CAREER TOOLKIT**: "Resume & Technical Interview Mastery" — Guided portfolio reviews, CV optimization, and mock technical interview sessions.
2. **DIRECT MENTORSHIP**: "Senior Engineering Guidance" — Weekly 1-on-1 code reviews with staff engineers and architectural feedback.
3. **PREMIUM DISTINCTION**: "Merit-Based 'Top Performer' Honors" — Top performers earning a prestigious gold badge on official verified credentials plus an executive Letter of Recommendation.
4. **CAREER ACCELERATOR**: "Direct Job Placement Pathway" — Fast-track transition into Junior Software Engineer and Associate positions at Devatrix.

##### 5.1.2 The 7 Specialized 6-Week Tracks
Every track is strictly standardized to a **6-Week Duration** (6 to 8 Hours/Week) with interactive syllabus inspection modals:
1. **Frontend & Full-Stack Engineering**: Next.js 14, React 18, TypeScript, Tailwind CSS, REST APIs.
2. **Backend & Cloud Architecture**: Node.js, Python, PostgreSQL, Redis, Docker, Microservices.
3. **Artificial Intelligence & Custom Agents**: OpenAI API, LangChain, RAG Pipelines, Vector DBs, Prompt Engineering.
4. **Data Science & Predictive Modeling**: Python, Pandas, Scikit-Learn, Feature Engineering, Model Deployment.
5. **Data Analytics & Business Intelligence**: SQL, Tableau/PowerBI, Data Warehousing, Metric Modeling.
6. **React Native Mobile App Development**: React Native, Expo, Mobile Navigation, Offline Sync, Native Modules.
7. **Flutter Mobile App Development**: Dart, Flutter Framework, Provider/Bloc, Material 3, Cross-Platform Deployment.

##### 5.1.3 Dedicated Application Flow (`/internships/apply`)
- Navigating from any track button passes the track name in the URL (e.g., `/internships/apply?track=Flutter+Mobile+App+Development`).
- The track dropdown is automatically pre-selected while remaining editable.
- **Form Fields**: Full Name, Email, WhatsApp Number, University/Institution, Track, 6-Week Duration (fixed), Optional Resume Upload (`.pdf, .doc, .docx`), Optional Cloud Resume Link (Google Drive / Dropbox), Optional GitHub URL, Optional LinkedIn URL, Optional Portfolio URL, Personal Statement.

#### 5.2 Careers Portal (`/careers`)
The careers portal targets experienced software engineers, architects, and technical leaders.

##### 5.2.1 Standardized Experience Tiers
1. **Fresher / Entry-Level (< 1 Year)**
2. **1 to 3 Years (Junior Engineer)**
3. **3 to 5 Years (Mid-Level Engineer)**
4. **5+ Years (Senior / Lead Architect)**

##### 5.2.2 Dedicated Career Application Flow (`/careers/apply`)
- Supports direct linking from open roles (e.g., `/careers/apply?role=Senior+Full-Stack+Next.js+Engineer`).
- **Comprehensive Fields**:
  - Full Name, Email, Phone/WhatsApp, Current Location
  - Target Role & Experience Tier
  - Previous / Current Company
  - Previous / Current Compensation
  - Expected Compensation
  - Notice Period (Immediate, 15 Days, 30 Days, 60 Days)
  - Resume Upload & Cloud Document Link
  - LinkedIn Profile & GitHub Handle
  - Professional Cover Note

---

### 6. Form Architecture & Data Ingestion Engine

```
 [ Candidate Submits Form ]
             │
             ▼
 [ Client Validation & FormData ]
             │
             ▼ POST to /api/internships/apply or /api/careers/apply
             │
 ┌───────────┴───────────────────────────────────────────────────────┐
 │ Next.js API Server Route                                          │
 │                                                                   │
 │ 1. Validate mandatory fields (Name, Email, WhatsApp, Role/Track)  │
 │ 2. Generate Unique ID:                                            │
 │    • Internships: DEV-INT-2026-XXXX                               │
 │    • Careers:     DEV-JOB-2026-XXXX                               │
 │ 3. Process File Upload (if attached):                             │
 │    • Sanitize filename with timestamp                             │
 │    • Stream to public/uploads/resumes/                            │
 │ 4. Persist to Local JSON:                                         │
 │    • data/internship-applications.json OR                         │
 │    • data/career-applications.json                                │
 │ 5. Trigger Async Google Sheets Webhook (Isolated try-catch):      │
 │    • Stream payload to Google Apps Script                         │
 │ 6. Return HTTP 200 JSON with tracking ID & timestamp              │
 └───────────────────────────────────────────────────────────────────┘
```

#### 6.1 Server API Routes
- **Internships Endpoint**: `src/app/api/internships/apply/route.ts`
- **Careers Endpoint**: `src/app/api/careers/apply/route.ts`

#### 6.2 Application ID Generation Logic
```typescript
// Algorithm: Brand Prefix + Department Code + Current Year + 4-Digit Entropy
const randomPin = Math.floor(1000 + Math.random() * 9000);
const trackingId = `DEV-INT-2026-${randomPin}`; // or DEV-JOB-2026-${randomPin}
```

#### 6.3 Dual Storage Mechanism
1. **Local Persistent Storage**: All submissions are appended to structured JSON arrays in `data/internship-applications.json` and `data/career-applications.json`.
2. **File Storage**: Uploaded resumes are securely written to `public/uploads/resumes/`.
3. **Google Sheets Webhook Sync**: If `GOOGLE_SHEETS_WEBHOOK_URL` is configured in environment variables, the server asynchronously dispatches a POST request with the complete application payload. The call is non-blocking so webhook latencies never degrade the user experience.

---

# Part II: Future Independent Portal System Architecture

> [!IMPORTANT]
> **Architectural Boundary**: Per product requirements, the Devatrix Portal is an **independent, standalone platform** hosted separately (e.g., `portal.devatrix.com`). It is decoupled from the marketing website, maintaining its own database, authentication authority, and state management.

```
                               ┌────────────────────────────────────────────────────────┐
                               │           Devatrix Autonomous Portal                   │
                               │             (portal.devatrix.com)                      │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                    ┌─────────────────────────────────────┼────────────────────────────────────┐
                    │                                     │                                    │
                    ▼                                     ▼                                    ▼
       ┌─────────────────────────┐           ┌─────────────────────────┐          ┌─────────────────────────┐
       │   Candidate / Intern    │           │     Mentor / Reviewer   │          │     Admin / HR Lead     │
       │        Dashboard        │           │         Cockpit         │          │       Command HUD       │
       ├─────────────────────────┤           ├─────────────────────────┤          ├─────────────────────────┤
       │ • Application Tracker   │           │ • Code Review Queue     │          │ • Kanban Pipeline       │
       │ • 6-Week Milestone Hub  │           │ • Milestone Grading     │          │ • Automated Certificate │
       │ • GitHub PR Commit Sync │           │ • Feedback Annotations  │          │   & LOR Generation      │
       │ • Verified Credential   │           │ • Top Performer Voting  │          │ • Google Sheets Bi-Sync │
       │   & "Top Performer" Card│           └─────────────────────────┘          │ • WhatsApp Bulk Alerts  │
       └─────────────────────────┘                                                └─────────────────────────┘
                                                          │
                                                          ▼
                               ┌────────────────────────────────────────────────────────┐
                               │             Supabase / PostgreSQL Database             │
                               │          (Row-Level Security & Real-Time Sync)         │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                               ┌──────────────────────────┴─────────────────────────────┐
                               │                                                        │
                               ▼                                                        ▼
                 ┌───────────────────────────┐                            ┌───────────────────────────┐
                 │    Cloudflare R2 / S3     │                            │     Inngest / BullMQ      │
                 │   (Resumes, PDFs, Keys)   │                            │  (Automated Cert Issuance)│
                 └───────────────────────────┘                            └───────────────────────────┘
```

---

### 1. System Vision & Objectives

The Devatrix Portal is designed as a centralized platform for:
1. **End-to-End Application Tracking**: Providing transparent, stage-by-stage status progression for applicants.
2. **6-Week Milestone Delivery Engine**: Tracking weekly deliverables, GitHub commits, and code quality.
3. **Automated Credentialing & Honors Verification**: Issuing cryptographically verifiable certificates and executive Letters of Recommendation with "Top Performer" gold distinctions.
4. **Talent Pipeline Conversion**: Automatically routing exemplary interns directly into Devatrix hiring workflows.

---

### 2. User Roles & Access Control (RBAC)

| Role | Permissions & Capabilities |
| :--- | :--- |
| **Applicant** | View submitted application status, upload supplemental documents, complete technical screening quizzes. |
| **Active Intern** | Access track curriculum, submit weekly GitHub pull requests, view mentor reviews, track milestone scores, access final certificates. |
| **Mentor / Reviewer** | Inspect candidate submissions, conduct code reviews on PRs, assign milestone grades, nominate for "Top Performer" honors. |
| **Admin / HR Lead** | Full administrative control: manage track openings, advance applicants along the Kanban pipeline, issue bulk certificates, trigger WhatsApp/email notifications, view analytics. |

---

### 3. Core Functional Modules

#### 3.1 Authentication & Identity Provider
- **OAuth Providers**: GitHub (primary for engineering profile sync) and Google.
- **Passwordless Magic Links**: Direct login via verified email addresses.
- **Profile Synchronization**: Automatic extraction of candidate GitHub repositories, commit history, and public stats.

#### 3.2 Application & Admissions Pipeline
- **Status Progression States**:
  1. `APPLICATION_SUBMITTED`
  2. `SCREENING_PASSED`
  3. `TECHNICAL_ASSESSMENT` (Coding quiz or take-home project)
  4. `INTERVIEW_SCHEDULED`
  5. `COHORT_ACCEPTED`
  6. `COHORT_ACTIVE`
  7. `GRADUATED` / `TOP_PERFORMER_HONORED`
  8. `HIRED_INTO_DEVATRIX`
- **Interactive Candidate Timeline**: Real-time visual timeline showing current stage, reviewer notes, and scheduled milestones.

#### 3.3 6-Week Milestone & Learning Hub
Structured around the 3 two-week sprints:
- **Phase 1: Foundation & Architecture (Weeks 1–2)**
  - Submission: Repository architecture setup, database schema design, core project scaffolding.
  - Verification: Automated CI check verifying linting, TypeScript compilation, and Docker configuration.
- **Phase 2: Core Feature Implementation (Weeks 3–4)**
  - Submission: Working business logic, API integrations, responsive client UI, state management.
  - Verification: Mentor review focusing on code cleanliness, error handling, and component modularity.
- **Phase 3: Production Hardening & CI/CD (Weeks 5–6)**
  - Submission: Live cloud deployment (Vercel/AWS), unit/integration test coverage, performance optimization report.
  - Verification: Final production review and scoring against industry standards.

#### 3.4 Automated GitHub Webhook Integration
- Interns connect their personal GitHub project repository.
- GitHub webhooks automatically stream:
  - Commit frequency and volume.
  - Pull request descriptions and branch hygiene.
  - Automated CI test passing badges.

#### 3.5 Automated Credentialing & "Top Performer" Engine
1. **Certificate Generation**:
   - Automated vector PDF rendering with high-resolution Devatrix corporate crest, unique serial number (`DEV-INT-2026-XXXX`), cryptographic signature, and dynamic QR code.
   - Verification slug automatically synchronizes with the public website's verification route: `https://devatrixtechnologies.com/verify?id=DEV-INT-2026-XXXX`.
2. **"Top Performer" Honors Badge**:
   - Interns achieving a cumulative milestone score in the top 10th percentile automatically receive a gold metallic seal on their certificate.
   - Triggers the generation of an **Executive Letter of Recommendation (LOR)** signed by the Chief Technology Officer and Engineering Director.

---

### 4. Database Architecture & Complete Schema

Recommended Database: **PostgreSQL via Supabase** with Row Level Security (RLS) policies.

```sql
-- 1. Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    role VARCHAR(50) DEFAULT 'APPLICANT' CHECK (role IN ('APPLICANT', 'INTERN', 'MENTOR', 'ADMIN')),
    github_username VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Internship Applications
CREATE TABLE internship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. DEV-INT-2026-1042
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    track VARCHAR(100) NOT NULL,
    duration VARCHAR(50) DEFAULT '6 Weeks',
    university VARCHAR(255) NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    personal_statement TEXT,
    status VARCHAR(50) DEFAULT 'SUBMITTED' CHECK (status IN (
        'SUBMITTED', 'UNDER_REVIEW', 'ASSESSMENT_PENDING', 
        'INTERVIEW_SCHEDULED', 'OFFER_EXTENDED', 'ENROLLED', 'REJECTED'
    )),
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Cohorts & Tracks
CREATE TABLE cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. COHORT-2026-Q1
    title VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Cohort Enrollments
CREATE TABLE cohort_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_id UUID REFERENCES cohorts(id),
    user_id UUID REFERENCES users(id),
    track VARCHAR(100) NOT NULL,
    github_repo_url TEXT,
    mentor_id UUID REFERENCES users(id),
    is_completed BOOLEAN DEFAULT FALSE,
    earned_top_performer BOOLEAN DEFAULT FALSE,
    final_grade NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Weekly Milestone Submissions
CREATE TABLE milestone_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES cohort_enrollments(id) ON DELETE CASCADE,
    phase_number INT CHECK (phase_number IN (1, 2, 3)), -- Weeks 1-2, Weeks 3-4, Weeks 5-6
    pull_request_url TEXT NOT NULL,
    live_demo_url TEXT,
    documentation_url TEXT,
    submission_notes TEXT,
    score NUMERIC(5,2), -- 0.00 to 100.00
    mentor_feedback TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Verified Credentials & Certificates
CREATE TABLE credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. DEV-INT-2026-XXXX
    enrollment_id UUID REFERENCES cohort_enrollments(id),
    recipient_name VARCHAR(255) NOT NULL,
    track_title VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    is_top_performer BOOLEAN DEFAULT FALSE,
    certificate_pdf_url TEXT NOT NULL,
    lor_pdf_url TEXT, -- Letter of Recommendation URL (for top performers)
    qr_code_url TEXT NOT NULL,
    cryptographic_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Career Applications (Direct Lateral Hires)
CREATE TABLE career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. DEV-JOB-2026-XXXX
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    target_role VARCHAR(150) NOT NULL,
    experience_tier VARCHAR(100) NOT NULL,
    previous_company VARCHAR(150),
    previous_salary VARCHAR(100),
    expected_salary VARCHAR(100),
    notice_period VARCHAR(100),
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    cover_note TEXT,
    status VARCHAR(50) DEFAULT 'REVIEW_PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 5. Implementation Roadmap for the Future Portal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PORTAL IMPLEMENTATION PHASES                          │
├─────────────────────┬───────────────────────────────────────────────────────┤
│ Phase 1: Foundation │ • Scaffold standalone Next.js 14 / Remix repository   │
│ (Weeks 1 - 2)       │ • Configure Supabase PostgreSQL DB and Prisma ORM     │
│                     │ • Implement Supabase Auth (GitHub & Magic Links)      │
│                     │ • Deploy to portal.devatrix.com                       │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Phase 2: Admissions │ • Build candidate application tracker HUD             │
│ (Weeks 3 - 4)       │ • Develop Admin Kanban review board                   │
│                     │ • Integrate automated email & WhatsApp alerts via API │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Phase 3: Milestones │ • Build 3-Phase milestone submission modules          │
│ (Weeks 5 - 6)       │ • Implement GitHub Webhook pull request listener      │
│                     │ • Design mentor review and scoring interface          │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Phase 4: Honors &   │ • Implement headless PDF certificate & LOR generator  │
│ Automation          │ • Connect verification hashes with main /verify route │
│ (Weeks 7 - 8)       │ • Deploy automated 'Top Performer' gold badge logic   │
└─────────────────────┴───────────────────────────────────────────────────────┘
```

---

*Devatrix Technologies • Enterprise Architecture & Engineering Documentation • All Rights Reserved © 2022–2026*
