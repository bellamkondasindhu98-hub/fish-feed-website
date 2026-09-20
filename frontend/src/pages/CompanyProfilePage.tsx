import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, Phone, Mail, MessageCircle, 
  ShieldCheck, Target, Eye, Award, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const CompanyProfilePage: React.FC = () => {
  const { company, whatsappNumber } = useCompany();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-slate-800">
        <div className="max-w-3xl space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
            Corporate Profile & Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {company?.companyName || 'AquaGrow Feeds India Pvt. Ltd.'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {company?.description}
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              GSTIN: <strong>{company?.gstNumber}</strong>
            </span>
            <span>•</span>
            <span>CIN: U05005AP2020PTC114920</span>
            <span>•</span>
            <span>ISO 9001:2015 Registered</span>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Corporate Mission</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {company?.mission}
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Strategic Vision</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {company?.vision}
          </p>
        </div>
      </div>

      {/* Leadership & CEO Profile Highlight */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-4 ring-brand-400/40 bg-slate-800 shrink-0 shadow-2xl">
          <img
            src={company?.ceoImage || '/assets/images/ceo.svg'}
            alt={company?.ceoName || 'CEO'}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center lg:text-left space-y-3">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Executive Leadership</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{company?.ceoName}</h3>
          <p className="text-xs text-brand-300 font-semibold">Chief Executive Officer & Head of Nutritional Formulation</p>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{company?.ceoBio}</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-400">
            <span>📞 {company?.ceoPhone}</span>
            <span>•</span>
            <span>📧 {company?.ceoEmail}</span>
          </div>
        </div>

        <div className="shrink-0">
          <Link
            to="/ceo"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow transition-all inline-flex items-center gap-2"
          >
            <span>Read CEO Message</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Official Factory & Contact Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Official Headquarters & Plant</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Company Contact Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <MapPin className="w-5 h-5 text-brand-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase">Manufacturing Plant</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{company?.address}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase">Phone Desk</h4>
            <p className="text-xs text-slate-800 font-bold">{company?.phone}</p>
            <p className="text-[11px] text-slate-500">Mon - Sat (8:00 AM - 7:00 PM)</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Mail className="w-5 h-5 text-sky-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase">Email Support</h4>
            <p className="text-xs text-slate-800 font-bold">{company?.email}</p>
            <p className="text-[11px] text-slate-500">Response within 4 business hours</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase">WhatsApp Order Desk</h4>
            <p className="text-xs text-emerald-800 font-bold">{whatsappNumber}</p>
            <a
              href={buildGeneralWhatsAppUrl(whatsappNumber, 'Company Consultation')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-xs text-brand-600 hover:text-brand-700 font-bold"
            >
              Start Chat →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
