import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans, Newsreader, Great_Vibes } from "next/font/google";
import SmoothScrollManager from "@/components/SmoothScrollManager";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: ["400"],
  display: "swap",
});

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

export const metadata: Metadata = {
  title: "Devatrix Technologies | Software Studio & Engineering Academy",
  description: "Devatrix Technologies pairs mission-critical software engineering with an elite talent accelerator in Lahore & remote. Explore 6-week intensive cohorts, verified GitHub milestones, and production software delivery.",
  icons: {
    icon: "/logo-transparent.png",
    apple: "/logo-transparent.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${newsreader.variable} ${greatVibes.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#FAF9F6] text-slate-900 selection:bg-amber-400 selection:text-slate-950`}
      >
        <SmoothScrollManager />
        {children}
      </body>
    </html>
  );
}
