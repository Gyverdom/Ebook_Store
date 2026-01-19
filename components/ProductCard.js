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
      console.error('Erè:', error);
      setMessage('❌ Erè koneksyon. Tanpri re-eseye.');
    } else {
      // Mesaj siksè ak enstriksyon klè
      setMessage('✅ Lòd resevwa! N ap valide sa rapid (5-15 minit).');
      setNatcashId('');
      // Nou kite modal la louvri 3 segonn pou l ka li mesaj la anvan l fèmen
      setTimeout(() => setIsModalOpen(false), 3500);
    }
  }

  return (
    <>
      {/* KAT PWODWI A */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100">
        
        {/* Foto kouvèti liv la */}
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden text-gray-400 font-bold">
               EBOOK
          </div>
        )}
        
        <div className="p-6 flex flex-col flex-grow text-black">
          <h2 className="text-xl font-bold leading-tight mb-2 line-clamp-2 uppercase">
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

      {/* MODAL PEMAN (Pop-up) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800">Peye ak Natcash</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
            </div>
            
            {/* Enstriksyon Peman */}
            <div className="bg-yellow-50 p-4 rounded-xl mb-4 border border-yellow-200">
              <p className="text-sm text-gray-700 mb-2 font-medium">1. Voye <b>{product.price} HTG</b></p>
              <p className="text-sm text-gray-700">2. Sou nimewo: <b>3333-3333</b></p>
            </div>

            {/* Nòt Rasirans pou Kliyan an */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100 flex items-start gap-2">
              <span className="text-blue-600">ℹ️</span>
              <p className="text-[11px] text-blue-800 leading-tight">
                <b>NÒT:</b> Apre ou fin peye, n ap valide kòmand lan nan <b>5 a 15 minit</b>. Apre sa, w ap ka telechaje liv la sou paj "Rekipere Liv" la.
              </p>
            </div>

            <form onSubmit={handleOrder}>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ID Tranzaksyon Natcash</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg mb-4 text-black focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Eg: 12345678"
                value={natcashId}
                onChange={(e) => setNatcashId(e.target.value)}
              />
              
              {message && (
                <div className={`p-3 rounded-lg mb-4 text-xs font-bold text-center ${message.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 flex justify-center items-center"
              >
                {loading ? (
                   <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : 'Mwen fin peye'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}