import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Package, ArrowLeft, Save, CheckCircle2, AlertCircle, 
  Sparkles, Image as ImageIcon 
} from 'lucide-react';
import { productApi } from '@/services/api';
import { Product } from '@/types';

export const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    packSize: '25 KG Bag',
    category: 'Floating Feed',
    fishType: 'Rohu, Catla, Mrigal',
    protein: '32',
    fat: '4.0',
    feedType: 'Floating Pellets (3mm - 4mm)',
    recommendedFishSize: '100g - 1.5kg Growout Stage',
    feedingInstructions: 'Feed 2-3% of total body weight daily across 2 split feedings.',
    stock: '100',
    image: '/assets/images/products/floating_pellets_32_4.svg'
  });

  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const imagePresets = [
    { label: 'Floating Pellets 32/4 (Blue)', path: '/assets/images/products/floating_pellets_32_4.svg' },
    { label: 'Starter Crumble 38/6 (Green)', path: '/assets/images/products/starter_crumble_38_6.svg' },
    { label: 'Pangasius Grow 28/3 (Cyan)', path: '/assets/images/products/pangasius_grow_28_3.svg' },
    { label: 'Tilapia Intensive 30/4 (Royal Blue)', path: '/assets/images/products/tilapia_intensive_30_4.svg' },
    { label: 'Broodstock Special 36/7 (Purple)', path: '/assets/images/products/broodstock_special_36_7.svg' },
    { label: 'Sinking Pellet 24/3 (Dark Grey)', path: '/assets/images/products/sinking_pellet_24_3.svg' },
    { label: 'Shrimp Nursery 40/8 (Red)', path: '/assets/images/products/shrimp_nursery_40_8.svg' },
    { label: 'Winter Care 34/5 (Ice Blue)', path: '/assets/images/products/winter_feed_34_5.svg' },
  ];

  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduct = async () => {
        try {
          const res = await productApi.getById(id);
          if (res.success && res.data) {
            const p = res.data;
            setFormData({
              name: p.name,
              description: p.description,
              price: String(p.price),
              packSize: p.packSize,
              category: p.category,
              fishType: p.fishType,
              protein: String(p.protein),
              fat: String(p.fat),
              feedType: p.feedType,
              recommendedFishSize: p.recommendedFishSize,
              feedingInstructions: p.feedingInstructions,
              stock: String(p.stock),
              image: p.image
            });
          }
        } catch (err) {
          setErrorMsg('Failed to load existing product details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.price || !formData.packSize || !formData.category) {
      setErrorMsg('Please fill in all mandatory fields: Product Name, Price, Pack Size, and Category.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Product> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        packSize: formData.packSize.trim(),
        category: formData.category,
        fishType: formData.fishType.trim(),
        protein: Number(formData.protein),
        fat: Number(formData.fat),
        feedType: formData.feedType.trim(),
        recommendedFishSize: formData.recommendedFishSize.trim(),
        feedingInstructions: formData.feedingInstructions.trim(),
        stock: Number(formData.stock),
        image: formData.image
      };

      if (isEditMode && id) {
        const res = await productApi.update(id, payload);
        if (res.success) {
          setSuccessMsg('Product updated successfully! Customer catalog and WhatsApp links now reflect the new details.');
          setTimeout(() => navigate('/admin/products'), 1500);
        }
      } else {
        const res = await productApi.create(payload);
        if (res.success) {
          setSuccessMsg('New product published successfully to the customer catalog!');
          setTimeout(() => navigate('/admin/products'), 1500);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save product details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link & Title */}
      <div>
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products Table</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Package className="w-6 h-6 text-indigo-400" />
          <span>{isEditMode ? `Edit Product #${id}` : 'Create New Fish Feed Formulation'}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {isEditMode
            ? 'Updating these details will automatically change prices, stock badges, and WhatsApp messages across the customer website.'
            : 'Fill in the nutritional specs, pack weights, pricing, and initial factory stock.'}
        </p>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800/90 rounded-3xl border border-slate-700 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Product Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. AquaGrow Premium Floating Pellets 32/4"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Farmer Price (₹ INR) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              min="1"
              step="1"
              placeholder="e.g. 1250"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Pack Size */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Pack Size <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="packSize"
              placeholder="e.g. 25 KG Bag"
              value={formData.packSize}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Feed Category <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Floating Feed">Floating Feed</option>
              <option value="Starter Feed">Starter Feed</option>
              <option value="Growth Feed">Growth Feed</option>
              <option value="Broodstock Feed">Broodstock Feed</option>
              <option value="Sinking Feed">Sinking Feed</option>
              <option value="High Protein Feed">High Protein Feed</option>
            </select>
          </div>

          {/* Target Fish Species */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Fish Species <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="fishType"
              placeholder="e.g. Rohu, Catla, Mrigal, Tilapia"
              value={formData.fishType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Crude Protein */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Crude Protein (% Min)
            </label>
            <input
              type="number"
              step="0.1"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Crude Fat */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Crude Fat (% Min)
            </label>
            <input
              type="number"
              step="0.1"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Feed Extrusion Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Feed Extrusion & Size
            </label>
            <input
              type="text"
              name="feedType"
              placeholder="e.g. Floating Pellets (3mm - 4mm)"
              value={formData.feedType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Factory Stock Quantity (Bags)
            </label>
            <input
              type="number"
              min="0"
              name="stock"
              placeholder="e.g. 150 (0 sets to OUT OF STOCK)"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Setting stock to 0 will show 🔴 OUT OF STOCK and disable WhatsApp orders.
            </span>
          </div>

          {/* Recommended Fish Size */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Recommended Fish Stage
            </label>
            <input
              type="text"
              name="recommendedFishSize"
              placeholder="e.g. 100g - 1.5kg Growout Stage"
              value={formData.recommendedFishSize}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Product Description
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Feeding Instructions */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Feeding Instructions & Daily Ration
            </label>
            <textarea
              rows={2}
              name="feedingInstructions"
              value={formData.feedingInstructions}
              onChange={handleChange}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Image Selection / Preset */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Product Bag Illustration / Image
            </label>
            <select
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
            >
              {imagePresets.map((img) => (
                <option key={img.path} value={img.path}>{img.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-700">
              <img src={formData.image} alt="Preview" className="w-12 h-14 object-contain rounded" />
              <span className="text-xs text-slate-400">Current visual asset: {formData.image}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-700 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving to Database...' : (isEditMode ? 'Save & Update Product' : 'Publish Product')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
