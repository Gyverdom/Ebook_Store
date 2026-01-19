"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [natcashId, setNatcashId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
          natcash_id: natcashId,
          status: 'pending'
        },
      ]);

    setLoading(false);
    
    if (error) {
      setMessage('Erè koneksyon. Re-eseye.');
    } else {
      setMessage('✅ Lòd resevwa! N ap valide l rapid.');
      setNatcashId('');
      setTimeout(() => setIsModalOpen(false), 2500);
    }
  }

  return (
    <>
      {/* KAT PWODWI A */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100">
        {/* Si ou gen imaj, nou ta mete l la. Pou kounye a yon placeholder koulè */}
        <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300"></div>
             <span className="relative text-gray-400 text-4xl font-bold opacity-30">EBOOK</span>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
            {product.title}
          </h2>
          <p className="text-gray-500 text-sm mb-4 flex-grow line-clamp-3">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-400 uppercase font-semibold">Pri</span>
              <p className="text-2xl font-extrabold text-blue-900">{product.price} <span className="text-sm font-normal text-gray-500">HTG</span></p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-gray-800 transition active:scale-95"
            >
              Achte
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PEMAN AN (Pop-up) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl transform scale-100 transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800">Peye ak Natcash</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl mb-6 border border-yellow-200">
              <div className="flex items-center mb-2">
                 <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded mr-2">ETAP 1</span>
                 <p className="text-sm text-gray-700">Voye <b>{product.price} HTG</b></p>
              </div>
              <div className="flex items-center">
                 <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded mr-2">ETAP 2</span>
                 <p className="text-sm text-gray-700">Sou: <b>3333-3333</b></p>
              </div>
            </div>

            <form onSubmit={handleOrder}>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ID Tranzaksyon an</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Eg: 123456"
                value={natcashId}
                onChange={(e) => setNatcashId(e.target.value)}
              />
              
              {message && (
                <div className={`p-3 rounded-lg mb-4 text-sm font-bold text-center ${message.includes('Erè') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 flex justify-center items-center"
              >
                {loading ? (
                   <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : 'Konfime Peman'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}