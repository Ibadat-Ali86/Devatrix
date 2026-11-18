import type { Metadata } from "next";
import React from "react";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildPageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Devatrix Vanguard Fellowship | Elite AI & Systems Engineering",
  description:
    "Explore the Devatrix Vanguard Fellowship — an intensive cohort program for top engineering builders focused on sovereign AI agents, distributed systems, and production software craftsmanship.",
  path: "/vanguard",
  keywords: [
    "Devatrix Vanguard",
    "Devatrix Vanguard Fellowship",
    "AI systems engineering fellowship Pakistan",
  ],
});

const vanguardSchema = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Vanguard Fellowship", path: "/vanguard" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: "Devatrix Vanguard Fellowship",
    url: `${SITE_URL}/vanguard`,
    provider: { "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
  },
];

export default function VanguardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={vanguardSchema} />
      {children}
    </>
  );
}
