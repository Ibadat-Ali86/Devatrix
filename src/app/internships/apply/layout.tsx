import type { Metadata } from "next";
import React from "react";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Apply for Devatrix 6-Week Virtual Internship (Batch 2026)",
  description:
    "Submit your official application for the Devatrix Technologies Batch 2026 6-Week Virtual Internship Program and receive an instant application tracking ID.",
  path: "/internships/apply",
  keywords: [
    "apply Devatrix internship",
    "Devatrix Batch 2026 internship application",
    "online CS internship application Pakistan",
    "remote web AI mobile DevOps internship",
  ],
});

export default function InternshipApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Internships", path: "/internships" },
          { name: "Apply", path: "/internships/apply" },
        ])}
      />
      {children}
    </>
  );
}
