import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, Search, SlidersHorizontal, RotateCcw, 
  Check, ChevronDown, PackageCheck, AlertCircle 
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { productApi } from '../services/api';
import { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [category, setCategory] = useState<string>('All');
  const [fishType, setFishType] = useState<string>('All');
  const [stockStatus, setStockStatus] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<string>('ASC');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const categories = [
    'All',
    'Floating Feed',
    'Starter Feed',
    'Growth Feed',
    'Broodstock Feed',
    'Sinking Feed',
    'High Protein Feed'
  ];

  const fishTypes = [
    'All',
    'Rohu',
    'Catla',
    'Mrigal',
    'Pangasius',
    'Tilapia',
    'Shrimp/Prawn'
  ];

  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productApi.getAll({
        search: searchTerm,
        category: category !== 'All' ? category : undefined,
        fishType: fishType !== 'All' ? fishType : undefined,
        maxPrice: maxPrice < 2500 ? maxPrice : undefined,
        stockStatus: stockStatus !== 'All' ? stockStatus : undefined,
        sortBy,
        sortOrder
      });

      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, fishType, stockStatus, maxPrice, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setFishType('All');
    setStockStatus('All');
    setMaxPrice(2500);
    setSortBy('id');
    setSortOrder('ASC');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Commercial Fish Feed Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Explore our range of extruded floating, micro-crumble, sinking, and broodstock feeds for Indian freshwater aquaculture.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 text-sm font-bold text-slate-800"
          >
            <Filter className="w-4 h-4 text-brand-600" />
            <span>Filters ({category !== 'All' || stockStatus !== 'All' || fishType !== 'All' ? 'Active' : 'All'})</span>
          </button>
          <span className="text-xs text-slate-500">{products.length} feeds found</span>
        </div>

        {/* Filter Sidebar */}
        <aside className={`lg:block bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-sm">Filter Products</h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input in Sidebar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Search Name / Feed</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Floating, 32%, Rohu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Feed Category</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                    category === cat
                      ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{cat}</span>
                  {category === cat && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Fish Species Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Fish Species</label>
            <div className="space-y-1.5">
              {fishTypes.map((ft) => (
                <button
                  key={ft}
                  onClick={() => setFishType(ft)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                    fishType === ft
                      ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{ft}</span>
                  {fishType === ft && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Availability Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Availability</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStockStatus(stockStatus === 'IN_STOCK' ? 'All' : 'IN_STOCK')}
                className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                  stockStatus === 'IN_STOCK'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                🟢 In Stock
              </button>
              <button
                type="button"
                onClick={() => setStockStatus(stockStatus === 'OUT_OF_STOCK' ? 'All' : 'OUT_OF_STOCK')}
                className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                  stockStatus === 'OUT_OF_STOCK'
                    ? 'bg-red-50 text-red-800 border-red-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                🔴 Out of Stock
              </button>
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Max Price</label>
              <span className="text-xs font-bold text-brand-700">Up to ₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="2500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹1,000</span>
              <span>₹2,500</span>
            </div>
          </div>
        </aside>

        {/* Main Product Catalog Grid & Sorting */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-800">{products.length}</strong> fish feed formulations
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 shrink-0">Sort By:</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [col, dir] = e.target.value.split('-');
                  setSortBy(col);
                  setSortOrder(dir);
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="id-ASC">Recommended</option>
                <option value="price-ASC">Price: Low to High</option>
                <option value="price-DESC">Price: High to Low</option>
                <option value="rating-DESC">Highest Rated</option>
                <option value="name-ASC">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* No Products Found State */
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any fish feed matching your current filter criteria. Try resetting or adjusting your search term.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
