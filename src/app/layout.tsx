import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Used as a literary accent — currently italicized surname in the hero.
const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600"],
});

const title = "Nathan Kim — Statistics & Data Science · UCSB";
const description =
  "Recent Statistics & Data Science graduate from UC Santa Barbara. Building with data, statistics, and agentic AI. Open to roles in Data Science, ML, AI, and Analytics.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "Nathan Kim",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
