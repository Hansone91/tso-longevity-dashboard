import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { userData, categories, biomarkers, getByCategory, getStatus, getStatusLabel, calculateLongevityScore, getCategoryOptimalScore } from '../data/biomarkers';
import { disclaimers } from '../data/disclaimers';

const MARGIN = 20;
const PAGE_W = 210; // A4 mm
const CONTENT_W = PAGE_W - 2 * MARGIN;

function addText(doc, text, x, y, options = {}) {
  const { size = 10, style = 'normal', color = [60, 60, 60], maxWidth = CONTENT_W } = options;
  doc.setFontSize(size);
  doc.setFont('helvetica', style);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * (size * 0.45);
}

function ensureSpace(doc, y, needed) {
  if (y + needed > 275) {
    doc.addPage();
    return 30;
  }
  return y;
}

export async function generatePdf() {
  const doc = new jsPDF('p', 'mm', 'a4');

  // --- Cover Page ---
  let y = 60;
  addText(doc, 'LONGEVITY DASHBOARD', MARGIN, y, { size: 24, style: 'bold', color: [0, 122, 255] });
  y += 15;
  addText(doc, `Bericht für ${userData.name}`, MARGIN, y, { size: 14 });
  y += 10;
  addText(doc, `Erstellt am ${new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}`, MARGIN, y, { size: 11, color: [140, 140, 140] });
  y += 20;

  const score = calculateLongevityScore();
  addText(doc, `Biologisches Alter: ${userData.biologicalAge} Jahre`, MARGIN, y, { size: 16, style: 'bold' });
  y += 10;
  addText(doc, `Chronologisches Alter: ${userData.chronologicalAge} Jahre`, MARGIN, y, { size: 13 });
  y += 10;
  addText(doc, `Longevity Score: ${score} / 100`, MARGIN, y, { size: 13, color: score >= 75 ? [52, 199, 89] : score >= 50 ? [255, 149, 0] : [255, 59, 48] });

  // --- Chart page (capture from DOM if available) ---
  const chartEl = document.querySelector('.recharts-responsive-container');
  if (chartEl) {
    try {
      const canvas = await html2canvas(chartEl, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      doc.addPage();
      y = 30;
      addText(doc, 'Verlauf', MARGIN, y, { size: 16, style: 'bold' });
      y += 8;
      const imgData = canvas.toDataURL('image/png');
      const imgW = CONTENT_W;
      const imgH = (canvas.height / canvas.width) * imgW;
      doc.addImage(imgData, 'PNG', MARGIN, y, imgW, Math.min(imgH, 100));
      y += Math.min(imgH, 100) + 10;
    } catch {
      // Chart capture failed, skip
    }
  }

  // --- Categories overview ---
  doc.addPage();
  y = 30;
  addText(doc, 'Kategorien-Übersicht', MARGIN, y, { size: 16, style: 'bold' });
  y += 12;

  categories.forEach((cat) => {
    y = ensureSpace(doc, y, 15);
    const catScore = getCategoryOptimalScore(cat.id);
    const markers = getByCategory(cat.id);
    const good = markers.filter((m) => getStatus(m) === 'good').length;
    addText(doc, `${cat.label} — ${good} von ${markers.length} im Zielbereich (Score: ${catScore})`, MARGIN, y, { size: 11, style: 'bold' });
    y += 6;
    addText(doc, cat.description, MARGIN, y, { size: 9, color: [120, 120, 120] });
    y += 8;
  });

  // --- Detail pages per category ---
  categories.forEach((cat) => {
    doc.addPage();
    y = 30;
    addText(doc, cat.label, MARGIN, y, { size: 16, style: 'bold' });
    y += 12;

    const markers = getByCategory(cat.id);
    markers.forEach((m) => {
      y = ensureSpace(doc, y, 25);
      const status = getStatus(m);
      const statusLabel = getStatusLabel(status);
      const statusColor = status === 'good' ? [52, 199, 89] : status === 'warn' ? [255, 149, 0] : [255, 59, 48];

      addText(doc, m.label, MARGIN, y, { size: 11, style: 'bold' });
      y += 5;
      addText(doc, `Wert: ${m.value} ${m.unit} — ${statusLabel}`, MARGIN, y, { size: 9, color: statusColor });
      y += 4;
      const normText = `Norm: ${m.normMin != null ? m.normMin : '–'} – ${m.normMax != null ? m.normMax : '–'} ${m.unit}`;
      addText(doc, normText, MARGIN, y, { size: 9, color: [140, 140, 140] });
      y += 4;
      if (m.optMin !== null || m.optMax !== null) {
        addText(doc, `Optimal: ${m.optMin != null ? m.optMin : '–'} – ${m.optMax != null ? m.optMax : '–'} ${m.unit}`, MARGIN, y, { size: 9, color: [140, 140, 140] });
        y += 4;
      }
      if (m.tip) {
        addText(doc, `Tipp: ${m.tip}`, MARGIN, y, { size: 9, color: [0, 122, 255] });
        y += 4;
      }
      y += 4;
    });
  });

  // --- Disclaimer page ---
  doc.addPage();
  y = 30;
  addText(doc, 'Haftungsausschluss', MARGIN, y, { size: 16, style: 'bold' });
  y += 12;
  addText(doc, disclaimers.footer, MARGIN, y, { size: 10, color: [100, 100, 100] });
  y += 15;
  addText(doc, disclaimers.simulationDisclaimer.text, MARGIN, y, { size: 10, color: [100, 100, 100] });

  // Save
  doc.save(`longevity-bericht-${userData.name.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
