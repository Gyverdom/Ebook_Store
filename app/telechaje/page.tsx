"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DownloadPage() {
  const [searchId, setSearchId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function checkOrder(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setOrderData(null);

    // 1. Chache lòd la
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('natcash_id', searchId)
      .single();

    if (error || !order) {
      setMsg('❌ Nou pa jwenn lòd ak ID sa a. Verifye si w tape l byen.');
      setLoading(false);
      return;
    }

    // 2. Verifye si Admin nan valide l
    if (order.status !== 'completed') {
      setMsg('⏳ Nou resevwa lòd la, men Admin an poko valide l. Tanpri eseye ankò nan kèk minit.');
      setLoading(false);
      return;
    }

    // 3. Si tout bagay bon, al chache lyen an nan table products
    const { data: product } = await supabase
      .from('products')
      .select('download_link')
      .eq('id', order.product_id)
      .single();

    if (product && product.download_link) {
      setOrderData({ ...order, download_link: product.download_link });
    } else {
      setMsg('⚠️ Lòd la valide, men sanble pa gen lyen pou liv sa a. Kontakte sipò.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-extrabold mb-6 text-black">📥 Telechaje Liv Ou</h1>
        
        <form onSubmit={checkOrder} className="mb-6 space-y-4">
          <div className="text-left">
            <label className="block text-gray-700 text-sm font-bold mb-2">Natcash Transaction ID:</label>
            <input 
              type="text" 
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 text-black"
              placeholder="Ex: 12345678"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {loading ? 'Ap verifye...' : 'Verifye Peman Mwen'}
          </button>
        </form>

        {msg && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded text-sm mb-4 border border-yellow-200">
            {msg}
          </div>
        )}

        {orderData && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg animate-pulse-once">
            <h3 className="text-green-800 font-bold text-xl mb-2">Felisitasyon!</h3>
            <p className="text-gray-600 mb-6 text-sm">Peman verifye pou: <br/><b>{orderData.product_name}</b></p>
            
            <a 
              href={orderData.download_link} 
              target="_blank"
              rel="noopener noreferrer" 
              className="block w-full bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              Klike la pou Telechaje PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}