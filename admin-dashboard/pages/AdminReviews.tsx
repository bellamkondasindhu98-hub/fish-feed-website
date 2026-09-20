import React, { useState, useEffect } from 'react';
import { 
  Star, Trash2, CheckCircle2, XCircle, AlertCircle, 
  Eye, Check, ShieldCheck 
} from 'lucide-react';
import { reviewApi } from '@/services/api';
import { Review } from '@/types';
import { formatDate } from '@/utils/formatters';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await reviewApi.getAllForAdmin();
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id: number, currentApproved: number) => {
    setActionMsg(null);
    const newStatus = currentApproved === 1 ? false : true;
    try {
      const res = await reviewApi.toggleApproval(id, newStatus);
      if (res.success) {
        setActionMsg({
          type: 'success',
          text: `Review #${id} is now ${newStatus ? 'published on customer website' : 'hidden from public view'}.`
        });
        fetchReviews();
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update review status.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently remove this review?')) return;
    setActionMsg(null);
    try {
      const res = await reviewApi.deleteReview(id);
      if (res.success) {
        setActionMsg({ type: 'success', text: 'Review permanently deleted.' });
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete review.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Star className="w-6 h-6 text-amber-400" />
          <span>Customer Review Moderation</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review verified farmer feedback. You can approve or remove inappropriate reviews, while customer star ratings remain authentic.
        </p>
      </div>

      {actionMsg && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          actionMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px] bg-slate-950/40">
                <th className="p-4">Farmer / Author</th>
                <th className="p-4">Product</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Customer Comment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading customer reviews...</td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-700/30">
                    <td className="p-4">
                      <p className="font-bold text-white">{rev.userName}</p>
                      <p className="text-[10px] text-slate-400">{rev.userEmail}</p>
                      <p className="text-[10px] text-slate-500">{formatDate(rev.createdAt)}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-200">{rev.productName}</p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rev.rating} / 5</span>
                      </div>
                    </td>

                    <td className="p-4 max-w-sm">
                      <p className="text-slate-300 leading-relaxed italic line-clamp-3">"{rev.comment}"</p>
                    </td>

                    <td className="p-4">
                      {rev.isApproved === 1 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Hidden
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          rev.isApproved === 1
                            ? 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-300'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300'
                        }`}
                      >
                        {rev.isApproved === 1 ? 'Hide' : 'Approve'}
                      </button>

                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No reviews submitted yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
