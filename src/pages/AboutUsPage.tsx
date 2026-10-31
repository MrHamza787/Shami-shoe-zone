import React from 'react';
import { Footprints, MapPin, Award, ShieldCheck, Heart, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StoreSettings } from '../types';

interface AboutUsPageProps {
  settings: StoreSettings;
  onGoToShop: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ settings, onGoToShop }) => {
  const { isUrdu } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
          <Footprints className="w-3.5 h-3.5" />
          <span>Kala Pul, Abbottabad</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-neutral-950 tracking-tight">
          {isUrdu ? 'شامی شو زون کی کہانی' : 'Crafting Every Step in Abbottabad'}
        </h1>

        <p className="text-sm text-neutral-600 leading-relaxed">
          {isUrdu
            ? 'شامی شو زون کا آغاز ایک واضح مقصد کے ساتھ ہوا: ایبٹ آباد کے باسیوں کو پائیدار، پرآسائش اور اعلیٰ ترین معیار کے جوتے مناسب قیمتوں پر ان کی دہلیز تک پہنچانا۔'
            : 'Located at Shami General Store, Kala Pul, Abbottabad, Shami Shoe Zone is committed to bringing footwear excellence to Hazara with unmatched comfort and genuine craftsmanship.'}
        </p>
      </div>

      {/* Story & Image Banner */}
      <div className="rounded-3xl overflow-hidden bg-neutral-900 text-white grid grid-cols-1 md:grid-cols-2 border border-neutral-800 shadow-xl">
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Our Heritage & Roots
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            A Trusted Name at Kala Pul
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            From handcrafted Peshawari chappals made with authentic full-grain cow leather to responsive cushioned sports sneakers, every shoe in our catalog is hand-selected for durability, weather resistance, and all-day comfort in the mountainous terrain of Abbottabad.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <MapPin className="w-4 h-4" />
            <span>Shami General Store, Kala Pul, Abbottabad</span>
          </div>
        </div>

        <div className="relative aspect-video md:aspect-auto">
          <img
            src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop"
            alt="Handcrafted Footwear at Shami Shoe Zone"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-950 font-serif">
            {isUrdu ? 'خالص چمڑا اور معیاری مٹیریل' : '100% Genuine Materials'}
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            We partner with master cobblers across Peshawar, Lahore, and Sialkot to ensure authentic leather uppers and durable tyre/rubber soles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-950 font-serif">
            {isUrdu ? 'ایکسپریس لوکل ڈیلیوری' : 'Express Local Delivery'}
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Deliveries dispatched straight from Kala Pul to Mandian, Cantt, Supply, PMA Kakul Road, Jinnahabad, and Nawan Shehr within hours.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-neutral-950 font-serif">
            {isUrdu ? 'سائز کی آسان تبدیلی' : 'Guaranteed Fit'}
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            If your shoes don't fit just right, our local Abbottabad exchange policy allows seamless size replacement with zero hassle.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onGoToShop}
          className="px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm shadow-xl"
        >
          Explore Shami Shoe Zone Catalog
        </button>
      </div>

    </div>
  );
};
