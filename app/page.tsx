"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; 
import ProductCard from '../components/ProductCard';

export default function Home() {
  // KOREKSYON ISIT LA: Nou ajoute <any[]> pou TypeScript sispann rele
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      let { data, error } = await supabase.from('products').select('*');
      
      if (error) {
        console.log('Erè:', error);
      }
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-black mb-2">
            Ebook Store
          </h1>
          <p className="text-gray-500">Achte liv ou pi renmen yo fasil ak Natcash.</p>
        </header>

        {loading ? (
          <p className="text-center">Ap chaje liv yo...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.length === 0 ? (
              <p className="text-center col-span-2 text-gray-400">
                Pa gen liv disponib pou kounye a. (Al ajoute youn nan Supabase!)
              </p>
            ) : (
              products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}