import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; phone: string; password: string; confirmPassword?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aquagrow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aquagrow_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('aquagrow_token');
      if (savedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('aquagrow_user', JSON.stringify(res.user));
          }
        } catch (err) {
          // Token invalid or expired
          setUser(null);
          setToken(null);
          localStorage.removeItem('aquagrow_token');
          localStorage.removeItem('aquagrow_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (identifier: string, pass: string) => {
    try {
      const res = await authApi.login(identifier, pass);
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('aquagrow_token', res.token);
        localStorage.setItem('aquagrow_user', JSON.stringify(res.user));
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Login failed.' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string; confirmPassword?: string }) => {
    try {
      const res = await authApi.register(data);
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('aquagrow_token', res.token);
        localStorage.setItem('aquagrow_user', JSON.stringify(res.user));
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('aquagrow_token');
      localStorage.removeItem('aquagrow_user');
    }
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('aquagrow_user', JSON.stringify(updated));
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
