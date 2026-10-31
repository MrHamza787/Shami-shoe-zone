import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { StoreSettings } from '../types';

interface CartDrawerProps {
  settings: StoreSettings;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ settings, onProceedToCheckout }) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    totalItems, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen 
  } = useCart();
  const { isUrdu, t } = useLanguage();

  if (!isCartDrawerOpen) return null;

  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryCost = isFreeDelivery ? 0 : settings.deliveryCharges;
  const grandTotal = subtotal + (cart.length > 0 ? deliveryCost : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-neutral-900 font-serif">
                {t('cart')} ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Threshold Notice */}
          <div className="bg-amber-50/70 border-b border-amber-100 px-4 py-2.5 flex items-center gap-2 text-xs text-amber-900">
            <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              {isFreeDelivery ? (
                <strong className="text-emerald-700">
                  🎉 {isUrdu ? 'مفت ہوم ڈیلیوری اہل ہے!' : 'Eligible for FREE Abbottabad Delivery!'}
                </strong>
              ) : (
                <span>
                  {isUrdu
                    ? `مفت ڈیلیوری کے لیے مزید PKR ${(settings.freeDeliveryThreshold - subtotal).toLocaleString()} شامل کریں`
                    : `Add PKR ${(settings.freeDeliveryThreshold - subtotal).toLocaleString()} more for FREE delivery in Abbottabad`}
                </span>
              )}
            </span>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-neutral-600">
                  {t('cartEmpty')}
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800"
                >
                  {isUrdu ? 'شاپنگ جاری رکھیں' : 'Explore Footwear'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4 p-3 rounded-xl border border-neutral-100 bg-white hover:border-neutral-200 transition-all shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {isUrdu && item.nameUrdu ? item.nameUrdu : item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size, item.color)}
                          className="text-neutral-400 hover:text-red-500 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] text-neutral-500 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-medium">
                          Size: {item.size}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-medium">
                          {item.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs font-bold text-neutral-900">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, -1)}
                          className="p-1 hover:bg-neutral-200 text-neutral-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, 1)}
                          className="p-1 hover:bg-neutral-200 text-neutral-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-neutral-100 bg-neutral-50/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-neutral-900">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>{t('deliveryCharges')}</span>
                  <span className="font-semibold text-neutral-900">
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 uppercase font-bold text-[11px]">Free</span>
                    ) : (
                      `PKR ${deliveryCost.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-950">
                  <span>{t('total')}</span>
                  <span className="text-amber-600 font-serif text-base">
                    PKR {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer group"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-center text-neutral-500">
                {t('codNote')}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
