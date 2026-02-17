import { useState } from 'react';
import { FileDown } from 'lucide-react';

export default function PdfButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { generatePdf } = await import('../utils/generatePdf');
      await generatePdf();
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-[13px] font-medium text-gray-600 dark:text-gray-400 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
    >
      <FileDown size={16} />
      {loading ? 'Erstelle PDF...' : 'PDF exportieren'}
    </button>
  );
}
