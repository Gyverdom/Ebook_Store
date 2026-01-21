"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductCard({ product }) {
  // Modal States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Payment Logic States
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- CHANJE NIMEWO SA YO POU PA W YO ---
  const NATCASH_AGENT_CODE = "324751"; 
  const MONCASH_NUMBER = "47360092";

  const closePaymentModal = () => {
    setIsPaymentOpen(false);
    setPaymentMethod(null);
    setMessage('');
    setTransactionId('');
    setPhone('');
  };

  async function handleOrder(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1. Anrejistre Lòd la nan Supabase
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

    if (error) {
      setLoading(false);
      setMessage('❌ Erè koneksyon. Re-eseye.');
      return;
    }

    // 2. VOYE NOTIFIKASYON TELEGRAM (Nouvo Pati a) 🚀
    // Nou fè l nan yon blòk "try" pou si Telegram gen pwoblèm, sa pa bloke kliyan an
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.title,
          price: product.price,
          transactionId: transactionId,
          phone: phone,
        }),
      });
    } catch (err) {
      console.error("Notifikasyon Telegram pa ale:", err);
      // Nou pa montre kliyan an erè sa a, paske lòd li a deja sove nan Supabase
    }

    // 3. Siksè - Montre mesaj vèt la
    setLoading(false);
    setMessage('✅ Lòd resevwa! N ap valide sa nan 5-15 minit.');
    
    // Fèmen fenèt la otomatikman apre 3.5 segonn
    setTimeout(closePaymentModal, 3500);
  }

  return (
    <>
      {/* --- KAT PWODWI A (Grid Item) --- */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100 group">
        
        {/* Imaj la (Klike sou li ouvri detay yo) */}
        <div className="relative cursor-pointer" onClick={() => setIsDetailsOpen(true)}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-full h-64 object-cover" />
          ) : (
            <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">Ebook</div>
          )}
          
          {/* Badge "Preview" si liv la gen lyen echantiyon */}
          {product.sample_link && (
            <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded shadow-sm z-10">
              PREVIEW GRATIS
            </span>
          )}

          {/* Hover Effect: "Wè Detay" */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
             <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition">
               👁️ Wè Detay
             </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow text-black">
          <div className="flex justify-between items-start mb-2">
             <h2 onClick={() => setIsDetailsOpen(true)} className="text-xl font-black leading-tight uppercase text-blue-950 cursor-pointer hover:text-blue-700 transition">
               {product.title}
             </h2>
          </div>

          {/* Ti Enfòmasyon Rapid (Paj) */}
          {product.pages > 0 && (
             <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">
               📄 {product.pages} Paj
             </p>
          )}

          {/* Deskripsyon Kout */}
          <div className="mb-4 flex-grow">
            <p className="text-gray-500 text-sm italic line-clamp-3">
              {product.description}
            </p>
            <button onClick={() => setIsDetailsOpen(true)} className="text-blue-600 text-xs font-bold mt-1 hover:underline">
              Li tout deskripsyon an &rarr;
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between mb-3">
               <span className="text-[10px] text-gray-400 uppercase font-bold">Pri</span>
               <p className="text-2xl font-black text-blue-900">{product.price} <span className="text-xs font-normal">HTG</span></p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {product.sample_link ? (
                <a href={product.sample_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center border-2 border-gray-200 text-gray-600 px-4 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-gray-50 transition">
                  📖 Li yon moso
                </a>
              ) : (
                <button onClick={() => setIsDetailsOpen(true)} className="flex items-center justify-center border-2 border-gray-200 text-gray-600 px-4 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-gray-50 transition">
                  👁️ Detay
                </button>
              )}
              <button onClick={() => setIsPaymentOpen(true)} className="bg-black text-white px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-gray-800 active:scale-95 transition">
                Achte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DETAY (Popup pou wè plis enfòmasyon) --- */}
      {isDetailsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-lg p-0 overflow-hidden shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] flex flex-col">
              
              {/* Header Imaj */}
              <div className="relative h-48 bg-gray-100 flex-shrink-0">
                {product.image_url && (
                   <img src={product.image_url} className="w-full h-full object-cover opacity-90" />
                )}
                <button onClick={() => setIsDetailsOpen(false)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-red-50 hover:text-red-500 transition font-bold shadow-sm">
                  ✕ Fèmen
                </button>
              </div>

              {/* Kontni an */}
              <div className="p-8 overflow-y-auto">
                 <h2 className="text-2xl font-black text-blue-900 mb-2 uppercase">{product.title}</h2>
                 
                 <div className="flex gap-4 mb-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-4">
                    <span>📄 {product.pages || '?'} Paj</span>
                    <span>💾 PDF Digital</span>
                    <span>⚡ Livrezon Imedya</span>
                 </div>

                 <div className="prose prose-sm text-gray-600 leading-relaxed mb-8">
                    <p className="whitespace-pre-line">{product.description}</p>
                 </div>

                 {/* Bouton Aksyon nan Modal la */}
                 <button 
                   onClick={() => { setIsDetailsOpen(false); setIsPaymentOpen(true); }}
                   className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition"
                 >
                   Achte pou {product.price} HTG
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL PEMAN (Fòmilè pou peye) --- */}
      {isPaymentOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 relative">
            
            {/* Tèt Modal Peman */}
            <div className="flex justify-between items-center mb-6">
              {paymentMethod ? (
                 <button onClick={() => setPaymentMethod(null)} className="text-xs text-blue-600 font-bold hover:underline uppercase">← Chanje Metòd</button>
              ) : (
                 <h3 className="font-black text-xl text-gray-900 italic uppercase">Peye Kounye a</h3>
              )}
              <button onClick={closePaymentModal} className="text-gray-400 hover:text-red-500 text-3xl font-light">&times;</button>
            </div>

            {/* Chwa Metòd Peman (Si li poko chwazi) */}
            {!paymentMethod && (
              <div className="space-y-4">
                <p className="text-center text-gray-500 text-xs font-bold uppercase mb-4">Ki sèvis ou vle itilize?</p>
                <button onClick={() => setPaymentMethod('natcash')} className="w-full bg-red-50 hover:bg-red-100 border border-red-200 p-4 rounded-2xl flex items-center justify-between group transition">
                  <div className="flex items-center gap-3"><span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded">N</span><div className="text-left"><p className="font-bold text-red-900 text-sm">Natcash</p><p className="text-[10px] text-gray-500">Retrait Ajan (*202#)</p></div></div><span className="text-red-400 group-hover:translate-x-1 transition">→</span>
                </button>
                <button onClick={() => setPaymentMethod('moncash')} className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 p-4 rounded-2xl flex items-center justify-between group transition">
                   <div className="flex items-center gap-3"><span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded">M</span><div className="text-left"><p className="font-bold text-gray-900 text-sm">MonCash</p><p className="text-[10px] text-gray-500">Transfè Senp (*212#)</p></div></div><span className="text-red-400 group-hover:translate-x-1 transition">→</span>
                </button>
              </div>
            )}

            {/* Fòmilè Peman (Si li fin chwazi MonCash oswa Natcash) */}
            {(paymentMethod === 'natcash' || paymentMethod === 'moncash') && (
               <div className="animate-in slide-in-from-right duration-200">
                  <div className={`p-5 rounded-2xl border text-center mb-6 ${paymentMethod === 'natcash' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Montan pou voye</p>
                    <p className="text-3xl font-black text-blue-900 mb-4">{product.price} HTG</p>
                    
                    <div className="bg-white p-3 rounded-xl border mb-4">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{paymentMethod === 'natcash' ? 'Kòd Ajan' : 'Nimewo MonCash'}</p>
                      <p className={`text-2xl font-mono font-black select-all ${paymentMethod === 'natcash' ? 'text-red-600' : 'text-gray-800'}`}>
                        {paymentMethod === 'natcash' ? NATCASH_AGENT_CODE : MONCASH_NUMBER}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleOrder} className="space-y-4">
                    <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Nimewo Telefòn Ou</label>
                        <input type="text" required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl font-bold outline-none text-black" placeholder="Eg: 44332211" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase ml-1">ID Tranzaksyon</label>
                        <input type="text" required className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl font-mono outline-none text-black" placeholder="Kole ID a la a..." value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                    </div>
                    
                    {message && <div className={`p-3 rounded-xl text-[10px] font-bold text-center italic ${message.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</div>}
                    
                    <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition hover:bg-gray-900">
                        {loading ? 'Ap Anrejistre...' : 'Mwen fin peye'}
                    </button>
                  </form>
               </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}