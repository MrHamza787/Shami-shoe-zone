import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Tag, 
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { StoreSettings } from '../types';

interface CartPageProps {
  settings: StoreSettings;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  settings,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const { isUrdu, t } = useLanguage();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryCost = isFreeDelivery ? 0 : settings.deliveryCharges;
  const grandTotal = Math.max(0, subtotal - promoDiscount + (cart.length > 0 ? deliveryCost : 0));

  const progressPercent = Math.min(100, Math.round((subtotal / settings.freeDeliveryThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'ABBOTTABAD' || promoCode.trim().toUpperCase() === 'SSZ10') {
      const discount = Math.round(subtotal * 0.1);
      setPromoDiscount(discount);
      setPromoMessage('Promo code applied: 10% discount on shoes!');
    } else {
      setPromoMessage('Invalid voucher code. Try "SSZ10"');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif text-neutral-900">
            {t('cartEmpty')}
          </h2>
          <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
            Your shopping cart currently has no items. Explore our footwear collection and pick your preferred size and color!
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all"
        >
          Browse Abbottabad Shoe Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onContinueShopping}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl font-extrabold text-neutral-950 font-serif">
            {t('cart')} ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold self-start sm:self-auto"
        >
          Clear Shopping Cart
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-xs text-amber-950">
          <span className="flex items-center gap-1.5 font-bold">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>
              {isFreeDelivery
                ? '🎉 Congratulations! You have unlocked FREE Delivery in Abbottabad!'
                : `Add PKR ${(settings.freeDeliveryThreshold - subtotal).toLocaleString()} more for FREE Delivery across Abbottabad`}
            </span>
          </span>
          <span className="font-semibold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-amber-200/70 overflow-hidden">
          <div
            className="h-full bg-amber-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <div className="divide-y divide-neutral-100">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex gap-4 items-center min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-neutral-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-neutral-900 truncate">
                      {isUrdu && item.nameUrdu ? item.nameUrdu : item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-[11px] text-neutral-500 mt-1">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-800">
                        Size: {item.size}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-medium">
                        Color: {item.color}
                      </span>
                      <span className="text-neutral-400">
                        Unit: PKR {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 mt-2 sm:mt-0">
                  {/* Quantity */}
                  <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, -1)}
                      className="p-1.5 hover:bg-neutral-200 text-neutral-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, 1)}
                      className="p-1.5 hover:bg-neutral-200 text-neutral-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-sm font-extrabold text-neutral-950 font-serif">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="text-neutral-400 hover:text-red-500 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-neutral-950 font-serif border-b border-neutral-200 pb-3">
            Summary & Total
          </h3>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Discount code (SSZ10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p className={`text-[11px] font-medium ${promoDiscount > 0 ? 'text-emerald-600' : 'text-neutral-500'}`}>
                {promoMessage}
              </p>
            )}
          </form>

          {/* Price rows */}
          <div className="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span className="font-semibold text-neutral-900">
                PKR {subtotal.toLocaleString()}
              </span>
            </div>

            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount (SSZ10)</span>
                <span>- PKR {promoDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>{t('deliveryCharges')}</span>
              <span className="font-semibold text-neutral-900">
                {isFreeDelivery ? (
                  <span className="text-emerald-600 uppercase font-bold text-[11px]">Free</span>
                ) : (
                  `PKR ${deliveryCost.toLocaleString()}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-950">
              <span>{t('total')}</span>
              <span className="text-amber-600 font-serif text-lg">
                PKR {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={onProceedToCheckout}
            className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <span>{t('proceedToCheckout')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-3 rounded-2xl bg-neutral-50 text-[11px] text-neutral-600 flex items-center gap-2 border border-neutral-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Cash on Delivery across Abbottabad. Mandatory customer login at next step.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
