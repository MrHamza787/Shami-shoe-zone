import React, { useState } from 'react';
import { ShoppingBag, Star, MessageCircle, Eye, Check } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../services/storeService';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  onSelectProduct: (product: Product) => void;
  onOpenQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { isUrdu } = useLanguage();

  const [selectedSize, setSelectedSize] = useState<string | number>(product.sizes[0] || '41');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Standard');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = product.originalPrice > product.discountedPrice
    ? Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Hello Shami Shoe Zone Abbottabad!\nI am interested in this shoe:\n*${product.name}*\nPrice: PKR ${product.discountedPrice.toLocaleString()}\nSize: ${selectedSize}\nColor: ${selectedColor}\nIs this in stock at Kala Pul for delivery in Abbottabad?`;
    window.open(getWhatsAppUrl(settings.whatsappNumber, msg), '_blank');
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-amber-400 text-[10px] font-bold border border-amber-500/40 shadow-xs">
            ★ Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold shadow-xs">
            New Arrival
          </span>
        )}
      </div>

      {/* Stock Status Pill */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
          product.inStock 
            ? 'bg-emerald-500/90 text-white shadow-xs' 
            : 'bg-red-500/90 text-white shadow-xs'
        }`}>
          {product.inStock ? (isUrdu ? 'دستیاب' : 'In Stock') : (isUrdu ? 'ختم' : 'Out of Stock')}
        </span>
      </div>

      {/* Image Gallery Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 flex items-center justify-center">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick WhatsApp Inquiry Floating on Image Hover */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={handleWhatsAppInquiry}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg flex items-center justify-center gap-1.5 backdrop-blur-md transition-colors"
            title="Ask on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Order</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="uppercase tracking-wider text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
              <span className="text-neutral-400 font-normal">({product.reviewsCount || 24})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.nameUrdu && (
            <p className="text-xs text-neutral-500 line-clamp-1 font-medium mt-0.5">
              {product.nameUrdu}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-extrabold text-neutral-950 font-serif">
              PKR {product.discountedPrice.toLocaleString()}
            </span>
            {product.originalPrice > product.discountedPrice && (
              <span className="text-xs text-neutral-400 line-through">
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Sizes Selector Chips */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span>Size (EU):</span>
            <span className="font-semibold text-neutral-800">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`w-7 h-7 rounded-md text-[11px] font-semibold flex items-center justify-center border transition-all ${
                  selectedSize === sz
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="pt-2 border-t border-neutral-100 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : product.inStock
                ? 'bg-neutral-900 hover:bg-amber-600 text-white cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ٹوکری میں ڈالیں' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
