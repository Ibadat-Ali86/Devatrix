import type { Metadata } from "next";
import React from "react";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Apply for Engineering Careers",
  description:
    "Submit your software engineering job application to Devatrix Technologies for full-time remote and Lahore hybrid roles across Full-Stack, AI/ML, Mobile, and Cloud.",
  path: "/careers/apply",
  keywords: [
    "apply Devatrix jobs",
    "Devatrix software engineer application",
    "remote tech jobs Devatrix Technologies",
  ],
});

export default function CareersApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
          { name: "Apply", path: "/careers/apply" },
        ])}
      />
      {children}
    </>
  );
}
