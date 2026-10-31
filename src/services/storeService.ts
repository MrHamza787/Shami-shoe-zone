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
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, Order, StoreSettings, Review } from '../types';
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS, INITIAL_REVIEWS } from '../data/seedData';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'store_settings';
const REVIEWS_COLLECTION = 'reviews';

// --- PRODUCTS ---

export async function fetchProducts(): Promise<Product[]> {
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
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedInitialProductsIfEmpty(): Promise<boolean> {
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

// --- STORE SETTINGS ---

export async function fetchStoreSettings(): Promise<StoreSettings> {
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
  const path = ORDERS_COLLECTION;
  try {
    // Generate unique Abbottabad order ID: #SSZ + 4-digit number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#SSZ${randomSuffix}`;
    const timestamp = new Date().toISOString();

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
    // Sort descending by creation
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
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
  // Strip non-digits
  let cleanNumber = phone.replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '92' + cleanNumber.substring(1);
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
