import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Zap, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Check, 
  Ruler, 
  MapPin,
  ChevronRight,
  Heart
} from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../services/storeService';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  settings: StoreSettings;
  onBack: () => void;
  onProceedToCheckout: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  settings,
  onBack,
  onProceedToCheckout,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { isUrdu, t } = useLanguage();

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string | number>(product.sizes[0] || '41');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const discountPercent = product.originalPrice > product.discountedPrice
    ? Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onProceedToCheckout();
  };

  const handleWhatsAppOrder = () => {
    const text = `NEW ORDER INQUIRY – SHAMI SHOE ZONE

Product: ${product.name}
Size: ${selectedSize}
Color: ${selectedColor}
Quantity: ${quantity}
Price: PKR ${(product.discountedPrice * quantity).toLocaleString()}

Is this available for prompt delivery in Abbottabad?`;
    window.open(getWhatsAppUrl(settings.whatsappNumber, text), '_blank');
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-neutral-900 hover:text-amber-600 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="capitalize">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-900 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 relative shadow-xs">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
              product.inStock ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {product.inStock ? 'In Stock in Abbottabad' : 'Temporarily Out of Stock'}
            </span>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? 'border-amber-500 shadow-md scale-95'
                      : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category, Rating, Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || 4.9}</span>
                <span className="text-neutral-400 font-normal">({product.reviewsCount || 24} reviews)</span>
              </div>
            </div>

            {/* Product Titles */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif tracking-tight">
                {product.name}
              </h1>
              {product.nameUrdu && (
                <p className="text-base font-semibold text-neutral-600 mt-1">
                  {product.nameUrdu}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-extrabold text-neutral-950 font-serif">
                PKR {product.discountedPrice.toLocaleString()}
              </span>
              {product.originalPrice > product.discountedPrice && (
                <span className="text-base text-neutral-400 line-through">
                  PKR {product.originalPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  Save PKR {(product.originalPrice - product.discountedPrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {product.description}
              </p>
              {product.descriptionUrdu && (
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-1 border-t border-neutral-200/60">
                  {product.descriptionUrdu}
                </p>
              )}
            </div>

            {/* Color Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-neutral-800">
                <span>Color: <strong className="text-neutral-950">{selectedColor}</strong></span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      selectedColor === color
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                        : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector with Size Guide Link */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-800">
                  Shoe Size (EU): <strong className="text-neutral-950">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-11 h-11 rounded-xl text-xs font-bold flex items-center justify-center border transition-all ${
                      selectedSize === sz
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-md scale-105'
                        : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-semibold text-neutral-800">Quantity:</span>
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            {addedToast && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Successfully added to your shopping cart!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isUrdu ? 'ٹوکری میں شامل کریں' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{isUrdu ? 'ابھی خریدیں' : 'Buy Now (Instant Checkout)'}</span>
              </button>
            </div>

            {/* WhatsApp Direct Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order via WhatsApp ({settings.displayWhatsApp})</span>
            </button>

            {/* Abbottabad Local Delivery Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-neutral-600">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-center">
                <Truck className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <p className="font-semibold text-neutral-900">Abbottabad Delivery</p>
                <p className="text-[10px] text-neutral-500">Same Day / 2-4 Hours</p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <p className="font-semibold text-neutral-900">Cash on Delivery</p>
                <p className="text-[10px] text-neutral-500">Pay upon delivery</p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-center">
                <MapPin className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <p className="font-semibold text-neutral-900">Store Pickup</p>
                <p className="text-[10px] text-neutral-500">Kala Pul, Abbottabad</p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-950 font-serif flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-600" />
                <span>Footwear Size Chart (Pakistan & EU)</span>
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-neutral-400 hover:text-neutral-800 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Shami Shoe Zone follows standard Pakistani & European shoe sizing. If you wear an EU 42 in sneakers, our formal shoes and Peshawari chappals will match your exact size.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-800">
                    <th className="p-2 border border-neutral-200">EU Size</th>
                    <th className="p-2 border border-neutral-200">Pakistan / UK</th>
                    <th className="p-2 border border-neutral-200">Foot Length (cm)</th>
                    <th className="p-2 border border-neutral-200">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-700">
                  <tr>
                    <td className="p-2 border border-neutral-200 font-bold">39</td>
                    <td className="p-2 border border-neutral-200">5.5 - 6</td>
                    <td className="p-2 border border-neutral-200">24.5 cm</td>
                    <td className="p-2 border border-neutral-200">Men / Unisex</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-neutral-200 font-bold">40</td>
                    <td className="p-2 border border-neutral-200">6.5</td>
                    <td className="p-2 border border-neutral-200">25.0 cm</td>
                    <td className="p-2 border border-neutral-200">Men / Unisex</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-neutral-200 font-bold">41</td>
                    <td className="p-2 border border-neutral-200">7 - 7.5</td>
                    <td className="p-2 border border-neutral-200">26.0 cm</td>
                    <td className="p-2 border border-neutral-200">Men / Most Popular</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-neutral-200 font-bold">42</td>
                    <td className="p-2 border border-neutral-200">8</td>
                    <td className="p-2 border border-neutral-200">26.5 cm</td>
                    <td className="p-2 border border-neutral-200">Men / Most Popular</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-neutral-200 font-bold">43</td>
                    <td className="p-2 border border-neutral-200">8.5 - 9</td>
                    <td className="p-2 border border-neutral-200">27.5 cm</td>
                    <td className="p-2 border border-neutral-200">Men</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-neutral-200 font-bold">44</td>
                    <td className="p-2 border border-neutral-200">9.5 - 10</td>
                    <td className="p-2 border border-neutral-200">28.0 cm</td>
                    <td className="p-2 border border-neutral-200">Men</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-neutral-200 font-bold">36 - 40</td>
                    <td className="p-2 border border-neutral-200">3 - 7</td>
                    <td className="p-2 border border-neutral-200">22.5 - 25 cm</td>
                    <td className="p-2 border border-neutral-200">Women Collection</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              💡 <strong>Tip for Abbottabad Customers:</strong> Our local delivery riders can bring two consecutive sizes (e.g., 41 & 42) to your house in Abbottabad so you can try them before payment!
            </p>

            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}

      {/* Related Shoes Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-neutral-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              You May Also Like
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-serif mt-0.5">
              Similar Footwear Styles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                settings={settings}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
