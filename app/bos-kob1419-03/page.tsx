"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  // Nou itilize <any[]> pou evite erè TypeScript
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fonksyon pou chache tout kòmand yo
  async function fetchOrders() {
    let { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false }); // Dènye kòmand an premye
    
    if (error) console.log('Erè chajman:', error);
    if (data) setOrders(data);
    setLoading(false);
  }

  // 2. Fonksyon pou Valide yon lòd (Lè ou resevwa lajan an)
  async function markAsPaid(orderId: any) {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId);

    if (!error) {
      alert('✅ Lòd valide avèk siksè!');
      fetchOrders(); // Rafrechi lis la otomatikman
    } else {
      console.log(error);
      alert('❌ Erè: Tcheke si RLS dezaktive pou UPDATE nan Supabase.');
    }
  }

  // Lòde done yo lè paj la louvri
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black border-b pb-4">
          Admin Dashboard (Jesyon Natcash)
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 text-white uppercase font-medium">
              <tr>
                <th className="py-3 px-4">Dat</th>
                <th className="py-3 px-4">Pwodwi</th>
                <th className="py-3 px-4">Pri</th>
                <th className="py-3 px-4">Natcash ID</th>
                <th className="py-3 px-4">Estati</th>
                <th className="py-3 px-4 text-center">Aksyon</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-bold">{order.product_name}</td>
                  <td className="py-3 px-4">{order.price} HTG</td>
                  <td className="py-3 px-4 font-mono text-blue-600 bg-blue-50 rounded px-2 w-fit">
                    {order.natcash_id}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {order.status !== 'completed' && (
                      <button 
                        onClick={() => markAsPaid(order.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                      >
                        Valide Peman
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && !loading && (
            <div className="p-10 text-center text-gray-500">
              Pa gen kòmand pou kounye a.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}