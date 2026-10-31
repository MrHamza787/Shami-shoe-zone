import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, Order, StoreSettings, Review } from '../types';
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS, INITIAL_REVIEWS } from '../data/seedData';
import { getSupabaseClient, getSupabaseCredentials } from '../supabase';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'store_settings';
const REVIEWS_COLLECTION = 'reviews';

// --- SUPABASE MAPPERS ---
function mapProductFromSupabase(row: any): Product {
  return {
    id: row.id,
    name: row.name || '',
    nameUrdu: row.name_urdu || '',
    description: row.description || '',
    descriptionUrdu: row.description_urdu || '',
    originalPrice: Number(row.original_price) || 0,
    discountedPrice: Number(row.discounted_price) || 0,
    category: row.category,
    images: Array.isArray(row.images) ? row.images : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    inStock: Boolean(row.in_stock),
    stockQuantity: Number(row.stock_quantity) || 0,
    featured: Boolean(row.featured),
    isNewArrival: Boolean(row.is_new_arrival),
    isBestSeller: Boolean(row.is_best_seller),
    rating: Number(row.rating) || 4.8,
    reviewsCount: Number(row.reviews_count) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProductToSupabase(p: Partial<Product> & { id?: string }): any {
  const obj: any = {};
  if (p.id !== undefined) obj.id = p.id;
  if (p.name !== undefined) obj.name = p.name;
  if (p.nameUrdu !== undefined) obj.name_urdu = p.nameUrdu;
  if (p.description !== undefined) obj.description = p.description;
  if (p.descriptionUrdu !== undefined) obj.description_urdu = p.descriptionUrdu;
  if (p.originalPrice !== undefined) obj.original_price = p.originalPrice;
  if (p.discountedPrice !== undefined) obj.discounted_price = p.discountedPrice;
  if (p.category !== undefined) obj.category = p.category;
  if (p.images !== undefined) obj.images = p.images;
  if (p.sizes !== undefined) obj.sizes = p.sizes;
  if (p.colors !== undefined) obj.colors = p.colors;
  if (p.inStock !== undefined) obj.in_stock = p.inStock;
  if (p.stockQuantity !== undefined) obj.stock_quantity = p.stockQuantity;
  if (p.featured !== undefined) obj.featured = p.featured;
  if (p.isNewArrival !== undefined) obj.is_new_arrival = p.isNewArrival;
  if (p.isBestSeller !== undefined) obj.is_best_seller = p.isBestSeller;
  if (p.rating !== undefined) obj.rating = p.rating;
  if (p.reviewsCount !== undefined) obj.reviews_count = p.reviewsCount;
  obj.updated_at = new Date().toISOString();
  return obj;
}

function mapOrderFromSupabase(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number || '',
    userId: row.user_id || '',
    customerName: row.customer_name || '',
    phone: row.phone || '',
    whatsappNumber: row.whatsapp_number || '',
    address: row.address || '',
    area: row.area || '',
    city: row.city || 'Abbottabad',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    deliveryCharges: Number(row.delivery_charges) || 0,
    totalAmount: Number(row.total_amount) || 0,
    paymentMethod: row.payment_method || 'Cash on Delivery',
    notes: row.notes || '',
    status: row.status || 'pending',
    whatsappStatus: row.whatsapp_status || 'pending',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at,
  };
}

function mapOrderToSupabase(o: Omit<Order, 'id'> & { id?: string }): any {
  return {
    ...(o.id ? { id: o.id } : {}),
    order_number: o.orderNumber,
    user_id: o.userId,
    customer_name: o.customerName,
    phone: o.phone,
    whatsapp_number: o.whatsappNumber,
    address: o.address,
    area: o.area,
    city: o.city || 'Abbottabad',
    items: o.items,
    subtotal: o.subtotal,
    delivery_charges: o.deliveryCharges,
    total_amount: o.totalAmount,
    payment_method: o.paymentMethod,
    notes: o.notes || '',
    status: o.status,
    whatsapp_status: o.whatsappStatus,
    created_at: o.createdAt,
    updated_at: o.updatedAt || o.createdAt,
  };
}

function mapSettingsFromSupabase(row: any): StoreSettings {
  return {
    storeName: row.store_name || DEFAULT_STORE_SETTINGS.storeName,
    tagline: row.tagline || DEFAULT_STORE_SETTINGS.tagline,
    taglineUrdu: row.tagline_urdu || DEFAULT_STORE_SETTINGS.taglineUrdu,
    whatsappNumber: row.whatsapp_number || DEFAULT_STORE_SETTINGS.whatsappNumber,
    displayWhatsApp: row.display_whatsapp || DEFAULT_STORE_SETTINGS.displayWhatsApp,
    contactPhone: row.contact_phone || DEFAULT_STORE_SETTINGS.contactPhone,
    storeAddress: row.store_address || DEFAULT_STORE_SETTINGS.storeAddress,
    storeAddressUrdu: row.store_address_urdu || DEFAULT_STORE_SETTINGS.storeAddressUrdu,
    deliveryArea: row.delivery_area || DEFAULT_STORE_SETTINGS.deliveryArea,
    deliveryCharges: Number(row.delivery_charges) ?? DEFAULT_STORE_SETTINGS.deliveryCharges,
    freeDeliveryThreshold: Number(row.free_delivery_threshold) ?? DEFAULT_STORE_SETTINGS.freeDeliveryThreshold,
    minOrderAmount: Number(row.min_order_amount) ?? DEFAULT_STORE_SETTINGS.minOrderAmount,
    announcement: row.announcement || DEFAULT_STORE_SETTINGS.announcement,
    announcementUrdu: row.announcement_urdu || DEFAULT_STORE_SETTINGS.announcementUrdu,
    storeTiming: row.store_timing || DEFAULT_STORE_SETTINGS.storeTiming,
    updatedAt: row.updated_at,
  };
}

function mapSettingsToSupabase(s: StoreSettings): any {
  return {
    id: 'store_settings',
    store_name: s.storeName,
    tagline: s.tagline,
    tagline_urdu: s.taglineUrdu,
    whatsapp_number: s.whatsappNumber,
    display_whatsapp: s.displayWhatsApp,
    contact_phone: s.contactPhone,
    store_address: s.storeAddress,
    store_address_urdu: s.storeAddressUrdu,
    delivery_area: s.deliveryArea,
    delivery_charges: s.deliveryCharges,
    free_delivery_threshold: s.freeDeliveryThreshold,
    min_order_amount: s.minOrderAmount,
    announcement: s.announcement,
    announcement_urdu: s.announcementUrdu,
    store_timing: s.storeTiming,
    updated_at: new Date().toISOString(),
  };
}

// --- PRODUCTS ---

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapProductFromSupabase);
      }
    } catch (err) {
      console.warn('Supabase products fetch failed, falling back to Firestore/catalog:', err);
    }
  }

  // Firestore Fallback
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (querySnapshot.empty) {
      return INITIAL_PRODUCTS;
    }
    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
    });
    return products;
  } catch (error) {
    console.warn('Using local catalog fallback for products:', error);
    return INITIAL_PRODUCTS;
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();
  const generatedId = 'prod-' + Date.now();

  if (supabase && isActive) {
    try {
      const row = mapProductToSupabase({ ...product, id: generatedId });
      row.created_at = new Date().toISOString();
      const { error } = await supabase.from('products').insert([row]);
      if (!error) {
        return generatedId;
      }
      console.warn('Supabase add product error:', error);
    } catch (e) {
      console.warn('Supabase insert failed, attempting Firestore:', e);
    }
  }

  // Firestore
  const path = PRODUCTS_COLLECTION;
  try {
    const docRef = await addDoc(collection(db, path), {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const row = mapProductToSupabase(updates);
      const { error } = await supabase.from('products').update(row).eq('id', id);
      if (!error) return;
      console.warn('Supabase update product error:', error);
    } catch (e) {
      console.warn('Supabase update failed:', e);
    }
  }

  // Firestore
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return;
      console.warn('Supabase delete product error:', error);
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  // Firestore
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedInitialProductsIfEmpty(): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  // If Supabase is active, seed into Supabase
  if (supabase && isActive) {
    try {
      const { data: existing } = await supabase.from('products').select('id').limit(1);
      if (!existing || existing.length === 0) {
        const rows = INITIAL_PRODUCTS.map((p) => {
          const r = mapProductToSupabase(p);
          r.created_at = new Date().toISOString();
          return r;
        });
        await supabase.from('products').upsert(rows);
      }

      // Also upsert store_settings
      const settingsRow = mapSettingsToSupabase(DEFAULT_STORE_SETTINGS);
      await supabase.from('store_settings').upsert(settingsRow);
      return true;
    } catch (e) {
      console.warn('Supabase seed error:', e);
    }
  }

  // Firestore Seeding
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (!querySnapshot.empty) {
      return false; // already seeded
    }

    // Seed products
    for (const prod of INITIAL_PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      await setDoc(docRef, prod);
    }

    // Seed settings
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(settingsRef, DEFAULT_STORE_SETTINGS);

    // Seed reviews
    for (const rev of INITIAL_REVIEWS) {
      const revRef = doc(db, REVIEWS_COLLECTION, rev.id);
      await setDoc(revRef, rev);
    }

    return true;
  } catch (error) {
    console.error('Error during catalog seeding:', error);
    return false;
  }
}

// Push all initial products & settings directly to Supabase tables
export async function syncAllDataToSupabase(): Promise<{ success: boolean; message: string; count: number }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, message: 'Supabase client not initialized. Please verify URL and Anon Key.', count: 0 };
  }

  try {
    // 1. Push Products
    const productRows = INITIAL_PRODUCTS.map((p) => {
      const r = mapProductToSupabase(p);
      r.created_at = new Date().toISOString();
      return r;
    });

    const { error: prodError } = await supabase.from('products').upsert(productRows, { onConflict: 'id' });
    if (prodError) {
      throw new Error(`Products table error: ${prodError.message}`);
    }

    // 2. Push Settings
    const settingsRow = mapSettingsToSupabase(DEFAULT_STORE_SETTINGS);
    const { error: settingsError } = await supabase.from('store_settings').upsert(settingsRow, { onConflict: 'id' });
    if (settingsError) {
      console.warn('Store settings table warning:', settingsError.message);
    }

    // 3. Push Reviews
    const reviewRows = INITIAL_REVIEWS.map((r) => ({
      id: r.id,
      customer_name: r.customerName,
      rating: r.rating,
      comment: r.comment,
      product_name: r.productName,
      location: r.location,
      date: r.date,
      created_at: new Date().toISOString(),
    }));
    await supabase.from('reviews').upsert(reviewRows, { onConflict: 'id' });

    return { 
      success: true, 
      message: `Successfully synchronized ${productRows.length} footwear products and store settings to Supabase!`,
      count: productRows.length 
    };
  } catch (err: any) {
    return { success: false, message: err?.message || String(err), count: 0 };
  }
}

// --- STORE SETTINGS ---

export async function fetchStoreSettings(): Promise<StoreSettings> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const { data, error } = await supabase.from('store_settings').select('*').eq('id', 'store_settings').single();
      if (!error && data) {
        return mapSettingsFromSupabase(data);
      }
    } catch (e) {
      console.warn('Supabase store settings fetch error, using fallback:', e);
    }
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as StoreSettings;
    }
    return DEFAULT_STORE_SETTINGS;
  } catch (error) {
    console.warn('Using default store settings:', error);
    return DEFAULT_STORE_SETTINGS;
  }
}

export async function updateStoreSettings(settings: StoreSettings): Promise<void> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const row = mapSettingsToSupabase(settings);
      await supabase.from('store_settings').upsert(row, { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase store settings update error:', e);
    }
  }

  const path = `${SETTINGS_COLLECTION}/${SETTINGS_DOC_ID}`;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- ORDERS ---

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'whatsappStatus'>): Promise<Order> {
  // Generate unique Abbottabad order ID: #SSZ + 4-digit number
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `#SSZ${randomSuffix}`;
  const timestamp = new Date().toISOString();
  const generatedId = 'ord-' + Date.now();

  const sanitizedItems = orderData.items.map((item) => ({
    productId: item.productId || '',
    name: item.name || '',
    nameUrdu: item.nameUrdu || '',
    image: item.image || '',
    price: Number(item.price) || 0,
    size: String(item.size || ''),
    color: item.color || '',
    quantity: Number(item.quantity) || 1,
  }));

  const newOrder: Omit<Order, 'id'> = {
    userId: orderData.userId,
    customerName: orderData.customerName || '',
    phone: orderData.phone || '',
    whatsappNumber: orderData.whatsappNumber || '',
    address: orderData.address || '',
    area: orderData.area || '',
    city: orderData.city || 'Abbottabad',
    items: sanitizedItems,
    subtotal: Number(orderData.subtotal) || 0,
    deliveryCharges: Number(orderData.deliveryCharges) || 0,
    totalAmount: Number(orderData.totalAmount) || 0,
    paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
    notes: orderData.notes || '',
    orderNumber,
    status: 'pending',
    whatsappStatus: 'pending',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const row = mapOrderToSupabase({ ...newOrder, id: generatedId });
      const { error } = await supabase.from('orders').insert([row]);
      if (!error) {
        return {
          id: generatedId,
          ...newOrder,
        };
      }
      console.warn('Supabase create order error:', error);
    } catch (e) {
      console.warn('Supabase create order exception:', e);
    }
  }

  // Firestore Save
  const path = ORDERS_COLLECTION;
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
    return {
      id: docRef.id,
      ...newOrder,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(mapOrderFromSupabase);
      }
    } catch (e) {
      console.warn('Supabase fetchUserOrders error:', e);
    }
  }

  const path = ORDERS_COLLECTION;
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
    });
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(mapOrderFromSupabase);
      }
    } catch (e) {
      console.warn('Supabase fetchAllOrders error:', e);
    }
  }

  const path = ORDERS_COLLECTION;
  try {
    const querySnapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
    });
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (!error) return;
    } catch (e) {
      console.warn('Supabase updateOrderStatus error:', e);
    }
  }

  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function markOrderWhatsAppSent(orderId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      await supabase
        .from('orders')
        .update({ whatsapp_status: 'sent', updated_at: new Date().toISOString() })
        .eq('id', orderId);
    } catch (e) {
      console.warn('Supabase markOrderWhatsAppSent error:', e);
    }
  }

  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      whatsappStatus: 'sent',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Could not update whatsappStatus:', error);
  }
}

// --- REVIEWS ---

export async function fetchReviews(): Promise<Review[]> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          customerName: r.customer_name,
          rating: Number(r.rating) || 5,
          comment: r.comment,
          productName: r.product_name,
          location: r.location || 'Abbottabad',
          date: r.date || 'Recent',
        }));
      }
    } catch {
      // Fallback
    }
  }

  try {
    const querySnapshot = await getDocs(collection(db, REVIEWS_COLLECTION));
    if (querySnapshot.empty) {
      return INITIAL_REVIEWS;
    }
    const reviews: Review[] = [];
    querySnapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...(docSnap.data() as Omit<Review, 'id'>) });
    });
    return reviews;
  } catch {
    return INITIAL_REVIEWS;
  }
}

export async function addReview(review: Omit<Review, 'id'>): Promise<void> {
  const supabase = getSupabaseClient();
  const { isActive } = getSupabaseCredentials();

  if (supabase && isActive) {
    try {
      const generatedId = 'rev-' + Date.now();
      await supabase.from('reviews').insert([{
        id: generatedId,
        customer_name: review.customerName,
        rating: review.rating,
        comment: review.comment,
        product_name: review.productName,
        location: review.location || 'Abbottabad',
        date: review.date,
        created_at: new Date().toISOString(),
      }]);
      return;
    } catch (e) {
      console.warn('Supabase addReview error:', e);
    }
  }

  const path = REVIEWS_COLLECTION;
  try {
    await addDoc(collection(db, REVIEWS_COLLECTION), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Helper: Format WhatsApp order message exactly as required by specification
export function generateWhatsAppOrderMessage(order: Order): string {
  const itemsText = order.items
    .map(
      (item) =>
        `Product: ${item.name}\nSize: ${item.size}\nColor: ${item.color}\nQuantity: ${item.quantity}\nProduct Price: PKR ${item.price.toLocaleString()}`
    )
    .join('\n---\n');

  return `NEW ORDER – SHAMI SHOE ZONE

Order ID: ${order.orderNumber}
Customer Name: ${order.customerName}
Phone: ${order.phone}
WhatsApp: ${order.whatsappNumber}
Address: ${order.address}, ${order.area}, Abbottabad

${itemsText}

Subtotal: PKR ${order.subtotal.toLocaleString()}
Delivery Charges: PKR ${order.deliveryCharges.toLocaleString()}
Total Amount: PKR ${order.totalAmount.toLocaleString()}
Payment Method: ${order.paymentMethod}
${order.notes ? `Customer Notes: ${order.notes}\n` : ''}
Please confirm this order.`;
}

// Helper: Clean phone number to WhatsApp international standard
export function getWhatsAppUrl(phone: string, text: string): string {
  let cleanNumber = phone.replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '92' + cleanNumber.substring(1);
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
