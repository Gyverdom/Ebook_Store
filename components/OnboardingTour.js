"use client";
import { useState, useEffect } from 'react';

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Verifye si itilizatè a te deja wè gid la
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      // Si l poko wè l, tann 1 segonn epi ouvri l
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleFinish = () => {
    setIsOpen(false);
    // Sove nan memwa telefòn nan ke li fin wè gid la
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in duration-300 relative overflow-hidden">
        
        {/* Dekorasyon dèyè */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* ETAP 1: Byenveni */}
        {step === 1 && (
          <div className="text-center">
            <div className="text-4xl mb-4">👋</div>
            <h3 className="text-xl font-black text-blue-900 mb-2">Byenveni sou DijitalLektiYanm!</h3>
            <p className="text-gray-600 text-sm mb-6">
              Nou kontan wè w. Sa se premye libreri dijital ki pèmèt ou achte liv ak fòmasyon an Kreyòl fasilman.
            </p>
            <button onClick={handleNext} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Kòmanse Gid la →
            </button>
          </div>
        )}

        {/* ETAP 2: Chwazi Liv */}
        {step === 2 && (
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Chwazi Liv Ou</h3>
            <p className="text-gray-600 text-sm mb-6">
              Navige nan katalòg la. Ou ka klike sou <b>"Li yon moso"</b> pou w goute liv la gratis, oswa klike <b>"Detay"</b> pou w wè plis enfòmasyon.
            </p>
            <button onClick={handleNext} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
              Kontinye →
            </button>
          </div>
        )}

        {/* ETAP 3: Peman */}
        {step === 3 && (
          <div className="text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Peye an Sekirite</h3>
            <p className="text-gray-600 text-sm mb-6">
              Itilize <b>MonCash</b> oswa <b>Natcash</b>. Sistèm nan ap ba w tout enstriksyon yo (Kòd Ajan, elatriye) lè w klike "Achte".
            </p>
            <button onClick={handleNext} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
              Kontinye →
            </button>
          </div>
        )}

        {/* ETAP 4: Telechaje */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-4xl mb-4">📥</div>
            <h3 className="text-xl font-black text-green-700 mb-2">Resevwa l Touswit!</h3>
            <p className="text-gray-600 text-sm mb-6">
              Depi peman an valid (5-15 minit), n ap ba w yon lyen pou telechaje liv la sou telefòn ou.
            </p>
            <button onClick={handleFinish} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg">
              Mwen Konprann! Ann Ale! 🚀
            </button>
          </div>
        )}

        {/* Ti pwen anba pou montre pwogresyon */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${step === i ? 'bg-blue-600 w-4' : 'bg-gray-200'} transition-all`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}