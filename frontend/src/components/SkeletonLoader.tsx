import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm animate-pulse flex flex-col justify-between h-[450px]">
      <div>
        <div className="w-full h-48 bg-slate-200 rounded-2xl mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-slate-200 rounded w-full mb-1.5"></div>
        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
      </div>
      <div className="pt-4 border-t border-slate-100">
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
        <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 border-b border-slate-100 flex items-center px-6 gap-4">
          <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
          </div>
          <div className="w-20 h-4 bg-slate-200 rounded"></div>
          <div className="w-24 h-8 bg-slate-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};
