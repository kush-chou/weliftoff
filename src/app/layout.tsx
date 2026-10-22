import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://weliftoff.now"),
  title: "WeLiftoff — 14-Day Zero-to-Signed Android Engineering Residency",
  description:
    "On-campus high school software engineering residency by Substrata Labs. Students master atomic Git state machines, zero-egress SQLite/Room persistence, and reproducible Android App Bundle (AAB) + F-Droid distribution in 14 days.",
  openGraph: {
    title: "WeLiftoff — Zero to Signed APK in 14 Deterministic Days",
    description:
      "On-campus engineering residency: atomic Git discipline, local-first Android architecture, and dual-store FOSS publication (Google Play & F-Droid). Inaugural cohort at Mayo College, Ajmer.",
    url: "https://weliftoff.now",
    siteName: "WeLiftoff // Substrata Labs",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth bg-[#0B0C0E]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0B0C0E] text-[#F4F4F0] antialiased selection:bg-[#FF4F00] selection:text-[#0B0C0E]">
        {children}
      </body>
    </html>
  );
}
