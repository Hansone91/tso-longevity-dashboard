import { disclaimers } from '../data/disclaimers';

export default function DisclaimerFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-[540px] mx-auto px-6 py-2.5">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed text-center">
          {disclaimers.footer}
        </p>
      </div>
    </div>
  );
}
