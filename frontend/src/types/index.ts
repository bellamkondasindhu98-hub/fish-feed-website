export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ProductStatus = 'IN_STOCK' | 'OUT_OF_STOCK';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  packSize: string;
  image: string;
  category: string;
  fishType: string;
  protein: number;
  fat: number;
  feedType: string;
  recommendedFishSize: string;
  feedingInstructions: string;
  stock: number;
  status: ProductStatus;
  avgRating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  productName?: string;
  productImage?: string;
  rating: number;
  comment: string;
  isApproved: number;
  createdAt: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
}

export interface Company {
  id: number;
  companyName: string;
  logo: string;
  description: string;
  gstNumber: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  ceoName: string;
  ceoImage: string;
  ceoPhone: string;
  ceoEmail: string;
  ceoBio: string;
  mission: string;
  vision: string;
  whyChooseUs: WhyChooseUsItem[];
  updatedAt?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebsiteFeedback {
  id: number;
  userId?: number;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
}

export interface ComparisonProduct {
  id: number;
  productId: number;
  productName?: string;
  competitorName: string;
  competitorProductName: string;
  price: number;
  ourPrice?: number;
  packSize: string;
  protein: number;
  ourProtein?: number;
  fat: number;
  ourFat?: number;
  fishType: string;
  feedType: string;
  rating: number;
  source: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  totalCustomers: number;
  totalReviews: number;
  totalFeedback: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
