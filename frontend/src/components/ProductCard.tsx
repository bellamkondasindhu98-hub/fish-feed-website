import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Scale, Share2, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';
import { useComparison } from '../contexts/ComparisonContext';
import { ShareModal, triggerUniversalShare } from './ShareModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInCompare, addToCompare, removeFromCompare } = useComparison();
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  const inCompare = isInCompare(product.id);
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || Number(product.stock) <= 0;

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerUniversalShare(product, () => setShareModalOpen(true));
  };

  return (
    <>
      <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col overflow-hidden relative">
        {/* Top Badges & Stock Pill */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
          {/* Stock Status Badge */}
          <div className="pointer-events-auto">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100/95 text-red-700 border border-red-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                🔴 OUT OF STOCK
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/95 text-emerald-800 border border-emerald-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                🟢 IN STOCK
              </span>
            )}
          </div>

          {/* Category Pill */}
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
            {product.category}
          </span>
        </div>

        {/* Product Image Area */}
        <Link 
          to={`/products/${product.id}`}
          className="block relative bg-gradient-to-b from-slate-100/70 to-slate-50/50 p-6 pt-12 text-center overflow-hidden transition-transform group-hover:scale-[1.02]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-48 h-56 mx-auto object-contain drop-shadow-md transition-all duration-300 group-hover:drop-shadow-xl"
            loading="lazy"
          />
        </Link>

        {/* Product Details Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Fish Species & Protein Tag */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span className="truncate max-w-[65%]">{product.fishType}</span>
              <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 font-bold shrink-0">
                {product.protein}% Protein
              </span>
            </div>

            {/* Product Title */}
            <Link to={`/products/${product.id}`} className="block">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Short Description */}
            <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Rating & Review Count */}
            <div className="flex items-center gap-1.5 mt-3 text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-bold text-slate-800">{product.avgRating || 4.5}</span>
              <span className="text-slate-400">({product.reviewCount || 0} reviews)</span>
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Farmer Price ({product.packSize})</span>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {formatPrice(product.price)}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                {product.packSize}
              </span>
            </div>

            {/* Card Buttons: [View Details], [Compare], [Share] */}
            <div className="grid grid-cols-4 gap-2">
              <Link
                to={`/products/${product.id}`}
                className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 text-center"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </Link>

              <button
                type="button"
                onClick={handleCompareToggle}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  inCompare
                    ? 'bg-brand-100 text-brand-800 border-brand-300 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={inCompare ? 'Remove from comparison' : 'Compare product'}
              >
                {inCompare ? <Check className="w-3.5 h-3.5 text-brand-700" /> : <Scale className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{inCompare ? 'Added' : 'Compare'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareClick}
                className="flex items-center justify-center p-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all hover:text-brand-600"
                title="Share product with farmers"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Share Modal */}
      <ShareModal
        product={product}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </>
  );
};
