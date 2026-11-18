import type { Metadata } from "next";
import React from "react";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildPageMetadata, SITE_URL } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Devatrix Technologies | Start Your Software Project",
  description:
    "Contact Devatrix Technologies in Lahore or globally online to scope custom SaaS platforms, AI agent workflows, web & mobile apps, or cloud architecture.",
  path: "/contact",
  keywords: [
    "contact Devatrix",
    "contact Devatrix Technologies",
    "hire AI software house Pakistan",
    "Devatrix Technologies WhatsApp email",
  ],
});

const contactSchema = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Devatrix Technologies",
    url: `${SITE_URL}/contact`,
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  },
];

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={contactSchema} />
      {children}
    </>
  );
}
