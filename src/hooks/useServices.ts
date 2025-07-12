
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'certificates'|'licenses'|'permits'|'payments'|'utilities';
  required_documents: string[];
  processing_time: string;
  fees: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useServices = () => {
  return useQuery({
    queryKey: ['active-services'],
    queryFn: async () => {
      console.log('Fetching active services from database...');
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured - returning demo services');
        return [
          {
            id: 'demo-service-1',
            name: 'Birth Certificate',
            description: 'Official document issued by Gram Panchayat as proof of birth.',
            category: 'certificates' as const,
            required_documents: ['Birth Affidavit', 'Hospital Report', 'Parent ID proof'],
            processing_time: '7 days',
            fees: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ] as Service[];
      }
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching services:', error);
        console.warn('Returning demo services due to error');
        return [
          {
            id: 'demo-service-1',
            name: 'Birth Certificate',
            description: 'Official document issued by Gram Panchayat as proof of birth.',
            category: 'certificates' as const,
            required_documents: ['Birth Affidavit', 'Hospital Report', 'Parent ID proof'],
            processing_time: '7 days',
            fees: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ] as Service[];
      }
      
      console.log(`Successfully fetched ${data?.length || 0} active services`);
      return data as Service[];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating new service:', serviceData.name);
      
      // Validate required fields
      if (!serviceData.name?.trim()) {
        throw new Error('Service name is required');
      }
      if (!serviceData.description?.trim()) {
        throw new Error('Service description is required');
      }
      if (!serviceData.processing_time?.trim()) {
        throw new Error('Processing time is required');
      }
      
      const { data, error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          name: serviceData.name.trim(),
          description: serviceData.description.trim(),
          processing_time: serviceData.processing_time.trim(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating service:', error);
        throw new Error(`Failed to create service: ${error.message}`);
      }
      
      console.log('Successfully created service:', data.name);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['active-services'] });
      queryClient.invalidateQueries({ queryKey: ['all-services'] });
      toast({
        title: "सेवा सफलतापूर्वक बनाई गई",
        description: `${data.name} को सफलतापूर्वक जोड़ा गया है`,
      });
    },
    onError: (error: Error) => {
      console.error('Service creation failed:', error);
      toast({
        title: "सेवा बनाने में त्रुटि",
        description: error.message || "सेवा बनाने में असफल",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Service> }) => {
      console.log('Updating service:', id);
      
      const { data, error } = await supabase
        .from('services')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating service:', error);
        throw new Error(`Failed to update service: ${error.message}`);
      }
      
      console.log('Successfully updated service:', data.name);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['active-services'] });
      queryClient.invalidateQueries({ queryKey: ['all-services'] });
      toast({
        title: "सेवा अपडेट की गई",
        description: `${data.name} को सफलतापूर्वक अपडेट किया गया है`,
      });
    },
    onError: (error: Error) => {
      console.error('Service update failed:', error);
      toast({
        title: "सेवा अपडेट करने में त्रुटि",
        description: error.message || "सेवा अपडेट करने में असफल",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      console.log('Deactivating service:', serviceId);
      
      // Don't actually delete, just deactivate
      const { data, error } = await supabase
        .from('services')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', serviceId)
        .select()
        .single();

      if (error) {
        console.error('Error deactivating service:', error);
        throw new Error(`Failed to deactivate service: ${error.message}`);
      }
      
      console.log('Successfully deactivated service:', data.name);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['active-services'] });
      queryClient.invalidateQueries({ queryKey: ['all-services'] });
      toast({
        title: "सेवा निष्क्रिय की गई",
        description: `${data.name} को सफलतापूर्वक निष्क्रिय किया गया है`,
      });
    },
    onError: (error: Error) => {
      console.error('Service deactivation failed:', error);
      toast({
        title: "सेवा निष्क्रिय करने में त्रुटि",
        description: error.message || "सेवा निष्क्रिय करने में असफल",
        variant: "destructive",
      });
    },
  });
};
