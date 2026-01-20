"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DownloadPage() {
  const [searchId, setSearchId] = useState('');
  const [phone, setPhone] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function checkOrder(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setOrderData(null);

    // 1. Chache lòd la nan Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('natcash_id', searchId)
      .eq('customer_phone', phone)
      .single();

    if (error || !order) {
      setMsg('❌ Enfòmasyon pa kòrèk. Verifye ID tranzaksyon an ak nimewo telefòn ou.');
      setLoading(false);
      return;
    }

    if (order.status !== 'completed') {
      setMsg('⏳ Peman ou an poko valide. N ap verifye sa nan 5-15 minit. Re-eseye yon ti moman.');
      setLoading(false);
      return;
    }

    // 2. BLOKAJ STRIK: Tcheke si moun nan te deja telechaje (limit = 1)
    if (order.download_count >= 1) {
      setMsg('🛑 Ou deja itilize dwa telechajman ou pou liv sa a. Ou pa ka ouvri paj sa a de fwa. Si w gen yon pwoblèm, kontakte nou sou WhatsApp.');
      setLoading(false);
      return;
    }

    // 3. Si tout bagay bon, nou make l kòm "itilize" (fè +1 kounye a)
    await supabase
      .from('orders')
      .update({ download_count: 1 })
      .eq('id', order.id);

    const { data: product } = await supabase
      .from('products')
      .select('download_link')
      .eq('id', order.product_id)
      .single();

    if (product) {
      setOrderData({ ...order, download_link: product.download_link });
    } else {
      setMsg('⚠️ Nou pa jwenn lyen an. Kontakte sipò a.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-black">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <h1 className="text-2xl font-black mb-2 text-blue-900 italic underline tracking-tighter">DijitalLektiYanm</h1>
        <p className="text-[10px] text-gray-400 font-bold mb-6 tracking-widest uppercase">Ebook Store</p>
        
        <div className="bg-red-50 p-3 rounded-lg mb-6 border border-red-100">
           <p className="text-[11px] text-red-600 font-bold leading-tight uppercase">
             ⚠️ Atansyon: Ou gen dwa ouvri lyen liv la yon sèl fwa.
           </p>
        </div>

        <form onSubmit={checkOrder} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nimewo Telefòn Ou:</label>
            <input 
              type="text" 
              required
              className="w-full border-2 border-gray-100 p-4 rounded-xl focus:border-blue-500 outline-none transition-all"
              placeholder="Eg: 44332211"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ID Tranzaksyon Natcash/Moncash:</label>
            <input 
              type="text" 
              required
              className="w-full border-2 border-gray-100 p-4 rounded-xl focus:border-blue-500 outline-none transition-all font-mono"
              placeholder="Kole ID a la a..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg active:scale-95"
          >
            {loading ? 'Ap verifye...' : 'Rekipere Liv Mwen'}
          </button>
        </form>

        {msg && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-100 animate-shake">
            {msg}
          </div>
        )}

        {/* TI BWA JÒN KI PARÈT LÈ TOUT BAGAY BON AN */}
        {orderData && (
          <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-2xl shadow-inner text-left animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl animate-bounce">🎁</span>
              <h3 className="font-black text-yellow-900 uppercase text-sm italic underline">Liv ou a Pare!</h3>
            </div>
            
            <p className="text-[11px] text-yellow-800 leading-tight mb-5 font-bold">
              TRÈ ENPÒTAN: Depi w klike bouton an, asire w ou SOVE (Save/Download) liv la sou telefòn ou. Ou pap ka ouvri paj sa a ankò!
            </p>
            
            <a 
              href={orderData.download_link} 
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-700 text-white py-4 rounded-xl font-black text-center shadow-lg hover:bg-blue-800 transition"
            >
              📥 TELECHAJE LIV LA KOUNYE A
            </a>
          </div>
        )}
      </div>
    </div>
  );
}