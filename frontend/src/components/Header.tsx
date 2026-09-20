import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Menu, X, LogOut, User as UserIcon, Shield, 
  Scale, MessageCircle, ChevronDown, Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import { useComparison } from '../contexts/ComparisonContext';
import { productApi } from '../services/api';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';

export const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { company } = useCompany();
  const { compareList } = useComparison();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchDropdown(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Live dynamic product search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productApi.search(searchQuery.trim());
        if (res.success) {
          setSearchResults(res.data.slice(0, 5));
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Products', path: '/products' },
    { name: 'Company', path: '/company' },
    { name: 'Why Choose Us', path: '/why-choose-us' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Feedback', path: '/feedback' },
    { name: 'Help Center', path: '/help' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top utility notification bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Direct Farm Orders & Consultation via WhatsApp: <strong>{company?.whatsappNumber || '+919876543210'}</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span>GSTIN: {company?.gstNumber || '36AAAAA0000A1Z5'}</span>
            <span>ISO 9001:2015 Certified Aquaculture Nutrition</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* LEFT: Logo & Company Name */}
          <Link to="/home" className="flex items-center gap-3 shrink-0 group">
            <img 
              src={company?.logo || '/assets/images/logo.svg'} 
              alt={company?.companyName || 'AquaGrow Feeds'} 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* CENTER: Dynamic Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search feeds by species (Rohu, Tilapia), protein (32%), pack size..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-inner"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                {isSearching && (
                  <div className="absolute right-3.5 top-3 w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </form>

            {/* Dynamic Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium px-3">
                  <span>Quick Results</span>
                  <span>Press Enter for all</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.id}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center gap-3 p-3 hover:bg-brand-50/60 transition-colors"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded bg-slate-50 p-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.category} • {p.protein}% Protein</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-brand-700">{formatPrice(p.price)}</span>
                        <span className={`block text-[10px] font-semibold ${p.status === 'IN_STOCK' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {p.status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-2 bg-slate-50 text-center">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 py-1"
                  >
                    View all results for "{searchQuery}" →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Comparison, User Profile, Admin, Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Compare Badge / Button */}
            {compareList.length > 0 && (
              <Link
                to="/products/compare"
                className="relative flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 rounded-full text-xs font-semibold transition-all shadow-sm"
              >
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
                <span className="w-5 h-5 bg-brand-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {compareList.length}
                </span>
              </Link>
            )}

            {/* User Profile Menu */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left"
                >
                  <img
                    src={user.profileImage || '/assets/images/user_avatar.svg'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
                  />
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-indigo-700 font-semibold bg-indigo-50/50 hover:bg-indigo-50"
                        >
                          <Shield className="w-4 h-4 text-indigo-600" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={async () => {
                          setProfileDropdownOpen(false);
                          await logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
              >
                Login
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 py-2 border-t border-slate-100 overflow-x-auto">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-brand-700 bg-brand-50 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search fish feed products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          </form>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}

            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4 text-slate-500" />
              My Profile
            </Link>

            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
