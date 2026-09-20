import React, { useState } from 'react';
import { 
  X, Copy, Check, MessageCircle, Send, 
  Facebook, Share2 
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';

interface ShareModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ product, isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const productUrl = `${window.location.origin}/products/${product.id}`;
  const shareText = `Check out ${product.name} (${product.packSize}) at ${formatPrice(product.price)} on AquaGrow Feeds:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const shareViaWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${productUrl}`)}`;
    window.open(url, '_blank');
  };

  const shareViaTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Share Product</h3>
            <p className="text-xs text-slate-500">Share feed details with fellow aquaculture farmers</p>
          </div>
        </div>

        {/* Product Snapshot */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
          <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded-lg p-1 bg-white shrink-0" />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-800 truncate">{product.name}</h4>
            <p className="text-xs text-slate-500">{product.packSize} • <strong className="text-brand-700">{formatPrice(product.price)}</strong></p>
          </div>
        </div>

        {/* Share Channels */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={shareViaWhatsApp}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all font-semibold text-xs group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={shareViaTelegram}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-all font-semibold text-xs group"
          >
            <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <span>Telegram</span>
          </button>

          <button
            onClick={shareViaFacebook}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all font-semibold text-xs group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <Facebook className="w-5 h-5 fill-current" />
            </div>
            <span>Facebook</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Direct Product Page Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={productUrl}
              className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Universal share hook or trigger function that leverages Web Share API on mobile
 */
export function triggerUniversalShare(product: Product, onFallbackOpen: () => void) {
  const productUrl = `${window.location.origin}/products/${product.id}`;
  const shareData = {
    title: `${product.name} - AquaGrow Feeds`,
    text: `Check out ${product.name} (${product.packSize}) at ${formatPrice(product.price)} on AquaGrow Feeds:`,
    url: productUrl
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    navigator.share(shareData).catch((err) => {
      if (err.name !== 'AbortError') {
        onFallbackOpen();
      }
    });
  } else {
    onFallbackOpen();
  }
}
