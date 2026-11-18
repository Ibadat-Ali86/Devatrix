import type { Metadata } from "next";

export const SITE_URL = "https://www.devatrix.site";
export const SITE_NAME = "Devatrix Technologies";
export const SITE_SHORT_NAME = "Devatrix";
export const CONTACT_EMAIL = "devatrixtechnologies@gmail.com";
export const CONTACT_PHONE = "+92-315-6179410";
export const LINKEDIN_URL = "https://www.linkedin.com/company/devatrix-technologies/";
export const INSTAGRAM_URL = "https://www.instagram.com/devatrix_technologies";

export const CORE_BRAND_KEYWORDS = [
  "Devatrix",
  "Devatrix Technologies",
  "Devatrix Software House",
  "Devatrix Technologies Lahore",
  "Devatrix Technologies Pakistan",
  "Devatrix Internship",
  "Devatrix Virtual Internship",
  "AI software house Pakistan",
  "custom SaaS development",
  "full-stack web development",
  "applied AI agent engineering",
];

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogType?: "website" | "article";
  absoluteTitle?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  ogType = "website",
  absoluteTitle = false,
}: PageSeoInput): Metadata {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;
  const mergedKeywords = Array.from(new Set([...CORE_BRAND_KEYWORDS, ...keywords]));

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      locale: "en_US",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: absoluteTitle ? title : `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Software Engineering, AI Systems & Virtual Internships`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle ? title : `${title} | ${SITE_NAME}`,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
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
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ["Devatrix", "Devatrix Tech", "Devatrix Technologies LLC"],
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/devatrix-favicon.png`,
          width: 192,
          height: 192,
        },
        image: `${SITE_URL}/opengraph-image`,
        description:
          "Devatrix Technologies is an AI-native software house in Lahore, Pakistan delivering custom SaaS platforms, autonomous AI agents, full-stack web & mobile applications, cloud infrastructure, and structured 6-week engineering internships worldwide.",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        foundingDate: "2022",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        areaServed: ["Worldwide", "Pakistan", "United States", "United Kingdom", "United Arab Emirates", "Europe"],
        sameAs: [LINKEDIN_URL, INSTAGRAM_URL, "https://github.com/devatrixtechnologies"],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: CONTACT_EMAIL,
            telephone: CONTACT_PHONE,
            availableLanguage: ["English", "Urdu"],
          },
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: CONTACT_EMAIL,
            telephone: CONTACT_PHONE,
            availableLanguage: ["English"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        inLanguage: "en-US",
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}
