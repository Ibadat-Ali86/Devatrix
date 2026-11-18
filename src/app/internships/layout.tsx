import type { Metadata } from "next";
import React from "react";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildPageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "6-Week Virtual Internship Program | AI, Full-Stack Web, Mobile & DevOps",
  description:
    "Apply for the Devatrix Technologies 6-Week Virtual Internship Program (Batch 2026). Structured 6-week syllabi across Full-Stack Web Development, Applied AI & Agents, Machine Learning, Data Analytics, AI FDE, React Native, Flutter, and DevOps with verified certificates.",
  path: "/internships",
  keywords: [
    "Devatrix internship",
    "Devatrix 6-week virtual internship",
    "remote software engineering internship Pakistan",
    "Full-Stack Web Development internship",
    "Applied AI and Agent Engineering internship",
    "React Native mobile app internship",
    "Flutter mobile app internship",
    "DevOps cloud engineering internship",
    "Data Science and Data Analytics internship",
    "verified internship certificate Pakistan",
  ],
});

const tracksForSchema = [
  { name: "Full-Stack Web Development (6-Week Virtual Internship)", desc: "Build and deploy a production full-stack web application using React 19, Next.js App Router, TypeScript, REST APIs, database persistence, and authentication." },
  { name: "Applied AI & Agent Engineering (6-Week Virtual Internship)", desc: "Build and evaluate a focused LLM application with RAG, vector search, bounded tools, FastAPI, and guardrails." },
  { name: "Machine Learning & Data Science (6-Week Virtual Internship)", desc: "Take a supervised learning problem from data checks and baseline through model validation, error analysis, and reproducible reporting." },
  { name: "Data Analytics & Business Intelligence (6-Week Virtual Internship)", desc: "Query and model relational data with SQL, Power Query, DAX, and Power BI dashboards." },
  { name: "AI Engineer & Forward Deployed Engineer (FDE) (6-Week Virtual Internship)", desc: "Deliver a bounded AI solution around a real workflow from discovery and integration to Docker pilot deployment." },
  { name: "React Native Mobile App Development (6-Week Virtual Internship)", desc: "Engineer cross-platform iOS and Android apps with React Native, TypeScript, Expo, state management, offline storage, and APK release builds." },
  { name: "Flutter Mobile App Development (6-Week Virtual Internship)", desc: "Build natively compiled cross-platform mobile apps with Flutter, Dart, Provider/BLoC, REST APIs, and Firebase." },
  { name: "DevOps Engineer & Cloud Infrastructure (6-Week Virtual Internship)", desc: "Master Linux, Docker, GitHub Actions CI/CD, Terraform IaC, cloud deployments, and Kubernetes fundamentals." },
];

const internshipsSchema = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "6-Week Virtual Internships", path: "/internships" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Devatrix Technologies 6-Week Virtual Internship Tracks",
    url: `${SITE_URL}/internships`,
    itemListElement: tracksForSchema.map((track, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Course",
        name: track.name,
        description: track.desc,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          sameAs: SITE_URL,
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT42H",
        },
      },
    })),
  },
];

export default function InternshipsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={internshipsSchema} />
      {children}
    </>
  );
}
