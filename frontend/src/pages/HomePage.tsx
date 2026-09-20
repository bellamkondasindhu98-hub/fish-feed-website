import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Award, Waves, Sparkles, CheckCircle2, 
  MessageCircle, Star, ShieldCheck, HeartHandshake, PhoneCall, ChevronRight 
} from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { productApi, reviewApi } from '../services/api';
import { Product, Review } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const HomePage: React.FC = () => {
  const { company, whatsappNumber } = useCompany();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const prodRes = await productApi.getAll();
        if (prodRes.success) {
          setFeaturedProducts(prodRes.data);
        }

        // Load reviews for product 1 for showcase
        const revRes = await reviewApi.getByProductId(1);
        if (revRes.success) {
          setReviews(revRes.data);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const categories = ['All', 'Floating Feed', 'Starter Feed', 'Growth Feed', 'Broodstock Feed', 'High Protein Feed'];

  const filteredProducts = selectedCategory === 'All'
    ? featuredProducts
    : featuredProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Fish Feed Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Commercial Aquaculture Range</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Formulated Feeds for Indian Aquaculture
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              High water stability, optimized protein-energy ratio, and verified zero hormone additives for commercial aquaculture ponds.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 group shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-slate-500 text-sm">No feeds found in this category.</p>
          </div>
        )}
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              The AquaGrow Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Indian Fish Farmers Trust AquaGrow Feeds
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Every batch is manufactured under rigorous ISO standards with fresh digestible ingredients that maximize weight gain while protecting pond ecosystem health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {company?.whyChooseUs && company.whyChooseUs.length > 0 ? (
              company.whyChooseUs.map((item, idx) => (
                <div key={idx} className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/70 hover:border-brand-500/50 transition-all hover:bg-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-extrabold text-base mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-slate-400">Loading company pillars...</div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/why-choose-us"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg"
            >
              <span>Read Comprehensive Quality Report</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CEO Profile & Scientific Leadership Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-brand-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* CEO Photo */}
          <div className="relative shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-4 ring-brand-400/50 bg-slate-800 shadow-2xl">
              <img
                src={company?.ceoImage || '/assets/images/ceo.svg'}
                alt={company?.ceoName || 'CEO'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 right-2 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full shadow">
              Founder & CEO
            </div>
          </div>

          {/* CEO Message & Details */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold">
              Leadership & Research
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              "{company?.ceoName || 'Dr. Rajesh Varma'}"
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl italic">
              "{company?.ceoBio || 'Our mission is to help Indian aquaculture farmers achieve maximum biomass return per rupee spent on feed through rigorous amino acid balance and superior water stability.'}"
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-400">
              <span>📞 {company?.ceoPhone || '+91 98765 43210'}</span>
              <span>•</span>
              <span>📧 {company?.ceoEmail || 'ceo@aquagrowfeeds.in'}</span>
            </div>
          </div>

          {/* CEO Action Link */}
          <div className="shrink-0">
            <Link
              to="/company"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl text-xs shadow transition-all inline-flex items-center gap-2"
            >
              <span>About Company</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Customer Feedback Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Farmer Experiences</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Verified Customer Feedback</h2>
          <p className="text-xs text-slate-500 mt-1">Read reviews from commercial carp, pangasius, and shrimp pond operators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.slice(0, 3).map((rev) => (
              <div key={rev.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-amber-500 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                  <img
                    src={rev.userAvatar || '/assets/images/user_avatar.svg'}
                    alt={rev.userName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rev.userName || 'Commercial Farmer'}</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified AquaGrow Buyer
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-slate-500 text-xs">Customer reviews loading...</div>
          )}
        </div>
      </section>

      {/* 6. High-Impact WhatsApp Ordering Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider">
              No Online Payments • Personal Care
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Ready to Order or Request a Bulk Farm Quote?
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Connect directly with our technical managers on WhatsApp. We discuss fish species, pond water parameters, delivery timelines, and direct ex-mill pricing.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={buildGeneralWhatsAppUrl(whatsappNumber, 'Aquaculture Feed Direct Order')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 fill-current" />
              <span>Chat on WhatsApp Now</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
