import React from 'react';
import { Home, Compass, ShoppingBag, Package, User, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
}) => {
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAwanAdmin = user?.email?.toLowerCase() === 'awan11118@gmail.com';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-2 shadow-lg">
      <div className={`grid ${isAwanAdmin ? 'grid-cols-6' : 'grid-cols-5'} gap-1`}>
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
            activeTab === 'home' ? 'text-amber-600 font-bold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t('home')}</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
            activeTab === 'shop' ? 'text-amber-600 font-bold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t('shop')}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-neutral-500 hover:text-neutral-900 relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight">{t('cart')}</span>
        </button>

        {/* My Orders */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
            activeTab === 'orders' ? 'text-amber-600 font-bold' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t('myOrders')}</span>
        </button>

        {/* Account / Login */}
        <button
          onClick={user ? () => setActiveTab('orders') : openAuthModal}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-neutral-500 hover:text-neutral-900"
        >
          <div className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[9px] font-bold flex items-center justify-center mb-0.5">
            {user ? (user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U') : <User className="w-3 h-3" />}
          </div>
          <span className="text-[10px] leading-tight">
            {user ? 'Profile' : t('login')}
          </span>
        </button>

        {/* Admin Dashboard on Mobile when logged in as awan11118@gmail.com */}
        {isAwanAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              activeTab === 'admin' ? 'text-amber-600 font-bold bg-amber-50' : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5 text-amber-600" />
            <span className="text-[10px] leading-tight font-bold">Admin</span>
          </button>
        )}

      </div>
    </nav>
  );
};
