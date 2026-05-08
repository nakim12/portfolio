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
  "Statistics & Data Science student at UC Santa Barbara, graduating June 2026. Data science intern at BlueAlpha. Building with data, statistics, and AI.";

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

// Runs before React hydrates so the chosen theme is applied before
// first paint, avoiding a flash of the wrong theme.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(_){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
