import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Sparkles, CheckCircle2, Waves, ShieldCheck } from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const HeroSection: React.FC = () => {
  const { company, whatsappNumber } = useCompany();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-slate-900 to-slate-950 text-white py-16 sm:py-24 lg:py-28">
      {/* Decorative background glow circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Premier Indian Aquaculture Nutrition • ISO Certified</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Quality Fish Feed for <span className="bg-gradient-to-r from-brand-400 via-aqua-400 to-emerald-400 bg-clip-text text-transparent">Better Growth</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              Nutritious and reliable fish feed solutions for modern aquaculture. Scientifically formulated for Indian Major Carps, Pangasius, Tilapia, and Shrimp.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm text-slate-300">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Balanced Protein & Fats</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Water-Stable Extrusion</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct WhatsApp Ordering</span>
              </div>
            </div>

            {/* CTA Buttons: [Explore Products] and [Contact Us] */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl shadow-lg shadow-brand-600/30 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={buildGeneralWhatsAppUrl(whatsappNumber, 'Aquaculture Feed Consultation')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/90 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700 font-bold rounded-2xl shadow transition-all text-sm group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform fill-current" />
                <span>Contact Us via WhatsApp</span>
              </a>
            </div>

            {/* Real-time Logistics Notice */}
            <div className="pt-2 text-xs text-slate-400 flex items-center justify-center lg:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Direct factory dispatch to farm gate across Andhra Pradesh, West Bengal, Odisha, and Pan-India.</span>
            </div>
          </div>

          {/* Hero Right Visual Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Aquaculture pond graphic background */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
                <img
                  src="/assets/images/hero_aquaculture.svg"
                  alt="AquaGrow Aquaculture Pond & Farm"
                  className="w-full h-80 sm:h-96 object-cover"
                />

                {/* Floating Highlight Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-xl flex items-center gap-4">
                  <img
                    src="/assets/images/products/floating_pellets_32_4.svg"
                    alt="Featured Feed Bag"
                    className="w-14 h-16 object-contain shrink-0 drop-shadow"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block">Featured Feed</span>
                    <p className="text-sm font-bold text-white truncate">Premium Floating Pellets 32/4</p>
                    <p className="text-xs text-slate-400">High FCR • 25 KG Bag • Ready for Dispatch</p>
                  </div>
                  <Link
                    to="/products/1"
                    className="p-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-white shadow transition-all shrink-0"
                    title="View Product"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
