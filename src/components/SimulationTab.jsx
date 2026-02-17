import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { interventions, calculateProjection } from '../data/interventions';
import { biomarkers, getStatus, getFlagged } from '../data/biomarkers';
import { disclaimers } from '../data/disclaimers';

const catOrder = ['Ernährung', 'Bewegung', 'Lifestyle'];

function useAnimatedValue(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    startRef.current = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      setDisplay(+current.toFixed(1));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  // Update fromRef when animation finishes
  useEffect(() => { fromRef.current = display; }, [display]);

  return display;
}

function SimulationDisclaimer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden animate-in">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left"
      >
        <span className="text-[13px]">ℹ️</span>
        <span className="flex-1 text-[12px] font-medium text-gray-600 dark:text-gray-400">
          {disclaimers.simulationDisclaimer.title}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 animate-in">
          <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">
            {disclaimers.simulationDisclaimer.text}
          </p>
        </div>
      )}
    </div>
  );
}

function InterventionDetail({ item, result }) {
  const [open, setOpen] = useState(false);
  const affected = Object.keys(item.effects).map((markerId) => {
    const marker = biomarkers.find((m) => m.id === markerId);
    if (!marker) return null;
    const proj = result.projected.find((p) => p.id === markerId);
    return { marker, projectedValue: proj?.projectedValue ?? marker.value };
  }).filter(Boolean);

  return (
    <div>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="w-full flex items-center gap-1 mt-1 text-left"
      >
        <span className="text-[11px] text-gray-400 dark:text-gray-500">Details</span>
        <ChevronDown size={12} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-2 space-y-1 animate-in">
          {affected.map(({ marker, projectedValue }) => (
            <div key={marker.id} className="flex items-center text-[11px]">
              <span className="flex-1 text-gray-500 dark:text-gray-400">{marker.label}</span>
              <span className="tabular-nums text-gray-400">{marker.value}</span>
              <span className="mx-1 text-gray-300 dark:text-gray-600">→</span>
              <span className={`tabular-nums font-medium ${projectedValue !== marker.value ? 'text-accent' : 'text-gray-500'}`}>
                {projectedValue}
              </span>
              <span className="text-[10px] text-gray-400 ml-1 w-10 text-right">{marker.unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniProjectionChart({ userData, bioAgeChange, months }) {
  if (bioAgeChange === 0) return null;

  const currentAge = userData.biologicalAge;
  const projectedAge = currentAge + bioAgeChange;
  const steps = 4;
  const data = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // ease-out curve for projection
    const age = currentAge + bioAgeChange * (1 - Math.pow(1 - t, 2));
    data.push({ month: Math.round(t * months), age: +age.toFixed(1) });
  }

  return (
    <div className="card p-4 animate-in">
      <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
        Projizierter Verlauf · {months} Monate
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
          <Line type="monotone" dataKey="age" stroke="#34C759" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function SimulationTab({ onProjectionChange, userData, dark, preSelectedIntervention }) {
  const [selected, setSelected] = useState([]);
  const [months, setMonths] = useState(6);

  // Handle pre-selection from BiomarkersTab
  useEffect(() => {
    if (preSelectedIntervention && !selected.includes(preSelectedIntervention)) {
      setSelected((s) => [...s, preSelectedIntervention]);
    }
  }, [preSelectedIntervention]);

  const result = calculateProjection(biomarkers, selected, months);
  const flaggedIds = getFlagged().flatMap((m) => m.id);

  useEffect(() => { onProjectionChange(result); }, [selected, months]);

  const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const projectedRaw = userData.biologicalAge + result.bioAgeChange;
  const animatedAge = useAnimatedValue(selected.length === 0 ? userData.biologicalAge : +projectedRaw.toFixed(1));

  // Check if intervention addresses flagged markers
  const isRecommended = (item) => {
    return Object.keys(item.effects).some((markerId) => {
      const marker = biomarkers.find((m) => m.id === markerId);
      return marker && getStatus(marker) !== 'good';
    });
  };

  return (
    <div className="space-y-4 animate-in">
      {/* Simulation Disclaimer (Level 3) */}
      <SimulationDisclaimer />

      {/* Result */}
      <div className="card p-6 text-center">
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-1">
          {selected.length === 0 ? 'Biologisches Alter' : `Szenario · ${months} Monate`}
        </p>
        <p className="text-[56px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white tabular-nums">
          {animatedAge}
        </p>
        {selected.length > 0 && result.bioAgeChange !== 0 && (
          <p className="text-[15px] font-semibold text-accent mt-2 tabular-nums">
            {result.bioAgeChange} Jahre
          </p>
        )}
        {selected.length === 0 && (
          <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-2">
            Wähle Maßnahmen aus und sieh, was sich ändern könnte.
          </p>
        )}
      </div>

      {/* Time */}
      <div className="flex gap-2">
        {[3, 6, 12].map((m) => (
          <button
            key={m}
            onClick={() => setMonths(m)}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
              months === m
                ? 'bg-primary text-white dark:bg-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
          >
            {m} Monate
          </button>
        ))}
      </div>

      {/* Combination hint */}
      {selected.length > 3 && (
        <div className="card p-4 border-l-[3px] border-l-orange animate-in">
          <p className="text-[12px] text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-orange">Hinweis:</span> Bei mehr als 3 gleichzeitigen Maßnahmen könnte sich der Gesamteffekt durch Sättigungseffekte abschwächen. Die Projektion berücksichtigt dies bereits.
          </p>
        </div>
      )}

      {/* Mini projection chart */}
      {selected.length > 0 && (
        <MiniProjectionChart userData={userData} bioAgeChange={result.bioAgeChange} months={months} />
      )}

      {/* Interventions */}
      {catOrder.map((catName) => {
        const items = interventions.filter((i) => i.category === catName);
        if (!items.length) return null;
        return (
          <div key={catName}>
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5 px-1">
              {catName}
            </p>
            <div className="card divide-y divide-gray-50 dark:divide-gray-800 overflow-hidden">
              {items.map((item) => {
                const on = selected.includes(item.id);
                const recommended = isRecommended(item);
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => toggle(item.id)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* Toggle */}
                      <span className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all ${
                        on ? 'border-primary bg-primary dark:border-white dark:bg-white' : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {on && (
                          <svg className={`w-3 h-3 ${dark ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-medium text-gray-900 dark:text-white">{item.label}</p>
                          {recommended && (
                            <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary dark:bg-blue-400/10 dark:text-blue-400 text-[10px] font-semibold">
                              Empfohlen
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-gray-400 dark:text-gray-500">{item.description}</p>
                      </div>
                      <span className="text-[13px] font-semibold text-accent tabular-nums flex-shrink-0">
                        {item.bioAgeEffect} J.
                      </span>
                    </button>
                    {/* Per-intervention detail view */}
                    {on && (
                      <div className="px-5 pb-3">
                        <InterventionDetail item={item} result={result} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Disclaimer */}
      <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed text-center px-4">
        Szenarien basierend auf wissenschaftlichen Durchschnittswerten.
        Keine individuelle Vorhersage. Bei Fragen wende dich an deinen Arzt.
      </p>
    </div>
  );
}
