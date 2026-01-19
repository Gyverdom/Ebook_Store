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

    // 1. Chache lòd la ak ID Natcash la
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('natcash_id', searchId)
      .single();

    if (error || !order) {
      setMsg('❌ Nou pa jwenn okenn lòd ak ID sa a. Verifye si ID a kòrèk.');
      setLoading(false);
      return;
    }

    // 2. Si lòd la la, men li poko valide pa Admin nan
    if (order.status !== 'completed') {
      setMsg('⏳ Nou resevwa lòd la! N ap verifye peman an kounye a (sa pran 5 a 15 minit). Tanpri re-eseye yon ti moman ankò.');
      setLoading(false);
      return;
    }

    // 3. Si lòd la "completed", al chache lyen an nan table products
    const { data: product } = await supabase
      .from('products')
      .select('download_link')
      .eq('id', order.product_id)
      .single();

    if (product && product.download_link) {
      setOrderData({ ...order, download_link: product.download_link });
    } else {
      setMsg('⚠️ Lòd la valide, men nou pa jwenn lyen telechajman an. Kontakte nou sou WhatsApp.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900">Dijital<span className="text-blue-600">Lekti</span>Yanm</h1>
        <p className="text-gray-500 mb-8 text-sm uppercase tracking-widest font-semibold italic">Rekipere Liv Ou</p>
        
        <form onSubmit={checkOrder} className="mb-6 space-y-4">
          <div className="text-left">
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">
              ID Tranzaksyon Natcash:
            </label>
            <input 
              type="text" 
              className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:border-blue-500 text-black transition-all"
              placeholder="Eg: 12345678"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg active:scale-95"
          >
            {loading ? 'Ap verifye...' : 'Chache Liv Mwen'}
          </button>
        </form>

        {msg && (
          <div className={`p-4 rounded-xl text-sm mb-6 border ${
            msg.includes('❌') ? 'bg-red-50 border-red-100 text-red-700' : 'bg-yellow-50 border-yellow-100 text-yellow-700'
          }`}>
            {msg}
          </div>
        )}

        {orderData && (
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl animate-bounce-short">
            <div className="text-3xl mb-2">🎉</div>
            <h3 className="text-green-800 font-bold text-xl mb-1">Peman Konfime!</h3>
            <p className="text-gray-600 mb-6 text-sm italic">
              Ou ka telechaje <b>{orderData.product_name}</b> kounye a.
            </p>
            
            <a 
              href={orderData.download_link} 
              target="_blank"
              rel="noopener noreferrer" 
              className="block w-full bg-green-600 text-white px-6 py-4 rounded-xl font-bold shadow-md hover:bg-green-700 transition transform hover:-translate-y-1"
            >
              📥 Telechaje PDF la
            </a>
            <p className="text-[10px] text-gray-400 mt-4 uppercase">
              ID Tranzaksyon: {orderData.natcash_id}
            </p>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-xs text-gray-400">
             Si w gen nenpòt difikilte, kontakte sipò a sou WhatsApp la a dwat.
           </p>
        </div>
      </div>
    </div>
  );
}