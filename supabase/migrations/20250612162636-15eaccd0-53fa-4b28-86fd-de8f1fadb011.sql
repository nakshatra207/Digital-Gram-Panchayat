
-- Create enum types for better data integrity
CREATE TYPE public.application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'completed');
CREATE TYPE public.service_category AS ENUM ('certificates', 'licenses', 'permits', 'payments', 'utilities');
CREATE TYPE public.user_role AS ENUM ('officer', 'staff', 'citizen');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role user_role NOT NULL DEFAULT 'citizen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  required_documents TEXT[] NOT NULL DEFAULT '{}',
  processing_time TEXT NOT NULL,
  fees INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  application_data JSONB NOT NULL DEFAULT '{}',
  documents_uploaded TEXT[] DEFAULT '{}',
  assigned_to UUID REFERENCES public.profiles(id),
  remarks TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create application_history table for tracking status changes
CREATE TABLE public.application_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  status application_status NOT NULL,
  changed_by UUID NOT NULL REFERENCES public.profiles(id),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff and officers can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('officer', 'staff')
    )
  );

-- RLS Policies for services
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Officers can manage services" ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'officer'
    )
  );

-- RLS Policies for applications
CREATE POLICY "Citizens can view their own applications" ON public.applications
  FOR SELECT USING (citizen_id = auth.uid());

CREATE POLICY "Citizens can create applications" ON public.applications
  FOR INSERT WITH CHECK (citizen_id = auth.uid());

CREATE POLICY "Staff and officers can view all applications" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('officer', 'staff')
    )
  );

CREATE POLICY "Staff and officers can update applications" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('officer', 'staff')
    )
  );

-- RLS Policies for application_history
CREATE POLICY "Users can view application history" ON public.application_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id AND (
        a.citizen_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('officer', 'staff')
        )
      )
    )
  );

CREATE POLICY "Staff and officers can create application history" ON public.application_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('officer', 'staff')
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email,
    'citizen'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial services data
INSERT INTO public.services (name, description, category, required_documents, processing_time, fees) VALUES
('Birth Certificate', 'Official birth certificate issuance for legal purposes', 'certificates', ARRAY['Hospital Certificate', 'Parent ID Proof', 'Address Proof'], '7 working days', 50),
('Income Certificate', 'Income certificate for government schemes and applications', 'certificates', ARRAY['Salary Certificate', 'Bank Statement', 'ID Proof'], '10 working days', 30),
('Caste Certificate', 'Caste certificate for reservations and government schemes', 'certificates', ARRAY['ID Proof', 'Address Proof', 'Family Records'], '15 working days', 40),
('Business License', 'License for small business operations', 'licenses', ARRAY['Business Plan', 'ID Proof', 'Address Proof'], '20 working days', 200),
('Water Connection', 'New water connection application', 'utilities', ARRAY['Property Documents', 'ID Proof', 'Site Plan'], '21 working days', 500),
('Building Permission', 'Permission for construction or renovation', 'permits', ARRAY['Site Plan', 'Property Documents', 'NOC'], '30 working days', 1000);
