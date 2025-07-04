import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/OptimizedAuthContext';
import { useMemo } from 'react';

export interface OptimizedApplication {
  id: string;
  citizen_id: string;
  service_id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';
  application_data: Record<string, any>;
  documents_uploaded: string[];
  assigned_to?: string;
  remarks?: string;
  submitted_at: string;
  updated_at: string;
  completed_at?: string;
  service?: {
    name: string;
    category: string;
    fees: number;
    processing_time: string;
  };
  citizen?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

// Optimized applications fetching with better caching
export const useOptimizedApplications = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['optimized-applications', profile?.role, profile?.id],
    queryFn: async () => {
      if (!profile) {
        throw new Error('User profile not available');
      }

      console.log(`Fetching optimized applications for ${profile.role}:`, profile.id);
      
      let query = supabase
        .from('applications')
        .select(`
          id,
          citizen_id,
          service_id,
          status,
          submitted_at,
          updated_at,
          completed_at,
          service:services(name, category, fees, processing_time),
          citizen:profiles!applications_citizen_id_fkey(full_name, email, phone)
        `);

      // Apply role-based filtering with optimized queries
      switch (profile.role) {
        case 'citizen':
          query = query.eq('citizen_id', profile.id);
          break;
        case 'staff':
          query = query.or(`assigned_to.eq.${profile.id},assigned_to.is.null`);
          break;
        case 'officer':
          // Officers can see all applications - no additional filter
          break;
        default:
          throw new Error('Invalid user role');
      }

      const { data, error } = await query
        .order('submitted_at', { ascending: false })
        .limit(25); // Reduced limit for better performance

      if (error) {
        console.error('Error fetching optimized applications:', error);
        throw new Error(`Failed to fetch applications: ${error.message}`);
      }
      
      console.log(`Successfully fetched ${data?.length || 0} optimized applications`);
      return data as OptimizedApplication[];
    },
    enabled: !!profile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
};

// Optimized application statistics with memoization
export const useOptimizedApplicationStats = () => {
  const { profile } = useAuth();
  const { data: applications } = useOptimizedApplications();

  return useMemo(() => {
    if (!applications) {
      return {
        total: 0,
        pending: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
      };
    }

    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      under_review: applications.filter(app => app.status === 'under_review').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      completed: applications.filter(app => app.status === 'completed').length,
    };

    console.log('Optimized application statistics:', stats);
    return stats;
  }, [applications]);
};

// Batch application updates for better performance
export const useBatchUpdateApplications = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (updates: Array<{
      id: string;
      status: OptimizedApplication['status'];
      remarks?: string;
    }>) => {
      if (!profile || profile.role === 'citizen') {
        throw new Error('अनधिकृत पहुंच');
      }

      console.log('Batch updating applications:', updates.length);
      
      const promises = updates.map(update => 
        supabase
          .from('applications')
          .update({
            status: update.status,
            updated_at: new Date().toISOString(),
            ...(update.remarks && { remarks: update.remarks }),
            ...(profile.role === 'staff' && { assigned_to: profile.id }),
          })
          .eq('id', update.id)
      );

      const results = await Promise.all(promises);
      
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(`Batch update failed: ${errors[0].error?.message}`);
      }
      
      console.log('Batch update completed successfully');
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimized-applications'] });
      toast({
        title: "बल्क अपडेट सफल",
        description: "सभी आवेदन सफलतापूर्वक अपडेट किए गए",
      });
    },
    onError: (error: Error) => {
      console.error('Batch update failed:', error);
      toast({
        title: "बल्क अपडेट त्रुटि",
        description: error.message || "बल्क अपडेट असफल",
        variant: "destructive",
      });
    },
  });
};
