import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Order, StoreSettings } from '../types';
import { fetchUserOrders, getWhatsAppUrl } from '../services/storeService';

interface MyOrdersPageProps {
  settings: StoreSettings;
  onGoToShop: () => void;
  openAuthModal: () => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({
  settings,
  onGoToShop,
  openAuthModal,
}) => {
  const { user } = useAuth();
  const { isUrdu, t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const userOrders = await fetchUserOrders(user.uid);
      setOrders(userOrders);
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Confirmed</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Processing</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Out for Delivery</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">Pending Confirmation</span>;
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif text-neutral-900">
            {isUrdu ? 'اپنے آرڈرز دیکھنے کے لیے لاگ ان کریں' : 'Sign in to View Your Orders'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Please log in with your email, Google, or phone number to view past orders and delivery statuses across Abbottabad.
          </p>
        </div>
        <button
          onClick={openAuthModal}
          className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md"
        >
          {isUrdu ? 'لاگ ان کریں' : 'Sign In Now'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Account Order History
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif">
            {t('myOrders')}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Logged in as {user.email || user.displayName}
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-medium text-neutral-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-500">
          Loading your order history from Shami Shoe Zone database...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-neutral-800">No Orders Yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            You haven’t placed any shoe orders yet. Browse our Abbottabad collection and order stylish footwear!
          </p>
          <button
            onClick={onGoToShop}
            className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-5"
            >
              {/* Order Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 font-bold font-mono text-xs flex items-center justify-center border border-amber-200">
                    SSZ
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 font-mono">
                      Order {order.orderNumber}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-neutral-100 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-neutral-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex gap-2 text-[11px] text-neutral-500 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-medium">
                          Size: {item.size}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-medium">
                          {item.color}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-bold text-neutral-800">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-neutral-950">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Pricing Footer */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-50/70 p-4 rounded-2xl text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Delivering to: {order.address}, {order.area}, Abbottabad</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Recipient: {order.customerName} ({order.phone}) • {order.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:ml-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block uppercase">Total Amount</span>
                    <span className="text-sm font-extrabold text-neutral-950 font-serif">
                      PKR {order.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Direct WhatsApp Follow-up */}
                  <a
                    href={getWhatsAppUrl(settings.whatsappNumber, `Hello Shami Shoe Zone! I am inquiring about the delivery status of my order ID: ${order.orderNumber}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    title="Follow up on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp Support</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
