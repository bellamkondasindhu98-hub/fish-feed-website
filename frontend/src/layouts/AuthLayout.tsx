import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import { ShieldCheck, MessageCircle } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { company } = useCompany();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 flex flex-col justify-between text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">
        <Link to="/login" className="flex items-center gap-3">
          <img
            src={company?.logo || '/assets/images/logo.svg'}
            alt="AquaGrow Feeds"
            className="h-10 sm:h-12 w-auto bg-white/95 rounded-xl px-3 py-1 shadow-lg"
          />
        </Link>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Authorized Customer & Dealer Portal</span>
        </div>
      </div>

      {/* Main Form Center Box */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 animate-in zoom-in-95 duration-200">
          <Outlet />
        </div>
      </div>

      {/* Bottom Footer info */}
      <div className="max-w-7xl mx-auto w-full text-center py-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {company?.companyName || 'AquaGrow Feeds India Pvt. Ltd.'} All rights reserved.</p>
        <p className="mt-1 text-slate-400">Direct WhatsApp Ordering & Support Desk: {company?.whatsappNumber || '+919876543210'}</p>
      </div>
    </div>
  );
};
