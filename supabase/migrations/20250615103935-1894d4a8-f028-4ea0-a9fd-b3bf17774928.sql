
-- Insert example Certificate service
INSERT INTO public.services (name, description, category, required_documents, processing_time, fees, is_active, created_at, updated_at)
VALUES (
  'Birth Certificate',
  'Official document certifying birth registration for residents.',
  'certificates',
  ARRAY['Proof of birth', 'Parent ID', 'Address proof'],
  '2 days',
  0,
  true,
  NOW(),
  NOW()
);

-- Insert example License service
INSERT INTO public.services (name, description, category, required_documents, processing_time, fees, is_active, created_at, updated_at)
VALUES (
  'Shop License',
  'License to operate a shop or small commercial establishment in the village.',
  'licenses',
  ARRAY['Proof of ownership', 'ID proof', 'Photograph'],
  '3 days',
  250,
  true,
  NOW(),
  NOW()
);

-- Insert example Permit service
INSERT INTO public.services (name, description, category, required_documents, processing_time, fees, is_active, created_at, updated_at)
VALUES (
  'Building Permit',
  'Permit approval for residential or commercial construction.',
  'permits',
  ARRAY['Land ownership proof', 'Construction plan', 'No Objection Certificate'],
  '5 days',
  500,
  true,
  NOW(),
  NOW()
);

-- Insert example Payment service
INSERT INTO public.services (name, description, category, required_documents, processing_time, fees, is_active, created_at, updated_at)
VALUES (
  'Property Tax Payment',
  'Pay your annual property tax securely through the E-Service portal.',
  'payments',
  ARRAY['Property ID', 'Owner ID'],
  'Instant',
  1000,
  true,
  NOW(),
  NOW()
);

-- Insert example Utility service
INSERT INTO public.services (name, description, category, required_documents, processing_time, fees, is_active, created_at, updated_at)
VALUES (
  'Water Connection Request',
  'Apply for new water supply connection for households.',
  'utilities',
  ARRAY['ID proof', 'Address proof', 'Site photo'],
  '4 days',
  100,
  true,
  NOW(),
  NOW()
);
