import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://weliftoff.now"),
  title: "WeLiftoff — Don't Just Learn to Code. Ship Like a Founder.",
  description:
    "The 14-day engineering residency turning high school builders into technical founders. Stop tinkering in local folders. Master repo architecture, local-first persistence, and ship live software to Google Play.",
  openGraph: {
    title: "WeLiftoff — Don't Just Learn to Code. Ship Like a Founder.",
    description:
      "Turn messy local folders into deployed, production-ready software. An intensive 14-day engineering residency for builders going from 0 to 1. Inaugural cohort at Mayo College, Ajmer.",
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
