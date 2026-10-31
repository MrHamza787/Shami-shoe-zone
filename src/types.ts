export type CategoryType = 
  | 'all'
  | 'mens'
  | 'womens'
  | 'kids'
  | 'sneakers'
  | 'formal'
  | 'casual'
  | 'sandals';

export interface Product {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  originalPrice: number;
  discountedPrice: number;
  category: CategoryType;
  images: string[];
  sizes: (string | number)[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  nameUrdu?: string;
  image: string;
  price: number;
  originalPrice?: number;
  size: string | number;
  color: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  nameUrdu?: string;
  image: string;
  price: number;
  size: string | number;
  color: string;
  quantity: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  area: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery';
  notes?: string;
  status: OrderStatus;
  whatsappStatus: 'sent' | 'pending';
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  address?: string;
  area?: string;
  role: 'admin' | 'customer';
  createdAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  taglineUrdu: string;
  whatsappNumber: string; // e.g., 923001234567 (clean numeric for wa.me)
  displayWhatsApp: string; // e.g. +92 300 1234567
  contactPhone: string;
  storeAddress: string;
  storeAddressUrdu: string;
  deliveryArea: string;
  deliveryCharges: number; // default e.g. 150
  freeDeliveryThreshold: number; // e.g. 4000
  minOrderAmount: number; // e.g. 500
  announcement: string;
  announcementUrdu: string;
  storeTiming: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  productName: string;
  location: string;
  date: string;
}
