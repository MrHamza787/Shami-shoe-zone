import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Product, StoreSettings, CategoryType } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface ShopPageProps {
  products: Product[];
  settings: StoreSettings;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  settings,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
}) => {
  const { isUrdu, t } = useLanguage();

  const [selectedSize, setSelectedSize] = useState<string | number | 'all'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under2500' | '2500to3500' | 'above3500'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'priceLow' | 'priceHigh' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const categories: { id: CategoryType; label: string; labelUrdu: string }[] = [
    { id: 'all', label: 'All Footwear', labelUrdu: 'تمام جوتے' },
    { id: 'mens', label: "Men's Shoes", labelUrdu: 'مردانہ جوتے' },
    { id: 'womens', label: "Women's Shoes", labelUrdu: 'زنانہ جوتے' },
    { id: 'kids', label: "Kids' Shoes", labelUrdu: 'بچوں کے جوتے' },
    { id: 'sneakers', label: 'Sneakers & Sports', labelUrdu: 'اسنیکرز اور اسپورٹس' },
    { id: 'formal', label: 'Formal Shoes', labelUrdu: 'فارمل جوتے' },
    { id: 'casual', label: 'Casual & Loafers', labelUrdu: 'کیژول اور لوفیرز' },
    { id: 'sandals', label: 'Peshawari & Sandals', labelUrdu: 'پشاوری چپل و سینڈل' },
  ];

  const availableSizes = [28, 30, 32, 34, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesUrdu = product.nameUrdu?.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesCategory = product.category.toLowerCase().includes(q);
          if (!matchesName && !matchesUrdu && !matchesDesc && !matchesCategory) {
            return false;
          }
        }

        // Size filter
        if (selectedSize !== 'all') {
          if (!product.sizes.includes(selectedSize) && !product.sizes.includes(Number(selectedSize))) {
            return false;
          }
        }

        // Stock filter
        if (onlyInStock && !product.inStock) {
          return false;
        }

        // Price filter
        if (priceRange === 'under2500' && product.discountedPrice >= 2500) {
          return false;
        }
        if (priceRange === '2500to3500' && (product.discountedPrice < 2500 || product.discountedPrice > 3500)) {
          return false;
        }
        if (priceRange === 'above3500' && product.discountedPrice <= 3500) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceLow') return a.discountedPrice - b.discountedPrice;
        if (sortBy === 'priceHigh') return b.discountedPrice - a.discountedPrice;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, selectedSize, priceRange, sortBy, onlyInStock]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSize('all');
    setPriceRange('all');
    setSortBy('featured');
    setOnlyInStock(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            {isUrdu ? 'شامی شو زون کلیکشن' : 'Shami Shoe Zone Abbottabad'}
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-950 font-serif mt-1">
            {isUrdu ? 'تمام جوتوں کا مجموعہ' : 'Complete Footwear Catalog'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Showing {filteredProducts.length} premium footwear items available for delivery in Abbottabad
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-neutral-500 whitespace-nowrap font-medium">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="featured">Featured First</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            {isUrdu ? cat.labelUrdu : cat.label}
          </button>
        ))}
      </div>

      {/* Filter Row: Search, Sizes, Price, Stock */}
      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 flex flex-wrap items-center justify-between gap-4">
        
        {/* Search input inside shop */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={isUrdu ? 'نام یا کیٹیگری تلاش کریں...' : 'Filter by name, color...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Price Range Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Price:</span>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs text-neutral-800"
          >
            <option value="all">All Prices</option>
            <option value="under2500">Under PKR 2,500</option>
            <option value="2500to3500">PKR 2,500 – 3,500</option>
            <option value="above3500">Above PKR 3,500</option>
          </select>
        </div>

        {/* Size Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Size (EU):</span>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs text-neutral-800"
          >
            <option value="all">All Sizes</option>
            {availableSizes.map((sz) => (
              <option key={sz} value={sz}>
                Size {sz}
              </option>
            ))}
          </select>
        </div>

        {/* In Stock toggle */}
        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
          />
          <span>In Stock Only</span>
        </label>

        {/* Reset Filter Button */}
        {(selectedCategory !== 'all' || searchQuery || selectedSize !== 'all' || priceRange !== 'all' || onlyInStock) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4">
          <p className="text-sm font-semibold text-neutral-700">
            No footwear found matching your filter criteria.
          </p>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Try adjusting your search terms, clearing selected sizes, or contact us on WhatsApp to order customized footwear sizes.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={settings}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}

    </div>
  );
};
