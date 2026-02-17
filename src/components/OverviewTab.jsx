import { biomarkers, getStatus, getCategoriesSorted, getCategoryOptimalScore, getByCategory, getFlagged, getTopPriority, calculateLongevityScore } from '../data/biomarkers';
import TimelineChart from './TimelineChart';
import PdfButton from './PdfButton';
import ShareButton from './ShareButton';

function LongevityScoreRing() {
  const score = calculateLongevityScore();
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#34C759' : score >= 50 ? '#FF9500' : '#FF3B30';

  let description;
  if (score >= 75) {
    description = 'Deine Werte zeigen ein insgesamt starkes Profil.';
  } else if (score >= 50) {
    description = 'Es gibt Potenzial zur Optimierung einiger Bereiche.';
  } else {
    description = 'Mehrere Bereiche verdienen Aufmerksamkeit.';
  }

  return (
    <div className="card p-6 text-center animate-in">
      <svg width="128" height="128" viewBox="0 0 128 128" className="mx-auto">
        <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="8" className="stroke-gray-100 dark:stroke-gray-800" />
        <circle
          cx="64" cy="64" r={radius} fill="none" strokeWidth="8" strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
          className="transition-all duration-700"
        />
        <text x="64" y="58" textAnchor="middle" className="fill-gray-900 dark:fill-white" fontSize="32" fontWeight="800" fontFamily="'IBM Plex Mono', monospace">
          {score}
        </text>
        <text x="64" y="76" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="11" fontWeight="500">
          von 100
        </text>
      </svg>
      <p className="text-[15px] font-semibold text-gray-900 dark:text-white mt-3">Longevity Score</p>
      <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
}

function PriorityCard() {
  const top = getTopPriority();
  if (!top) return null;

  const status = getStatus(top);
  const isBad = status === 'bad';

  return (
    <div className={`card p-5 animate-in-1 border-l-[3px] ${isBad ? 'border-l-red' : 'border-l-orange'}`}>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">
        Priorität
      </p>
      <p className="text-[15px] font-semibold text-gray-900 dark:text-white">{top.label}</p>
      <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
        {top.value} {top.unit} — {top.detail}
      </p>
      {top.tip && (
        <p className="text-[12px] text-primary dark:text-blue-400 mt-2 font-medium">
          Studien zeigen: {top.tip}
        </p>
      )}
    </div>
  );
}

function CategoryRow({ cat }) {
  const markers = getByCategory(cat.id);
  const good = markers.filter((m) => getStatus(m) === 'good').length;
  const all = markers.length;
  const score = getCategoryOptimalScore(cat.id);
  const color = score >= 75 ? '#34C759' : score >= 50 ? '#FF9500' : '#FF3B30';

  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
        <div className="flex-1">
          <p className="text-[14px] font-medium text-gray-900 dark:text-white">{cat.label}</p>
        </div>
        <span className="text-[12px] text-gray-500 dark:text-gray-400 tabular-nums">
          {good} von {all} im Zielbereich
        </span>
      </div>
      {/* Horizontal progress bar */}
      <div className="relative h-[6px] rounded-full bg-gray-100 dark:bg-gray-800 ml-5">
        <div
          className="absolute h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

function NextMeasurement({ userData }) {
  const lastDate = new Date(userData.lastMeasurement);
  const nextDate = new Date(lastDate);
  nextDate.setMonth(nextDate.getMonth() + 6);
  const formatted = nextDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  return (
    <div className="card p-4 flex items-center gap-3 animate-in-3">
      <span className="text-[20px]">📅</span>
      <div>
        <p className="text-[13px] font-medium text-gray-900 dark:text-white">Nächste Messung</p>
        <p className="text-[12px] text-gray-400 dark:text-gray-500">{formatted}</p>
      </div>
    </div>
  );
}

export default function OverviewTab({ userData, history, dark, projection }) {
  const sortedCategories = getCategoriesSorted();

  return (
    <div className="space-y-4">
      <LongevityScoreRing />
      <PriorityCard />

      {/* Timeline */}
      <TimelineChart history={history} projection={projection} dark={dark} />

      {/* Categories - sorted by score ascending (most action needed first) */}
      <div className="card px-5 animate-in-2">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {sortedCategories.map((cat) => (
            <CategoryRow key={cat.id} cat={cat} />
          ))}
        </div>
      </div>

      <NextMeasurement userData={userData} />

      {/* Actions */}
      <div className="flex gap-3 animate-in-4">
        <PdfButton userData={userData} />
        <ShareButton />
      </div>
    </div>
  );
}
