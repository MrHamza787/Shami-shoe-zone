import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CartPage } from './pages/CartPage';

import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { Product, StoreSettings, Review, Order } from './types';
import { DEFAULT_STORE_SETTINGS, INITIAL_PRODUCTS, INITIAL_REVIEWS } from './data/seedData';
import { fetchProducts, fetchStoreSettings, fetchReviews, seedInitialProductsIfEmpty } from './services/storeService';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [loading, setLoading] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'phone'>('signin');

  // Load catalog and settings from Firestore
  const loadData = async () => {
    try {
      const [fetchedProducts, fetchedSettings, fetchedReviews] = await Promise.all([
        fetchProducts(),
        fetchStoreSettings(),
        fetchReviews(),
      ]);
      setProducts(fetchedProducts);
      setSettings(fetchedSettings);
      setReviews(fetchedReviews);
    } catch (err) {
      console.warn('Using default catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedProduct]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'phone' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Header Navigation */}
      <Navbar
        settings={settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openAuthModal={() => handleOpenAuth('signin')}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            products={products}
            settings={settings}
            reviews={reviews}
            setActiveTab={setActiveTab}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'shop' && (
          <ShopPage
            products={products}
            settings={settings}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            settings={settings}
            onBack={() => setActiveTab('shop')}
            onProceedToCheckout={() => setActiveTab('checkout')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutPage
            settings={settings}
            onBackToShop={() => setActiveTab('shop')}
            openAuthModal={() => handleOpenAuth('signin')}
            onOrderSuccess={(order: Order) => {
              // Stay on confirmation modal inside CheckoutPage or allow customer to see My Orders
            }}
          />
        )}

        {activeTab === 'orders' && (
          <MyOrdersPage
            settings={settings}
            onGoToShop={() => setActiveTab('shop')}
            openAuthModal={() => handleOpenAuth('signin')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            products={products}
            settings={settings}
            onRefreshProducts={loadData}
            onRefreshSettings={loadData}
          />
        )}

        {activeTab === 'about' && (
          <AboutUsPage
            settings={settings}
            onGoToShop={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage
            settings={settings}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesPage
            products={products}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveTab('shop');
            }}
          />
        )}

        {activeTab === 'cart' && (
          <CartPage
            settings={settings}
            onProceedToCheckout={() => setActiveTab('checkout')}
            onContinueShopping={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'policies' && (
          <PoliciesPage
            settings={settings}
          />
        )}
      </main>

      {/* Slideover Cart Drawer */}
      <CartDrawer
        settings={settings}
        onProceedToCheckout={() => setActiveTab('checkout')}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppFloatingButton
        settings={settings}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={() => handleOpenAuth('signin')}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        setActiveTab={setActiveTab}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
