import { useState } from 'react';
import { Share2 } from 'lucide-react';

export default function ShareButton() {
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-[13px] font-medium text-gray-600 dark:text-gray-400 transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Share2 size={16} />
        Ergebnisse teilen
      </button>

      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black text-[13px] font-medium shadow-lg animate-in">
          Demnächst verfügbar
        </div>
      )}
    </>
  );
}
