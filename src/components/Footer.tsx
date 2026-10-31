import React from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  MessageCircle,
  Footprints
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setActiveTab, setSelectedCategory }) => {
  const { isUrdu, t } = useLanguage();
  const { user } = useAuth();

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-24 md:pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions / Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isUrdu ? 'پورے ایبٹ آباد میں ڈیلیوری' : 'Abbottabad Home Delivery'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {isUrdu ? 'کالا پل، منڈیاں، سپلائی اور کینٹ تک ایکسپریس ترسیل' : 'Prompt delivery to Mandian, Cantt, Supply, PMA & beyond.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isUrdu ? 'کیش آن ڈیلیوری (COD)' : 'Cash on Delivery (COD)'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {isUrdu ? 'پہلے جوتے چیک کریں، پھر رقم ادا کریں' : 'Inspect your shoes upon arrival, then pay cash with confidence.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isUrdu ? 'آسان سائز ایکسچینج' : 'Easy Size Replacement'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {isUrdu ? 'اگر سائز درست نہ آئے تو فوری تبدیلی کی سہولت' : '7-day hassle-free shoe size exchange guarantee.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {isUrdu ? 'واٹس ایپ آرڈر سپورٹ' : 'Instant WhatsApp Orders'}
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                {isUrdu ? 'ہماری ٹیم آپ کی رہنمائی کے لیے تیار ہے' : 'Direct order confirmation and live sizing help on WhatsApp.'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif font-bold text-lg">
                SSZ
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif tracking-wide">
                  Shami Shoe Zone
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {isUrdu ? 'کالا پل، ایبٹ آباد، پاکستان' : 'Kala Pul, Abbottabad, Pakistan'}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {isUrdu
                ? 'شامی شو زون ایبٹ آباد کا بااعتماد جوتوں کا اسٹور ہے۔ ہم مردانہ، زنانہ اور بچوں کے لیے بہترین کوالٹی کے جوتے، اسنیکرز، فارمل لیدر شوز اور پشاوری چپل مناسب قیمتوں پر فراہم کرتے ہیں۔'
                : 'Shami Shoe Zone is Abbottabad’s premier footwear destination located at Shami General Store, Kala Pul. From handcrafted leather shoes and traditional Peshawari chappals to running sneakers and women’s party heels, we deliver premium comfort to your doorstep.'}
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hello Shami Shoe Zone Abbottabad, I would like to visit the store or place an order.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isUrdu ? 'واٹس ایپ پر رابطہ کریں' : 'Chat on WhatsApp: ' + settings.displayWhatsApp}</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {isUrdu ? 'کیٹیگریز' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setSelectedCategory('mens'); setActiveTab('shop'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  {isUrdu ? 'مردانہ جوتے' : "Men's Footwear"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('womens'); setActiveTab('shop'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  {isUrdu ? 'زنانہ کلیکشن' : "Women's Collection"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('kids'); setActiveTab('shop'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  {isUrdu ? 'بچوں کے جوتے' : "Kids' Shoes"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('sneakers'); setActiveTab('shop'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  {isUrdu ? 'اسپورٹس و اسنیکرز' : 'Sneakers & Sports'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('formal'); setActiveTab('shop'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  {isUrdu ? 'فارمل لیدر شوز' : 'Formal Leather Shoes'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('sandals'); setActiveTab('shop'); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  {isUrdu ? 'روایتی پشاوری چپل' : 'Peshawari Chappal'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Store Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {isUrdu ? 'مدد و معلومات' : 'Customer Service'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-amber-400 transition-colors">
                  {t('aboutUs')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition-colors">
                  {t('contactUs')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('policies')} className="hover:text-amber-400 transition-colors">
                  {isUrdu ? 'تبدیلی و واپسی پالیسی' : 'Return & Exchange Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('policies')} className="hover:text-amber-400 transition-colors">
                  {isUrdu ? 'پرائیویسی پالیسی' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('orders')} className="hover:text-amber-400 transition-colors">
                  {t('myOrders')}
                </button>
              </li>
              {user?.email?.toLowerCase() === 'awan11118@gmail.com' && (
                <li>
                  <button onClick={() => setActiveTab('admin')} className="text-amber-400 hover:text-amber-300 font-semibold">
                    🛡️ Admin Dashboard
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Store Location & Timings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {isUrdu ? 'اسٹور کی تفصیلات' : 'Store Details'}
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  {isUrdu ? settings.storeAddressUrdu : settings.storeAddress}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{settings.storeTiming}</p>
                  <p className="text-[11px] text-neutral-500">Open all 7 days a week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} Shami Shoe Zone – Kala Pul, Abbottabad. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
              Cash on Delivery (PKR)
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-emerald-400">
              WhatsApp Verified Store
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
