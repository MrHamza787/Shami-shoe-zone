import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Star, 
  Flame, 
  Award,
  ChevronRight,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { Product, StoreSettings, Review } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../services/storeService';

interface HomePageProps {
  products: Product[];
  settings: StoreSettings;
  reviews: Review[];
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  settings,
  reviews,
  setActiveTab,
  setSelectedCategory,
  onSelectProduct,
}) => {
  const { isUrdu, t } = useLanguage();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const flashOffers = products.filter((p) => p.originalPrice > p.discountedPrice).slice(0, 3);

  const categoryCards = [
    {
      id: 'mens',
      title: isUrdu ? 'مردانہ جوتے' : "Men's Footwear",
      desc: isUrdu ? 'فارمل، کیژول اور ڈریس شوز' : 'Formals, Loafers & Casuals',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop',
      count: '15+ Styles',
    },
    {
      id: 'womens',
      title: isUrdu ? 'زنانہ جوتے' : "Women's Collection",
      desc: isUrdu ? 'بلاک ہیلز، پمپس اور آرام دہ فلیٹس' : 'Block Heels, Pumps & Slides',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
      count: '12+ Styles',
    },
    {
      id: 'kids',
      title: isUrdu ? 'بچوں کے جوتے' : "Kids' Shoes",
      desc: isUrdu ? 'اسکول اور پلے اسنیکرز' : 'Durable School & Play Sneakers',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=600&auto=format&fit=crop',
      count: '10+ Styles',
    },
    {
      id: 'sneakers',
      title: isUrdu ? 'اسنیکرز و اسپورٹس' : 'Sneakers & Sports',
      desc: isUrdu ? 'جاگنگ اور جدید اسٹریٹ ویئر' : 'Running, Gym & High-Tops',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
      count: '18+ Styles',
    },
    {
      id: 'formal',
      title: isUrdu ? 'فارمل لیدر شوز' : 'Formal Shoes',
      desc: isUrdu ? 'خالص چمڑے کے آکسفورڈ اور ڈربی' : 'Pure Leather Oxfords & Derbies',
      image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop',
      count: '14+ Styles',
    },
    {
      id: 'sandals',
      title: isUrdu ? 'پشاوری چپل و سلائیڈرز' : 'Peshawari & Slippers',
      desc: isUrdu ? 'روایتی دستکاری ڈبل سول چپل' : 'Traditional Kaptan Chappal & Slides',
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop',
      count: '16+ Styles',
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-neutral-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl border border-neutral-800">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1600&auto=format&fit=crop"
            alt="Shami Shoe Zone Abbottabad Banner"
            className="w-full h-full object-cover object-center opacity-30 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-24 lg:py-28 flex flex-col items-start justify-center max-w-2xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUrdu ? 'شامی شو زون – کالا پل، ایبٹ آباد' : 'Shami Shoe Zone • Kala Pul, Abbottabad'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-white leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
            {t('heroSubtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveTab('shop');
              }}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm shadow-xl hover:shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer group"
            >
              <span>{t('shopNow')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={getWhatsAppUrl(settings.whatsappNumber, 'Hello Shami Shoe Zone! I want to browse and order shoes via WhatsApp for delivery in Abbottabad.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('orderWhatsApp')}</span>
            </a>
          </div>

          {/* Quick Stats */}
          <div className="mt-10 pt-8 border-t border-neutral-800/80 grid grid-cols-3 gap-6 text-left">
            <div>
              <p className="text-lg sm:text-2xl font-bold font-serif text-white">100%</p>
              <p className="text-[11px] text-neutral-400">Genuine Footwear</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold font-serif text-amber-400">COD</p>
              <p className="text-[11px] text-neutral-400">Abbottabad Wide</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold font-serif text-white">7 Days</p>
              <p className="text-[11px] text-neutral-400">Size Exchange</p>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              {isUrdu ? 'کیٹیگریز' : 'Explore Collections'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif mt-1">
              {isUrdu ? 'ہر موقع کے لیے بہترین جوتے' : 'Footwear for Every Occasion'}
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('shop');
            }}
            className="text-xs font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1 group"
          >
            <span>{isUrdu ? 'تمام دیکھیں' : 'View All'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryCards.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveTab('shop');
              }}
              className="group relative rounded-2xl overflow-hidden border border-neutral-200/80 bg-neutral-900 aspect-square cursor-pointer shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute bottom-3 inset-x-3 text-white">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  {cat.count}
                </span>
                <h3 className="text-xs sm:text-sm font-bold tracking-tight mt-0.5">
                  {cat.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'خاص پیشکش' : 'Handpicked Selection'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif mt-1">
              {isUrdu ? 'نمایاں جوتے' : 'Featured Products'}
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('shop');
            }}
            className="text-xs font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1 group"
          >
            <span>{isUrdu ? 'سب دیکھیں' : 'See All'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Special Discount Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold backdrop-blur-md">
                <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
                <span>LIMITED TIME ABBOTTABAD SPECIAL DEALS</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-serif">
                {isUrdu ? 'خصوصی ڈسکاؤنٹ آفرز - 30% تک بچت' : 'Save up to 30% on Premium Footwear'}
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
                {isUrdu
                  ? 'کالا پل شامی شو زون پر فارمل اور اسنیکرز پر خصوصی رعایت۔ کیش آن ڈیلیوری کی سہولت موجود ہے۔'
                  : 'Exclusive seasonal discount on selected Italian Loafers, Peshawari Chappals & Running Shoes. Order now via WhatsApp!'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveTab('shop');
                }}
                className="px-6 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-xs shadow-lg transition-all"
              >
                {isUrdu ? 'ڈیلز شاپ کریں' : 'Shop Flash Deals'}
              </button>
              <a
                href={getWhatsAppUrl(settings.whatsappNumber, 'Hello Shami Shoe Zone! I am interested in the special discount footwear offers.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers & New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Best Sellers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">
                <Award className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'سب سے زیادہ پسندیدہ' : 'Customer Favorites'}</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-950 font-serif mt-0.5">
                {isUrdu ? 'بیسٹ سیلرز' : 'Best Sellers in Abbottabad'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                settings={settings}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>

        {/* New Arrivals */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'تازہ ترین کلیکشن' : 'Fresh Drops'}</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-950 font-serif mt-0.5">
                {isUrdu ? 'نیو ارائیولز' : 'New Arrivals'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                settings={settings}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-neutral-50/70 py-12 rounded-3xl border border-neutral-200/60">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            {isUrdu ? 'گاہکوں کی رائے' : 'Real Customer Reviews'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif mt-1">
            {isUrdu ? 'ایبٹ آباد کے صارفین کا بھروسہ' : 'Loved by Customers in Abbottabad'}
          </h2>
          <p className="text-xs text-neutral-500 mt-2">
            See what shoe shoppers in Kala Pul, Mandian, and Cantt have to say about Shami Shoe Zone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <p className="text-xs font-bold text-neutral-900">{rev.customerName}</p>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>{rev.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Physical Store Location & Contact Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-900 text-white p-6 sm:p-10 border border-neutral-800 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'فزیکل اسٹور' : 'Visit Our Physical Shop'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif">
              {isUrdu ? 'شامی جنرل اسٹور، کالا پل، ایبٹ آباد' : 'Shami Shoe Zone at Kala Pul'}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {isUrdu
                ? 'ہم آپ کو اپنے اسٹور پر خوش آمدید کہتے ہیں۔ آپ ہمارے اسٹور پر تشریف لا کر مختلف سائز اور ورائٹی خود چیک کر سکتے ہیں، یا گھر بیٹھے واٹس ایپ پر آرڈر دے کر کیش آن ڈیلیوری حاصل کر سکتے ہیں۔'
                : 'Experience the footwear in person at Shami General Store, Kala Pul, Abbottabad. Feel the genuine leather quality, try your exact shoe size, or enjoy free doorstep delivery in Abbottabad.'}
            </p>

            <div className="space-y-2 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Store Timing: 10:00 AM – 10:00 PM (Every Day)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Direct Contact: {settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Delivery Coverage: Kala Pul, Mandian, Cantt, Supply, PMA Road, Jinnahabad</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href={getWhatsAppUrl(settings.whatsappNumber, 'Hello Shami Shoe Zone! Please share directions to your Kala Pul shop.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get WhatsApp Location</span>
              </a>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveTab('shop');
                }}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
              >
                Browse All Shoes
              </button>
            </div>
          </div>

          {/* Interactive Map Visual Card */}
          <div className="rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-800 p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Abbottabad Landmark
                </span>
                <h4 className="text-lg font-bold text-white mt-1">
                  Kala Pul, Main Karakoram Highway
                </h4>
                <p className="text-xs text-neutral-400">
                  Easy accessibility near Kala Pul Bridge, Abbottabad
                </p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-700 text-amber-400">
                <MapPin className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-neutral-900/90 rounded-xl p-4 border border-neutral-700/60 text-xs space-y-2">
              <div className="flex justify-between text-neutral-300">
                <span>Distance from Mandian:</span>
                <span className="font-semibold text-white">~10 mins</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Distance from Abbottabad Cantt:</span>
                <span className="font-semibold text-white">~12 mins</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Delivery Time:</span>
                <span className="font-semibold text-emerald-400">Same Day / 2-4 Hours</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400">
              * Drivers equipped with multiple shoe sizes on request to guarantee your perfect fit!
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
