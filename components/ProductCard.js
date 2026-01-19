"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Swa nimewo ou yo la a:
  const NATCASH_AGENT_CODE = "324751"; // <--- CHANJE SA AK KÒD AJAN OU
  const MONCASH_NUMBER = "47360092";    // <--- CHANJE SA AK NIMEWO MONCASH OU

  async function handleOrder(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('orders')
      .insert([
        { 
          product_name: product.title, 
          product_id: product.id,   
          price: product.price,     
          natcash_id: transactionId, // Nou itilize menm kolòn nan pou ID MonCash tou
          status: 'pending'
        },
      ]);

    setLoading(false);
    
    if (error) {
      console.error('Erè:', error);
      setMessage('❌ Erè koneksyon. Re-eseye.');
    } else {
      setMessage('✅ Lòd resevwa! N ap valide sa nan 5-15 minit.');
      setTransactionId('');
      setTimeout(() => setIsModalOpen(false), 3500);
    }
  }

  return (
    <>
      {/* KAT PWODWI A */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100">
        
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full h-64 object-cover" />
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-400 font-bold uppercase">Ebook</div>
        )}
        
        <div className="p-6 flex flex-col flex-grow text-black">
          <h2 className="text-xl font-bold leading-tight mb-2 line-clamp-2 uppercase">
            {product.title}
          </h2>
          <p className="text-gray-500 text-sm mb-4 flex-grow line-clamp-3 italic">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-400 uppercase font-semibold">Pri</span>
              <p className="text-2xl font-extrabold text-blue-900">{product.price} <span className="text-sm font-normal text-gray-500">HTG</span></p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition active:scale-95"
            >
              Achte
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PEMAN (Pop-up) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-gray-800 tracking-tight">Peye kounye a</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-3xl font-light">&times;</button>
            </div>
            
            <div className="space-y-3 mb-6">
              {/* OPSYON NATCASH AGENT */}
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Natcash</span>
                  <p className="text-xs font-bold text-red-900">Retrait sou Kòd Ajan</p>
                </div>
                <p className="text-[11px] text-gray-700 leading-tight">
                  Fè yon retrait <b>{product.price} HTG</b> sou kòd sa a:
                </p>
                <p className="text-xl font-mono font-black text-red-600 mt-1">{NATCASH_AGENT_CODE}</p>
              </div>

              {/* OPSYON MONCASH */}
              <div className="bg-red-600 p-4 rounded-xl border border-red-700 text-white shadow-inner">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">MonCash</span>
                  <p className="text-xs font-bold">Transfè nòmal</p>
                </div>
                <p className="text-[11px] opacity-90 leading-tight">
                  Voye <b>{product.price} HTG</b> sou nimewo sa a:
                </p>
                <p className="text-xl font-mono font-black mt-1">{MONCASH_NUMBER}</p>
              </div>
            </div>

            {/* FOMILÈ POU METE ID A */}
            <form onSubmit={handleOrder} className="border-t border-gray-100 pt-4">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">ID Tranzaksyon (Natcash oswa MonCash)</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl mb-4 text-black font-mono focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="ID tranzaksyon an la a..."
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              
              {message && (
                <div className={`p-3 rounded-lg mb-4 text-[11px] font-bold text-center animate-pulse ${message.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 shadow-xl transition-all active:scale-95 flex justify-center items-center"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Mwen fin peye'}
              </button>
              
              <div className="mt-4 flex items-start gap-2 text-blue-600 bg-blue-50 p-2 rounded-lg">
                <span className="text-xs">ℹ️</span>
                <p className="text-[9px] leading-tight">
                  N ap valide peman ou an nan 5 a 15 minit. Apre sa, w ap ka telechaje liv la sou paj "Rekipere Liv" la.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}