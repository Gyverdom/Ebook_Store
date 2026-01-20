"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'natcash' oswa 'moncash'
  const [transactionId, setTransactionId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // CONFIGURASYON (Mete vrè nimewo ou yo la)
  const NATCASH_AGENT_CODE = "324751"; 
  const MONCASH_NUMBER = "47360092";

  // Reset tout bagay lè nou fèmen modal la
  const closeModal = () => {
    setIsModalOpen(false);
    setPaymentMethod(null);
    setMessage('');
    setTransactionId('');
    setPhone('');
  };

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
      setTimeout(closeModal, 3500);
    }
  }

  return (
    <>
      {/* --- KAT PWODWI A (Li rete menm jan an) --- */}
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
              <span className="text-[10px] text-gray-400 uppercase font-bold">Pri</span>
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

      {/* --- MODAL PEMAN (Nouvo Design) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 relative">
            
            {/* Header Modal la */}
            <div className="flex justify-between items-center mb-6">
              {paymentMethod ? (
                 <button onClick={() => setPaymentMethod(null)} className="text-sm text-blue-600 font-bold hover:underline">← Chanje</button>
              ) : (
                 <h3 className="font-black text-xl text-gray-900 italic uppercase">Peye Kounye a</h3>
              )}
              <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-3xl font-light">&times;</button>
            </div>

            {/* --- EKRAN 1: CHWAZI METOD LA --- */}
            {!paymentMethod && (
              <div className="space-y-4">
                <p className="text-center text-gray-500 text-sm mb-4">Ki sèvis ou vle itilize?</p>
                
                <button 
                  onClick={() => setPaymentMethod('natcash')}
                  className="w-full bg-red-50 hover:bg-red-100 border border-red-200 p-4 rounded-2xl flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded">N</span>
                    <div className="text-left">
                      <p className="font-bold text-red-900">Natcash</p>
                      <p className="text-[10px] text-gray-500">Retrait Ajan</p>
                    </div>
                  </div>
                  <span className="text-red-400 group-hover:translate-x-1 transition">→</span>
                </button>

                <button 
                  onClick={() => setPaymentMethod('moncash')}
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 p-4 rounded-2xl flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded">M</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">MonCash</p>
                      <p className="text-[10px] text-gray-500">Transfè Senp</p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:translate-x-1 transition">→</span>
                </button>
              </div>
            )}

            {/* --- EKRAN 2: DETAY PEMAN YO --- */}
            {paymentMethod === 'natcash' && (
              <div className="animate-in slide-in-from-right duration-200">
                <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center mb-6">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Montan pou voye</p>
                  <p className="text-3xl font-black text-blue-900 mb-4">{product.price} HTG</p>
                  
                  <div className="bg-white p-3 rounded-xl border border-red-100 mb-4">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Kòd Ajan an</p>
                    <p className="text-2xl font-mono font-black text-red-600 select-all">{NATCASH_AGENT_CODE}</p>
                  </div>

                  {/* ENSTRIKSYON USSD NATCASH */}
                  <div className="text-left bg-red-100 p-3 rounded-lg">
                    <p className="text-[10px] font-bold text-red-800 mb-1 uppercase">🛠 Kijan pou fè l:</p>
                    <ol className="text-[10px] text-red-900 space-y-1 list-decimal ml-3">
                      <li>Tape <b>*202#</b> sou telefòn ou.</li>
                      <li>Chwazi opsyon <b>Retrait</b> (Cash Out).</li>
                      <li>Antre kòd ajan an: <b>{NATCASH_AGENT_CODE}</b>.</li>
                      <li>Mete montan an: <b>{product.price}</b>.</li>
                      <li>Konfime ak PIN ou.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'moncash' && (
              <div className="animate-in slide-in-from-right duration-200">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-center mb-6">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Montan pou voye</p>
                  <p className="text-3xl font-black text-blue-900 mb-4">{product.price} HTG</p>
                  
                  <div className="bg-white p-3 rounded-xl border border-gray-200 mb-4">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Nimewo MonCash</p>
                    <p className="text-2xl font-mono font-black text-gray-800 select-all">{MONCASH_NUMBER}</p>
                  </div>

                  {/* ENSTRIKSYON USSD MONCASH */}
                  <div className="text-left bg-gray-200 p-3 rounded-lg">
                    <p className="text-[10px] font-bold text-gray-700 mb-1 uppercase">🛠 Kijan pou fè l:</p>
                    <ol className="text-[10px] text-gray-800 space-y-1 list-decimal ml-3">
                      <li>Tape <b>*202#</b> oswa ouvri App MonCash la.</li>
                      <li>Chwazi opsyon <b>Voye Lajan</b>.</li>
                      <li>Mete nimewo a: <b>{MONCASH_NUMBER}</b>.</li>
                      <li>Mete montan an: <b>{product.price}</b>.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* --- FOMILÈ KOMEN (Parèt sèlman lè yo fin chwazi metòd la) --- */}
            {paymentMethod && (
              <form onSubmit={handleOrder} className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Nimewo Telefòn Ou (Pou verifikasyon)</label>
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
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-1">ID Tranzaksyon an</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-black font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Kole ID a la a..." 
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
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}