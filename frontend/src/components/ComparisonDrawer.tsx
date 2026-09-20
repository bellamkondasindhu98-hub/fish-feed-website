import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { formatPrice } from '../utils/formatters';

export const ComparisonDrawer: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useComparison();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 animate-in slide-in-from-bottom duration-300 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-4 shadow-2xl border border-slate-700 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Info & Items */}
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-2 bg-brand-500/20 text-brand-400 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Product Comparison</p>
              <p className="text-[11px] text-slate-400">{compareList.length} of 4 feeds selected</p>
            </div>
          </div>

          {/* Mini product thumbnails */}
          <div className="flex items-center gap-2">
            {compareList.map((p) => (
              <div key={p.id} className="relative group bg-slate-800 rounded-xl p-1.5 border border-slate-700 flex items-center gap-2 pr-3">
                <img src={p.image} alt={p.name} className="w-8 h-8 object-contain rounded" />
                <div className="max-w-[100px] hidden md:block">
                  <p className="text-[11px] font-bold truncate">{p.name}</p>
                  <p className="text-[10px] text-brand-400">{formatPrice(p.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCompare(p.id)}
                  className="p-1 text-slate-400 hover:text-red-400 rounded-full hover:bg-slate-700 transition-colors"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Actions: [Clear], [Compare Now] */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <Link
            to="/products/compare"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition-all"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
