import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  MessageCircle, 
  AlertCircle, 
  CheckCircle2, 
  Copy,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { StoreSettings, Order, OrderItem } from '../types';
import { ABBOTTABAD_AREAS } from '../data/seedData';
import { createOrder, generateWhatsAppOrderMessage, getWhatsAppUrl, markOrderWhatsAppSent } from '../services/storeService';

interface CheckoutPageProps {
  settings: StoreSettings;
  onBackToShop: () => void;
  openAuthModal: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  settings,
  onBackToShop,
  openAuthModal,
  onOrderSuccess,
}) => {
  const { user, profile } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const { isUrdu, t } = useLanguage();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState(ABBOTTABAD_AREAS[0]);
  const [customArea, setCustomArea] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmed Order State for Modal
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  // Populate from logged in user profile
  useEffect(() => {
    if (user) {
      if (user.displayName && !customerName) {
        setCustomerName(user.displayName);
      }
      if (profile?.phoneNumber && !phone) {
        setPhone(profile.phoneNumber);
        setWhatsappNumber(profile.phoneNumber);
      }
      if (profile?.address && !address) {
        setAddress(profile.address);
      }
      if (profile?.area && !area) {
        setArea(profile.area);
      }
    }
  }, [user, profile]);

  // Delivery calculation
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold;
  const deliveryCharges = isFreeDelivery ? 0 : settings.deliveryCharges;
  const totalAmount = subtotal + deliveryCharges;

  // Handle phone changes
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsappNumber(val);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      openAuthModal();
      return;
    }

    if (cart.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!customerName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!phone.trim() || phone.length < 10) {
      setError('Please provide a valid contact phone number in Abbottabad.');
      return;
    }

    const finalWhatsApp = sameAsPhone ? phone : (whatsappNumber || phone);
    if (!finalWhatsApp.trim()) {
      setError('Please provide your WhatsApp number for order confirmation.');
      return;
    }

    if (!address.trim()) {
      setError('Please provide your complete house/street address in Abbottabad.');
      return;
    }

    const resolvedArea = area === 'Other Area in Abbottabad' ? (customArea || 'Abbottabad') : area;

    try {
      setSubmitting(true);

      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        nameUrdu: item.nameUrdu,
        image: item.image,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      // 1. Save in Firestore
      const savedOrder = await createOrder({
        userId: user.uid,
        customerName: customerName.trim(),
        phone: phone.trim(),
        whatsappNumber: finalWhatsApp.trim(),
        address: address.trim(),
        area: resolvedArea,
        city: 'Abbottabad',
        items: orderItems,
        subtotal,
        deliveryCharges,
        totalAmount,
        paymentMethod: 'Cash on Delivery',
        notes: notes.trim() || '',
      });

      // 2. Clear Cart
      clearCart();

      // 3. Set confirmed state
      setPlacedOrder(savedOrder);

      // 4. Trigger WhatsApp safely (guarded against popup blockers)
      const waMsg = generateWhatsAppOrderMessage(savedOrder);
      const waUrl = getWhatsAppUrl(settings.whatsappNumber, waMsg);
      try {
        window.open(waUrl, '_blank');
      } catch (e) {
        console.warn('Auto-popup blocked, user can click direct button:', e);
      }

      // Update status
      markOrderWhatsAppSent(savedOrder.id);
      onOrderSuccess(savedOrder);

    } catch (err: any) {
      console.error('Failed to create order:', err);
      setError(err?.message || 'Failed to submit order. Please try again or contact us directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyMessage = (msg: string) => {
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4 flex items-center justify-between">
        <div>
          <button
            onClick={onBackToShop}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif">
            {isUrdu ? 'آرڈر چیک آؤٹ' : 'Checkout & Abbottabad Delivery'}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold">Cash on Delivery (Abbottabad)</span>
        </div>
      </div>

      {/* Mandatory Login Banner if user is not authenticated */}
      {!user && (
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {isUrdu ? 'لاگ ان ضروری ہے' : 'Sign In Required to Place Order'}
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                {isUrdu
                  ? 'برائے مہربانی اپنا گوگل، ای میل یا فون نمبر کے ذریعے لاگ ان کریں تاکہ آپ کا آرڈر محفوظ اور باآسانی ٹریک ہو سکے۔'
                  : 'As per store policy, customer authentication is mandatory prior to confirming an order for home delivery in Abbottabad.'}
              </p>
            </div>
          </div>

          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            {isUrdu ? 'لاگ ان یا رجسٹر کریں' : 'Sign In / Register Now'}
          </button>
        </div>
      )}

      {/* Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Customer & Delivery Address Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-950 font-serif flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <span>{isUrdu ? 'ڈیلیوری کی معلومات' : 'Delivery Address & Contact'}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Please enter your accurate Abbottabad address for prompt home delivery.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                {isUrdu ? 'کسٹمر کا مکمل نام' : 'Customer Full Name'} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Muhammad Ali Khan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Mobile & WhatsApp Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  {isUrdu ? 'موبائل فون نمبر' : 'Mobile Phone Number'} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-neutral-800">
                    {isUrdu ? 'واٹس ایپ نمبر' : 'WhatsApp Number'} *
                  </label>
                  <label className="text-[11px] text-neutral-500 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => {
                        setSameAsPhone(e.target.checked);
                        if (e.target.checked) setWhatsappNumber(phone);
                      }}
                      className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>Same as mobile</span>
                  </label>
                </div>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    type="tel"
                    required
                    disabled={sameAsPhone}
                    placeholder="0300 1234567"
                    value={sameAsPhone ? phone : whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                      sameAsPhone ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed' : 'bg-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Abbottabad Area Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                {isUrdu ? 'ایبٹ آباد کا علاقہ / محلہ' : 'Abbottabad Area / Neighborhood'} *
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white"
              >
                {ABBOTTABAD_AREAS.map((ar) => (
                  <option key={ar} value={ar}>
                    {ar}
                  </option>
                ))}
              </select>
            </div>

            {area === 'Other Area in Abbottabad' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Specify Your Area / Village in Abbottabad
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kehal, Salhad, Dhamtour, etc."
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900"
                />
              </div>
            )}

            {/* Complete Home Address */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                {isUrdu ? 'مکمل گھر کا پتہ (گلی، مکان نمبر، قریبی مشہور جگہ)' : 'Complete Home Address (House #, Street, Landmark)'} *
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. House #14, Street 2, Near Government College, Mandian, Abbottabad"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                {isUrdu ? 'آرڈر ہدایات یا اضافی نوٹ' : 'Order Notes & Instructions (Optional)'}
              </label>
              <input
                type="text"
                placeholder="e.g. Please bring two shoe sizes (41 & 42) to test fit, or call before arrival"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900"
              />
            </div>

            {/* Payment Method Banner */}
            <div className="p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Payment Method
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  Cash on Delivery (COD)
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Pay cash to rider upon inspecting shoes at your doorstep.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className={`w-full py-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                submitting || cart.length === 0
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-600/20'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Processing Order...'
                  : isUrdu
                  ? 'آرڈر کنفرم کریں اور واٹس ایپ بھیجیں'
                  : 'Confirm Order & Send via WhatsApp'}
              </span>
            </button>

            <p className="text-[11px] text-center text-neutral-500">
              * After clicking, your order will be safely registered in our database and WhatsApp will automatically open with your pre-filled order message.
            </p>

          </form>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="text-base font-bold text-neutral-950 font-serif">
              Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>
            <span className="text-xs text-neutral-500">Currency: PKR</span>
          </div>

          {/* Items List */}
          <div className="divide-y divide-neutral-100 max-h-[360px] overflow-y-auto pr-1 space-y-3">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="pt-3 first:pt-0 flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-neutral-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 truncate">
                    {item.name}
                  </h4>
                  <div className="flex gap-2 text-[11px] text-neutral-500 mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-medium">
                      Size: {item.size}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-medium">
                      {item.color}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-800">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-neutral-950 mt-1.5">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>{t('subtotal')}</span>
              <span className="font-semibold text-neutral-900">
                PKR {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-neutral-600">
              <span className="flex items-center gap-1">
                <span>{t('deliveryCharges')}</span>
                <span className="text-[10px] text-neutral-400">(Abbottabad)</span>
              </span>
              <span className="font-semibold text-neutral-900">
                {isFreeDelivery ? (
                  <span className="text-emerald-600 uppercase font-bold text-[11px]">Free Delivery</span>
                ) : (
                  `PKR ${deliveryCharges.toLocaleString()}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-950">
              <span>{t('total')}</span>
              <span className="text-amber-600 font-serif text-lg">
                PKR {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Store Info Reminder */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs space-y-1.5 text-neutral-600">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Fulfilled by Shami Shoe Zone</span>
            </div>
            <p className="text-[11px]">
              Shami General Store, Kala Pul, Abbottabad.
            </p>
            <p className="text-[11px] text-neutral-500">
              Questions? Call or WhatsApp {settings.displayWhatsApp}
            </p>
          </div>

        </div>

      </div>

      {/* Confirmed Order Modal */}
      {placedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 my-8 animate-in zoom-in-95">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-950 font-serif">
                Order Placed Successfully!
              </h2>
              <div className="inline-block px-3 py-1 rounded-full bg-neutral-900 text-amber-400 font-mono text-sm font-bold">
                Order ID: {placedOrder.orderNumber}
              </div>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Thank you, <strong>{placedOrder.customerName}</strong>! Your order is saved in our system. Please send the pre-filled message below on WhatsApp to confirm delivery to {placedOrder.area}.
              </p>
            </div>

            {/* Formatted WhatsApp Message Preview */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-700">Pre-filled WhatsApp Message:</span>
                <button
                  type="button"
                  onClick={() => handleCopyMessage(generateWhatsAppOrderMessage(placedOrder))}
                  className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 text-neutral-200 font-mono text-[11px] whitespace-pre-wrap leading-relaxed border border-neutral-800 max-h-48 overflow-y-auto">
                {generateWhatsAppOrderMessage(placedOrder)}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <a
                href={getWhatsAppUrl(settings.whatsappNumber, generateWhatsAppOrderMessage(placedOrder))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Open in WhatsApp Now</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <button
                onClick={() => {
                  setPlacedOrder(null);
                  onBackToShop();
                }}
                className="w-full py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors"
              >
                Return to Shop
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
