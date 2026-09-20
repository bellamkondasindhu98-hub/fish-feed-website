import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, PlusCircle, Building2, 
  MessageSquare, Star, HelpCircle, Scale, Users, 
  ExternalLink, LogOut, Shield, Menu, X 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { company } = useCompany();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Product Catalog', path: '/admin/products', icon: Package },
    { name: 'Add New Product', path: '/admin/products/new', icon: PlusCircle },
    { name: 'Company & CEO Profile', path: '/admin/company', icon: Building2 },
    { name: 'Customer Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Website Feedback', path: '/admin/feedback', icon: MessageSquare },
    { name: 'FAQ Management', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Market Comparisons', path: '/admin/comparisons', icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Mobile Admin Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
        <Link to="/admin" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-400" />
          <span className="font-extrabold text-sm text-white tracking-wide">AquaGrow Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`w-full lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-5 space-y-6 shrink-0 ${
        sidebarOpen ? 'block' : 'hidden lg:flex'
      }`}>
        <div className="space-y-6">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">AquaGrow Feeds</h2>
              <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">Executive Portal</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar User Info & Return Link */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <Link
            to="/home"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-brand-400 hover:text-brand-300 hover:bg-slate-900 rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Return to Main Website</span>
          </Link>

          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">Administrator</p>
            </div>
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
