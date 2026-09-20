import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, Search, 
  MessageCircle, Sparkles, BookOpen 
} from 'lucide-react';
import { faqApi } from '../services/api';
import { FAQ } from '../types';
import { useCompany } from '../contexts/CompanyContext';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const FAQsPage: React.FC = () => {
  const { whatsappNumber } = useCompany();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await faqApi.getAll();
        if (res.success) {
          setFaqs(res.data);
          if (res.data.length > 0) {
            setExpandedId(res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const categories = ['All', 'Ordering & Delivery', 'Feed Quality & Nutrition', 'Farmer Support', 'General'];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold uppercase tracking-wider">
          Knowledge Base & Answers
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to know about ordering via WhatsApp, protein nutritional specifications, bulk freight, and on-farm feeding support.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto pt-3">
          <input
            type="text"
            placeholder="Search questions (e.g. WhatsApp order, payment, floating feed)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
          <Search className="absolute left-3.5 top-6 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading FAQs...</p>
          </div>
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs shrink-0">
                      Q
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{faq.question}</h3>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-xs text-slate-500">No questions found matching your search. Please ask our WhatsApp desk directly!</p>
          </div>
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="p-8 bg-gradient-to-r from-brand-900 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg font-bold">Have a specific pond or feed question?</h4>
          <p className="text-xs text-slate-300">Our aquaculture nutritionists respond promptly on WhatsApp.</p>
        </div>

        <a
          href={buildGeneralWhatsAppUrl(whatsappNumber, 'FAQ Consultation')}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-all shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
