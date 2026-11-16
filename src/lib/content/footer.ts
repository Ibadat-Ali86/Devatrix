export type FooterSettings = {
  description: string;
  proofPoints: string[];
  linkedinUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
  whatsappLabel: string;
  officeCity: string;
  officeDescription: string;
  remoteTitle: string;
  remoteDescription: string;
  contactEmail: string;
  legalName: string;
  copyrightText: string;
};

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  description: "A modern software house delivering custom SaaS platforms, AI chatbots, mobile applications, and cloud architecture for businesses worldwide.",
  proofPoints: ["100% Code Ownership", "Clean Architecture", "Agile Sprints"],
  linkedinUrl: "https://www.linkedin.com/company/devatrix-technologies/",
  instagramUrl: "https://www.instagram.com/devatrix_technologies?srtk=aHNrM2N2ZGF2OHY5",
  whatsappNumber: "923156179410",
  whatsappLabel: "+92 315 6179410 (WhatsApp)",
  officeCity: "Lahore, Pakistan",
  officeDescription: "Software Engineering & Operations",
  remoteTitle: "Remote-First Delivery",
  remoteDescription: "Serving Clients Worldwide",
  contactEmail: "devatrixtechnologies@gmail.com",
  legalName: "Devatrix Technologies LLC",
  copyrightText: "All rights reserved.",
};

function isString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function isWebUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 500) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isFooterSettings(value: unknown): value is FooterSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const settings = value as Record<string, unknown>;
  const phoneDigits = typeof settings.whatsappNumber === "string" ? settings.whatsappNumber.replace(/\D/g, "") : "";

  return isString(settings.description, 600)
    && Array.isArray(settings.proofPoints)
    && settings.proofPoints.length <= 4
    && settings.proofPoints.every((point) => isString(point, 60))
    && isWebUrl(settings.linkedinUrl)
    && isWebUrl(settings.instagramUrl)
    && typeof settings.whatsappNumber === "string"
    && /^[+\d()\s.-]{7,32}$/.test(settings.whatsappNumber)
    && phoneDigits.length >= 8
    && phoneDigits.length <= 15
    && isString(settings.whatsappLabel, 60)
    && isString(settings.officeCity, 100)
    && isString(settings.officeDescription, 160)
    && isString(settings.remoteTitle, 80)
    && isString(settings.remoteDescription, 160)
    && typeof settings.contactEmail === "string"
    && settings.contactEmail.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail)
    && isString(settings.legalName, 120)
    && isString(settings.copyrightText, 120);
}

export function parseFooterSettings(value: unknown): FooterSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return DEFAULT_FOOTER_SETTINGS;
  const settings = { ...DEFAULT_FOOTER_SETTINGS, ...value };
  return isFooterSettings(settings) ? settings : DEFAULT_FOOTER_SETTINGS;
}
