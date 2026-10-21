import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeLiftoff 🚀 | Zero to Published Android App in 14 Days",
  description:
    "An intensive 14-day on-campus engineering residency for high school builders. Zero code to live on Google Play & F-Droid with git-first atomic discipline. By Substrata Labs.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>",
  },
  openGraph: {
    title: "WeLiftoff 🚀 | Zero to Play Store in 14 Days",
    description:
      "High school engineering residency: build, commit, and ship open-source Android apps. Inaugural cohort at Mayo College, Ajmer.",
    url: "https://weliftoff.now",
    siteName: "WeLiftoff",
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
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#090b10] text-[#e5e9f0] min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200`}
      >
        {children}
      </body>
    </html>
  );
}
