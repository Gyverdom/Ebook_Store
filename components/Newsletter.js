"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    // 1. Tcheke si email la egziste deja (opsyonèl men bon)
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      setStatus('exists');
      return;
    }

    // 2. Anrejistre email la
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      setStatus('success');
      setEmail('');
    }
  }

  return (
    <div className="w-full bg-[#0f172a] border-t border-gray-800 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2 block">
          Rete Konekte
        </span>
        <h2 className="text-3xl font-black text-white mb-4">
          Pa rate okenn nouvo liv
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Antre email ou pou w resevwa avètisman lè nou ajoute nouvo liv oswa fòmasyon sou platfòm nan.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="email@ou.com"
            required
            className="flex-grow bg-white/5 border border-gray-700 text-white px-5 py-4 rounded-xl outline-none focus:border-blue-500 transition placeholder-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-widest"
          >
            {status === 'loading' ? '...' : status === 'success' ? '✔ Anrejistre' : 'Abòne'}
          </button>
        </form>

        {/* Mesaj Siksè/Erè */}
        {status === 'success' && (
          <p className="text-green-400 text-sm mt-4 font-bold animate-in fade-in">
            🎉 Mèsi! Ou abòne avèk siksè.
          </p>
        )}
        {status === 'exists' && (
          <p className="text-yellow-400 text-sm mt-4 font-bold animate-in fade-in">
            ✋ Ou te deja nan lis nou an!
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-sm mt-4 font-bold animate-in fade-in">
            ❌ Gen yon ti erè. Re-eseye pita.
          </p>
        )}
      </div>
    </div>
  );
}