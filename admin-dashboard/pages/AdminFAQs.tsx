import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Plus, Edit3, Trash2, Save, 
  CheckCircle2, AlertCircle, X 
} from 'lucide-react';
import { faqApi } from '@/services/api';
import { FAQ } from '@/types';

export const AdminFAQs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [category, setCategory] = useState<string>('General');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await faqApi.getAll();
      if (res.success) {
        setFaqs(res.data);
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!question.trim() || !answer.trim()) {
      setStatusMsg({ type: 'error', text: 'Please fill in both question and answer.' });
      return;
    }

    try {
      if (editingId) {
        const res = await faqApi.update(editingId, { question, answer, category });
        if (res.success) {
          setStatusMsg({ type: 'success', text: 'FAQ item updated successfully.' });
          setIsFormOpen(false);
          fetchFaqs();
        }
      } else {
        const res = await faqApi.create({ question, answer, category });
        if (res.success) {
          setStatusMsg({ type: 'success', text: 'New FAQ item created.' });
          setIsFormOpen(false);
          fetchFaqs();
        }
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save FAQ.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    setStatusMsg(null);
    try {
      const res = await faqApi.delete(id);
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'FAQ deleted.' });
        setFaqs(prev => prev.filter(f => f.id !== id));
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete FAQ.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            <span>FAQ Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add, update, and manage frequently asked questions shown on the customer FAQs page.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New FAQ</span>
        </button>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Form Modal / Drawer if open */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-slate-800/95 rounded-3xl border border-indigo-500/50 p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-white uppercase">
              {editingId ? 'Edit FAQ Item' : 'Add New FAQ Item'}
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Ordering & Delivery">Ordering & Delivery</option>
              <option value="Feed Quality & Nutrition">Feed Quality & Nutrition</option>
              <option value="Farmer Support">Farmer Support</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Question</label>
            <input
              type="text"
              placeholder="e.g. How can I place a bulk order via WhatsApp?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Answer / Guidance</label>
            <textarea
              rows={3}
              placeholder="Provide clear, concise answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow"
            >
              Save FAQ
            </button>
          </div>
        </form>
      )}

      {/* FAQ Table List */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px] bg-slate-950/40">
                <th className="p-4">Category</th>
                <th className="p-4">Question & Answer</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-400">Loading FAQs...</td>
                </tr>
              ) : faqs.length > 0 ? (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-700/30">
                    <td className="p-4 align-top w-48">
                      <span className="px-2.5 py-1 bg-slate-900 text-indigo-300 rounded-lg text-[10px] font-bold border border-slate-700">
                        {faq.category}
                      </span>
                    </td>

                    <td className="p-4 space-y-1">
                      <h4 className="font-bold text-white text-sm">{faq.question}</h4>
                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">{faq.answer}</p>
                    </td>

                    <td className="p-4 text-right align-top space-x-2 w-36">
                      <button
                        onClick={() => handleOpenEdit(faq)}
                        className="p-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-all"
                        title="Edit FAQ"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-1.5 bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-400">No FAQs created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
