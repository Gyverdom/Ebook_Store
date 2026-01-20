import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppBtn from '../components/WhatsAppBtn';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'DijitalLektiYanm | Pi Gwo Libreri Nimerik Ayisyen',
  description: 'Achte ak telechaje liv, fòmasyon, ak zouti dijital an kreyòl. Peye fasil pa MonCash oswa Natcash.',
  keywords: ['ebook kreyòl', 'liv ayisyen', 'fòmasyon an liy', 'moncash', 'natcash', 'teknoloji'],
  openGraph: {
    title: 'DijitalLektiYanm - Aprann epi Grandi',
    description: 'Dekouvri pi bon liv dijital pou devlopman pèsonèl ak teknik ou.',
    url: 'https://ebook-store-lac.vercel.app', // Mete vrè lyen Vercel ou a la
    siteName: 'DijitalLektiYanm',
    locale: 'ht_HT',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WhatsAppBtn />

        {children}
      </body>
    </html>
  );
}
