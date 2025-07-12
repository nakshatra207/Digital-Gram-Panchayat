import { supabase } from '@/integrations/supabase/client';

export const setupDemoUsers = async () => {
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
      console.error(`Unexpected error creating user ${user.email}:`, error);
    }
  }
  
  console.log('Demo users setup completed');
};