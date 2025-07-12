
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

// Prefetch services for better performance
export const prefetchServices = async (queryClient: any) => {
  await queryClient.prefetchQuery({
    queryKey: ['optimized-services'],
    queryFn: fetchServices,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

const fetchServices = async (): Promise<OptimizedService[]> => {
  console.log('Fetching optimized services with caching...');
  
  // Check if Supabase is properly configured
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured - returning empty services array');
    // Return demo services instead of empty array
    const demoServices: OptimizedService[] = [
      {
        id: 'demo-service-1',
        name: 'Birth Certificate',
        description: 'Official document issued by Gram Panchayat as proof of birth.',
        category: 'certificates',
        required_documents: ['Birth Affidavit', 'Hospital Report', 'Parent ID proof'],
        processing_time: '7 days',
        fees: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'demo-service-2',
        name: 'Caste Certificate',
        description: 'Certificate for caste identification for reservation and other government purposes.',
        category: 'certificates',
        required_documents: ['Application form', 'Parent Caste certificate', 'Residence proof'],
        processing_time: '10 days',
        fees: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'demo-service-3',
        name: 'Income Certificate',
        description: 'Certificate for income verification for government schemes and applications.',
        category: 'certificates',
        required_documents: ['Salary slip', 'Bank statement', 'ID proof'],
        processing_time: '5 days',
        fees: 30,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'demo-service-4',
        name: 'Water Connection',
        description: 'Request new water connections for homes and businesses.',
        category: 'utilities',
        required_documents: ['Property papers', 'Residence proof'],
        processing_time: '21 days',
        fees: 500,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'demo-service-5',
        name: 'Trade License',
        description: 'License for operating small businesses within village limits.',
        category: 'licenses',
        required_documents: ['Business plan', 'ID proof', 'Address proof'],
        processing_time: '15 days',
        fees: 200,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    return demoServices;
  }

  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, category, required_documents, processing_time, fees, is_active, created_at, updated_at')
    .eq('is_active', true)
    .order('name')
    .limit(50); // Limit results for better performance

  if (error) {
    console.error('Error fetching optimized services:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      console.error('Cannot connect to Supabase. Please check your configuration.');
      console.error('Returning demo services for demo mode.');
      // Return demo services on connection error
      const demoServices: OptimizedService[] = [
        {
          id: 'demo-service-1',
          name: 'Birth Certificate',
          description: 'Official document issued by Gram Panchayat as proof of birth.',
          category: 'certificates',
          required_documents: ['Birth Affidavit', 'Hospital Report', 'Parent ID proof'],
          processing_time: '7 days',
          fees: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      return demoServices;
    }
    // Print detailed error (status code, message)
    if (error.details) {
      console.error('Supabase error details:', error.details);
    }
    if (error.hint) {
      console.error('Supabase error hint:', error.hint);
    }
    console.error(`Failed to fetch services: ${error.message}, details: ${JSON.stringify(error)}`);
    return []; // Return empty array instead of throwing
  }
  if (!data) {
    console.error('No data returned from Supabase (data is null or undefined).');
    console.error('No data returned from Supabase.');
    return []; // Return empty array instead of throwing
  }
  
  console.log(`Successfully fetched ${data?.length || 0} optimized services`, data);
  return data as OptimizedService[];
};

export const useOptimizedServices = () => {
  return useQuery({
    queryKey: ['optimized-services'],
    queryFn: fetchServices,
    staleTime: 10 * 60 * 1000, // 10 minutes - keep data fresh longer
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Memoized service filtering hook
export const useFilteredServices = (services: OptimizedService[], searchTerm: string, selectedCategory: string) => {
  return useMemo(() => {
    if (!services) return [];
    
    return services.filter(service => {
      const matchesSearch = searchTerm === '' || 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);
};

// Service statistics hook with memoization
export const useServiceStats = (services: OptimizedService[]) => {
  return useMemo(() => {
    if (!services) return { total: 0, byCategory: {} };
    
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
