import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { Analytics } from "@vercel/analytics/next"

// Metadata pou Google ak WhatsApp (Sa n te pale a)
export const metadata = {
  title: 'DijitalLektiYanm | Libreri Nimerik Pwofesyonèl',
  description: 'Achte ak telechaje liv, fòmasyon, ak zouti dijital an kreyòl. Peye fasil ak MonCash oswa Natcash.',
  keywords: ['ebook', 'ayiti', 'teknoloji', 'biznis', 'moncash', 'natcash'],
  openGraph: {
    title: 'DijitalLektiYanm - Aprann epi Grandi',
    description: 'Pi gwo libreri dijital pou liv ak zouti an Kreyòl.',
    siteName: 'DijitalLektiYanm',
    locale: 'ht_HT',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ht">
      <body className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
        
        {/* --- NAVBAR (Tèt Sit la) --- */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              
              {/* Logo ak Non Sit la */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-sm border border-gray-100 group-hover:scale-105 transition">
                  {/* Asire w logo.png nan dossier public/ la */}
                  <Image 
                    src="/logo.png" 
                    alt="Logo DijitalLektiYanm" 
                    width={100} 
                    height={100} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight text-blue-900 leading-none">DijitalLektiYanm</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ebook Store</span>
                </div>
              </Link>

              {/* Bouton Sipò (Trè enpòtan pou konfyans) */}
              <a 
                href="https://wa.me/50947360092" // <--- Mete nimewo WhatsApp ou la
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-green-100 transition border border-green-200"
              >
                <span>💬</span>
                <span>Sipò WhatsApp</span>
              </a>

            </div>
          </div>
        </header>

        {/* --- KÒ SIT LA (Kote liv yo ap parèt) --- */}
        <main className="flex-grow">
          {children}
        </main>

        {/* --- FOOTER (Pye Sit la) --- */}
        <footer className="bg-white border-t border-gray-100 mt-12 pt-12 pb-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6 opacity-50 grayscale hover:grayscale-0 transition">
              <Image src="/logo.png" alt="Logo Footer" width={40} height={40} />
            </div>
            
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Misyon nou se rann konesans aksesib pou tout Ayisyen. 
              Aprann, grandi, epi reyisi ak pi bon zouti dijital yo.
            </p>

            <div className="flex justify-center gap-6 text-xs text-gray-500 font-medium uppercase tracking-wide mb-8">
              <Link href="/" className="hover:text-blue-600 transition">Akèy</Link>
              <Link href="/telechaje" className="hover:text-blue-600 transition">Rekipere Liv</Link>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-gray-900">Kondisyon</a>
              <a href="#" className="hover:text-gray-900">Konfidansyalite</a>
            </div>

            <p className="text-xs text-gray-300">
              &copy; {new Date().getFullYear()} DijitalLektiYanm. Tout dwa rezève.
            </p>
          </div>
        </footer>
        <Analytics/>
      </body>
    </html>
  )
}