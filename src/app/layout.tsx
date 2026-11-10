import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const avenir = localFont({
  src: [{ path: "../../public/fonts/Avenir-Roman-12.ttf", weight: "400", style: "normal" }],
  variable: "--font-avenir",
});

const description = "Richard Álvarez is a web developer and AI engineer based in Chicago. Selected websites and contact details.";

export const metadata: Metadata = {
  title: {
    template: "%s | Richard Álvarez",
    default: "Richard Álvarez | Web Developer & AI Engineer",
  },
  description,
  keywords: ["Richard Álvarez", "web developer", "AI engineer", "Chicago", "websites"],
  metadataBase: new URL("https://richardalvarez.info"),
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "richardalvarez.info",
    title: "Richard Álvarez | Web Developer & AI Engineer",
    description,
    type: "website",
    locale: "en_US",
    url: "https://richardalvarez.info",
    images: [
      {
        url: "/og-image.jpg",
        width: 2048,
        height: 1152,
        alt: "Richard Álvarez",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={avenir.className + " flex flex-col bg-paper text-ink min-h-[100svh]"}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="flex-1 flex flex-col justify-center items-center w-full px-4">
          {children}
        </div>
        <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-4 text-center text-sm text-muted">
          <p>Richard Alvarez © {new Date().getFullYear()}</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
