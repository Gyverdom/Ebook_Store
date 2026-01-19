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
          // Matche ak kolòn Supabase ou yo egzakteman:
          product_name: product.title, 
          product_id: product.id,   // Nou ajoute sa paske tab ou a genyen l
          price: product.price,     // Ou sipoze te ajoute kolòn sa a nan Supabase
          natcash_id: natcashId,
          status: 'pending'
          // customer_phone: nou pa voye l, asire w kolòn nan "Nullable" nan Supabase
        },
      ]);

    setLoading(false);
    
    if (error) {
      console.error('Erè Supabase:', error); // Sa ap ede w wè vrè erè a nan Console la
      setMessage('Erè: Verifye si tab orders la gen kolòn "price".');
    } else {
      setMessage('✅ Lòd resevwa! N ap verifye l rapid.');
      setNatcashId('');
      setTimeout(() => setIsModalOpen(false), 2000);
    }
  }

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition">
      <h2 className="text-xl font-bold text-gray-800">{product.title}</h2>
      <p className="text-gray-600 my-2 text-sm">{product.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-green-600 font-bold text-lg">{product.price} HTG</span>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          Achte
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-lg mb-2">Peye ak Natcash</h3>
            <div className="bg-gray-50 p-3 rounded mb-4 text-sm border border-gray-200">
              <p>1. Voye <b>{product.price} HTG</b></p>
              <p>2. Sou: <b>3333-3333</b></p>
            </div>
            <form onSubmit={handleOrder}>
              <input 
                type="text" 
                required
                className="w-full border p-2 rounded mb-3 text-black"
                placeholder="ID Tranzaksyon (eg: 123456)"
                value={natcashId}
                onChange={(e) => setNatcashId(e.target.value)}
              />
              {message && <p className="text-sm text-green-600 mb-2 font-bold">{message}</p>}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700"
              >
                {loading ? 'Ap verifye...' : 'Konfime Peman'}
              </button>
            </form>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="mt-3 text-sm text-gray-500 w-full text-center"
            >
              Fèmen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}