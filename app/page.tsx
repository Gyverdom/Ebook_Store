"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      let { data, error } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 1. HERO SECTION (Bannè anlè a) */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Dijital<span className="text-yellow-400">Lekti</span>Yanm
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-light mb-8">
            Nouri lespri w ak konesans ki soti nan rasin nou.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/telechaje" className="bg-white text-blue-900 px-6 py-3 rounded-full font-bold shadow hover:bg-yellow-400 transition transform hover:-translate-y-1">
              📥 Mwen deja peye (Rekipere Liv)
            </a>
          </div>
        </div>
      </div>

      {/* 2. LIS PWODWI YO */}
      <div className="max-w-6xl mx-auto p-8 -mt-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-gray-500">N ap chache bon yanm yo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 ? (
              <p className="text-center col-span-3 text-gray-400 py-10">
                Pa gen liv disponib pou kounye a.
              </p>
            ) : (
              products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))
            )}
          </div>
        )}
      </div>

      {/* 3. FOOTER (Pye paj la) */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center mt-20">
        <p>&copy; 2024 DijitalLektiYanm. Tout dwa rezève.</p>
      </footer>
    </main>
  );
}