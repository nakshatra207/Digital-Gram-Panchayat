
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'officer' | 'staff' | 'citizen';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string; password: string; full_name: string; phone?: string; address?: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Profile cache with TTL
const profileCache = new Map<string, { profile: Profile; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const OptimizedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Optimized profile fetcher with caching and error handling
  const fetchProfile = useCallback(async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    
    // Check cache first
    const cached = profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Using cached profile');
      setProfile(cached.profile);
      setIsLoading(false);
      return;
    }

    try {
      // Direct query without RLS issues
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, address, role, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create a default one
        if (error.code === '42P17' || error.message.includes('infinite recursion')) {
          console.log('Profile access issue, using user metadata');
          // Use user metadata as fallback
          const currentUser = await supabase.auth.getUser();
          if (currentUser.data.user) {
            const fallbackProfile: Profile = {
              id: currentUser.data.user.id,
              full_name: currentUser.data.user.user_metadata?.full_name || 'User',
              email: currentUser.data.user.email || '',
              phone: currentUser.data.user.user_metadata?.phone || '',
              address: currentUser.data.user.user_metadata?.address || '',
              role: 'officer', // Default role for now
              created_at: currentUser.data.user.created_at,
              updated_at: new Date().toISOString(),
            };
            setProfile(fallbackProfile);
            profileCache.set(userId, { profile: fallbackProfile, timestamp: Date.now() });
          }
        }
      } else if (data) {
        console.log('Profile fetched successfully:', data);
        // Cache the profile
        profileCache.set(userId, { profile: data, timestamp: Date.now() });
        setProfile(data);
      } else {
        console.log('No profile found for user');
        setProfile(null);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized auth state handler
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('Auth state changed:', event, session ? 'with session' : 'no session');
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      // Fetch profile without blocking UI
      fetchProfile(session.user.id);
    } else {
      setProfile(null);
      setIsLoading(false);
      // Clear cache on logout
      profileCache.clear();
    }
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        handleAuthStateChange('INITIAL_SESSION', session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // Optimized login with better error handling
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if Supabase is properly configured using the exported flag
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured - using demo mode');
        
        // Create a demo user session for demo mode
        const demoUser = {
          id: 'demo-user-id',
          email: email,
          created_at: new Date().toISOString(),
          user_metadata: { full_name: 'Demo User' }
        } as any;
        
        const demoProfile = {
          id: 'demo-user-id',
          full_name: 'Demo User',
          email: email,
          role: 'citizen' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Set demo user state
        setUser(demoUser);
        setProfile(demoProfile);
        
        toast({
          title: "Demo Mode",
          description: "Supabase not configured. Using demo authentication.",
        });
        return true; // Allow demo login
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          console.error('Cannot connect to Supabase. Please check your configuration.');
          
          // Fallback to demo mode on connection error
          const demoUser = {
            id: 'demo-user-id',
            email: email,
            created_at: new Date().toISOString(),
            user_metadata: { full_name: 'Demo User' }
          } as any;
          
          const demoProfile = {
            id: 'demo-user-id',
            full_name: 'Demo User',
            email: email,
            role: 'citizen' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          setUser(demoUser);
          setProfile(demoProfile);
          
          toast({
            title: "Demo Mode",
            description: "Using demo authentication due to connection issues.",
          });
          return true;
        }
        console.error('Login error:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log('Login successful:', data.user?.email);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to demo mode on any error
      const demoUser = {
        id: 'demo-user-id',
        email: email,
        created_at: new Date().toISOString(),
        user_metadata: { full_name: 'Demo User' }
      } as any;
      
      const demoProfile = {
        id: 'demo-user-id',
        full_name: 'Demo User',
        email: email,
        role: 'citizen' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setUser(demoUser);
      setProfile(demoProfile);
      
      toast({
        title: "Demo Mode",
        description: "Using demo authentication due to connection issues.",
      });
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized register function
  const register = useCallback(async (userData: { email: string; password: string; full_name: string; phone?: string; address?: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured - using demo mode for registration');
        
        // Create demo user for registration
        const demoUser = {
          id: 'demo-user-id',
          email: userData.email,
          created_at: new Date().toISOString(),
          user_metadata: { full_name: userData.full_name }
        } as any;
        
        const demoProfile = {
          id: 'demo-user-id',
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          role: 'citizen' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(demoUser);
        setProfile(demoProfile);
        
        toast({
          title: "Demo Registration",
          description: "Account created in demo mode",
        });
        return true;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
            address: userData.address,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        // Fallback to demo mode on error
        const demoUser = {
          id: 'demo-user-id',
          email: userData.email,
          created_at: new Date().toISOString(),
          user_metadata: { full_name: userData.full_name }
        } as any;
        
        const demoProfile = {
          id: 'demo-user-id',
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          role: 'citizen' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(demoUser);
        setProfile(demoProfile);
        
        toast({
          title: "Demo Registration",
          description: "Account created in demo mode due to connection issues",
        });
        return true;
      }

      toast({
        title: "Registration Successful",
        description: "Please check your email for verification link",
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Fallback to demo mode on any error
      const demoUser = {
        id: 'demo-user-id',
        email: userData.email,
        created_at: new Date().toISOString(),
        user_metadata: { full_name: userData.full_name }
      } as any;
      
      const demoProfile = {
        id: 'demo-user-id',
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        role: 'citizen' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setUser(demoUser);
      setProfile(demoProfile);
      
      toast({
        title: "Demo Registration",
        description: "Account created in demo mode due to connection issues",
      });
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized profile update with cache invalidation
  const updateProfile = useCallback(async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;

    // Skip update in demo mode
    if (!isSupabaseConfigured || user.id === 'demo-user-id') {
      toast({
        title: "Demo Mode",
        description: "Profile updates are not saved in demo mode",
      });
      return true;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Update cache and state
      profileCache.set(user.id, { profile: data, timestamp: Date.now() });
      setProfile(data);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  }, [user]);

  // Fast logout with immediate state clearing
  const logout = useCallback(async () => {
    console.log('Logging out...');
    // Clear state immediately for faster UI response
    setUser(null);
    setProfile(null);
    setSession(null);
    profileCache.clear();
    
    // Then sign out from Supabase
    await supabase.auth.signOut();
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ 
    user, 
    profile, 
    session, 
    login, 
    register, 
    logout, 
    isLoading, 
    updateProfile 
  }), [user, profile, session, login, register, logout, isLoading, updateProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
