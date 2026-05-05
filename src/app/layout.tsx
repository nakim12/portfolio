import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nathan Kim — Builder & Engineer",
  description:
    "Personal portfolio of Nathan Kim. Engineer building products at the intersection of AI, design, and software.",
  metadataBase: new URL("https://nakim.dev"),
  openGraph: {
    title: "Nathan Kim — Builder & Engineer",
    description:
      "Personal portfolio of Nathan Kim. Engineer building products at the intersection of AI, design, and software.",
    url: "https://nakim.dev",
    siteName: "nakim.dev",
    type: "website",
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
      className={`${sans.variable} ${mono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
