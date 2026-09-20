import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, User, Mail, Calendar, RefreshCw } from 'lucide-react';
import { feedbackApi } from '@/services/api';
import { WebsiteFeedback } from '@/types';
import { formatDate } from '@/utils/formatters';

export const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<WebsiteFeedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const res = await feedbackApi.getAll();
      if (res.success) {
        setFeedbacks(res.data);
      }
    } catch (err) {
      console.error('Error loading website feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-teal-400" />
            <span>Website User Feedback</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submitted feedback, ratings, and feature requests from farmers browsing the website.
          </p>
        </div>

        <button
          onClick={fetchFeedback}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          title="Refresh feedback"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Feedback List Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Loading website feedback...</div>
        ) : feedbacks.length > 0 ? (
          feedbacks.map((fb) => (
            <div key={fb.id} className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                    {fb.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{fb.name}</h4>
                    <p className="text-xs text-slate-400">{fb.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{fb.rating} / 5</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{formatDate(fb.createdAt)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line italic">
                "{fb.message}"
              </p>
            </div>
          ))
        ) : (
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center text-slate-400 text-xs">
            No website feedback entries found.
          </div>
        )}
      </div>
    </div>
  );
};
