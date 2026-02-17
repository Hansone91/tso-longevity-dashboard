// Evidence-based interventions — user-friendly language
// Effects: conservative lower-bound estimates from meta-analyses

export const interventions = [
  {
    id: 'omega3',
    label: 'Omega-3 nehmen',
    description: 'Fisch\u00f6l oder Algen\u00f6l, 2\u20134g t\u00e4glich',
    category: 'Ern\u00e4hrung',
    bioAgeEffect: -0.2,
    effects: { triglycerides: -0.25, crp_sensitive: -0.03 },
  },
  {
    id: 'vitamin_d_supp',
    label: 'Vitamin D supplementieren',
    description: '2.000\u20134.000 IE t\u00e4glich',
    category: 'Ern\u00e4hrung',
    bioAgeEffect: -0.1,
    effects: { vitamin_d: 30 },
  },
  {
    id: 'mediterranean',
    label: 'Mediterran ern\u00e4hren',
    description: 'Viel Gem\u00fcse, Oliven\u00f6l, Fisch, N\u00fcsse',
    category: 'Ern\u00e4hrung',
    bioAgeEffect: -0.7,
    effects: { ldl: -0.3, hdl: 0.05, crp_sensitive: -0.03, hba1c: -0.1 },
  },
  {
    id: 'fasting',
    label: 'Intervallfasten 16:8',
    description: '16 Std. Pause, 8 Std. Essenszeit',
    category: 'Ern\u00e4hrung',
    bioAgeEffect: -0.4,
    effects: { glucose: -0.2, triglycerides: -0.15, crp_sensitive: -0.02 },
  },
  {
    id: 'endurance',
    label: 'Regelm\u00e4\u00dfig Ausdauer',
    description: 'Laufen, Radfahren, Schwimmen \u2013 3\u00d7/Woche',
    category: 'Bewegung',
    bioAgeEffect: -0.8,
    effects: { crp_sensitive: -0.04, hdl: 0.12, hba1c: -0.15, triglycerides: -0.2 },
  },
  {
    id: 'strength',
    label: 'Krafttraining',
    description: 'Gewichte oder K\u00f6rpergewicht \u2013 3\u00d7/Woche',
    category: 'Bewegung',
    bioAgeEffect: -0.6,
    effects: { testosterone: 0.4, dhea_s: 0.3, glucose: -0.2 },
  },
  {
    id: 'sleep',
    label: 'Schlaf optimieren',
    description: '7\u20138 Stunden, fester Rhythmus',
    category: 'Lifestyle',
    bioAgeEffect: -0.4,
    effects: { cortisol: -20, crp_sensitive: -0.02, testosterone: 0.3 },
  },
  {
    id: 'meditation',
    label: 'Stress reduzieren',
    description: 'Meditation, Achtsamkeit, Natur \u2013 20 Min./Tag',
    category: 'Lifestyle',
    bioAgeEffect: -0.3,
    effects: { cortisol: -15, crp_sensitive: -0.02 },
  },
];

export const durationMultipliers = { 3: 0.5, 6: 0.8, 12: 1.0 };

export function calculateProjection(currentBiomarkers, selectedIds, months) {
  const mult = durationMultipliers[months] || 1.0;
  const selected = interventions.filter((i) => selectedIds.includes(i.id));

  const aggregated = {};
  let totalBioAge = 0;

  selected.forEach((item) => {
    totalBioAge += item.bioAgeEffect;
    Object.entries(item.effects).forEach(([id, change]) => {
      aggregated[id] = (aggregated[id] || 0) + change;
    });
  });

  // Diminishing returns if > 3 selected
  const factor = selected.length > 3 ? 0.8 : 1;
  Object.keys(aggregated).forEach((k) => { aggregated[k] *= mult * factor; });
  totalBioAge *= mult * factor;

  const projected = currentBiomarkers.map((m) => ({
    ...m,
    projectedValue: Math.max(0, +(m.value + (aggregated[m.id] || 0)).toFixed(2)),
  }));

  return { projected, bioAgeChange: +totalBioAge.toFixed(1) };
}

export function getInterventionForMarker(markerId) {
  return interventions.filter((i) =>
    Object.keys(i.effects).includes(markerId)
  );
}
