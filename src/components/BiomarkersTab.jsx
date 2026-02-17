import { useState } from 'react';
import { categories, getByCategory, getStatus, getStatusLabel, getFlagged } from '../data/biomarkers';
import { getInterventionForMarker } from '../data/interventions';
import { disclaimers } from '../data/disclaimers';

const dot = { good: 'bg-accent', warn: 'bg-orange', bad: 'bg-red' };
const statusBg = { good: 'bg-accent/10', warn: 'bg-orange/10', bad: 'bg-red/10' };

function Marker({ m, defaultOpen, onTipClick, highlighted }) {
  const [open, setOpen] = useState(defaultOpen);
  const status = getStatus(m);
  const range = m.max - m.min;
  const pos = Math.max(2, Math.min(98, ((m.value - m.min) / range) * 100));
  const nL = m.normMin !== null ? ((m.normMin - m.min) / range) * 100 : 0;
  const nR = m.normMax !== null ? ((m.normMax - m.min) / range) * 100 : 100;

  // Optimal range within norm
  const oL = m.optMin !== null ? ((m.optMin - m.min) / range) * 100 : nL;
  const oR = m.optMax !== null ? ((m.optMax - m.min) / range) * 100 : nR;

  const interventionsForMarker = getInterventionForMarker(m.id);
  const hasTipAction = m.tip && interventionsForMarker.length > 0 && onTipClick;

  return (
    <button
      onClick={() => setOpen(!open)}
      className={`w-full text-left py-3.5 group ${highlighted ? 'border-l-[3px] border-l-orange pl-3 -ml-3' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${dot[status]}`} />
        <span className="flex-1 text-[14px] text-gray-900 dark:text-white font-medium">{m.label}</span>
        <span className="text-[14px] font-semibold tabular-nums text-gray-900 dark:text-white">{m.value}</span>
        <span className="text-[11px] text-gray-400 w-14 text-right">{m.unit}</span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-[6px] rounded-full bg-gray-100 dark:bg-gray-800 mt-2.5 ml-[22px]">
        {/* Norm range */}
        <div className="absolute h-full rounded-full bg-accent/15 dark:bg-accent/10" style={{ left: `${nL}%`, width: `${nR - nL}%` }} />
        {/* Optimal range - darker zone within norm */}
        <div className="absolute h-full rounded-full bg-accent/30 dark:bg-accent/25" style={{ left: `${oL}%`, width: `${oR - oL}%` }} />
        {/* Value dot */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full ${dot[status]} ring-2 ring-white dark:ring-gray-900 transition-all`}
          style={{ left: `${pos}%`, marginLeft: '-5px' }}
        />
      </div>

      {open && (
        <div className="mt-3 ml-[22px] text-[12px] leading-relaxed animate-in space-y-1.5">
          <p className="text-gray-500 dark:text-gray-400">{m.detail}</p>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBg[status]} ${
              status === 'good' ? 'text-accent' : status === 'warn' ? 'text-orange' : 'text-red'
            }`}>
              {getStatusLabel(status)}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              Norm: {m.normMin != null ? m.normMin : '–'} – {m.normMax != null ? m.normMax : '–'} {m.unit}
            </span>
          </div>
          {/* Optimal range label */}
          {(m.optMin !== null || m.optMax !== null) && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Optimal: {m.optMin != null ? m.optMin : '–'} – {m.optMax != null ? m.optMax : '–'} {m.unit}
            </p>
          )}
          {/* Tappable tip as button */}
          {m.tip && (
            hasTipAction ? (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTipClick(interventionsForMarker[0].id);
                }}
                className="inline-block text-[12px] text-primary dark:text-blue-400 font-medium cursor-pointer hover:underline"
              >
                Studien zeigen: {m.tip} →
              </span>
            ) : (
              <p className="text-[12px] text-primary dark:text-blue-400 font-medium">
                Studien zeigen: {m.tip}
              </p>
            )
          )}
          {/* Contextual disclaimer for flagged markers */}
          {status !== 'good' && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 italic mt-1">
              {disclaimers.markerHint}
            </p>
          )}
        </div>
      )}
    </button>
  );
}

export default function BiomarkersTab({ onNavigateToSimulation }) {
  const [showAll, setShowAll] = useState(false);
  const flagged = getFlagged();
  const flaggedIds = new Set(flagged.map((m) => m.id));

  const handleTipClick = (interventionId) => {
    if (onNavigateToSimulation) {
      onNavigateToSimulation(interventionId);
    }
  };

  return (
    <div className="space-y-5 animate-in">
      {/* Toggle */}
      <div className="flex gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800">
        <button
          onClick={() => setShowAll(false)}
          className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
            !showAll
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          Auffällige Werte
        </button>
        <button
          onClick={() => setShowAll(true)}
          className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
            showAll
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          Alle Werte
        </button>
      </div>

      {!showAll ? (
        // Flagged-only view
        <>
          {flagged.length > 0 ? (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5 px-1">
                Handlungsbedarf
              </p>
              <div className="card overflow-hidden">
                <div className="px-5 divide-y divide-gray-50 dark:divide-gray-800">
                  {flagged.map((m) => <Marker key={m.id} m={m} defaultOpen={true} onTipClick={handleTipClick} />)}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center">
              <p className="text-[18px] font-bold text-gray-900 dark:text-white">Alles im Zielbereich</p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Keine auffälligen Werte gefunden.</p>
            </div>
          )}
        </>
      ) : (
        // All values view - no duplicates, flagged highlighted with colored left border
        <>
          {categories.map((cat) => {
            const markers = getByCategory(cat.id);
            return (
              <div key={cat.id}>
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5 px-1">
                  {cat.label}
                </p>
                <div className="card overflow-hidden">
                  {cat.note && (
                    <p className="px-5 pt-3 text-[11px] text-gray-400 dark:text-gray-500 italic">{cat.note}</p>
                  )}
                  <div className="px-5 divide-y divide-gray-50 dark:divide-gray-800">
                    {markers.map((m) => (
                      <Marker
                        key={m.id}
                        m={m}
                        defaultOpen={getStatus(m) !== 'good'}
                        onTipClick={handleTipClick}
                        highlighted={flaggedIds.has(m.id)}
                      />
                    ))}
                  </div>
                  <div className="h-2" />
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
