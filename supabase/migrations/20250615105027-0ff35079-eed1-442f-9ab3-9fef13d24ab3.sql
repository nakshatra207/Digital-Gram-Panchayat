
-- Insert sample Gram Panchayat services into the "services" table
INSERT INTO public.services (
  name, description, category, required_documents, processing_time, fees, is_active
) VALUES
  (
    'Birth Certificate',
    'Official document issued by Gram Panchayat as proof of birth.',
    'certificates',
    ARRAY['Birth Affidavit', 'Hospital Report', 'Parent ID proof'],
    '7 days',
    0,
    TRUE
  ),
  (
    'Caste Certificate',
    'Certificate for caste identification for reservation and other government purposes.',
    'certificates',
    ARRAY['Application form', 'Parent Caste certificate', 'Residence proof'],
    '7 days',
    0,
    TRUE
  ),
  (
    'Residence Certificate',
    'Proof of residence in the Gram Panchayat jurisdiction.',
    'certificates',
    ARRAY['Ration card', 'Aadhaar card', 'Voter ID'],
    '5 days',
    0,
    TRUE
  ),
  (
    'Property Tax Payment',
    'Facility to pay property taxes online.',
    'payments',
    ARRAY['Property ID', 'Previous tax receipt'],
    'Instant',
    100,
    TRUE
  ),
  (
    'Trade License',
    'License issued by Gram Panchayat to run businesses within the village area.',
    'licenses',
    ARRAY['Business proof', 'Owner ID', 'Address proof'],
    '10 days',
    200,
    TRUE
  ),
  (
    'Water Connection',
    'Request new water connections for homes and businesses.',
    'utilities',
    ARRAY['Property papers', 'Residence proof'],
    '10 days',
    200,
    TRUE
  ),
  (
    'NOC for Land Sale',
    'No Objection Certificate from Gram Panchayat for land sale/transfer.',
    'permits',
    ARRAY['Sale deed', 'Land documents', 'Applicant’s ID proof'],
    '7 days',
    100,
    TRUE
  ),
  (
    'Marriage Certificate',
    'Certificate validating marriage registered at the Gram Panchayat.',
    'certificates',
    ARRAY['Marriage application', 'Photographs', 'ID proof of couple and witnesses'],
    '10 days',
    0,
    TRUE
  );

-- All services added as "active" by default.
