import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import OnboardingTour from '@/components/OnboardingTour';
import Link from 'next/link'; // <--- Nou bezwen sa pou bouton yo

// Sa asire ke sit la toujou a jou
export const revalidate = 0;

export default async function Home() {
  // 1. Rekipere liv yo
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erè nan chajman liv yo:", error);
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      
      {/* 1. GID POU NOUVO VIZITÈ */}
      <OnboardingTour />

      {/* 2. HERO SECTION (Nouvo Design "Briye" + Bouton Rekipere) */}
      <div className="relative bg-[#0f172a] text-white py-24 sm:py-32 px-4 overflow-hidden shadow-2xl">
        
        {/* Background Dekorasyon (Limyè dèyè) */}
        {/* Yon gwo limyè ble anlè a goch */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600 opacity-20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        {/* Yon gwo limyè mov anba a dwat */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 opacity-20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center animate-in slide-in-from-bottom duration-700">
          
          {/* Badge anlè a */}
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/10 border border-white/20 text-blue-200 text-[11px] font-black tracking-[0.2em] uppercase mb-8 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Bibliyotèk 100% Ayisyen
          </span>
          
          {/* TIT LA KI BRIYE (GLOW EFFECT) */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tighter leading-none drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]">
            Dijital
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 animate-text-shimmer">
              LektiYanm
            </span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-10">
            Konesans pa gen limit. Telechaje pi bon liv ak fòmasyon pou devlopman pèsonèl ou. 
            <span className="block mt-2 text-white font-bold opacity-80">Peye fasil. Resevwa l rapid.</span>
          </p>

          {/* --- ZÒN AKSYON (Bouton yo) --- */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
             
             {/* 1. Bouton pou desann wè liv yo */}
             <a 
               href="#katalog" 
               className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:bg-blue-500 transition-all w-full sm:w-auto"
             >
               <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
               <span className="flex items-center justify-center gap-2">
                 📚 Gade Katalòg la
               </span>
             </a>

             {/* 2. BOUTON REKIPERE A (Sa w t ap chèche a) */}
             {/* Li fèt an "Glassmorphism" (vè) pou l distenge l de bouton ble a */}
             <Link 
               href="/telechaje" 
               className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/10 border-2 border-white/20 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-blue-900 hover:border-white transition-all w-full sm:w-auto backdrop-blur-sm"
             >
                <span className="text-xl group-hover:scale-110 transition">📥</span>
                <span>Mwen gen yon kòd</span>
             </Link>

          </div>

          <p className="mt-6 text-[10px] text-gray-500 font-medium uppercase tracking-widest">
            Sipòte pa MonCash & Natcash
          </p>
        </div>
      </div>

      {/* 3. SEKSYON LIV YO (Katalòg) */}
      <div id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100">
              <p className="text-5xl mb-4">📚</p>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                Sistèm nan pare.
              </p>
              <p className="text-xs text-gray-500 mt-2">Ajoute liv nan Supabase pou yo parèt la.</p>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}