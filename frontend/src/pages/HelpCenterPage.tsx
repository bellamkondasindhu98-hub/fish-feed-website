import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, MessageCircle, Phone, MapPin, Clock, 
  HelpCircle, ShieldCheck, HeartHandshake, ChevronRight 
} from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const HelpCenterPage: React.FC = () => {
  const { company, whatsappNumber } = useCompany();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider">
          Farmer Support & Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AquaGrow Help Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Need assistance with order quotes, feeding rates, pond water analysis, or technical advice? We are always here to support your aquaculture farm.
        </p>
      </div>

      {/* 3 Primary Action Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. WhatsApp Action */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between text-center space-y-6">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <MessageCircle className="w-7 h-7 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">WhatsApp Order Desk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant response for price quotes, bag quantities, delivery schedules, and technical water advice.
            </p>
            <p className="text-sm font-extrabold text-emerald-700">{whatsappNumber}</p>
          </div>

          <a
            href={buildGeneralWhatsAppUrl(whatsappNumber, 'Help Center Inquiry')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp Us</span>
          </a>
        </div>

        {/* 2. Phone Call Action (tel:) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all flex flex-col justify-between text-center space-y-6">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-xs">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Direct Phone Desk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Speak directly with our regional aquaculture managers and plant dispatch department.
            </p>
            <p className="text-sm font-extrabold text-slate-900">{company?.phone || '+91 866 245 8900'}</p>
          </div>

          <a
            href={`tel:${company?.phone || '+918662458900'}`}
            className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-brand-700/20 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call Us</span>
          </a>
        </div>

        {/* 3. Email Support (mailto:) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between text-center space-y-6">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-xs">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Email Inquiries</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Send bulk corporate tenders, dealership requests, or lab water reports via email.
            </p>
            <p className="text-xs font-extrabold text-slate-900 truncate">{company?.email || 'support@aquagrowfeeds.in'}</p>
          </div>

          <a
            href={`mailto:${company?.email || 'support@aquagrowfeeds.in'}?subject=AquaGrow%20Farmer%20Inquiry`}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Email Us</span>
          </a>
        </div>
      </div>

      {/* Operating Hours & Plant Location */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Support Timings & Factory Desk</span>
          <h3 className="text-2xl font-extrabold text-slate-900">Operating Schedule</h3>
          
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Clock className="w-5 h-5 text-brand-600 shrink-0" />
              <div>
                <strong>Monday to Saturday:</strong> 8:00 AM - 7:00 PM IST
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Sunday / Emergency Harvest Support:</strong> 9:00 AM - 2:00 PM (WhatsApp Only)
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
          <MapPin className="w-6 h-6 text-brand-400" />
          <h4 className="text-sm font-bold">Plant & Mill Address</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{company?.address}</p>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Truck dispatches arranged across Andhra Pradesh, Telangana, West Bengal, Odisha, Bihar, Assam, and all Indian states.
          </p>
        </div>
      </div>

      {/* FAQs Quick Link Banner */}
      <div className="p-6 bg-brand-50 border border-brand-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-brand-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Looking for immediate answers?</h4>
            <p className="text-xs text-slate-500">Check our comprehensive FAQs for quick answers regarding ordering and feeds.</p>
          </div>
        </div>

        <Link
          to="/faqs"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-all shrink-0"
        >
          <span>Visit FAQs</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
