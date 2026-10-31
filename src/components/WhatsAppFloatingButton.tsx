import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { StoreSettings } from '../types';
import { getWhatsAppUrl } from '../services/storeService';
import { useLanguage } from '../context/LanguageContext';

interface WhatsAppFloatingButtonProps {
  settings: StoreSettings;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ settings }) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const { isUrdu } = useLanguage();

  const handleOpenWhatsApp = () => {
    const text = "Hello Shami Shoe Zone! I am visiting your website and have a question about footwear availability and delivery in Abbottabad.";
    window.open(getWhatsAppUrl(settings.whatsappNumber, text), '_blank');
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Small popover prompt */}
      {showTooltip && (
        <div className="mb-2 bg-white rounded-2xl shadow-xl border border-neutral-200 p-3 max-w-[220px] text-xs animate-in fade-in slide-in-from-bottom-2 relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 text-neutral-400 hover:text-neutral-600 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <strong className="text-neutral-900 font-semibold">
              {isUrdu ? 'آن لائن واٹس ایپ آرڈر' : 'WhatsApp Orders'}
            </strong>
          </div>
          <p className="text-[11px] text-neutral-600">
            {isUrdu 
              ? 'ایبٹ آباد میں فوری ڈیلیوری اور سائز معلوم کرنے کے لیے رابطہ کریں' 
              : 'Direct chat with Shami Shoe Zone team at Kala Pul, Abbottabad'}
          </p>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleOpenWhatsApp}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white group cursor-pointer"
        aria-label="Chat on WhatsApp with Shami Shoe Zone"
        title="WhatsApp: +92 312 9876543"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">Order on WhatsApp</span>
      </button>
    </div>
  );
};
