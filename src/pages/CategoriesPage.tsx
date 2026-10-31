import React from 'react';
import { ArrowRight, Footprints, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CategoryType, Product } from '../types';

interface CategoriesPageProps {
  products: Product[];
  onSelectCategory: (cat: CategoryType) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  products,
  onSelectCategory,
}) => {
  const { isUrdu } = useLanguage();

  const categoryList: {
    id: CategoryType;
    title: string;
    titleUrdu: string;
    description: string;
    descriptionUrdu: string;
    image: string;
    featuredTag: string;
  }[] = [
    {
      id: 'mens',
      title: "Men's Footwear",
      titleUrdu: 'مردانہ جوتے',
      description: 'Handcrafted leather oxfords, casual loafers, formal lace-ups and boots.',
      descriptionUrdu: 'خالص چمڑے کے آکسفورڈز، لوفیرز اور دفتری جوتے۔',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      featuredTag: 'Top Selling in Abbottabad',
    },
    {
      id: 'womens',
      title: "Women's Collection",
      titleUrdu: 'زنانہ کلیکشن',
      description: 'Elegant block heels, comfortable flats, party pumps, and everyday sandals.',
      descriptionUrdu: 'خوبصورت بلاک ہیلز، پارٹی پمپس اور آرام دہ فلیٹس۔',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      featuredTag: 'New Arrivals',
    },
    {
      id: 'kids',
      title: "Kids' Shoes",
      titleUrdu: 'بچوں کے جوتے',
      description: 'Durable school shoes, light-up sneakers, and comfortable play footwear.',
      descriptionUrdu: 'اسکول کے پائیدار جوتے اور بچوں کے اسپورٹ اسنیکرز۔',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop',
      featuredTag: 'High Durability',
    },
    {
      id: 'sneakers',
      title: 'Sneakers & Sports',
      titleUrdu: 'اسنیکرز اور اسپورٹس',
      description: 'Breathable running shoes, gym trainers, and trendy urban high-top sneakers.',
      descriptionUrdu: 'جاگنگ اور واک کے لیے ہوا دار میش اسنیکرز۔',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      featuredTag: 'Comfort Cushioning',
    },
    {
      id: 'formal',
      title: 'Formal & Office Shoes',
      titleUrdu: 'فارمل اور دفتری جوتے',
      description: 'Polished genuine leather dress shoes suited for weddings and professional offices.',
      descriptionUrdu: 'شادی بیاہ اور دفاتر کے لیے بہترین پالش لیدر شوز۔',
      image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop',
      featuredTag: 'Genuine Cow Leather',
    },
    {
      id: 'casual',
      title: 'Casual Shoes & Loafers',
      titleUrdu: 'کیژول اور لوفیرز',
      description: 'Easy slip-on driving loafers, suede moccasins, and versatile daily shoes.',
      descriptionUrdu: 'آسانی سے پہننے والے روزمرہ کے آرام دہ لوفیرز۔',
      image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop',
      featuredTag: 'Daily Wear',
    },
    {
      id: 'sandals',
      title: 'Traditional Peshawari & Sandals',
      titleUrdu: 'روایتی پشاوری چپل و سینڈل',
      description: 'Authentic twin-stitched Kaptan Peshawari Chappal with solid tyre soles.',
      descriptionUrdu: 'اصل روایتی کپتان چپل اور مضبوط سول والی آرام دہ چپل۔',
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop',
      featuredTag: 'Handcrafted Pride',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Shami Shoe Zone Categories
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-neutral-950">
          {isUrdu ? 'جوتوں کے تمام زمرے' : 'Footwear Collections & Categories'}
        </h1>
        <p className="text-xs text-neutral-500">
          Explore curated shoe styles handcrafted and delivered all across Abbottabad.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryList.map((cat) => {
          const itemCount = products.filter((p) => cat.id === 'all' || p.category === cat.id).length;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[16/10] w-full overflow-hidden relative bg-neutral-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold">
                  {cat.featuredTag}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-xs font-bold shadow-xs">
                  {itemCount} Styles
                </span>
              </div>

              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-neutral-950 group-hover:text-amber-600 transition-colors">
                    {cat.title}
                  </h3>
                  {cat.titleUrdu && (
                    <p className="text-xs font-semibold text-neutral-500">
                      {cat.titleUrdu}
                    </p>
                  )}
                  <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
                  <span>Browse Collection</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
