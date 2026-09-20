import React, { useState } from 'react';
import { 
  MessageSquare, Star, Send, CheckCircle2, 
  AlertCircle, Sparkles, HeartHandshake 
} from 'lucide-react';
import { feedbackApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const WebsiteFeedbackPage: React.FC = () => {
  const { user } = useAuth();

  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMsg({ type: 'error', text: 'Please fill in your name, email, and feedback message.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await feedbackApi.submit({
        name: name.trim(),
        email: email.trim(),
        rating,
        message: message.trim()
      });

      if (res.success) {
        setStatusMsg({
          type: 'success',
          text: 'Thank you for your valuable feedback! Your thoughts help us serve fish farmers better.'
        });
        setMessage('');
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit feedback. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider">
          User Experience & Suggestions
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Website & Service Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          How was your experience browsing our fish feed products and ordering on WhatsApp? We value your honest suggestions.
        </p>
      </div>

      {/* Feedback Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        {statusMsg && (
          <div className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-3 ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Overall Website Experience <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-500 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star className={`w-8 h-8 ${star <= rating ? 'fill-current text-amber-500' : 'text-slate-200'}`} />
                </button>
              ))}
              <span className="text-xs font-extrabold text-slate-800 ml-2">
                {rating === 5 ? 'Excellent 🌟' : rating === 4 ? 'Good 👍' : rating === 3 ? 'Average 😐' : 'Needs Improvement'}
              </span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Rajesh Reddy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. farmer@krishi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Feedback Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Feedback or Feature Request <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Tell us what you liked, what can be improved, or what new feed products you would like us to introduce..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Submitting Feedback...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
