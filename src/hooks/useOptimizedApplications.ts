import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
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
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured) {
        console.warn('📋 Supabase not configured - returning demo applications');
        const demoApps = [
          {
            id: 'demo-1',
            citizen_id: 'demo-user-id',
            service_id: 'demo-service-1',
            status: 'pending',
            application_data: { applicant_name: 'Demo User', purpose: 'Demo Application' },
            documents_uploaded: [],
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            service: {
              name: 'Birth Certificate',
              category: 'certificates',
              fees: 0,
              processing_time: '7 days'
            },
            citizen: {
              full_name: 'Demo User',
              email: 'demo@example.com'
            }
          },
          {
            id: 'demo-2', 
            citizen_id: 'demo-user-id',
            service_id: 'demo-service-2',
            status: 'approved',
            application_data: { applicant_name: 'Demo User', purpose: 'Demo Application' },
            documents_uploaded: [],
            submitted_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date().toISOString(),
            service: {
              name: 'Caste Certificate',
              category: 'certificates',
              fees: 0,
              processing_time: '10 days'
            },
            citizen: {
              full_name: 'Demo User',
              email: 'demo@example.com'
            }
          },
          {
            id: 'demo-3',
            citizen_id: 'demo-user-id',
            service_id: 'demo-service-3',
            status: 'completed',
            application_data: { applicant_name: 'Demo User', purpose: 'Demo Application' },
            documents_uploaded: [],
            submitted_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date().toISOString(),
            completed_at: new Date(Date.now() - 86400000).toISOString(),
            service: {
              name: 'Income Certificate',
              category: 'certificates',
              fees: 30,
              processing_time: '5 days'
            },
            citizen: {
              full_name: 'Demo User',
              email: 'demo@example.com'
            }
          }
        ];
        return demoApps as OptimizedApplication[];
      }

      if (!profile) {
        throw new Error('User profile not available');
      }

      console.log(`Fetching optimized applications for ${profile.role}:`, profile.id);
      
      try {
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
          console.warn('Supabase error, using demo data:', error);
          const fallbackApps = [
            {
              id: 'demo-1',
              citizen_id: profile?.id || 'demo-user-id',
              service_id: 'demo-service-1',
              status: 'pending',
              application_data: { applicant_name: profile?.full_name || 'Demo User' },
              documents_uploaded: [],
              submitted_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              service: {
                name: 'Birth Certificate',
                category: 'certificates',
                fees: 0,
                processing_time: '7 days'
              },
              citizen: {
                full_name: profile?.full_name || 'Demo User',
                email: profile?.email || 'demo@example.com'
              }
            }
          ];
          return fallbackApps as OptimizedApplication[];
        }
        
        console.log(`Successfully fetched ${data?.length || 0} optimized applications`);
        return data as OptimizedApplication[];
      } catch (error) {
        console.warn('Error fetching applications, using demo data:', error);
        const errorFallbackApps = [
          {
            id: 'demo-1',
            citizen_id: profile?.id || 'demo-user-id',
            service_id: 'demo-service-1',
            status: 'pending',
            application_data: { applicant_name: profile?.full_name || 'Demo User' },
            documents_uploaded: [],
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            service: {
              name: 'Birth Certificate',
              category: 'certificates',
              fees: 0,
              processing_time: '7 days'
            },
            citizen: {
              full_name: profile?.full_name || 'Demo User',
              email: profile?.email || 'demo@example.com'
            }
          },
          {
            id: 'demo-2',
            citizen_id: profile?.id || 'demo-user-id',
            service_id: 'demo-service-2',
            status: 'under_review',
            application_data: { applicant_name: profile?.full_name || 'Demo User' },
            documents_uploaded: [],
            submitted_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date().toISOString(),
            service: {
              name: 'Income Certificate',
              category: 'certificates',
              fees: 30,
              processing_time: '10 days'
            },
            citizen: {
              full_name: profile?.full_name || 'Demo User',
              email: profile?.email || 'demo@example.com'
            }
          }
        ];
        return errorFallbackApps as OptimizedApplication[];
      }
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