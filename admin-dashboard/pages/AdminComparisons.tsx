import React, { useState, useEffect } from 'react';
import { 
  Scale, Plus, Edit3, Trash2, CheckCircle2, 
  AlertCircle, X, Save 
} from 'lucide-react';
import { comparisonApi, productApi } from '@/services/api';
import { ComparisonProduct, Product } from '@/types';
import { formatPrice } from '@/utils/formatters';

export const AdminComparisons: React.FC = () => {
  const [comparisons, setComparisons] = useState<ComparisonProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    productId: '1',
    competitorName: '',
    competitorProductName: '',
    price: '',
    packSize: '25 KG Bag',
    protein: '28',
    fat: '3.0',
    fishType: 'Rohu / Catla',
    feedType: 'Floating Pellets',
    rating: '4.0',
    source: 'Market Benchmark 2026'
  });

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [compRes, prodRes] = await Promise.all([
        comparisonApi.getAll(),
        productApi.getAll()
      ]);
      if (compRes.success) setComparisons(compRes.data);
      if (prodRes.success) setProducts(prodRes.data);
    } catch (err) {
      console.error('Error fetching comparison data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      productId: products[0]?.id ? String(products[0].id) : '1',
      competitorName: '',
      competitorProductName: '',
      price: '',
      packSize: '25 KG Bag',
      protein: '28',
      fat: '3.0',
      fishType: 'Rohu / Catla',
      feedType: 'Floating Pellets',
      rating: '4.0',
      source: 'Market Benchmark 2026'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (comp: ComparisonProduct) => {
    setEditingId(comp.id);
    setFormData({
      productId: String(comp.productId),
      competitorName: comp.competitorName,
      competitorProductName: comp.competitorProductName,
      price: String(comp.price),
      packSize: comp.packSize,
      protein: String(comp.protein),
      fat: String(comp.fat),
      fishType: comp.fishType,
      feedType: comp.feedType,
      rating: String(comp.rating),
      source: comp.source
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!formData.competitorName.trim() || !formData.competitorProductName.trim() || !formData.price) {
      setStatusMsg({ type: 'error', text: 'Please fill in competitor brand, product name, and benchmark price.' });
      return;
    }

    try {
      const payload: Partial<ComparisonProduct> = {
        productId: Number(formData.productId),
        competitorName: formData.competitorName.trim(),
        competitorProductName: formData.competitorProductName.trim(),
        price: Number(formData.price),
        packSize: formData.packSize.trim(),
        protein: Number(formData.protein),
        fat: Number(formData.fat),
        fishType: formData.fishType.trim(),
        feedType: formData.feedType.trim(),
        rating: Number(formData.rating),
        source: formData.source.trim()
      };

      if (editingId) {
        const res = await comparisonApi.update(editingId, payload);
        if (res.success) {
          setStatusMsg({ type: 'success', text: 'Comparison benchmark updated.' });
          setIsFormOpen(false);
          fetchData();
        }
      } else {
        const res = await comparisonApi.create(payload);
        if (res.success) {
          setStatusMsg({ type: 'success', text: 'New benchmark record added.' });
          setIsFormOpen(false);
          fetchData();
        }
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save benchmark.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this competitor benchmark?')) return;
    setStatusMsg(null);
    try {
      const res = await comparisonApi.delete(id);
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Benchmark deleted.' });
        setComparisons(prev => prev.filter(c => c.id !== id));
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-teal-400" />
            <span>Market Benchmark & Competitor Comparisons</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage verified industry benchmarks that customers see when comparing AquaGrow feeds on the comparison page.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Benchmark Data</span>
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

      {/* Form Drawer */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-slate-800/95 rounded-3xl border border-teal-500/40 p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-white uppercase">
              {editingId ? 'Edit Benchmark Record' : 'Add Competitor Benchmark Record'}
            </h3>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">AquaGrow Product</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.protein}%)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Competitor / Benchmark Brand</label>
              <input
                type="text"
                placeholder="e.g. Standard Market Brand A"
                value={formData.competitorName}
                onChange={(e) => setFormData({ ...formData, competitorName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Competitor Feed Name</label>
              <input
                type="text"
                placeholder="e.g. Commercial Carp Grow 28/3"
                value={formData.competitorProductName}
                onChange={(e) => setFormData({ ...formData, competitorProductName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1320"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Pack Sizing</label>
              <input
                type="text"
                value={formData.packSize}
                onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Protein % (Min)</label>
              <input
                type="number"
                step="0.1"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Fat % (Min)</label>
              <input
                type="number"
                step="0.1"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Target Fish</label>
              <input
                type="text"
                value={formData.fishType}
                onChange={(e) => setFormData({ ...formData, fishType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Verification Source</label>
              <input
                type="text"
                placeholder="e.g. Published Market Catalog 2026"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
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
              className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow"
            >
              Save Benchmark
            </button>
          </div>
        </form>
      )}

      {/* Comparisons Table */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px] bg-slate-950/40">
                <th className="p-4">AquaGrow Product</th>
                <th className="p-4">Competitor Benchmark</th>
                <th className="p-4">Price</th>
                <th className="p-4">Protein / Fat</th>
                <th className="p-4">Source</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading benchmark matrices...</td>
                </tr>
              ) : comparisons.length > 0 ? (
                comparisons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-700/30">
                    <td className="p-4 font-bold text-white">
                      <p>{c.productName}</p>
                      <span className="text-[10px] text-slate-400">Our: {formatPrice(c.ourPrice)} • {c.ourProtein}% Protein</span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-amber-400">{c.competitorName}</p>
                      <p className="text-slate-300 text-xs">{c.competitorProductName}</p>
                    </td>

                    <td className="p-4 font-black text-slate-200">
                      {formatPrice(c.price)}
                    </td>

                    <td className="p-4 text-slate-300">
                      <span className="font-bold text-white">{c.protein}%</span> Protein • {c.fat}% Fat
                    </td>

                    <td className="p-4 text-slate-400 text-[11px]">
                      {c.source}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-all"
                        title="Edit Benchmark"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all"
                        title="Delete Benchmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No benchmark comparisons added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
