import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import {
  buildOrganizationJsonLd,
  CORE_BRAND_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/metadata";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#061833",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Devatrix Technologies | AI Software House, Custom SaaS & Engineering Internships",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Devatrix Technologies is an AI-native software house engineering custom SaaS platforms, autonomous AI agents, full-stack web & mobile apps, cloud infrastructure, and verified 6-week virtual internships.",
  keywords: CORE_BRAND_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Devatrix Technologies | AI Software House, Custom SaaS & Engineering Internships",
    description:
      "Devatrix Technologies builds custom SaaS platforms, applied AI agents, React Native & Flutter mobile apps, cloud DevOps, and structured 6-week virtual engineering internships.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Devatrix Technologies — Software Solutions That Create Real Value",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devatrix Technologies | AI Software House & Custom SaaS Engineering",
    description:
      "Custom SaaS, Applied AI Agents, Full-Stack Web, Mobile Apps, Cloud DevOps & Verified 6-Week Virtual Internships.",
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/devatrix-favicon.png?v=2", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/devatrix-favicon.png?v=2",
    apple: "/devatrix-favicon.png?v=2",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={buildOrganizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
