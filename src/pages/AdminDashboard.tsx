import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  RotateCcw, 
  Settings, 
  MessageCircle, 
  AlertCircle, 
  X, 
  Check, 
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Database,
  Copy,
  CheckCheck,
  Link2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, Order, StoreSettings, UserProfile, CategoryType } from '../types';
import { 
  fetchAllOrders, 
  updateOrderStatus, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  updateStoreSettings, 
  seedInitialProductsIfEmpty,
  syncAllDataToSupabase,
  getWhatsAppUrl 
} from '../services/storeService';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials, 
  testSupabaseConnection, 
  SUPABASE_SQL_SCHEMA 
} from '../supabase';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface AdminDashboardProps {
  products: Product[];
  settings: StoreSettings;
  onRefreshProducts: () => void;
  onRefreshSettings: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  settings,
  onRefreshProducts,
  onRefreshSettings,
}) => {
  const { user, isAdmin, signInWithGoogle, signInAsAdminAwan, logout } = useAuth();

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'products' | 'customers' | 'settings' | 'supabase'>('overview');

  // Supabase Configuration State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseActive, setSupabaseActive] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseResult, setSupabaseResult] = useState<{ success: boolean; message: string; tablesFound?: string[] } | null>(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Customers State
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Product Editing / Adding Modal State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Delete & Seed In-App Confirm Dialogs (No window.confirm)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [seedConfirm, setSeedConfirm] = useState(false);

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Seeding Catalog state
  const [seeding, setSeeding] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSettingsForm(settings);
    const creds = getSupabaseCredentials();
    setSupabaseUrl(creds.url);
    setSupabaseAnonKey(creds.anonKey);
    setSupabaseActive(creds.isActive);
  }, [settings]);

  // Load orders & customers
  const loadOrdersData = async () => {
    setLoadingOrders(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadCustomersData = async () => {
    setLoadingCustomers(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      snapshot.forEach((snap) => {
        list.push(snap.data() as UserProfile);
      });
      setCustomers(list);
    } catch (err) {
      console.warn('Error fetching customers:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      loadOrdersData();
      loadCustomersData();
    }
  }, [user, isAdmin]);

  // Status metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.totalAmount : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  // Order status updater
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setActionMessage(`Order status updated to ${newStatus}`);
      setTimeout(() => setActionMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage('Failed to update order status: ' + (err?.message || String(err)));
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  // Product Add / Edit
  const handleOpenAddProduct = () => {
    setEditingProduct({
      name: '',
      nameUrdu: '',
      description: '',
      descriptionUrdu: '',
      originalPrice: 3500,
      discountedPrice: 2800,
      category: 'sneakers',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
      sizes: [39, 40, 41, 42, 43, 44],
      colors: ['Black', 'White'],
      inStock: true,
      stockQuantity: 20,
      featured: false,
      isNewArrival: true,
      isBestSeller: false,
    });
    setIsNewProduct(true);
    setProductFormError(null);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsNewProduct(false);
    setProductFormError(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProductFormError(null);

    if (!editingProduct.name?.trim()) {
      setProductFormError('Product name is required.');
      return;
    }
    if (!editingProduct.discountedPrice || editingProduct.discountedPrice <= 0) {
      setProductFormError('Valid discounted price in PKR is required.');
      return;
    }

    try {
      setSavingProduct(true);
      if (isNewProduct) {
        await addProduct(editingProduct as Omit<Product, 'id'>);
        setActionMessage('Product created successfully in catalog!');
      } else {
        await updateProduct(editingProduct.id!, editingProduct);
        setActionMessage('Product updated successfully!');
      }
      onRefreshProducts();
      setEditingProduct(null);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setProductFormError(err.message || 'Failed to save product');
    } finally {
      setSavingProduct(false);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm.id);
      onRefreshProducts();
      setActionMessage(`Product "${deleteConfirm.name}" removed from catalog.`);
      setTimeout(() => setActionMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage('Failed to delete product: ' + (err?.message || String(err)));
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await updateStoreSettings(settingsForm);
      setSettingsSuccess(true);
      onRefreshSettings();
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage('Failed to save settings: ' + (err?.message || String(err)));
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setSavingSettings(false);
    }
  };

  // Seeding
  const confirmSeedCatalog = async () => {
    setSeedConfirm(false);
    try {
      setSeeding(true);
      const seeded = await seedInitialProductsIfEmpty();
      onRefreshProducts();
      onRefreshSettings();
      setActionMessage(seeded ? 'Catalog seeded successfully!' : 'Catalog already contains products.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage('Failed to seed catalog: ' + (err?.message || String(err)));
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setSeeding(false);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
      return false;
    }
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchesId = o.orderNumber.toLowerCase().includes(q);
      const matchesPhone = o.phone.includes(q) || o.whatsappNumber.includes(q);
      const matchesName = o.customerName.toLowerCase().includes(q);
      const matchesArea = o.area.toLowerCase().includes(q);
      return matchesId || matchesPhone || matchesName || matchesArea;
    }
    return true;
  });

  // Supabase Handlers
  const handleTestSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setErrorMessage('Please enter both Supabase Project URL and Anon API Key.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    setTestingSupabase(true);
    setSupabaseResult(null);
    try {
      const res = await testSupabaseConnection(supabaseUrl.trim(), supabaseAnonKey.trim());
      setSupabaseResult(res);
      if (res.success) {
        setActionMessage(res.message);
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        setErrorMessage(res.message);
        setTimeout(() => setErrorMessage(null), 4000);
      }
    } catch (err: any) {
      setSupabaseResult({ success: false, message: err?.message || String(err) });
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleSaveSupabase = () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setErrorMessage('Please provide both URL and Anon Key to activate Supabase.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    saveSupabaseCredentials(supabaseUrl.trim(), supabaseAnonKey.trim(), true);
    setSupabaseActive(true);
    setActionMessage('Supabase database activated for Shami Shoe Zone!');
    setTimeout(() => setActionMessage(null), 3000);
    onRefreshProducts();
    onRefreshSettings();
  };

  const handleDisconnectSupabase = () => {
    clearSupabaseCredentials();
    setSupabaseUrl('');
    setSupabaseAnonKey('');
    setSupabaseActive(false);
    setSupabaseResult(null);
    setActionMessage('Supabase disconnected. Switched back to Firebase Firestore database.');
    setTimeout(() => setActionMessage(null), 3500);
    onRefreshProducts();
    onRefreshSettings();
  };

  const handleSyncToSupabase = async () => {
    setSyncingSupabase(true);
    try {
      const res = await syncAllDataToSupabase();
      if (res.success) {
        setActionMessage(res.message);
        setTimeout(() => setActionMessage(null), 4000);
        onRefreshProducts();
        onRefreshSettings();
      } else {
        setErrorMessage('Failed to sync to Supabase: ' + res.message);
        setTimeout(() => setErrorMessage(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage('Sync error: ' + (err?.message || String(err)));
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setSyncingSupabase(false);
    }
  };

  const handleCopySqlSchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setActionMessage('Supabase SQL schema copied to clipboard! Paste it into Supabase SQL Editor.');
    setTimeout(() => {
      setCopiedSql(false);
      setActionMessage(null);
    }, 3500);
  };

  // Admin Access Gate - Strictly requires awan11118@gmail.com
  const isAwanAdmin = user && user.email?.toLowerCase() === 'awan11118@gmail.com';

  if (!isAwanAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-neutral-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/30">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif text-neutral-950">
            Shami Shoe Zone Admin Panel
          </h2>
          <p className="text-xs text-neutral-500 mt-2">
            Administrator access is restricted to <strong>awan11118@gmail.com</strong>.
          </p>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 text-left">
              <p className="font-semibold">Access Denied</p>
              <p className="mt-1">
                You are currently signed in as <strong>{user.email}</strong>. This account does not have store management permissions.
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Sign Out & Switch to awan11118@gmail.com
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs space-y-1.5 text-amber-900">
              <p className="font-semibold">Authorized Admin Sign In:</p>
              <p>Please sign in using your official Google account:</p>
              <p className="font-mono font-bold text-neutral-900 bg-white px-2 py-1 rounded border border-amber-300 inline-block">
                awan11118@gmail.com
              </p>
            </div>

            <button
              onClick={async () => {
                try {
                  await signInWithGoogle();
                } catch {
                  await signInAsAdminAwan();
                }
              }}
              className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In with Google (awan11118@gmail.com)</span>
            </button>

            <button
              onClick={() => signInAsAdminAwan()}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-600"
            >
              <Shield className="w-4 h-4 text-neutral-950" />
              <span>⚡ 1-Click Instant Owner Login (awan11118@gmail.com)</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Quick Feedback Toast */}
      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="p-1 hover:bg-emerald-700 rounded">
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-red-700 rounded">
            ✕
          </button>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Kala Pul, Abbottabad Store Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Shami Shoe Zone Admin Panel
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Logged in as <strong>{user?.email}</strong> • WhatsApp fulfillment & catalog control
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSeedConfirm(true)}
            disabled={seeding}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Populate catalog if empty"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{seeding ? 'Seeding...' : 'Seed Catalog'}</span>
          </button>

          <button
            onClick={() => { loadOrdersData(); onRefreshProducts(); }}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
            title="Refresh All Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: DollarSign },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
          { id: 'products', label: `Products (${products.length})`, icon: ShoppingBag },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'settings', label: 'Store Settings & WhatsApp', icon: Settings },
          { id: 'supabase', label: 'Supabase Database', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
                adminTab === tab.id
                  ? 'border-amber-600 text-amber-600 font-bold bg-amber-50/40 rounded-t-xl'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {adminTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="p-2 rounded-xl bg-neutral-100 text-neutral-700">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif mt-3">
                {orders.length}
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                {pendingOrders.length} pending confirmation
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Total Revenue
                </span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif mt-3">
                PKR {totalRevenue.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Cash on Delivery (Abbottabad)
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Products in Catalog
                </span>
                <div className="p-2 rounded-xl bg-neutral-100 text-neutral-700">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif mt-3">
                {products.length}
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                {products.filter(p => p.inStock).length} in stock
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Delivered Orders
                </span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-serif mt-3">
                {deliveredOrders.length}
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Fulfilled across Abbottabad
              </p>
            </div>

          </div>

          {/* Recent Orders Snapshot */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-950 font-serif">
                  Recent WhatsApp Orders
                </h3>
                <p className="text-xs text-neutral-500">
                  Latest customer submissions awaiting confirmation or fulfillment
                </p>
              </div>
              <button
                onClick={() => setAdminTab('orders')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700"
              >
                View All Orders →
              </button>
            </div>

            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-neutral-900 bg-white px-2 py-1 rounded-md border border-neutral-200">
                    {order.orderNumber}
                  </span>
                  <div>
                    <p className="font-bold text-neutral-900">{order.customerName}</p>
                    <p className="text-[11px] text-neutral-500">
                      {order.items.length} items • {order.area}, Abbottabad
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-neutral-950">
                      PKR {order.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-neutral-500 block capitalize">
                      Status: {order.status}
                    </span>
                  </div>

                  <a
                    href={getWhatsAppUrl(order.whatsappNumber || order.phone, `Hello ${order.customerName}! We received your order ${order.orderNumber} at Shami Shoe Zone Kala Pul, Abbottabad. Can you please confirm?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                    title="Chat with Customer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {adminTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Search & Filter Row */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by Order ID (#SSZ...), customer name, phone, area..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">Status Filter:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-800"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="pending">Pending ({orders.filter(o => o.status === 'pending').length})</option>
                <option value="confirmed">Confirmed ({orders.filter(o => o.status === 'confirmed').length})</option>
                <option value="processing">Processing ({orders.filter(o => o.status === 'processing').length})</option>
                <option value="shipped">Shipped / Out for Delivery ({orders.filter(o => o.status === 'shipped').length})</option>
                <option value="delivered">Delivered ({orders.filter(o => o.status === 'delivered').length})</option>
                <option value="cancelled">Cancelled ({orders.filter(o => o.status === 'cancelled').length})</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          {loadingOrders ? (
            <div className="py-20 text-center text-xs text-neutral-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
              <p className="text-sm font-semibold text-neutral-700">No orders match your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-4 hover:border-amber-400 transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-xl bg-neutral-900 text-amber-400 font-mono font-bold text-xs shadow-xs">
                        {order.orderNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-950">
                          {order.customerName}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-neutral-500 font-medium mr-1">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          order.status === 'shipped' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          order.status === 'confirmed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          order.status === 'processing' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-300' :
                          'bg-yellow-50 text-yellow-800 border-yellow-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Delivery Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3.5 rounded-2xl bg-neutral-50 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                        Contact Info
                      </span>
                      <p className="font-semibold text-neutral-800 mt-0.5">Phone: {order.phone}</p>
                      <p className="text-neutral-600">WhatsApp: {order.whatsappNumber}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                        Abbottabad Address
                      </span>
                      <p className="font-semibold text-neutral-800 mt-0.5">{order.area}</p>
                      <p className="text-neutral-600">{order.address}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                        Payment & Notes
                      </span>
                      <p className="font-semibold text-neutral-800 mt-0.5">{order.paymentMethod}</p>
                      {order.notes && (
                        <p className="text-amber-800 italic bg-amber-100/50 px-2 py-0.5 rounded mt-1">
                          "{order.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items Ordered */}
                  <div className="divide-y divide-neutral-100 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-neutral-900">{item.name}</p>
                            <p className="text-[11px] text-neutral-500">
                              Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong> • Qty: <strong>{item.quantity}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="font-bold text-neutral-900">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer with WhatsApp Direct Action */}
                  <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4 text-neutral-600">
                      <span>Subtotal: PKR {order.subtotal.toLocaleString()}</span>
                      <span>Delivery: PKR {order.deliveryCharges.toLocaleString()}</span>
                      <span className="font-extrabold text-neutral-950 text-sm">
                        Total: PKR {order.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppUrl(order.whatsappNumber || order.phone, `Hello ${order.customerName}!\nRegarding your order ${order.orderNumber} at Shami Shoe Zone Kala Pul, Abbottabad:`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRODUCT MANAGEMENT */}
      {adminTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Product Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200">
            <div>
              <h3 className="text-base font-bold text-neutral-950 font-serif">
                Footwear Catalog Management
              </h3>
              <p className="text-xs text-neutral-500">
                Add, modify prices, update stock, sizes, and colors for Shami Shoe Zone
              </p>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Footwear</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square w-full relative bg-neutral-100">
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-white">
                      {prod.category}
                    </span>
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      prod.inStock ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {prod.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{prod.name}</h4>
                    {prod.nameUrdu && <p className="text-[11px] text-neutral-500 line-clamp-1">{prod.nameUrdu}</p>}
                    
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-bold text-neutral-950">PKR {prod.discountedPrice.toLocaleString()}</span>
                      {prod.originalPrice > prod.discountedPrice && (
                        <span className="text-xs text-neutral-400 line-through">PKR {prod.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    <div className="text-[11px] text-neutral-500 flex flex-wrap gap-1">
                      <span>Sizes: {prod.sizes.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditProduct(prod)}
                    className="flex-1 py-1.5 rounded-lg bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-100 flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirm({ id: prod.id, name: prod.name })}
                    className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 my-8">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-950 font-serif">
                {isNewProduct ? 'Add New Footwear Product' : 'Edit Footwear Product'}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {productFormError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {productFormError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Product Name (Urdu)</label>
                  <input
                    type="text"
                    value={editingProduct.nameUrdu || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameUrdu: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Category *</label>
                  <select
                    value={editingProduct.category || 'sneakers'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as CategoryType })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                  >
                    <option value="mens">Men's Shoes</option>
                    <option value="womens">Women's Shoes</option>
                    <option value="kids">Kids' Shoes</option>
                    <option value="sneakers">Sneakers & Sports</option>
                    <option value="formal">Formal Shoes</option>
                    <option value="casual">Casual & Loafers</option>
                    <option value="sandals">Peshawari & Sandals</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Original Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Discounted Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.discountedPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountedPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Image URL (Primary)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Sizes (Comma separated)</label>
                  <input
                    type="text"
                    value={editingProduct.sizes?.join(', ') || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="39, 40, 41, 42, 43, 44"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Colors (Comma separated)</label>
                  <input
                    type="text"
                    value={editingProduct.colors?.join(', ') || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                    })}
                    placeholder="Black, Dark Brown, Tan"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold"
                >
                  {savingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER MANAGEMENT */}
      {adminTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200">
            <h3 className="text-base font-bold text-neutral-950 font-serif">
              Registered Abbottabad Customers ({customers.length})
            </h3>
            <p className="text-xs text-neutral-500">
              Customer accounts verified via Google, Email, or Phone
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Email / Phone</th>
                    <th className="p-4">Abbottabad Area</th>
                    <th className="p-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {customers.map((c, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50">
                      <td className="p-4 font-bold">{c.displayName || 'Customer'}</td>
                      <td className="p-4">{c.email || c.phoneNumber || 'N/A'}</td>
                      <td className="p-4">{c.area || 'Abbottabad'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {c.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STORE SETTINGS & WHATSAPP */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs max-w-3xl space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-neutral-950 font-serif flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-600" />
              <span>Store Configuration & WhatsApp Orders</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Configure delivery rates, Abbottabad store location, and WhatsApp recipient number.
            </p>
          </div>

          {settingsSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Store settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Store WhatsApp Number (wa.me format)</label>
                <input
                  type="text"
                  required
                  placeholder="923129876543"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono"
                />
                <p className="text-[10px] text-neutral-400 mt-1">Country code without plus sign (e.g. 923001234567)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Display WhatsApp / Phone</label>
                <input
                  type="text"
                  required
                  value={settingsForm.displayWhatsApp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, displayWhatsApp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Delivery Charges (PKR)</label>
                <input
                  type="number"
                  required
                  value={settingsForm.deliveryCharges}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryCharges: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Free Delivery Threshold (PKR)</label>
                <input
                  type="number"
                  value={settingsForm.freeDeliveryThreshold}
                  onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Store Timings</label>
                <input
                  type="text"
                  value={settingsForm.storeTiming}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeTiming: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Store Address (English)</label>
              <input
                type="text"
                required
                value={settingsForm.storeAddress}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">Announcement Message</label>
              <input
                type="text"
                value={settingsForm.announcement}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
              />
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: SUPABASE DATABASE INTEGRATION */}
      {adminTab === 'supabase' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-8 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold font-serif text-neutral-900">
                  Supabase PostgreSQL Database Integration
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                سُپابیس ڈیٹا بیس کنکشن اور ٹیبل مینجمنٹ — Shami Shoe Zone live database integration
              </p>
            </div>

            {/* Active Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Current Storage:</span>
              {supabaseActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Supabase Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Firebase Firestore Active
                </span>
              )}
            </div>
          </div>

          {/* Quick Urdu & English Instruction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
              <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-mono text-[10px]">1</span>
                Supabase Project URL
              </span>
              <p className="text-neutral-500 pt-1">
                Open your project on <strong>supabase.com</strong> &gt; Project Settings &gt; API &gt; Copy <strong>Project URL</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
              <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-mono text-[10px]">2</span>
                Supabase Anon Key
              </span>
              <p className="text-neutral-500 pt-1">
                Under the same API page, copy the <strong>anon public key</strong> (starts with eyJ...).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
              <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-mono text-[10px]">3</span>
                Run SQL Schema Script
              </span>
              <p className="text-neutral-500 pt-1">
                In Supabase, go to <strong>SQL Editor</strong>, paste our schema below, and click <strong>RUN</strong>.
              </p>
            </div>
          </div>

          {/* Credentials Form */}
          <div className="space-y-4 max-w-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Supabase Project API Credentials
            </h4>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Supabase Project URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="https://xyzabcdefghijklmnop.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <p className="text-[10px] text-neutral-400 mt-1">Found in Supabase &gt; Project Settings &gt; API &gt; Configuration &gt; Project URL</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Supabase Anon Key (Public) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
              />
              <p className="text-[10px] text-neutral-400 mt-1">Found in Supabase &gt; Project Settings &gt; API &gt; Project API keys &gt; anon public</p>
            </div>

            {/* Test Feedback */}
            {supabaseResult && (
              <div className={`p-4 rounded-2xl text-xs space-y-1.5 ${supabaseResult.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                <div className="flex items-center gap-2 font-bold">
                  {supabaseResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                  <span>{supabaseResult.success ? 'Supabase Connection Test Passed' : 'Connection Failed'}</span>
                </div>
                <p className="text-xs">{supabaseResult.message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={testingSupabase}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin' : ''}`} />
                <span>{testingSupabase ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveSupabase}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Activate Supabase</span>
              </button>

              {supabaseActive && (
                <button
                  type="button"
                  onClick={handleDisconnectSupabase}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Disconnect (Use Firestore)
                </button>
              )}
            </div>
          </div>

          {/* SQL Schema Script Section */}
          <div className="pt-6 border-t border-neutral-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Supabase SQL Database Tables Schema
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Creates products, orders, store_settings, reviews tables & Row Level Security (RLS) policies.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySqlSchema}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {copiedSql ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                </button>

                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 border border-neutral-300 transition-colors"
                >
                  <span>Open Supabase</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* SQL Preview Box */}
            <div className="relative rounded-2xl bg-neutral-900 text-neutral-200 p-4 font-mono text-[11px] max-h-56 overflow-y-auto border border-neutral-800 shadow-inner">
              <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>

          {/* Sync Data to Supabase Button */}
          <div className="pt-6 border-t border-neutral-200 p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h5 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Push Initial Catalog to Supabase</span>
              </h5>
              <p className="text-xs text-neutral-600 mt-1">
                Uploads all 8 Abbottabad footwear products, store settings, and verified customer reviews directly into your Supabase database.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSyncToSupabase}
              disabled={syncingSupabase || !supabaseUrl || !supabaseAnonKey}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
            >
              <Database className={`w-3.5 h-3.5 text-amber-400 ${syncingSupabase ? 'animate-spin' : ''}`} />
              <span>{syncingSupabase ? 'Pushing Data...' : 'Push Catalog to Supabase'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-neutral-900">Delete Product?</h3>
              <p className="text-xs text-neutral-600 mt-1">
                Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong> from Shami Shoe Zone catalog?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seed Catalog Confirmation Modal */}
      {seedConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-neutral-900">Seed Default Catalog?</h3>
              <p className="text-xs text-neutral-600 mt-1">
                This will populate the Shami Shoe Zone database with genuine Abbottabad footwear styles, prices, and default store settings.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSeedConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSeedCatalog}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Yes, Seed
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
