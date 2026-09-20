import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, ShieldCheck, HeartHandshake, CheckCircle2, 
  Droplets, Sparkles, MessageCircle, ArrowRight 
} from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const WhyChooseUsPage: React.FC = () => {
  const { company, whatsappNumber } = useCompany();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-slate-800 text-center max-w-4xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
          Scientific Assurance & Farmer Prosperity
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Why Choose AquaGrow Feeds?
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          We combine cutting-edge extrusion technology with rigorous proximate nutrient testing to deliver consistent FCR and maximum biomass return for commercial fish farming across India.
        </p>
      </div>

      {/* Pillars Grid (Dynamic from Database) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {company?.whyChooseUs && company.whyChooseUs.length > 0 ? (
          company.whyChooseUs.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-extrabold text-base mb-5">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-brand-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Quality Standard</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-slate-500 text-xs">Loading quality pillars...</div>
        )}
      </div>

      {/* Detailed Technical Standards */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Technical Specifications</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Our Core Quality Guarantees</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <Droplets className="w-6 h-6 text-brand-600" />
            <h4 className="text-sm font-bold text-slate-900">Over 3-Hour Water Stability</h4>
            <p className="text-slate-600 leading-relaxed">
              Pellets maintain physical integrity underwater without dissolving into mud, preventing sudden ammonia and nitrite spikes in your earthen ponds.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Proven 1.1 - 1.3 FCR Potential</h4>
            <p className="text-slate-600 leading-relaxed">
              Balanced amino acid ratios ensure maximum protein absorption into white muscle tissue rather than excretion, saving feed cost per kilogram of harvested fish.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
            <h4 className="text-sm font-bold text-slate-900">Zero Antibiotics & Zero Urea</h4>
            <p className="text-slate-600 leading-relaxed">
              Clean feed formulations strictly adhering to Indian CAA and MPEDA guidelines, making your fish healthy for local wholesale markets and export quality.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">Experience the AquaGrow Difference</h3>
          <p className="text-xs text-emerald-100 mt-1">Chat directly on WhatsApp with our aquaculture team for personalized pond feeding advice.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/products"
            className="px-6 py-3 bg-white text-emerald-950 font-bold rounded-xl text-xs shadow hover:bg-emerald-50 transition-all"
          >
            Explore Feeds
          </Link>
          <a
            href={buildGeneralWhatsAppUrl(whatsappNumber, 'Why Choose Us Consultation')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-900 text-white font-bold rounded-xl text-xs shadow hover:bg-emerald-950 transition-all flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};
