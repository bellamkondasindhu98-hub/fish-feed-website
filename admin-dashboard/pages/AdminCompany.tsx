import React, { useState, useEffect } from 'react';
import { 
  Building2, Save, CheckCircle2, AlertCircle, Phone, 
  Mail, MessageCircle, ShieldCheck, UserCheck 
} from 'lucide-react';
import { companyApi } from '@/services/api';
import { useCompany } from '@/contexts/CompanyContext';
import { Company } from '@/types';

export const AdminCompany: React.FC = () => {
  const { refetchCompany } = useCompany();

  const [formData, setFormData] = useState<Partial<Company>>({
    companyName: '',
    description: '',
    gstNumber: '',
    address: '',
    phone: '',
    email: '',
    whatsappNumber: '',
    ceoName: '',
    ceoImage: '',
    ceoPhone: '',
    ceoEmail: '',
    ceoBio: '',
    mission: '',
    vision: ''
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await companyApi.get();
        if (res.success && res.data) {
          setFormData(res.data);
        }
      } catch (err) {
        console.error('Error fetching company details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsSubmitting(true);

    try {
      const res = await companyApi.update(formData);
      if (res.success) {
        setStatusMsg({
          type: 'success',
          text: 'Company and CEO profile updated! All customer pages and WhatsApp order links now use the updated configuration.'
        });
        await refetchCompany();
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update company configuration.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs">Loading company configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-indigo-400" />
          <span>Company Profile & WhatsApp Number Configuration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Modify company credentials, registered GSTIN, official WhatsApp order number, and executive leadership details stored in the database.
        </p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-800/90 rounded-3xl border border-slate-700 p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Section 1: Company Profile */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700 pb-2">
            <Building2 className="w-4 h-4" />
            <span>Corporate Identity & Legal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">GSTIN Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">About Company Description</label>
              <textarea
                rows={3}
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Manufacturing Plant & Office Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Corporate Mission</label>
              <textarea
                rows={2}
                name="mission"
                value={formData.mission || ''}
                onChange={handleChange}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Corporate Vision</label>
              <textarea
                rows={2}
                name="vision"
                value={formData.vision || ''}
                onChange={handleChange}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Channels & WhatsApp Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700 pb-2">
            <MessageCircle className="w-4 h-4" />
            <span>Official WhatsApp Ordering & Contact Desk</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                WhatsApp Order Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-extrabold focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Used in all "Order via WhatsApp" buttons across products.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: CEO Profile */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700 pb-2">
            <UserCheck className="w-4 h-4" />
            <span>CEO & Scientific Leadership Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">CEO Name</label>
              <input
                type="text"
                name="ceoName"
                value={formData.ceoName || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">CEO Photo Asset / Path</label>
              <input
                type="text"
                name="ceoImage"
                value={formData.ceoImage || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">CEO Phone</label>
              <input
                type="text"
                name="ceoPhone"
                value={formData.ceoPhone || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">CEO Email</label>
              <input
                type="email"
                name="ceoEmail"
                value={formData.ceoEmail || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">CEO Biography & Qualifications</label>
              <textarea
                rows={3}
                name="ceoBio"
                value={formData.ceoBio || ''}
                onChange={handleChange}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-700 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Configuration...' : 'Save Company Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
