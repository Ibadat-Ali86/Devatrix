import type { Metadata } from "next";
import React from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Learner Portal",
  description: "Private Devatrix Technologies Learner Portal for enrolled interns.",
  path: "/portal",
  noIndex: true,
});

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
