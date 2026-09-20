import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MessageCircle, Award, BookOpen, 
  Sparkles, CheckCircle2, ArrowLeft 
} from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const CEOProfilePage: React.FC = () => {
  const { company, whatsappNumber } = useCompany();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <Link to="/company" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Company Overview</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* CEO Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-brand-950 p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center gap-8">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-4 ring-brand-400 bg-slate-800 shrink-0 shadow-2xl">
            <img
              src={company?.ceoImage || '/assets/images/ceo.svg'}
              alt={company?.ceoName || 'CEO'}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Chief Executive Officer
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">{company?.ceoName}</h1>
            <p className="text-sm text-slate-300">Ph.D. / M.F.Sc Aquaculture Nutrition Specialist</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-slate-300">
              <a href={`tel:${company?.ceoPhone}`} className="hover:text-brand-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{company?.ceoPhone}</span>
              </a>
              <span>•</span>
              <a href={`mailto:${company?.ceoEmail}`} className="hover:text-brand-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>{company?.ceoEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* CEO Introduction & Message */}
        <div className="p-8 sm:p-12 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              <span>Professional Biography & Research Leadership</span>
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {company?.ceoBio}
            </p>
          </div>

          <div className="p-6 bg-brand-50/60 rounded-2xl border border-brand-200/80 space-y-3">
            <h4 className="text-sm font-bold text-brand-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Direct Commitment to Aquaculture Farmers</span>
            </h4>
            <p className="text-xs text-brand-800 leading-relaxed italic">
              "AquaGrow Feeds was founded on a singular principle: honest, science-backed nutrition without filler ingredients. Our farmers invest their hard-earned capital into fish seed and pond management; they deserve a feed that delivers the fastest possible growth with zero water spoilage."
            </p>
          </div>

          {/* Quick Contact Desk */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Need technical consultation regarding pond stocking density or feeding schedules?
            </p>
            <a
              href={buildGeneralWhatsAppUrl(whatsappNumber, 'CEO Technical Consultation')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-all shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Technical Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
