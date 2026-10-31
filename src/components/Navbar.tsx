import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Shield, 
  LogOut, 
  Package, 
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { StoreSettings } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openAuthModal: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  openAuthModal,
  setSelectedCategory,
}) => {
  const { user, profile, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { language, setLanguage, isUrdu, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('home') },
    { id: 'shop', label: t('shop') },
    { id: 'categories', label: t('categories') },
    { id: 'mens', label: t('mens'), category: 'mens' },
    { id: 'womens', label: t('womens'), category: 'womens' },
    { id: 'kids', label: t('kids'), category: 'kids' },
    { id: 'sandals', label: isUrdu ? 'پشاوری چپل و سینڈل' : 'Peshawari & Sandals', category: 'sandals' },
    { id: 'about', label: t('aboutUs') },
    { id: 'contact', label: t('contactUs') },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.category) {
      setSelectedCategory(link.category);
      setActiveTab('shop');
    } else {
      setActiveTab(link.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Announcement Bar */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-amber-400">
              {isUrdu ? 'کالا پل، ایبٹ آباد' : 'Kala Pul, Abbottabad'}:
            </span>
            <span className="hidden sm:inline">
              {isUrdu ? settings.announcementUrdu : settings.announcement}
            </span>
            <span className="sm:hidden">
              {isUrdu ? 'پورے ایبٹ آباد میں ہوم ڈیلیوری' : 'Home Delivery Across Abbottabad'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs ml-auto">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hello Shami Shoe Zone Abbottabad, I have an inquiry.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.displayWhatsApp}</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
              title="Toggle English / Urdu"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span className="font-semibold">{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none group flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md group-hover:border-amber-400 transition-all">
              <span className="font-serif font-black text-xl tracking-tighter text-amber-400">SSZ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 font-serif">
                  Shami Shoe Zone
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  KALA PUL
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">
                {isUrdu ? 'شامی جنرل اسٹور، ایبٹ آباد' : 'Shami General Store, Abbottabad'}
              </p>
            </div>
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={isUrdu ? 'جوتے، اسنیکرز یا سینڈل تلاش کریں...' : 'Search sneakers, formal shoes, sandals...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'shop') setActiveTab('shop');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Admin Badge/Link - ONLY shown when logged in with awan11118@gmail.com */}
            {user?.email?.toLowerCase() === 'awan11118@gmail.com' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
                title="Admin Panel"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Admin</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </button>
            )}

            {/* User Account / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-neutral-200 hover:border-neutral-300 bg-neutral-50 text-xs font-medium text-neutral-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden lg:inline max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-xs font-semibold text-neutral-900 truncate">
                        {user.displayName || 'Customer'}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('orders');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 text-left"
                    >
                      <Package className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{t('myOrders')}</span>
                    </button>

                    {user?.email?.toLowerCase() === 'awan11118@gmail.com' && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 text-left font-medium"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-neutral-100 mt-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-neutral-100 hover:bg-amber-50 text-neutral-900 transition-colors group"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-amber-600 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center justify-between border-t border-neutral-100 py-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`font-medium tracking-wide transition-colors whitespace-nowrap py-1 relative ${
                  activeTab === link.id
                    ? 'text-amber-600 font-bold'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {link.label}
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            ))}

            {/* Admin Panel Tab - Highlighted when logged in as awan11118@gmail.com */}
            {user?.email?.toLowerCase() === 'awan11118@gmail.com' ? (
              <button
                onClick={() => setActiveTab('admin')}
                className={`font-bold tracking-wide transition-all whitespace-nowrap py-1 px-3 rounded-lg flex items-center gap-1.5 shadow-xs ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>🛡️ Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('admin')}
                className="text-neutral-400 hover:text-neutral-600 text-[11px] font-medium transition-colors"
                title="Store Owner Portal"
              >
                Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <MapPin className="w-3 h-3 text-amber-600" />
            <span>Kala Pul, Abbottabad</span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3 animate-in fade-in">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder={isUrdu ? 'جوتے تلاش کریں...' : 'Search shoes...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'shop') setActiveTab('shop');
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-100 border border-neutral-200 text-xs text-neutral-900"
            />
          </div>

          <div className="flex flex-col space-y-1 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === link.id
                    ? 'bg-amber-50 text-amber-700 font-bold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setActiveTab('orders');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              {t('myOrders')}
            </button>
            {user?.email?.toLowerCase() === 'awan11118@gmail.com' && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-lg text-xs font-medium text-amber-700 bg-amber-50/50 hover:bg-amber-100"
              >
                🛡️ Admin Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
