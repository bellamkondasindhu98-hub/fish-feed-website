import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, MessageCircle, ShieldCheck, 
  Award, HeartHandshake, FileText, HelpCircle, ArrowRight
} from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  const { company, whatsappNumber } = useCompany();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Scientifically Formulated</h4>
              <p className="text-slate-400 text-xs mt-1">Engineered by aquaculture nutritionists for superior FCR (1.1 - 1.3) and clean pond water.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Direct WhatsApp Ordering</h4>
              <p className="text-slate-400 text-xs mt-1">No online payment delays. Connect directly with factory sales reps for custom quotes & delivery.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Farmer Technical Support</h4>
              <p className="text-slate-400 text-xs mt-1">Complimentary water testing, dissolved oxygen audits, and customized biomass feeding schedules.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/home" className="inline-block">
              <img 
                src={company?.logo || '/assets/images/logo.svg'} 
                alt="AquaGrow Feeds" 
                className="h-12 w-auto bg-white/95 rounded-xl px-3 py-1 shadow"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {company?.description || 'AquaGrow Feeds is a premier Indian aquaculture nutrition company committed to empowering fish and shrimp farmers with scientifically engineered feed formulations.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>GST Registered: <strong className="text-slate-200">{company?.gstNumber || '36AAAAA0000A1Z5'}</strong></span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/home" className="hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-brand-400 transition-colors">Fish Feed Catalog</Link></li>
              <li><Link to="/company" className="hover:text-brand-400 transition-colors">About Company</Link></li>
              <li><Link to="/why-choose-us" className="hover:text-brand-400 transition-colors">Why Choose Us</Link></li>
              <li><Link to="/products/compare" className="hover:text-brand-400 transition-colors">Product Comparison</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Support & Help</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/faqs" className="hover:text-brand-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/help" className="hover:text-brand-400 transition-colors">Help Center & Desk</Link></li>
              <li><Link to="/feedback" className="hover:text-brand-400 transition-colors">Submit Website Feedback</Link></li>
              <li><Link to="/profile" className="hover:text-brand-400 transition-colors">Customer Account</Link></li>
            </ul>
          </div>

          {/* Direct WhatsApp Ordering Callout */}
          <div className="space-y-4">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-2">Order Desk</h5>
            <p className="text-xs text-slate-400">
              Chat with our technical sales managers directly on WhatsApp for live price quotes, truck loads, and farm logistics.
            </p>
            <a
              href={buildGeneralWhatsAppUrl(whatsappNumber, 'Aquaculture Feed Purchase Consultation')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-400" />
                <span>{company?.phone || '+91 866 245 8900'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                <span>{company?.email || 'support@aquagrowfeeds.in'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {company?.companyName || 'AquaGrow Feeds India Pvt. Ltd.'} All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Manufactured in India</span>
            <span>•</span>
            <span>Non-Steroidal High FCR Formulation</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
