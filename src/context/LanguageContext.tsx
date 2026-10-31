import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isUrdu: boolean;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  home: { en: 'Home', ur: 'ہوم' },
  shop: { en: 'Shop', ur: 'دکان' },
  categories: { en: 'Categories', ur: 'کیٹیگریز' },
  cart: { en: 'Cart', ur: 'ٹوکری' },
  myOrders: { en: 'My Orders', ur: 'میرے آرڈرز' },
  aboutUs: { en: 'About Us', ur: 'ہمارے بارے میں' },
  contactUs: { en: 'Contact Us', ur: 'رابطہ کریں' },
  admin: { en: 'Admin Panel', ur: 'ایڈمن پینل' },
  login: { en: 'Sign In', ur: 'لاگ ان' },
  logout: { en: 'Log Out', ur: 'لاگ آؤٹ' },

  // Categories
  allShoes: { en: 'All Shoes', ur: 'تمام جوتے' },
  mens: { en: "Men's Shoes", ur: 'مردانہ جوتے' },
  womens: { en: "Women's Shoes", ur: 'زننانہ جوتے' },
  kids: { en: "Kids' Shoes", ur: 'بچوں کے جوتے' },
  sneakers: { en: 'Sneakers & Sports', ur: 'اسنیکرز اور اسپورٹس' },
  formal: { en: 'Formal & Office', ur: 'فارمل اور دفتری' },
  casual: { en: 'Casual & Loafers', ur: 'کیژول اور لوفیرز' },
  sandals: { en: 'Sandals & Slippers', ur: 'سینڈل اور چپل' },

  // Hero & Banners
  heroTitle: { en: 'Step into Comfort & Style in Abbottabad', ur: 'ایبٹ آباد کا سب سے معیاری اور اسٹائلش جوتوں کا مرکز' },
  heroSubtitle: { en: 'Premium handcrafted shoes, sports sneakers, Peshawari chappals & casual footwear delivered directly to your doorstep across Abbottabad.', ur: 'خالص چمڑے کے جوتے، جاگنگ اسنیکرز، اصل پشاوری چپل اور فیشن فٹ ویئر اب آپ کی دہلیز پر۔' },
  shopNow: { en: 'Shop Collection', ur: 'کلیکشن دیکھیں' },
  orderWhatsApp: { en: 'WhatsApp Order', ur: 'واٹس ایپ آرڈر' },

  // Product
  addToCart: { en: 'Add to Cart', ur: 'ٹوکری میں شامل کریں' },
  buyNow: { en: 'Buy Now', ur: 'ابھی خریدیں' },
  selectSize: { en: 'Select Size', ur: 'سائز منتخب کریں' },
  selectColor: { en: 'Select Color', ur: 'رنگ منتخب کریں' },
  inStock: { en: 'In Stock', ur: 'دستیاب ہے' },
  outOfStock: { en: 'Out of Stock', ur: 'اسٹاک ختم' },
  pkr: { en: 'PKR', ur: 'روپے' },
  sizeGuide: { en: 'Size Guide', ur: 'سائز گائیڈ' },

  // Cart & Checkout
  cartEmpty: { en: 'Your shopping cart is empty', ur: 'آپ کی شاپنگ کارٹ خالی ہے' },
  subtotal: { en: 'Subtotal', ur: 'کل رقم' },
  deliveryCharges: { en: 'Delivery Charges (Abbottabad)', ur: 'ڈیلیوری چارجز (ایبٹ آباد)' },
  freeDelivery: { en: 'Free Delivery', ur: 'مفت ڈیلیوری' },
  total: { en: 'Total Amount', ur: 'کل ادائیگی' },
  proceedToCheckout: { en: 'Proceed to Checkout', ur: 'چیک آؤٹ پر جائیں' },
  codNote: { en: 'Cash on Delivery: Pay cash upon receiving your shoes', ur: 'کیش آن ڈیلیوری: پارسل موصول ہونے پر رقم ادا کریں' },

  // Checkout labels
  fullName: { en: 'Full Name', ur: 'مکمل نام' },
  phone: { en: 'Mobile Phone Number', ur: 'موبائل فون نمبر' },
  whatsappNum: { en: 'WhatsApp Number', ur: 'واٹس ایپ نمبر' },
  address: { en: 'Complete Home Address', ur: 'مکمل گھر کا پتہ' },
  area: { en: 'Abbottabad Area / Mohallah', ur: 'علاقہ / محلہ' },
  orderNotes: { en: 'Delivery Instructions / Notes', ur: 'ڈیلیوری ہدایات' },
  placeOrder: { en: 'Confirm Order & Send via WhatsApp', ur: 'آرڈر تصدیق کریں اور واٹس ایپ بھیجیں' },
  loginRequiredNote: { en: 'Please sign in to complete your checkout and confirm delivery', ur: 'آرڈر مکمل کرنے کے لیے برائے مہربانی لاگ ان کریں' },

  // Store Location & Info
  storeLocationHeader: { en: 'Visit Shami Shoe Zone in Abbottabad', ur: 'شامی شو زون کا دورہ کریں' },
  storeLocationDesc: { en: 'Located at Shami General Store, Kala Pul, Abbottabad. Welcome to try on our shoes in person or order for prompt home delivery!', ur: 'شامی جنرل اسٹور، کالا پل، ایبٹ آباد میں تشریف لائیں یا گھر بیٹھے واٹس ایپ پر آرڈر کریں۔' },
  openTiming: { en: 'Daily 10:00 AM – 10:00 PM', ur: 'روزانہ صبح 10 تا رات 10 بجے' },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  isUrdu: false,
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('ssz_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ssz_lang', lang);
  };

  const isUrdu = language === 'ur';

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  useEffect(() => {
    document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isUrdu]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isUrdu, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
