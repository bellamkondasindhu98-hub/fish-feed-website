import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, ArrowLeft, Trash2, Plus, Star, CheckCircle2, 
  X, MessageCircle, AlertCircle, Eye 
} from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { useCompany } from '../contexts/CompanyContext';
import { productApi, comparisonApi } from '../services/api';
import { Product, ComparisonProduct } from '../types';
import { formatPrice } from '../utils/formatters';
import { WhatsAppOrderButton } from '../components/WhatsAppOrderButton';

export const ProductComparisonPage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useComparison();
  const { whatsappNumber } = useCompany();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [competitorBenchmarks, setCompetitorBenchmarks] = useState<ComparisonProduct[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<ComparisonProduct | null>(null);
  const [addProductDropdownOpen, setAddProductDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodRes = await productApi.getAll();
        if (prodRes.success) {
          setAllProducts(prodRes.data);
          // If compare list is empty, default add first 2 products for great initial UX
          if (compareList.length === 0 && prodRes.data.length >= 2) {
            addToCompare(prodRes.data[0]);
            addToCompare(prodRes.data[1]);
          }
        }

        const compRes = await comparisonApi.getAll();
        if (compRes.success && compRes.data.length > 0) {
          setCompetitorBenchmarks(compRes.data);
          setSelectedBenchmark(compRes.data[0]);
        }
      } catch (err) {
        console.error('Error loading comparison data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const availableToAdd = allProducts.filter(
    (p) => !compareList.some((cp) => cp.id === p.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Scale className="w-8 h-8 text-brand-600" />
            <span>Product & Specification Comparison</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare crude protein, fat, FCR potential, pack sizing, and direct farmer prices side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Product Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAddProductDropdownOpen(!addProductDropdownOpen)}
              disabled={compareList.length >= 4 || availableToAdd.length === 0}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Feed to Compare</span>
            </button>

            {addProductDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                  Select Product to Add
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {availableToAdd.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        addToCompare(p);
                        setAddProductDropdownOpen(false);
                      }}
                      className="w-full p-2.5 hover:bg-brand-50 text-left flex items-center gap-2 text-xs"
                    >
                      <img src={p.image} alt={p.name} className="w-8 h-8 object-contain" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.protein}% Protein • {formatPrice(p.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 border border-slate-200 rounded-xl bg-white transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {compareList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Scale className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No feeds selected for comparison</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add products from the catalog to compare their nutritional values, pack weights, and prices.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-4 sm:p-6 w-48 font-bold text-slate-500 uppercase tracking-wider text-[11px] bg-slate-100/50">
                    Product Parameters
                  </th>
                  {compareList.map((p) => (
                    <th key={p.id} className="p-4 sm:p-6 min-w-[220px] max-w-[280px] align-top">
                      <div className="space-y-3 relative">
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute -top-2 -right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove product"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img src={p.image} alt={p.name} className="w-24 h-28 mx-auto object-contain drop-shadow" />
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-brand-50 text-brand-700 font-bold rounded text-[10px] mb-1">
                            {p.category}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{p.name}</h4>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Optional Competitor Benchmark Column */}
                  {selectedBenchmark && (
                    <th className="p-4 sm:p-6 min-w-[220px] max-w-[280px] bg-amber-50/40 border-l border-amber-200/60 align-top">
                      <div className="space-y-3">
                        <div className="w-24 h-28 mx-auto flex items-center justify-center bg-amber-100/70 text-amber-800 rounded-2xl font-black text-xs text-center p-2">
                          Competitor / Market Feed
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px] mb-1">
                            {selectedBenchmark.competitorName}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                            {selectedBenchmark.competitorProductName}
                          </h4>
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* 1. Price */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Farmer Price</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 font-black text-base text-slate-900">
                      {formatPrice(p.price)}
                    </td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 font-bold text-base text-slate-800 bg-amber-50/20 border-l border-amber-100">
                      {formatPrice(selectedBenchmark.price)}
                    </td>
                  )}
                </tr>

                {/* 2. Pack Size */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Pack Sizing</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 font-semibold">{p.packSize}</td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 text-slate-800 font-semibold bg-amber-50/20 border-l border-amber-100">
                      {selectedBenchmark.packSize}
                    </td>
                  )}
                </tr>

                {/* 3. Crude Protein */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Crude Protein (Min)</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 font-extrabold text-brand-700 text-sm">
                      {p.protein}%
                    </td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 font-extrabold text-amber-900 text-sm bg-amber-50/20 border-l border-amber-100">
                      {selectedBenchmark.protein}%
                    </td>
                  )}
                </tr>

                {/* 4. Crude Fat */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Crude Fat (Min)</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 font-extrabold text-emerald-700 text-sm">
                      {p.fat}%
                    </td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 font-extrabold text-amber-900 text-sm bg-amber-50/20 border-l border-amber-100">
                      {selectedBenchmark.fat}%
                    </td>
                  )}
                </tr>

                {/* 5. Fish Species */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Target Fish Species</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">{p.fishType}</td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 text-slate-700 bg-amber-50/20 border-l border-amber-100">
                      {selectedBenchmark.fishType}
                    </td>
                  )}
                </tr>

                {/* 6. Feed Type */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Form & Extrusion</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700 font-medium">{p.feedType}</td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 text-slate-700 font-medium bg-amber-50/20 border-l border-amber-100">
                      {selectedBenchmark.feedType}
                    </td>
                  )}
                </tr>

                {/* 7. Recommended Fish Size */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Recommended Fish Size</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 text-slate-700">{p.recommendedFishSize}</td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 text-slate-700 bg-amber-50/20 border-l border-amber-100">
                      Standard Growout
                    </td>
                  )}
                </tr>

                {/* 8. Stock Availability */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Inventory Status</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4">
                      {p.status === 'IN_STOCK' ? (
                        <span className="font-bold text-emerald-700">🟢 In Stock ({p.stock} bags)</span>
                      ) : (
                        <span className="font-bold text-red-600">🔴 Out of Stock</span>
                      )}
                    </td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 text-slate-500 bg-amber-50/20 border-l border-amber-100">
                      Market Dependent
                    </td>
                  )}
                </tr>

                {/* 9. Rating */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Customer Rating</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{p.avgRating || 4.5}</span>
                      </div>
                    </td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 bg-amber-50/20 border-l border-amber-100">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{selectedBenchmark.rating}</span>
                      </div>
                    </td>
                  )}
                </tr>

                {/* 10. Direct Actions */}
                <tr className="bg-slate-50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-100/50">Order / Action</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 space-y-2">
                      <WhatsAppOrderButton
                        productName={p.name}
                        packSize={p.packSize}
                        price={p.price}
                        stock={p.stock}
                        status={p.status}
                        size="sm"
                        fullWidth={true}
                      />
                      <Link
                        to={`/products/${p.id}`}
                        className="block text-center py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                      >
                        View Full Details
                      </Link>
                    </td>
                  ))}
                  {selectedBenchmark && (
                    <td className="p-4 text-center text-slate-400 text-xs bg-amber-50/20 border-l border-amber-100 italic">
                      Benchmark data sourced from {selectedBenchmark.source}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Competitor Benchmark Selector Callout */}
      {competitorBenchmarks.length > 0 && (
        <div className="p-6 bg-amber-50/70 border border-amber-200/80 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-950">Market Benchmark Comparison</h4>
            <p className="text-xs text-amber-800">
              Select a verified competitor or regional mill formulation to compare nutritional specs and pricing against AquaGrow products.
            </p>
          </div>

          <select
            value={selectedBenchmark?.id || ''}
            onChange={(e) => {
              const b = competitorBenchmarks.find(item => item.id === Number(e.target.value));
              setSelectedBenchmark(b || null);
            }}
            className="px-4 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {competitorBenchmarks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.competitorName} - {b.competitorProductName}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
