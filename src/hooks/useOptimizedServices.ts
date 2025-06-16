
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
  
  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, category, required_documents, processing_time, fees, is_active, created_at, updated_at')
    .eq('is_active', true)
    .order('name')
    .limit(50); // Limit results for better performance

  if (error) {
    console.error('Error fetching optimized services:', error);
    // Print detailed error (status code, message)
    if (error.details) {
      console.error('Supabase error details:', error.details);
    }
    if (error.hint) {
      console.error('Supabase error hint:', error.hint);
    }
    throw new Error(`Failed to fetch services: ${error.message}, details: ${JSON.stringify(error)}`);
  }
  if (!data) {
    console.error('No data returned from Supabase (data is null or undefined).');
    throw new Error('No data returned from Supabase.');
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
