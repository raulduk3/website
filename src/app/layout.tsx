import type { Metadata } from "next";
import  localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const avenir = localFont({
  src: [
    { path: '../../public/fonts/Avenir-Black-03.ttf', weight: '900', style: 'normal' },
    { path: '../../public/fonts/Avenir-BlackOblique-04.ttf', weight: '900', style: 'italic' },
    { path: '../../public/fonts/Avenir-Book-01.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Avenir-BookOblique-02.ttf', weight: '400', style: 'italic' },
    { path: '../../public/fonts/Avenir-Heavy-05.ttf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Avenir-HeavyOblique-06.ttf', weight: '700', style: 'italic' },
    { path: '../../public/fonts/Avenir-Light-07.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Avenir-LightOblique-08.ttf', weight: '300', style: 'italic' },
    { path: '../../public/fonts/Avenir-Medium-09.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Avenir-MediumOblique-10.ttf', weight: '500', style: 'italic' },
    { path: '../../public/fonts/Avenir-Oblique-11.ttf', weight: '400', style: 'italic' },
    { path: '../../public/fonts/Avenir-Roman-12.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-avenir',
});


export const metadata: Metadata = {
  title: {
    template: '%s | richard alvarez',
    default: 'richard alvarez',
  },
  description: 'Artist website of Richard Álvarez.',
  keywords: [
    'Rick Alvarez',
    'rick alvarez chicago',
    'Alvarez',
    'dvi',
    'canon xl2',
    'Canon XL2',
    'glitch art',
    'raul duke',
    'Raoul Duke',
    'Raul Duke',
    'underground artist',
    'vfx',
    'chicago',
    'music scene',
    'music videos',
    'art',
    'poetry',
    'latinx art',
    'video art',
    'code',
    'programming',
    'p5js',
    'chicago underground artists',
    'cgi',
    'animation',
    'punk art',
    'youtube music videos',
    'nudity in music videos',
    'chicago underground film festival',
  ],
  openGraph: {
    siteName: 'richardalvarez.info',
    title: 'Richard Alvarez',
    description: 'Artist website of Richard Álvarez.',
    type: 'website',
    locale: 'en_US',
    url: 'https://richardalvarez.info',
    images: [
      {
        url: 'https://richardalvarez.info/og-image.jpg',
        width: 800,
        height: 650,
        alt: 'Richard Alvarez',
      },
    ],
  },
  metadataBase: new URL('https://richardalvarez.info'),
  icons: [
    { rel: 'icon', href: '/favicon.ico', url: '/favicon.ico' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </head>
      <body className={avenir.className + " flex flex-col bg-black text-white min-h-[100svh]"}>
        <div className="flex-1 flex flex-col justify-center items-center w-full px-4"> 
          {children}
        </div>
        <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-6 text-center text-xs text-white/70">
          <p>Richard Alvarez © {new Date().getFullYear()}</p>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
