import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header({ userData, dark, setDark }) {
  const diff = userData.chronologicalAge - userData.biologicalAge;
  const isYounger = diff > 0;

  const [displayAge, setDisplayAge] = useState(0);
  useEffect(() => {
    const target = userData.biologicalAge;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / 1400, 1);
      setDisplayAge(+(target * (1 - Math.pow(1 - p, 3))).toFixed(1));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [userData.biologicalAge]);

  return (
    <header className="pt-12 animate-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-16">
        <span className="text-[13px] font-semibold tracking-wide text-gray-400 dark:text-gray-500">
          LONGEVITY
        </span>
        <button
          onClick={() => setDark(!dark)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Dunkelmodus"
          title={dark ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Hero */}
      <div className="text-center">
        <p className="text-[15px] text-gray-500 dark:text-gray-400 mb-4 font-medium">
          Dein biologisches Alter
        </p>
        <p className="text-[96px] md:text-[120px] font-extrabold leading-[0.85] tracking-tighter text-gray-900 dark:text-white animate-pop">
          {displayAge}
        </p>
        <p className="text-[15px] text-gray-400 dark:text-gray-500 mt-3 font-medium">
          Jahre
        </p>
      </div>

      {/* Meta line */}
      <div className="flex items-center justify-center gap-4 mt-8 text-[13px]">
        <span className="text-gray-400 dark:text-gray-500">
          Chronologisch <strong className="text-gray-600 dark:text-gray-300 font-semibold">{userData.chronologicalAge}</strong>
        </span>
        <span className={`font-semibold tabular-nums ${isYounger ? 'text-accent' : 'text-red'}`}>
          {isYounger ? '\u2212' : '+'}{Math.abs(diff).toFixed(1)} Jahre {isYounger ? 'jünger' : 'älter'}
        </span>
      </div>

      {/* Explainer */}
      <p className="text-[12px] text-gray-400 dark:text-gray-500 text-center mt-3 leading-relaxed">
        Das biologische Alter zeigt, wie fit dein Körper im Vergleich zu deinem tatsächlichen Alter ist.
      </p>
    </header>
  );
}
