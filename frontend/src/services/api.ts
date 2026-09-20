import axios from 'axios';
import {
  User, Product, Review, Company, FAQ, WebsiteFeedback,
  ComparisonProduct, DashboardMetrics, ApiResponse, AuthResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aquagrow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRequest = error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register');
      if (!isAuthRequest) {
        localStorage.removeItem('aquagrow_token');
        localStorage.removeItem('aquagrow_user');
        if (window.location.pathname !== '/login') {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authApi = {
  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', { identifier, password });
    return res.data;
  },
  register: async (data: { name: string; email: string; phone: string; password: string; confirmPassword?: string }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },
  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const res = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; phone?: string; profileImage?: string }): Promise<{ success: boolean; message: string; user: User }> => {
    const res = await apiClient.put<{ success: boolean; message: string; user: User }>('/auth/profile', data);
    return res.data;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.put<{ success: boolean; message: string }>('/auth/change-password', data);
    return res.data;
  },
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('aquagrow_token');
      localStorage.removeItem('aquagrow_user');
    }
  }
};

// Product Services
export const productApi = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    fishType?: string;
    minPrice?: number | string;
    maxPrice?: number | string;
    stockStatus?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<Product[]>> => {
    const res = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
    return res.data;
  },
  search: async (query: string): Promise<ApiResponse<Product[]>> => {
    const res = await apiClient.get<ApiResponse<Product[]>>('/products/search', { params: { q: query } });
    return res.data;
  },
  getById: async (id: number | string): Promise<ApiResponse<Product & { comparisons: ComparisonProduct[]; recommendations: Product[] }>> => {
    const res = await apiClient.get<ApiResponse<Product & { comparisons: ComparisonProduct[]; recommendations: Product[] }>>(`/products/${id}`);
    return res.data;
  },
  getRecommendations: async (id: number | string): Promise<ApiResponse<Product[]>> => {
    const res = await apiClient.get<ApiResponse<Product[]>>(`/products/${id}/recommendations`);
    return res.data;
  },
  // Admin Operations
  create: async (data: Partial<Product>): Promise<ApiResponse<Product>> => {
    const res = await apiClient.post<ApiResponse<Product>>('/products', data);
    return res.data;
  },
  update: async (id: number | string, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    const res = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
    return res.data;
  },
  updateStock: async (id: number | string, stock: number): Promise<ApiResponse<Product>> => {
    const res = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/stock`, { stock });
    return res.data;
  },
  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
    return res.data;
  }
};

// Review Services
export const reviewApi = {
  getByProductId: async (productId: number | string): Promise<ApiResponse<Review[]>> => {
    const res = await apiClient.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`);
    return res.data;
  },
  submitReview: async (productId: number | string, data: { rating: number; comment: string }): Promise<ApiResponse<Review>> => {
    const res = await apiClient.post<ApiResponse<Review>>(`/products/${productId}/reviews`, data);
    return res.data;
  },
  getAllForAdmin: async (): Promise<ApiResponse<Review[]>> => {
    const res = await apiClient.get<ApiResponse<Review[]>>('/reviews/admin');
    return res.data;
  },
  toggleApproval: async (id: number | string, isApproved: boolean): Promise<ApiResponse<Review>> => {
    const res = await apiClient.patch<ApiResponse<Review>>(`/reviews/${id}/approve`, { isApproved });
    return res.data;
  },
  deleteReview: async (id: number | string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/reviews/${id}`);
    return res.data;
  }
};

// Company Services
export const companyApi = {
  get: async (): Promise<ApiResponse<Company>> => {
    const res = await apiClient.get<ApiResponse<Company>>('/company');
    return res.data;
  },
  update: async (data: Partial<Company>): Promise<ApiResponse<Company>> => {
    const res = await apiClient.put<ApiResponse<Company>>('/company', data);
    return res.data;
  }
};

// FAQ Services
export const faqApi = {
  getAll: async (): Promise<ApiResponse<FAQ[]>> => {
    const res = await apiClient.get<ApiResponse<FAQ[]>>('/faqs');
    return res.data;
  },
  create: async (data: { question: string; answer: string; category?: string; sortOrder?: number }): Promise<ApiResponse<FAQ>> => {
    const res = await apiClient.post<ApiResponse<FAQ>>('/faqs', data);
    return res.data;
  },
  update: async (id: number | string, data: Partial<FAQ>): Promise<ApiResponse<FAQ>> => {
    const res = await apiClient.put<ApiResponse<FAQ>>(`/faqs/${id}`, data);
    return res.data;
  },
  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/faqs/${id}`);
    return res.data;
  }
};

// Feedback Services
export const feedbackApi = {
  submit: async (data: { name: string; email: string; rating: number; message: string }): Promise<ApiResponse<WebsiteFeedback>> => {
    const res = await apiClient.post<ApiResponse<WebsiteFeedback>>('/feedback', data);
    return res.data;
  },
  getAll: async (): Promise<ApiResponse<WebsiteFeedback[]>> => {
    const res = await apiClient.get<ApiResponse<WebsiteFeedback[]>>('/feedback');
    return res.data;
  }
};

// Comparison Services
export const comparisonApi = {
  getAll: async (): Promise<ApiResponse<ComparisonProduct[]>> => {
    const res = await apiClient.get<ApiResponse<ComparisonProduct[]>>('/comparisons');
    return res.data;
  },
  getByProduct: async (productId: number | string): Promise<ApiResponse<ComparisonProduct[]>> => {
    const res = await apiClient.get<ApiResponse<ComparisonProduct[]>>(`/comparisons/product/${productId}`);
    return res.data;
  },
  create: async (data: Partial<ComparisonProduct>): Promise<ApiResponse<ComparisonProduct>> => {
    const res = await apiClient.post<ApiResponse<ComparisonProduct>>('/comparisons', data);
    return res.data;
  },
  update: async (id: number | string, data: Partial<ComparisonProduct>): Promise<ApiResponse<ComparisonProduct>> => {
    const res = await apiClient.put<ApiResponse<ComparisonProduct>>(`/comparisons/${id}`, data);
    return res.data;
  },
  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/comparisons/${id}`);
    return res.data;
  }
};

// Admin Services
export const adminApi = {
  getMetrics: async (): Promise<ApiResponse<DashboardMetrics>> => {
    const res = await apiClient.get<ApiResponse<DashboardMetrics>>('/admin/metrics');
    return res.data;
  },
  getCustomers: async (): Promise<ApiResponse<User[]>> => {
    const res = await apiClient.get<ApiResponse<User[]>>('/admin/customers');
    return res.data;
  }
};

export default apiClient;
