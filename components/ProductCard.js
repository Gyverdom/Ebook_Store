"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // CONFIGURASYON PEMAN OU
  const NATCASH_AGENT_CODE = "324751"; // <--- METE KÒD AJAN PA W LA
  const MONCASH_NUMBER = "47360092";    // <--- METE NIMEWO MONCASH PA W LA

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
          natcash_id: transactionId,
          customer_phone: phone, 
          status: 'pending',
          download_count: 0
        },
      ]);

    setLoading(false);
    
    if (error) {
      setMessage('❌ Erè koneksyon. Re-eseye.');
    } else {
      setMessage('✅ Lòd resevwa! N ap valide sa nan 5-15 minit.');
      setTransactionId('');
      setPhone('');
      setTimeout(() => setIsModalOpen(false), 3500);
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full h-64 object-cover" />
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">Ebook</div>
        )}
        <div className="p-6 flex flex-col flex-grow text-black">
          <h2 className="text-xl font-black leading-tight mb-2 uppercase text-blue-950">
            {product.title}
          </h2>
          <p className="text-gray-500 text-sm mb-4 flex-grow italic line-clamp-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">Pri Liv la</span>
              <p className="text-2xl font-black text-blue-900">{product.price} <span className="text-xs font-normal">HTG</span></p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-gray-800 active:scale-95 transition"
            >
              Achte
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl text-gray-900 italic underline uppercase tracking-tighter">Peye Kounye a</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-3xl font-light">&times;</button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 relative">
                <span className="absolute top-2 right-3 text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-black uppercase">Natcash</span>
                <p className="text-[10px] font-bold text-red-900 mb-1">Retrait sou Kòd Ajan:</p>
                <p className="text-2xl font-mono font-black text-red-600">{NATCASH_AGENT_CODE}</p>
              </div>

              <div className="bg-red-600 p-4 rounded-2xl border border-red-700 text-white shadow-lg">
                <p className="text-[10px] font-bold mb-1 opacity-80 uppercase">Transfè MonCash:</p>
                <p className="text-2xl font-mono font-black">{MONCASH_NUMBER}</p>
              </div>
            </div>

            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Nimewo Telefòn Ou:</label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-black font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Eg: 44332211" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">ID Tranzaksyon:</label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-black font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="ID tranzaksyon an la a..." 
                  value={transactionId} 
                  onChange={(e) => setTransactionId(e.target.value)} 
                />
              </div>
              
              {message && (
                <div className={`p-3 rounded-xl text-[10px] font-bold text-center italic ${message.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition hover:bg-gray-900"
              >
                {loading ? 'Ap Anrejistre...' : 'Mwen fin peye'}
              </button>
              
              <p className="text-[9px] text-gray-400 text-center font-bold uppercase italic mt-2">
                N ap valide peman ou an nan 5 a 15 minit.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}