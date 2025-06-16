
import { useMemo } from 'react';

export interface OptimizedService {
  id: string;
  name: string;
  description: string;
  category: 'certificates'|'licenses'|'permits'|'payments'|'utilities';
  required_documents: string[];
  processing_time: string;
  fees: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Static list of Gram Panchayat services
const STATIC_SERVICES: OptimizedService[] = [
  {
    id: '1',
    name: 'Birth Certificate',
    description: 'Official document issued by Gram Panchayat as proof of birth.',
    category: 'certificates',
    required_documents: ['Birth Affidavit', 'Hospital Report', 'Parent ID proof'],
    processing_time: '7 days',
    fees: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    name: 'Caste Certificate',
    description: 'Certificate for caste identification for reservation and other government purposes.',
    category: 'certificates',
    required_documents: ['Application form', 'Parent Caste certificate', 'Residence proof'],
    processing_time: '7 days',
    fees: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    name: 'Residence Certificate',
    description: 'Proof of residence in the Gram Panchayat jurisdiction.',
    category: 'certificates',
    required_documents: ['Ration card', 'Aadhaar card', 'Voter ID'],
    processing_time: '5 days',
    fees: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    name: 'Property Tax Payment',
    description: 'Facility to pay property taxes online.',
    category: 'payments',
    required_documents: ['Property ID', 'Previous tax receipt'],
    processing_time: 'Instant',
    fees: 100,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '5',
    name: 'Trade License',
    description: 'License issued by Gram Panchayat to run businesses within the village area.',
    category: 'licenses',
    required_documents: ['Business proof', 'Owner ID', 'Address proof'],
    processing_time: '10 days',
    fees: 200,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '6',
    name: 'Water Connection',
    description: 'Request new water connections for homes and businesses.',
    category: 'utilities',
    required_documents: ['Property papers', 'Residence proof'],
    processing_time: '10 days',
    fees: 200,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '7',
    name: 'NOC for Land Sale',
    description: 'No Objection Certificate from Gram Panchayat for land sale/transfer.',
    category: 'permits',
    required_documents: ['Sale deed', 'Land documents', 'Applicant’s ID proof'],
    processing_time: '7 days',
    fees: 100,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '8',
    name: 'Marriage Certificate',
    description: 'Certificate validating marriage registered at the Gram Panchayat.',
    category: 'certificates',
    required_documents: ['Marriage application', 'Photographs', 'ID proof of couple and witnesses'],
    processing_time: '10 days',
    fees: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  // You can add more services here as needed
];

// Hook to get static services. Mimic react-query's return shape.
export const useOptimizedServices = () => {
  return {
    data: STATIC_SERVICES,
    isLoading: false,
    error: null,
  };
};

// Memoized service filtering hook
export const useFilteredServices = (
  services: OptimizedService[], 
  searchTerm: string, 
  selectedCategory: string
) => {
  return useMemo(() => {
    if (!services) return [];

    return services.filter(service => {
      const matchesSearch =
        !searchTerm ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);
};

// Hook for stats
export const useServiceStats = (services: OptimizedService[]) => {
  return useMemo(() => {
    if (!services) return { total: 0, byCategory: {}, freeServices: 0, paidServices: 0 };

    const byCategory = services.reduce((acc, service) => {
      acc[service.category] = (acc[service.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: services.length,
      byCategory,
      freeServices: services.filter(s => s.fees === 0).length,
      paidServices: services.filter(s => s.fees > 0).length,
    };
  }, [services]);
};
