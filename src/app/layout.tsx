import type { Metadata, Viewport } from "next";
import { Comic_Neue, Raleway } from "next/font/google";
import { Providers } from "@/providers";
import { jsonLd, siteConfig } from "@/lib/site";
import "./globals.css";
import Script from "next/script";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: "Lokesh Yadav Portfolio",
    title: "Lokesh Yadav (Loki) - Full Stack Engineer Portfolio",
    description:
      "Full Stack Engineer specializing in React, Next.js, TypeScript, Node.js, PostgreSQL, real-time systems, and performance-focused web applications.",
    images: [{ url: siteConfig.ogImage, alt: "Lokesh Yadav Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lokesh Yadav (Loki) - Full Stack Engineer Portfolio",
    description:
      "Full Stack Engineer (MERN | PERN) — React, Next.js, Node.js, PostgreSQL, Three.js, WebSockets, Redis, and real-time web applications.",
    images: [siteConfig.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable} ${comicNeue.variable} h-full`}>
      <body className="min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Escape `<` so a value can never close the script tag early.
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>{children}</Providers>
        <Script defer src="https://silentpulse.vercel.app/script.js" data-website-id="46509111-a743-4792-95ab-a43b1d451b61"></Script>
      </body>
    </html>
  );
}
