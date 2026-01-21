import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import OnboardingTour from '@/components/OnboardingTour';

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
      
      {/* 1. GID POU NOUVO VIZITÈ (Li la toujou) */}
      <OnboardingTour />

      {/* 2. HERO SECTION (Retou Design "Wow" la) */}
      {/* Mwen mete yon background degrade ak tèks blan */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20 sm:py-32 px-4 overflow-hidden">
        
        {/* Ti sèk dekorasyon dèyè (pou fè l pi bèl) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-in slide-in-from-bottom duration-700">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-[10px] font-black tracking-[0.2em] uppercase mb-6 backdrop-blur-sm">
            🚀 Bibliyotèk 100% Ayisyen
          </span>
          
          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight leading-none drop-shadow-lg">
            Dijital<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">LektiYanm</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-light mb-10">
            Konesans pa gen limit. Telechaje pi bon liv ak fòmasyon pou devlopman pèsonèl ou. Peye fasil, resevwa l rapid.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
                <span className="text-green-400 font-bold">✓</span>
                <span className="text-sm font-bold">MonCash</span>
             </div>
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
                <span className="text-red-400 font-bold">✓</span>
                <span className="text-sm font-bold">Natcash</span>
             </div>
          </div>
        </div>
      </div>

      {/* 3. SEKSYON LIV YO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
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