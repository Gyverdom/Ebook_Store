"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';

export default function DownloadPage() {
  const [searchId, setSearchId] = useState('');
  const [phone, setPhone] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // --- FONKSYON POU KREYE PDF LA ---
  const downloadInvoice = () => {
    if (!orderData) return;

    const doc = new jsPDF();
    const date = new Date(orderData.created_at).toLocaleDateString('fr-FR');

    // 1. Header (Logo ak Non)
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 153); // Koulè Bleu
    doc.text("DijitalLektiYanm", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Resi Peman Ofisyèl", 20, 26);
    doc.text("Sipò: +509 44 33 22 11", 20, 31);

    // 2. Liy separasyon
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // 3. Enfòmasyon Kliyan ak Lòd
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Dat: ${date}`, 20, 50);
    doc.text(`ID Tranzaksyon: ${orderData.natcash_id}`, 20, 60);
    doc.text(`Kliyan (Tel): ${orderData.customer_phone}`, 20, 70);

    // 4. Detay Pwodwi a
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 85, 170, 10, 'F'); // Ti bwat gri
    doc.setFontSize(10);
    doc.text("DESKRIPSYON", 25, 91);
    doc.text("PRI", 160, 91);

    doc.setFontSize(12);
    doc.text(orderData.product_name, 25, 105);
    doc.text(`${orderData.price} HTG`, 160, 105);

    // 5. Total
    doc.line(20, 115, 190, 115);
    doc.setFontSize(14);
    doc.text(`TOTAL PEYE: ${orderData.price} HTG`, 120, 125);

    // 6. Mesaj Remèsiman
    doc.setFontSize(11);
    doc.setTextColor(0, 100, 0); // Vèt fonse
    doc.text("Mèsi paske ou chwazi DijitalLektiYanm!", 105, 145, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Resi sa a pwouve ou gen aksè legal a dokiman sa a.", 105, 152, { align: "center" });

    // 7. Telechaje fichye a
    doc.save(`Resi-${orderData.natcash_id}.pdf`);
  };

  async function checkOrder(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setOrderData(null);

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('natcash_id', searchId)
      .eq('customer_phone', phone)
      .single();

    if (error || !order) {
      setMsg('❌ Enfòmasyon pa kòrèk. Verifye ID ak Telefòn.');
      setLoading(false);
      return;
    }

    if (order.status !== 'completed') {
      setMsg('⏳ Peman an poko valide. Re-eseye nan 5 minit.');
      setLoading(false);
      return;
    }

    if (order.download_count >= 1) {
      setMsg('🛑 Ou deja telechaje liv sa a. Lyen an ekspire.');
      setLoading(false);
      return;
    }

    // Update download count
    await supabase.from('orders').update({ download_count: 1 }).eq('id', order.id);

    const { data: product } = await supabase
      .from('products')
      .select('download_link')
      .eq('id', order.product_id)
      .single();

    if (product) {
      setOrderData({ ...order, download_link: product.download_link });
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
             ⚠️ Atansyon: Ou gen dwa telechaje liv la 1 fwa sèlman.
           </p>
        </div>

        {!orderData ? (
          <form onSubmit={checkOrder} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nimewo Telefòn Ou:</label>
              <input type="text" required className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none" placeholder="Eg: 44332211" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ID Tranzaksyon:</label>
              <input type="text" required className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none font-mono" placeholder="Kole ID a la a..." value={searchId} onChange={(e) => setSearchId(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition">
              {loading ? 'Ap verifye...' : 'Rekipere Liv Mwen'}
            </button>
          </form>
        ) : (
          <div className="mt-2 animate-in slide-in-from-bottom duration-500">
             {/* Bwat Siksè a */}
            <div className="p-6 bg-green-50 border-2 border-green-400 rounded-2xl shadow-inner text-left mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎉</span>
                <h3 className="font-black text-green-900 uppercase text-sm italic">Siksè!</h3>
              </div>
              <p className="text-[11px] text-green-800 leading-tight mb-5 font-bold">
                Klike bouton ble a pou w pran liv la.
              </p>
              <a href={orderData.download_link} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-700 text-white py-4 rounded-xl font-black text-center shadow-lg hover:bg-blue-800 transition">
                📥 TELECHAJE PDF LA
              </a>
            </div>

            {/* BOUTON POU TELECHAJE RESI A */}
            <button 
              onClick={downloadInvoice}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-xs uppercase border border-gray-300 hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              📄 Telechaje Resi Peman (Invoice)
            </button>
          </div>
        )}

        {msg && !orderData && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-100 animate-shake">{msg}</div>}
      </div>
    </div>
  );
}