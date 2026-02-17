import { useState, useCallback } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import { userData, biologicalAgeHistory } from './data/biomarkers';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import BiomarkersTab from './components/BiomarkersTab';
import SimulationTab from './components/SimulationTab';

import WelcomeModal from './components/WelcomeModal';

const tabs = [
  { id: 'overview', label: 'Übersicht' },
  { id: 'biomarkers', label: 'Meine Werte' },
  { id: 'simulation', label: 'Was wäre wenn' },
];

export default function App() {
  const [dark, setDark] = useDarkMode();
  const [tab, setTab] = useState('overview');
  const [projection, setProjection] = useState(null);
  const [preSelectedIntervention, setPreSelectedIntervention] = useState(null);

  const onProjection = useCallback((p) => setProjection(p), []);

  const switchTab = (id) => {
    setTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSimulation = (interventionId) => {
    setPreSelectedIntervention(interventionId);
    switchTab('simulation');
  };

  return (
    <div className="min-h-screen">
      <WelcomeModal />
      <div className="max-w-[540px] mx-auto px-6 pb-12">
        <Header userData={userData} dark={dark} setDark={setDark} />

        {/* Tabs */}
        <nav className="flex gap-1 mt-10 mb-8 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => switchTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                tab === t.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <main>
          {tab === 'overview' && (
            <OverviewTab userData={userData} history={biologicalAgeHistory} dark={dark} projection={projection} />
          )}
          {tab === 'biomarkers' && (
            <BiomarkersTab onNavigateToSimulation={handleNavigateToSimulation} />
          )}
          {tab === 'simulation' && (
            <SimulationTab
              onProjectionChange={onProjection}
              userData={userData}
              dark={dark}
              preSelectedIntervention={preSelectedIntervention}
            />
          )}
        </main>
      </div>
    </div>
  );
}
