import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Scale, Share2, MessageCircle, CheckCircle2, 
  AlertCircle, ShieldCheck, ChevronRight, Send, Check, 
  Award, Droplets, Info, Sparkles, User 
} from 'lucide-react';
import { productApi, reviewApi } from '../services/api';
import { Product, Review, ComparisonProduct } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import { WhatsAppOrderButton } from '../components/WhatsAppOrderButton';
import { ShareModal, triggerUniversalShare } from '../components/ShareModal';
import { ProductCard } from '../components/ProductCard';
import { useComparison } from '../contexts/ComparisonContext';
import { useAuth } from '../contexts/AuthContext';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isInCompare, addToCompare, removeFromCompare } = useComparison();

  const [product, setProduct] = useState<(Product & { comparisons?: ComparisonProduct[]; recommendations?: Product[] }) | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewFeedback, setReviewFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        const res = await productApi.getById(id);
        if (res.success && res.data) {
          setProduct(res.data);
        }

        const revRes = await reviewApi.getByProductId(id);
        if (revRes.success) {
          setReviews(revRes.data);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewFeedback(null);

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!reviewComment.trim()) {
      setReviewFeedback({ type: 'error', message: 'Please write your review comment.' });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await reviewApi.submitReview(id!, {
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      if (res.success) {
        setReviewFeedback({ type: 'success', message: 'Thank you! Your review has been submitted.' });
        setReviewComment('');
        // Refresh reviews
        const revRes = await reviewApi.getByProductId(id!);
        if (revRes.success) {
          setReviews(revRes.data);
        }
      }
    } catch (err: any) {
      setReviewFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to submit review.' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium text-sm">Loading product details & nutritional profiles...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested fish feed formulation does not exist or has been discontinued.</p>
        <Link to="/products" className="mt-6 inline-block px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(product.id);
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || Number(product.stock) <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/home" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-brand-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Large Product Image Display */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-100 to-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center relative">
          {/* Stock Badge Overlay */}
          <div className="absolute top-4 left-4">
            {isOutOfStock ? (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200 shadow-sm">
                🔴 OUT OF STOCK
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                🟢 IN STOCK ({product.stock} bags available)
              </span>
            )}
          </div>

          <img
            src={product.image}
            alt={product.name}
            className="w-72 h-96 mx-auto object-contain drop-shadow-xl"
          />

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-around text-xs text-slate-500 font-semibold">
            <span>Pack: {product.packSize}</span>
            <span>•</span>
            <span>Category: {product.category}</span>
            <span>•</span>
            <span>Feed Type: {product.feedType}</span>
          </div>
        </div>

        {/* Right: Product Details & WhatsApp Ordering */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-block px-3 py-1 bg-brand-50 text-brand-700 font-bold rounded-lg text-xs mb-2">
              {product.category} • {product.fishType}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>
            
            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-2.5 text-xs">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.avgRating || 4.5) ? 'fill-current' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-800 text-sm">{product.avgRating || 4.5}</span>
              <span className="text-slate-400">({product.reviewCount || 0} customer reviews)</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Direct Farmer Price</span>
              <span className="text-3xl font-black text-slate-900">{formatPrice(product.price)}</span>
              <span className="text-xs text-slate-500 ml-2 font-medium">per {product.packSize} (GST inclusive)</span>
            </div>
            <div className="text-right text-xs">
              <span className="block text-slate-400">Availability</span>
              <span className={`font-bold ${isOutOfStock ? 'text-red-600' : 'text-emerald-600'}`}>
                {isOutOfStock ? 'Out of Stock' : 'Ready for Dispatch'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Product Overview</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Key Nutritional Specs Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Crude Protein</span>
              <span className="text-lg font-black text-brand-700">{product.protein}%</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Crude Fat</span>
              <span className="text-lg font-black text-emerald-700">{product.fat}%</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Feed Type</span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-1">{product.feedType}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Pack Size</span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-1">{product.packSize}</span>
            </div>
          </div>

          {/* Action CTAs: WhatsApp Order Button + Compare + Share */}
          <div className="space-y-3 pt-2">
            {/* WHATSAPP ORDER BUTTON */}
            <WhatsAppOrderButton
              productName={product.name}
              packSize={product.packSize}
              price={product.price}
              stock={product.stock}
              status={product.status}
              size="lg"
              fullWidth={true}
            />

            {/* Sub actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => inCompare ? removeFromCompare(product.id) : addToCompare(product)}
                className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                  inCompare
                    ? 'bg-brand-50 text-brand-800 border-brand-300'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                {inCompare ? <Check className="w-4 h-4 text-brand-700" /> : <Scale className="w-4 h-4" />}
                <span>{inCompare ? 'Added to Comparison' : 'Compare Specifications'}</span>
              </button>

              <button
                type="button"
                onClick={() => triggerUniversalShare(product, () => setShareModalOpen(true))}
                className="py-3 px-4 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Product</span>
              </button>
            </div>
          </div>

          {/* Business Guarantee Info */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Direct Factory Guarantee
            </p>
            <p className="text-emerald-800 text-[11px]">
              No online checkout or hidden platform fees. Orders are discussed and confirmed personally on WhatsApp. Direct factory dispatches with full GST invoice.
            </p>
          </div>
        </div>
      </div>

      {/* Nutritional Breakdown & Feeding Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nutritional Parameters Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-brand-600">
            <Award className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-lg">Guaranteed Nutritional Analysis</h3>
          </div>
          <p className="text-xs text-slate-500">Every production lot is lab-tested for proximate nutritional parameters.</p>
          
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600 font-medium">Crude Protein (Min)</span>
              <strong className="text-slate-900 font-bold">{product.protein}%</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600 font-medium">Crude Fat (Min)</span>
              <strong className="text-slate-900 font-bold">{product.fat}%</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600 font-medium">Crude Fiber (Max)</span>
              <strong className="text-slate-900 font-bold">5.5%</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600 font-medium">Moisture (Max)</span>
              <strong className="text-slate-900 font-bold">11.0%</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600 font-medium">Total Ash (Max)</span>
              <strong className="text-slate-900 font-bold">9.0%</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600 font-medium">Target Species</span>
              <strong className="text-slate-900 font-bold">{product.fishType}</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-600 font-medium">Recommended Fish Stage</span>
              <strong className="text-slate-900 font-bold">{product.recommendedFishSize}</strong>
            </div>
          </div>
        </div>

        {/* Feeding Guidelines & Water Stability */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Droplets className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 text-lg">Feeding Instructions & Water Care</h3>
          </div>
          <p className="text-xs text-slate-500">Guidelines formulated for optimum digestion and zero water pollution.</p>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-900 mb-1">Recommended Daily Ration</strong>
              <p className="leading-relaxed">{product.feedingInstructions}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-900 mb-1">Water Quality Advisory</strong>
              <p className="leading-relaxed">Do not overfeed during cloudy or rainy days. Always verify dissolved oxygen (DO &gt; 4.0 ppm) before morning feeding.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">Farmer Reviews & Experiences</h3>
            <p className="text-xs text-slate-500 mt-1">Verified reviews from fish and shrimp farmers using this feed</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{product.avgRating || 4.5}</span>
              <span className="text-xs text-slate-400"> / 5.0</span>
            </div>
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.avgRating || 4.5) ? 'fill-current' : 'text-slate-200'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.userAvatar || '/assets/images/user_avatar.svg'}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{rev.userName || 'Verified Farmer'}</h5>
                      <span className="text-[10px] text-slate-400">{formatDate(rev.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">"{rev.comment}"</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
              No reviews yet for this product. Be the first farmer to share your experience!
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-3">Write a Customer Review</h4>
          
          {reviewFeedback && (
            <div className={`mb-4 p-3 rounded-xl text-xs font-medium ${
              reviewFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {reviewFeedback.message}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Rating (1 to 5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-500 focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-slate-300'}`} />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">{reviewRating} Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Feedback / Pond Experience</label>
              <textarea
                rows={3}
                placeholder="Share your harvest results, fish growth rate, water quality, and experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow disabled:opacity-60"
            >
              {isSubmittingReview ? 'Submitting Review...' : 'Submit Verified Review'}
            </button>
          </form>
        </div>
      </section>

      {/* "You May Also Like" - Recommendations */}
      {product.recommendations && product.recommendations.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Related Formulations</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">You May Also Like</h3>
            </div>
            <Link to="/products" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              View All Feeds →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.recommendations.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}

      {/* Share Modal */}
      <ShareModal
        product={product}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};
