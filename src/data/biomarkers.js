export const userData = {
  name: 'Max',
  chronologicalAge: 30,
  biologicalAge: 27.3,
  sex: 'male',
  lastMeasurement: '2022-02-01',
};

export const biologicalAgeHistory = [
  { date: '2020-08-15', bioAge: 29.1, chronoAge: 28.5 },
  { date: '2021-02-01', bioAge: 28.5, chronoAge: 29.0 },
  { date: '2021-08-01', bioAge: 28.0, chronoAge: 29.5 },
  { date: '2022-02-01', bioAge: 27.3, chronoAge: 30.0 },
];

export const categories = [
  { id: 'cardiovascular', label: 'Herz & Gefäße', description: 'Cholesterin, Blutfette & Gefäßgesundheit', color: '#EF4444', weight: 0.25 },
  { id: 'metabolism', label: 'Stoffwechsel', description: 'Blutzucker & Energiehaushalt', color: '#F59E0B', weight: 0.20 },
  { id: 'hormones', label: 'Hormone', description: 'Hormonhaushalt & Balance', color: '#8B5CF6', note: 'Hormonwerte schwanken natürlich im Tagesverlauf.', weight: 0.20 },
  { id: 'inflammation', label: 'Entzündung & Abwehr', description: 'Immunsystem & stille Entzündungen', color: '#06B6D4', weight: 0.20 },
  { id: 'nutrients', label: 'Nährstoffe', description: 'Vitamine, Mineralstoffe & Speicher', color: '#22C55E', weight: 0.15 },
];

export const biomarkers = [
  // Cardiovascular
  { id: 'cholesterol_total', category: 'cardiovascular', label: 'Gesamtcholesterin', detail: 'Summe aller Cholesterin-Bestandteile im Blut', value: 5.22, unit: 'mmol/l', normMin: null, normMax: 5.2, optMin: null, optMax: 5.0, min: 0, max: 8, tip: 'Ballaststoffe erhöhen, gesunde Fette bevorzugen' },
  { id: 'ldl', category: 'cardiovascular', label: 'LDL – \u201eschlechtes\u201c Cholesterin', detail: 'Kann sich in Gefäßwänden ablagern', value: 3.38, unit: 'mmol/l', normMin: null, normMax: 4.1, optMin: null, optMax: 3.0, min: 0, max: 6 },
  { id: 'hdl', category: 'cardiovascular', label: 'HDL – \u201egutes\u201c Cholesterin', detail: 'Transportiert Cholesterin zurück zur Leber', value: 1.39, unit: 'mmol/l', normMin: 1.04, normMax: null, optMin: 1.55, optMax: null, min: 0, max: 3 },
  { id: 'ldl_hdl_ratio', category: 'cardiovascular', label: 'Verhältnis LDL/HDL', detail: 'Je niedriger, desto besser', value: 2.4, unit: '', normMin: null, normMax: 3.0, optMin: null, optMax: 2.0, min: 0, max: 6 },
  { id: 'triglycerides', category: 'cardiovascular', label: 'Blutfette (Triglyceride)', detail: 'Fette aus der Nahrung im Blut', value: 2.16, unit: 'mmol/l', normMin: null, normMax: 1.71, optMin: null, optMax: 1.13, min: 0, max: 4, tip: 'Omega-3, weniger Zucker & Alkohol, Ausdauersport' },
  { id: 'non_hdl', category: 'cardiovascular', label: 'Non-HDL-Cholesterin', detail: 'Alle \u201eunguten\u201c Cholesterin-Anteile zusammen', value: 3.8, unit: 'mmol/l', normMin: null, normMax: 3.4, optMin: null, optMax: 3.0, min: 0, max: 6, tip: 'Mediterrane Ernährung, Ballaststoffe' },

  // Metabolism
  { id: 'hba1c', category: 'metabolism', label: 'Langzeit-Blutzucker (HbA1c)', detail: 'Durchschnittlicher Blutzucker der letzten 3 Monate', value: 5.3, unit: '%', normMin: 4.0, normMax: 6.0, optMin: 4.5, optMax: 5.2, min: 3, max: 8 },
  { id: 'glucose', category: 'metabolism', label: 'Nüchtern-Blutzucker', detail: 'Blutzucker nach mind. 8h ohne Essen', value: 5.4, unit: 'mmol/l', normMin: 3.3, normMax: 5.3, optMin: 3.9, optMax: 4.9, min: 2, max: 8, tip: 'Intervallfasten, Spazieren nach Mahlzeiten' },

  // Hormones
  { id: 'testosterone', category: 'hormones', label: 'Testosteron', detail: 'Wichtig für Muskeln, Energie & Stimmung', value: 3.59, unit: 'ng/ml', normMin: 1.65, normMax: 7.53, optMin: 4.0, optMax: 7.0, min: 0, max: 10 },
  { id: 'dhea_s', category: 'hormones', label: 'DHEA-S – Jugendhormon', detail: 'Vorstufe vieler Hormone, sinkt mit dem Alter', value: 2.09, unit: 'mg/l', normMin: 1.47, normMax: 5.53, optMin: 2.5, optMax: 5.0, min: 0, max: 7 },
  { id: 'cortisol', category: 'hormones', label: 'Cortisol – Stresshormon', detail: 'Zu viel kann Alterungsprozesse beschleunigen', value: 175, unit: 'µg/l', normMin: 50, normMax: 250, optMin: 80, optMax: 180, min: 0, max: 350 },
  { id: 'shbg', category: 'hormones', label: 'SHBG – Hormon-Transportprotein', detail: 'Bindet Hormone und regelt deren Verfügbarkeit', value: 27.2, unit: 'nmol/l', normMin: 14.6, normMax: 94.6, optMin: 20, optMax: 55, min: 0, max: 120 },

  // Inflammation
  { id: 'crp_sensitive', category: 'inflammation', label: 'Stille Entzündung (hs-CRP)', detail: 'Schlüsselmarker für chronische Mikro-Entzündungen', value: 0.18, unit: 'mg/l', normMin: null, normMax: 3.0, optMin: null, optMax: 1.0, min: 0, max: 5 },
  { id: 'leukocytes', category: 'inflammation', label: 'Weiße Blutkörperchen', detail: 'Zellen des Immunsystems', value: 4.3, unit: 'Gpt/l', normMin: 3.9, normMax: 10.2, optMin: 4.0, optMax: 7.0, min: 0, max: 15 },
  { id: 'nlr', category: 'inflammation', label: 'Entzündungs-Verhältnis (NLR)', detail: 'Verhältnis zweier Immunzell-Typen – zeigt stille Entzündungen', value: 2.5, unit: '', normMin: null, normMax: 3.0, optMin: null, optMax: 2.0, min: 0, max: 8 },

  // Nutrients
  { id: 'vitamin_d', category: 'nutrients', label: 'Vitamin D', detail: 'Knochen, Immunsystem, Stimmung', value: 129, unit: 'nmol/l', normMin: 75, normMax: 125, optMin: 100, optMax: 125, min: 0, max: 250, tip: 'Leicht über Norm – Dosis prüfen' },
  { id: 'vitamin_b12', category: 'nutrients', label: 'Vitamin B12', detail: 'Nerven & Blutbildung', value: 650, unit: 'pg/ml', normMin: 211, normMax: 911, optMin: 400, optMax: 800, min: 0, max: 1200 },
  { id: 'folate', category: 'nutrients', label: 'Folsäure', detail: 'Zellteilung & DNA-Reparatur', value: 9.74, unit: 'µg/l', normMin: 5.38, normMax: 25, optMin: 10, optMax: 20, min: 0, max: 25 },
  { id: 'ferritin', category: 'nutrients', label: 'Eisenspeicher (Ferritin)', detail: 'Wie viel Eisen dein Körper in Reserve hat', value: 90, unit: 'µg/l', normMin: 30, normMax: 400, optMin: 50, optMax: 150, min: 0, max: 500 },
  { id: 'magnesium', category: 'nutrients', label: 'Magnesium', detail: 'Muskeln, Nerven, Schlaf', value: 37.8, unit: 'mg/l', normMin: 30, normMax: 40, optMin: 33, optMax: 38, min: 20, max: 50 },
  { id: 'calcium', category: 'nutrients', label: 'Calcium', detail: 'Knochen & Muskelfunktion', value: 2.53, unit: 'mmol/l', normMin: 2.15, normMax: 2.58, optMin: 2.3, optMax: 2.5, min: 1.5, max: 3.5 },
];

export function getStatus(marker) {
  const { value, normMin, normMax } = marker;
  if (normMin !== null && value < normMin) return 'bad';
  if (normMax !== null && value > normMax) return 'warn';
  return 'good';
}

export function getOptimalStatus(marker) {
  const { value, optMin, optMax } = marker;
  if (optMin !== null && value < optMin) return false;
  if (optMax !== null && value > optMax) return false;
  return true;
}

export function getByCategory(categoryId) {
  return biomarkers.filter((m) => m.category === categoryId);
}

export function getCategoryScore(categoryId) {
  const markers = getByCategory(categoryId);
  const good = markers.filter((m) => getStatus(m) === 'good').length;
  return Math.round((good / markers.length) * 100);
}

export function getCategoryOptimalScore(categoryId) {
  const markers = getByCategory(categoryId);
  let totalScore = 0;
  markers.forEach((m) => {
    const status = getStatus(m);
    if (status !== 'good') {
      totalScore += 0;
    } else if (getOptimalStatus(m)) {
      totalScore += 100;
    } else {
      totalScore += 60;
    }
  });
  return Math.round(totalScore / markers.length);
}

export function calculateLongevityScore() {
  let weightedSum = 0;
  let totalWeight = 0;
  categories.forEach((cat) => {
    const score = getCategoryOptimalScore(cat.id);
    weightedSum += score * cat.weight;
    totalWeight += cat.weight;
  });
  return Math.round(weightedSum / totalWeight);
}

export function getCategoriesSorted() {
  return [...categories].sort((a, b) => getCategoryOptimalScore(a.id) - getCategoryOptimalScore(b.id));
}

export function getStatusLabel(s) {
  return { good: 'Im grünen Bereich', warn: 'Leicht auffällig', bad: 'Auffällig' }[s];
}

// Get flagged markers sorted by severity
export function getFlagged() {
  return biomarkers
    .filter((m) => getStatus(m) !== 'good')
    .sort((a, b) => (getStatus(a) === 'bad' ? -1 : 1));
}

// Get the single highest-priority recommendation
export function getTopPriority() {
  const flagged = getFlagged();
  if (!flagged.length) return null;
  return flagged[0];
}
