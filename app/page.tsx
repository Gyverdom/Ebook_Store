import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import OnboardingTour from '@/components/OnboardingTour';

// Sa asire ke sit la toujou a jou (pa gen ansyen done nan kach)
export const revalidate = 0;

export default async function Home() {
  // 1. Rekipere liv yo nan Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erè nan chajman liv yo:", error);
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-8 pb-20">
      
      {/* --- 1. GID POU NOUVO VIZITÈ (Onboarding) --- */}
      {/* Li pral parèt otomatikman anlè tout bagay si se premye vizit moun nan */}
      <OnboardingTour />

      {/* --- 2. TÈT PAJ LA (Hero Section) --- */}
      <div className="text-center max-w-2xl mx-auto mb-12 mt-8 animate-in slide-in-from-top duration-700">
        <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block shadow-sm">
          🚀 Bibliyotèk 100% Ayisyen
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
          Konesans Ou, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Nan Pòch Ou.
          </span>
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed font-medium">
          Telechaje pi bon liv ak fòmasyon pou devlopman ou. 
          Peye an sekirite avèk <span className="font-bold text-red-600">Natcash</span> oswa <span className="font-bold text-red-600">Moncash</span>.
        </p>
      </div>

      {/* --- 3. LIS LIV YO (Grid) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              Pa gen liv disponib pou kounye a.
            </p>
            <p className="text-xs text-gray-300 mt-2">Tcheke Supabase ou pou wè si ou ajoute pwodwi.</p>
          </div>
        )}
      </div>

    </main>
  );
}