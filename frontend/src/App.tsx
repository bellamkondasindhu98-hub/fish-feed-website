import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { ComparisonProvider } from './contexts/ComparisonContext';

// Guards
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AdminLayout } from '@admin/layouts/AdminLayout';

// Customer Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ProductComparisonPage } from './pages/ProductComparisonPage';
import { CompanyProfilePage } from './pages/CompanyProfilePage';
import { CEOProfilePage } from './pages/CEOProfilePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { FAQsPage } from './pages/FAQsPage';
import { WhyChooseUsPage } from './pages/WhyChooseUsPage';
import { WebsiteFeedbackPage } from './pages/WebsiteFeedbackPage';
import { HelpCenterPage } from './pages/HelpCenterPage';

// Admin Pages
import { AdminDashboard } from '@admin/pages/AdminDashboard';
import { AdminProducts } from '@admin/pages/AdminProducts';
import { AdminProductForm } from '@admin/pages/AdminProductForm';
import { AdminCompany } from '@admin/pages/AdminCompany';
import { AdminReviews } from '@admin/pages/AdminReviews';
import { AdminFeedback } from '@admin/pages/AdminFeedback';
import { AdminFAQs } from '@admin/pages/AdminFAQs';
import { AdminComparisons } from '@admin/pages/AdminComparisons';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CompanyProvider>
          <ComparisonProvider>
            <Routes>
              {/* Public Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected Customer Routes (Requires Login) */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/products/compare" element={<ProductComparisonPage />} />
                <Route path="/company" element={<CompanyProfilePage />} />
                <Route path="/ceo" element={<CEOProfilePage />} />
                <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
                <Route path="/faqs" element={<FAQsPage />} />
                <Route path="/feedback" element={<WebsiteFeedbackPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
              </Route>

              {/* Protected Admin Routes (Requires Admin Role) */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/edit/:id" element={<AdminProductForm />} />
                <Route path="company" element={<AdminCompany />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="faqs" element={<AdminFAQs />} />
                <Route path="comparisons" element={<AdminComparisons />} />
              </Route>

              {/* Fallback 404 Route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ComparisonProvider>
        </CompanyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
