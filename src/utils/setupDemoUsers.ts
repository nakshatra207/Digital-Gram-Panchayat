import { supabase } from '@/integrations/supabase/client';

export const setupDemoUsers = async () => {
  // Check if Supabase is properly configured before attempting to create users
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl === 'your_supabase_project_url_here' || 
      supabaseKey === 'your_supabase_anon_key_here' ||
      supabaseUrl === 'https://placeholder.supabase.co' ||
      supabaseKey === 'placeholder-key') {
    console.warn('⚠️ Supabase not configured properly. Skipping demo user setup.');
    console.warn('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
    return;
  }

  console.log('Setting up demo users...');
  
  const demoUsers = [
    {
      email: 'admin@gp.gov.in',
      password: 'admin123',
      full_name: 'Admin Officer',
      role: 'officer' as const,
      phone: '+91-9876543210',
      address: 'Gram Panchayat Office, Main Road'
    },
    {
      email: 'staff@gp.gov.in',
      password: 'staff123',
      full_name: 'Staff Member',
      role: 'staff' as const,
      phone: '+91-9876543211',
      address: 'Gram Panchayat Office, Main Road'
    },
    {
      email: 'citizen@gp.gov.in',
      password: 'citizen123',
      full_name: 'John Citizen',
      role: 'citizen' as const,
      phone: '+91-9876543212',
      address: 'Village Main Street, House No. 123'
    }
  ];

  for (const user of demoUsers) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      // First, try to sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.full_name,
            phone: user.phone,
            address: user.address,
            role: user.role
          },
          emailRedirectTo: undefined // Disable email confirmation for demo users
        }
      });

      if (authError) {
        if (authError.message.includes('Failed to fetch') || authError.message.includes('fetch')) {
          console.error('❌ Cannot connect to Supabase. Please check your configuration.');
          console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly in .env');
          return; // Stop trying to create more users
        }
        if (authError.message.includes('already registered')) {
          console.log(`User ${user.email} already exists`);
          continue;
        } else {
          console.error(`Error creating user ${user.email}:`, authError);
          continue;
        }
      }

      if (authData.user) {
        console.log(`Successfully created user: ${user.email}`);
        
        // Create profile if user was created successfully
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role
          });

        if (profileError) {
          console.error(`Error creating profile for ${user.email}:`, profileError);
        } else {
          console.log(`Profile created for ${user.email}`);
        }
      }
    } catch (error) {
      if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('fetch'))) {
        console.error('❌ Network error: Cannot connect to Supabase');
        console.error('Please verify your Supabase configuration and internet connection');
        return; // Stop trying to create more users
      }
      console.error(`Unexpected error creating user ${user.email}:`, error);
    }
  }
  
  console.log('Demo users setup completed');
};