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
      // The script below sets data-intro here before React runs, which React
      // would otherwise report as a server/client attribute mismatch.
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${serif.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        {/* Holds back everything that is meant to arrive with the hero copy,
            for as long as the hero's opening sequence is going to play. Inline
            and synchronous because it has to be true of the very first frame:
            the nav is outside the hero and would otherwise paint on top of the
            sequence before React has run at all.

            The canvas clears this when it hands over. The timeout is only a
            failsafe for the case where it never mounts, so the page can never
            be left with a permanently invisible nav. It is deliberately far
            longer than the sequence: its job is to catch a broken bundle, not
            a slow one, and firing early would uncover the nav mid-sequence on
            exactly the slow devices least able to hide it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('ridge-intro')){d.dataset.intro='running';setTimeout(function(){if(d.dataset.intro==='running')delete d.dataset.intro},8000)}}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
