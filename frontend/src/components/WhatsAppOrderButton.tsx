import React from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { buildWhatsAppOrderUrl } from '../utils/whatsapp';
import { useCompany } from '../contexts/CompanyContext';

interface WhatsAppOrderButtonProps {
  productName: string;
  packSize: string;
  price: number | string;
  stock: number;
  status: 'IN_STOCK' | 'OUT_OF_STOCK';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const WhatsAppOrderButton: React.FC<WhatsAppOrderButtonProps> = ({
  productName,
  packSize,
  price,
  stock,
  status,
  size = 'md',
  fullWidth = false
}) => {
  const { whatsappNumber } = useCompany();
  const isOutOfStock = status === 'OUT_OF_STOCK' || Number(stock) <= 0;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base font-bold'
  }[size];

  if (isOutOfStock) {
    return (
      <div className={`relative group ${fullWidth ? 'w-full' : 'inline-block'}`}>
        <button
          type="button"
          disabled
          className={`flex items-center justify-center gap-2 rounded-xl bg-slate-200 text-slate-500 font-semibold cursor-not-allowed transition-all opacity-80 border border-slate-300 ${sizeClasses} ${fullWidth ? 'w-full' : ''}`}
          title="This product is currently out of stock. Please check back later."
        >
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>Currently Out of Stock</span>
        </button>
        <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-2.5 py-1 text-xs text-white bg-slate-800 rounded shadow-md z-10 text-center">
          WhatsApp ordering is disabled while inventory is 0
        </span>
      </div>
    );
  }

  const orderUrl = buildWhatsAppOrderUrl({
    productName,
    packSize,
    price,
    whatsappNumber
  });

  return (
    <a
      href={orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-700/20 hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${sizeClasses} ${fullWidth ? 'w-full' : ''}`}
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span>Order via WhatsApp</span>
    </a>
  );
};
