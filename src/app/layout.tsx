import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Devatrix Technologies | Sovereign AI & Mission-Critical Software Systems",
  description: "Devatrix Technologies is an AI-native software house engineering sovereign AI platforms, distributed cloud architectures, and high-concurrency systems.",
  icons: {
    icon: [
      { url: "/devatrix-favicon.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/devatrix-favicon.png",
    apple: "/devatrix-favicon.png",
  },
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
        {children}
      </body>
    </html>
  );
}
