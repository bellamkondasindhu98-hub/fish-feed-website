import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, PlusCircle, Edit3, Trash2, CheckCircle2, 
  AlertCircle, Search, RefreshCw, Eye 
} from 'lucide-react';
import { productApi } from '@/services/api';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatters';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stockEditId, setStockEditId] = useState<number | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productApi.getAll();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockUpdate = async (id: number) => {
    setActionMsg(null);
    try {
      const res = await productApi.updateStock(id, newStockVal);
      if (res.success) {
        setActionMsg({ type: 'success', text: `Stock updated to ${newStockVal} for Product #${id}.` });
        setStockEditId(null);
        fetchProducts();
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update stock.' });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    setActionMsg(null);
    try {
      const res = await productApi.delete(id);
      if (res.success) {
        setActionMsg({ type: 'success', text: `Product "${name}" deleted successfully.` });
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete product.' });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.fishType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-400" />
            <span>Product & Inventory Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update prices, manage stock quantities, and view live availability.
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

      {/* Alert message */}
      {actionMsg && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
          actionMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by feed name, category, or fish species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        </div>

        <button
          onClick={fetchProducts}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-colors"
          title="Refresh products list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px] bg-slate-950/40">
                <th className="p-4">Image</th>
                <th className="p-4">Product Name & Category</th>
                <th className="p-4">Farmer Price</th>
                <th className="p-4">Stock Quantity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading product table...</td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/30">
                    <td className="p-4">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-contain rounded-xl bg-slate-900 p-1 border border-slate-700" />
                    </td>

                    <td className="p-4">
                      <Link to={`/products/${p.id}`} className="font-bold text-white hover:text-indigo-400 text-sm block">
                        {p.name}
                      </Link>
                      <span className="text-[11px] text-slate-400">
                        {p.category} • {p.protein}% Protein • {p.packSize}
                      </span>
                    </td>

                    <td className="p-4 font-black text-white text-sm">
                      {formatPrice(p.price)}
                    </td>

                    <td className="p-4">
                      {stockEditId === p.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={newStockVal}
                            onChange={(e) => setNewStockVal(Number(e.target.value))}
                            className="w-20 px-2 py-1 bg-slate-900 border border-indigo-500 rounded-lg text-xs text-white font-bold"
                          />
                          <button
                            onClick={() => handleStockUpdate(p.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setStockEditId(null)}
                            className="px-2 py-1 bg-slate-700 text-slate-300 rounded-lg text-[11px]"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm">{p.stock}</span>
                          <button
                            onClick={() => {
                              setStockEditId(p.id);
                              setNewStockVal(p.stock);
                            }}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-semibold"
                          >
                            Quick Update
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {p.status === 'IN_STOCK' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          🟢 IN STOCK
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          🔴 OUT OF STOCK
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No products found matching "{searchQuery}".</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
