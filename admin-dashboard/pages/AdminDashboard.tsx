import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, PackageCheck, AlertCircle, Users, Star, 
  MessageSquare, PlusCircle, Building2, Scale, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { adminApi, productApi } from '@/services/api';
import { DashboardMetrics, Product } from '@/types';
import { formatPrice } from '@/utils/formatters';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const metricsRes = await adminApi.getMetrics();
        if (metricsRes.success) {
          setMetrics(metricsRes.data);
        }

        const prodRes = await productApi.getAll();
        if (prodRes.success) {
          setRecentProducts(prodRes.data);
        }
      } catch (err) {
        console.error('Error fetching admin metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Management Control Center</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            AquaGrow Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live overview of products, stock inventory, customer reviews, and website feedback.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Product</span>
        </Link>
      </div>

      {/* 6 Required Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Products */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Products</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">{metrics?.totalProducts || 0}</p>
          <span className="text-[10px] text-slate-400 mt-1">Active feed formulations</span>
        </div>

        {/* 2. Available Products */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Available In Stock</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-3">{metrics?.availableProducts || 0}</p>
          <span className="text-[10px] text-emerald-400/80 mt-1">🟢 WhatsApp Orders Active</span>
        </div>

        {/* 3. Out of Stock */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Out of Stock</span>
            <div className="p-2 bg-red-500/10 text-red-400 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-400 mt-3">{metrics?.outOfStockProducts || 0}</p>
          <span className="text-[10px] text-red-400/80 mt-1">🔴 Disabled on Storefront</span>
        </div>

        {/* 4. Total Customers */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Farmers</span>
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">{metrics?.totalCustomers || 0}</p>
          <span className="text-[10px] text-slate-400 mt-1">Registered farm accounts</span>
        </div>

        {/* 5. Total Reviews */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Reviews</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-3">{metrics?.totalReviews || 0}</p>
          <span className="text-[10px] text-slate-400 mt-1">Farmer feed ratings</span>
        </div>

        {/* 6. Website Feedback */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Feedback</span>
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-400 mt-3">{metrics?.totalFeedback || 0}</p>
          <span className="text-[10px] text-slate-400 mt-1">Website inquiries</span>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/products"
          className="p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Manage Products</h4>
              <p className="text-[11px] text-slate-400">Edit price, stock, specs</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
        </Link>

        <Link
          to="/admin/company"
          className="p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Company Profile</h4>
              <p className="text-[11px] text-slate-400">WhatsApp & CEO info</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
        </Link>

        <Link
          to="/admin/reviews"
          className="p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Review Moderation</h4>
              <p className="text-[11px] text-slate-400">Approve & delete</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
        </Link>

        <Link
          to="/admin/comparisons"
          className="p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Competitor Data</h4>
              <p className="text-[11px] text-slate-400">Benchmark matrices</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
        </Link>
      </div>

      {/* Recent Products Table Preview */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Product Inventory Status</h3>
          <Link to="/admin/products" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
            View All Products ({recentProducts.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Farmer Price</th>
                <th className="pb-3">Stock Quantity</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {recentProducts.slice(0, 6).map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/30">
                  <td className="py-3.5 font-bold text-white flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-8 h-8 object-contain rounded bg-slate-900 p-1" />
                    <span className="truncate max-w-[200px]">{p.name}</span>
                  </td>
                  <td className="py-3.5 text-slate-300">{p.category}</td>
                  <td className="py-3.5 font-extrabold text-white">{formatPrice(p.price)}</td>
                  <td className="py-3.5 text-slate-300 font-bold">{p.stock} bags</td>
                  <td className="py-3.5">
                    {p.status === 'IN_STOCK' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        🟢 IN STOCK
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        🔴 OUT OF STOCK
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      to={`/admin/products/edit/${p.id}`}
                      className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold transition-all"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
