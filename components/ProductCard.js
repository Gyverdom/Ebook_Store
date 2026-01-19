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
      setMessage('Erè koneksyon.');
    } else {
      setMessage('✅ Lòd resevwa!');
      setNatcashId('');
      setTimeout(() => setIsModalOpen(false), 2500);
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100">
        
        {/* --- PATI IMAJ LA KÒMANSE LA --- */}
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-64 object-cover" // Mwen mete l pi wo (h-64) pou l parèt pi byen
          />
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300"></div>
               <span className="relative text-gray-400 text-4xl font-bold opacity-30">EBOOK</span>
          </div>
        )}
        {/* --- PATI IMAJ LA FINI LA --- */}

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

      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800">Peye ak Natcash</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl mb-6 border border-yellow-200">
              <p className="text-sm text-gray-700">1. Voye <b>{product.price} HTG</b> sou <b>3333-3333</b></p>
            </div>

            <form onSubmit={handleOrder}>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="ID Tranzaksyon"
                value={natcashId}
                onChange={(e) => setNatcashId(e.target.value)}
              />
              {message && <p className="mb-2 text-center text-green-600 font-bold">{message}</p>}
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold">
                {loading ? '...' : 'Konfime'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}