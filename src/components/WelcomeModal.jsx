import { useState, useEffect } from 'react';
import { disclaimers } from '../data/disclaimers';

const STORAGE_KEY = 'longevity-welcome-seen';

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch { /* localStorage unavailable */ }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in">
      <div className="card p-8 max-w-[440px] w-full text-center">
        <p className="text-[22px] font-bold text-gray-900 dark:text-white mb-3">
          {disclaimers.welcome.title}
        </p>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
          {disclaimers.welcome.text}
        </p>
        <button
          onClick={dismiss}
          className="w-full py-3 rounded-2xl bg-primary text-white font-semibold text-[15px] transition-all hover:opacity-90 dark:bg-white dark:text-black"
        >
          {disclaimers.welcome.button}
        </button>
      </div>
    </div>
  );
}
