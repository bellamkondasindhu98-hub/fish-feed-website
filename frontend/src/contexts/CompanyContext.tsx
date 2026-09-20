import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company } from '../types';
import { companyApi } from '../services/api';

interface CompanyContextType {
  company: Company | null;
  whatsappNumber: string;
  isLoading: boolean;
  refetchCompany: () => Promise<void>;
  updateCompanyState: (updated: Company) => void;
}

const defaultCompany: Company = {
  id: 1,
  companyName: 'AquaGrow Feeds India Pvt. Ltd.',
  logo: '/assets/images/logo.svg',
  description: 'AquaGrow Feeds is a premier Indian aquaculture nutrition company committed to empowering fish and shrimp farmers with scientifically engineered feed formulations.',
  gstNumber: '36AAAAA0000A1Z5',
  address: 'Plot No. 48, Aquaculture Industrial Park, NH-65, Vijayawada - Hyderabad Highway, Andhra Pradesh - 521101, India',
  phone: '+91 866 245 8900',
  email: 'support@aquagrowfeeds.in',
  whatsappNumber: '+919876543210',
  ceoName: 'Dr. Rajesh Varma',
  ceoImage: '/assets/images/ceo.svg',
  ceoPhone: '+91 98765 43210',
  ceoEmail: 'ceo@aquagrowfeeds.in',
  ceoBio: 'Dr. Rajesh Varma is a distinguished aquaculture nutrition specialist with over 22 years of research in Indian carps, Pangasius, and shrimp farming.',
  mission: 'To accelerate sustainable aquaculture across India by providing scientifically balanced, high-conversion fish feeds that maximize farmer profitability.',
  vision: 'To be India’s most trusted and sustainable aquaculture feed partner.',
  whyChooseUs: []
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<Company>(defaultCompany);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCompany = async () => {
    try {
      const res = await companyApi.get();
      if (res.success && res.data) {
        setCompany(res.data);
      }
    } catch (err) {
      console.error('Failed to load company config, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const updateCompanyState = (updated: Company) => {
    setCompany(updated);
  };

  return (
    <CompanyContext.Provider
      value={{
        company,
        whatsappNumber: company.whatsappNumber || '+919876543210',
        isLoading,
        refetchCompany: fetchCompany,
        updateCompanyState
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
