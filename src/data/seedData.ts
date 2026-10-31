import { Product, StoreSettings, Review } from '../types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Shami Shoe Zone",
  tagline: "Premium Footwear Store in Abbottabad",
  taglineUrdu: "ایبٹ آباد کا سب سے بہترین جوتوں کا مرکز",
  whatsappNumber: "923129876543",
  displayWhatsApp: "+92 312 9876543",
  contactPhone: "+92 312 9876543",
  storeAddress: "Shami General Store, Kala Pul, Abbottabad, Pakistan",
  storeAddressUrdu: "شامی جنرل اسٹور، کالا پل، ایبٹ آباد، پاکستان",
  deliveryArea: "All over Abbottabad (Mandian, Cantt, Supply, Kala Pul, Jinnahabad, PMA Road, Nawan Shehr)",
  deliveryCharges: 150,
  freeDeliveryThreshold: 4500,
  minOrderAmount: 500,
  announcement: "🚚 Fast Home Delivery all across Abbottabad! Cash on Delivery Available. WhatsApp Orders: +92 312 9876543",
  announcementUrdu: "🚚 پورے ایبٹ آباد میں تیز ترین ہوم ڈیلیوری! کیش آن ڈیلیوری دستیاب ہے۔ واٹس ایپ آرڈر کریں!",
  storeTiming: "10:00 AM - 10:00 PM (Monday - Sunday)",
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "ssz-prod-1",
    name: "Classic Oxford Leather Formal Shoes",
    nameUrdu: "کلاسک آکسفورڈ لیدر فارمل جوتے",
    description: "Crafted from genuine polished leather with a cushioned insole and non-slip rubber heel. Perfect for office, weddings, and formal events in Abbottabad.",
    descriptionUrdu: "خالص چمڑے سے تیار کردہ پائیدار فارمل جوتے۔ آرام دہ تلوے کے ساتھ دفتری اور تقریباتی استعمال کے لیے بہترین۔",
    originalPrice: 4999,
    discountedPrice: 3899,
    category: "formal",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ["Black", "Dark Brown", "Tan"],
    inStock: true,
    stockQuantity: 18,
    featured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 34,
    createdAt: "2026-10-01T10:00:00Z"
  },
  {
    id: "ssz-prod-2",
    name: "Air-Mesh Breathable Running Sneakers",
    nameUrdu: "ایئر میش رننگ اسنیکرز",
    description: "Ultra-lightweight mesh upper with responsive EVA cushioning. Designed for jogging, gym workouts, and brisk morning walks around Abbottabad hills.",
    descriptionUrdu: "انتہائی ہلکے اور ہوادار جوتے۔ جاگنگ، واک اور جم کے لیے بے حد آرام دہ۔",
    originalPrice: 4200,
    discountedPrice: 3199,
    category: "sneakers",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Crimson Red", "Jet Black", "Steel Grey"],
    inStock: true,
    stockQuantity: 24,
    featured: true,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 28,
    createdAt: "2026-10-15T10:00:00Z"
  },
  {
    id: "ssz-prod-3",
    name: "Handcrafted Traditional Peshawari Chappal (Kaptan Style)",
    nameUrdu: "دستکاری کپتان اسٹائل پشاوری چپل",
    description: "Authentic twin-stitched Pakistani Peshawari Chappal made with pure cow leather and durable tyre sole. Ideal for Eid, Friday prayers, and traditional attire.",
    descriptionUrdu: "خالص چمڑے اور مضبوط ٹائر سول سے تیار کردہ اصل روایتی پشاوری چپل۔ عید اور جمعہ کے لیے بہترین انتخاب۔",
    originalPrice: 3800,
    discountedPrice: 2899,
    category: "sandals",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: ["Mustard Brown", "Glossy Black", "Chocolate"],
    inStock: true,
    stockQuantity: 30,
    featured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 52,
    createdAt: "2026-09-20T10:00:00Z"
  },
  {
    id: "ssz-prod-4",
    name: "Women's Elegant Block Heel Sandals",
    nameUrdu: "خواتین کے خوبصورت بلاک ہیل سینڈل",
    description: "Chic open-toe block heel sandals with cushioned footbed and gold metallic accent buckle. Stylish yet comfortable for evening parties and family gatherings.",
    descriptionUrdu: "خواتین کے لیے پرکشش اور پرآسائش بلاک ہیلز۔ تقریبات اور پارٹیوں کے لیے پرفیکٹ ڈیزائن۔",
    originalPrice: 3500,
    discountedPrice: 2650,
    category: "womens",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    colors: ["Beige Nude", "Midnight Black", "Rose Gold"],
    inStock: true,
    stockQuantity: 15,
    featured: true,
    rating: 4.7,
    reviewsCount: 19,
    createdAt: "2026-10-05T10:00:00Z"
  },
  {
    id: "ssz-prod-5",
    name: "Men's Italian Penny Loafers (Slip-on)",
    nameUrdu: "مردانہ اٹالین لوفیرز",
    description: "Premium slip-on driving loafers with soft microfiber lining and anti-slip studded rubber sole. Versatile styling with jeans or traditional Shalwar Kameez.",
    descriptionUrdu: "سافٹ ڈرائیونگ لوفیرز جو پینٹ اور شلوار قمیض دونوں کے ساتھ دلکش لگتے ہیں۔",
    originalPrice: 4400,
    discountedPrice: 3450,
    category: "casual",
    images: [
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: [40, 41, 42, 43, 44],
    colors: ["Suede Brown", "Charcoal Black", "Navy Blue"],
    inStock: true,
    stockQuantity: 20,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 22,
    createdAt: "2026-10-18T10:00:00Z"
  },
  {
    id: "ssz-prod-6",
    name: "Kids' Dynamic Sport Sneakers (Lightweight)",
    nameUrdu: "بچوں کے اسپورٹ اسنیکرز",
    description: "Durable kid-friendly sneakers with easy Velcro straps, shock-absorbing midsole, and flexible toe guard. Great for school PE, park play, and daily adventures.",
    descriptionUrdu: "بچوں کے لیے ہلکے پھلکے اسکول اور پلے اسنیکرز۔ ویلکرو اسٹریپ کے ساتھ آسانی سے پہننے والے۔",
    originalPrice: 2800,
    discountedPrice: 1999,
    category: "kids",
    images: [
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: [28, 29, 30, 31, 32, 33, 34, 35],
    colors: ["Cobalt Blue", "Vibrant Red", "Neon Green"],
    inStock: true,
    stockQuantity: 25,
    featured: true,
    rating: 4.9,
    reviewsCount: 31,
    createdAt: "2026-10-10T10:00:00Z"
  },
  {
    id: "ssz-prod-7",
    name: "Women's Comfort Cushioned Flat Slip-on Pumps",
    nameUrdu: "خواتین کے آرام دہ فلیٹ پمپس",
    description: "Memory foam insole with rounded toe box and flexible outsole. The go-to daily comfort footwear for teachers, university students, and busy days.",
    descriptionUrdu: "میموری فوم اندرونی تلوے کے ساتھ انتہائی آرام دہ خواتین کے پمپس۔",
    originalPrice: 2900,
    discountedPrice: 2199,
    category: "womens",
    images: [
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: [36, 37, 38, 39, 40],
    colors: ["Muted Peach", "Matte Black", "Ivory"],
    inStock: true,
    stockQuantity: 16,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 26,
    createdAt: "2026-09-28T10:00:00Z"
  },
  {
    id: "ssz-prod-8",
    name: "Men's Urban High-Top Streetwear Sneakers",
    nameUrdu: "مردانہ ہائی ٹاپ اسٹریٹ ویئر اسنیکرز",
    description: "High-ankle padded collar with premium synthetic leather overlays and textured rubber outsole. Stand out with bold urban streetwear fashion.",
    descriptionUrdu: "جدید ہائی ٹاپ ڈیزائن اسنیکرز۔ اسپورٹی اور اسٹائلش لک۔",
    originalPrice: 5200,
    discountedPrice: 3999,
    category: "sneakers",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: [40, 41, 42, 43, 44],
    colors: ["White / Black", "Triple Black", "Grey Camo"],
    inStock: true,
    stockQuantity: 14,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 15,
    createdAt: "2026-10-22T10:00:00Z"
  },
  {
    id: "ssz-prod-9",
    name: "Orthopedic Comfort Slide Sandals (Men & Unisex)",
    nameUrdu: "آرتھوپیڈک کمفرٹ سلائیڈ سینڈل",
    description: "Ergonomic arch support with water-resistant non-slip footbed. Great for home wear, mosque ablution, and casual relaxation.",
    descriptionUrdu: "پیروں کے درد کے لیے خاص تلوے والی آرام دہ سلائیڈرز۔ گھر اور بیرونی استعمال کے لیے بہترین۔",
    originalPrice: 2200,
    discountedPrice: 1599,
    category: "sandals",
    images: [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ["Coffee Brown", "Jet Black", "Olive"],
    inStock: true,
    stockQuantity: 40,
    rating: 4.7,
    reviewsCount: 38,
    createdAt: "2026-09-15T10:00:00Z"
  }
];

export const ABBOTTABAD_AREAS = [
  "Kala Pul (Local Store Area)",
  "Mandian",
  "Jinnahabad",
  "Supply Bazar",
  "Abbottabad Cantt",
  "PMA Kakul Road",
  "Bilal Town",
  "Link Road",
  "Nawan Shehr",
  "Mirpur",
  "Habibullah Colony",
  "Kehal",
  "Murree Road",
  "Ilyasi Masjid Road",
  "Karakoram Highway (KKH)",
  "Other Area in Abbottabad"
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    customerName: "Taimoor Shah",
    rating: 5,
    comment: "Ordered Oxford Formal Shoes via WhatsApp. Received within 3 hours at Mandian! Leather quality is top notch and size 42 was a perfect fit.",
    productName: "Classic Oxford Leather Formal Shoes",
    location: "Mandian, Abbottabad",
    date: "October 2026"
  },
  {
    id: "rev-2",
    customerName: "Zainab Bibi",
    rating: 5,
    comment: "Shami Shoe Zone at Kala Pul has the best ladies collection in town. The block heels are super comfortable and reasonably priced.",
    productName: "Women's Elegant Block Heel Sandals",
    location: "Jinnahabad, Abbottabad",
    date: "October 2026"
  },
  {
    id: "rev-3",
    customerName: "Majid Khan",
    rating: 5,
    comment: "Kaptan Peshawari Chappal double sole is incredible! Pure craftsmanship and very solid tyre sole. Delivery to Supply was swift.",
    productName: "Handcrafted Traditional Peshawari Chappal",
    location: "Supply, Abbottabad",
    date: "October 2026"
  },
  {
    id: "rev-4",
    customerName: "Dr. Hamza Malik",
    rating: 5,
    comment: "Excellent experience! The WhatsApp confirmation was instant. Cash on delivery made it completely risk-free. Highly recommended footwear shop in Abbottabad.",
    productName: "Air-Mesh Breathable Running Sneakers",
    location: "PMA Road, Abbottabad",
    date: "October 2026"
  }
];
