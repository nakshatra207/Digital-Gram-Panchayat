
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/OptimizedAuthContext';
import { useMemo } from 'react';

export interface Application {
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

// Applications fetching with role filtering
export const useApplications = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['applications', profile?.role, profile?.id],
    queryFn: async () => {
      // Check if Supabase is configured
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured - returning demo applications');
        return [
          {
            id: 'demo-1',
            citizen_id: profile?.id || 'demo-user-id',
            service_id: 'demo-service-1',
            status: 'pending' as const,
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
        ] as Application[];
      }
      
      if (!profile) {
        throw new Error('User profile not available');
      }

      let query = supabase
        .from('applications')
        .select(`
          id,
          citizen_id,
          service_id,
          status,
          application_data,
          documents_uploaded,
          assigned_to,
          remarks,
          submitted_at,
          updated_at,
          completed_at,
          service:services(name, category, fees, processing_time),
          citizen:profiles!applications_citizen_id_fkey(full_name, email, phone)
        `);

      // Role-based filtering
      switch (profile.role) {
        case 'citizen':
          query = query.eq('citizen_id', profile.id);
          break;
        case 'staff':
          query = query.or(`assigned_to.eq.${profile.id},assigned_to.is.null`);
          break;
        case 'officer':
          // Officers see all applications
          break;
        default:
          throw new Error('Invalid user role');
      }

      const { data, error } = await query
        .order('submitted_at', { ascending: false })
        .limit(30);

      if (error) {
        console.warn('Error fetching applications, returning demo data:', error);
        return [
          {
            id: 'demo-1',
            citizen_id: profile?.id || 'demo-user-id',
            service_id: 'demo-service-1',
            status: 'pending' as const,
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
        ] as Application[];
      }
      return data as Application[];
    },
    enabled: !!profile,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0, // Don't retry to avoid repeated errors
  });
};

// Applications stats
export const useApplicationStats = () => {
  const { profile } = useAuth();
  const { data: applications } = useApplications();

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

    return stats;
  }, [applications]);
};

// --- ADD: Create Application Hook ---
/**
 * useCreateApplication
 * Create a new application as a citizen.
 */
export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      service_id: string;
      application_data: Record<string, any>;
      documents_uploaded: string[];
    }) => {
      if (!profile || profile.role !== 'citizen') {
        throw new Error('Only citizens can submit applications');
      }
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            citizen_id: profile.id,
            service_id: input.service_id,
            application_data: input.application_data,
            documents_uploaded: input.documents_uploaded || [],
            status: 'pending',
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();
      if (error) {
        throw new Error(error.message || 'Failed to submit application.');
      }
      return data as Application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: "Submitted!",
        description: "Your application was submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit application.",
        variant: "destructive",
      });
    },
  });
};

// --- ADD: Update Application Hook ---
/**
 * useUpdateApplication
 * Update a single application (staff/officer).
 */
export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Application, 'status' | 'remarks' | 'updated_at' | 'completed_at' | 'assigned_to'>>;
    }) => {
      if (!profile || profile.role === 'citizen') {
        throw new Error('Unauthorized access');
      }
      const { error } = await supabase
        .from('applications')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          ...(profile.role === 'staff' && { assigned_to: profile.id }),
        })
        .eq('id', id);
      if (error) {
        throw new Error(error.message || 'Failed to update application.');
      }
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: "Application Updated",
        description: "Application status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Error",
        description: error.message || "Failed to update application.",
        variant: "destructive",
      });
    },
  });
};

// Batch update applications
export const useBatchUpdateApplications = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (updates: Array<{
      id: string;
      status: Application['status'];
      remarks?: string;
    }>) => {
      if (!profile || profile.role === 'citizen') {
        throw new Error('Unauthorized access');
      }

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

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: "Update Successful",
        description: "All applications updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Batch update failed.",
        variant: "destructive",
      });
    },
  });
};
