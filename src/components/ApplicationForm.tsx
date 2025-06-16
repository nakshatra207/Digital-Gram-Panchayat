
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Service } from '@/hooks/useServices';
import { useCreateApplication } from '@/hooks/useApplications';

interface ApplicationFormProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ service, isOpen, onClose }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createApplication = useCreateApplication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setIsSubmitting(true);
    try {
      await createApplication.mutateAsync({
        service_id: service.id,
        application_data: formData,
        documents_uploaded: [],
      });
      onClose();
      setFormData({});
    } catch (error) {
      console.error('Application submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for {service.name}</DialogTitle>
          <DialogDescription>
            Please fill in the required information for your application.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="applicant-name">Full Name</Label>
            <Input
              id="applicant-name"
              value={formData.applicant_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-number">Contact Number</Label>
            <Input
              id="contact-number"
              type="tel"
              value={formData.contact_number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose/Reason</Label>
            <Textarea
              id="purpose"
              value={formData.purpose || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              placeholder="Please specify the reason for this application"
              required
            />
          </div>

          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
            <strong>Required Documents:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {service.required_documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-orange-600">
              Note: Please have these documents ready. You may need to visit the office with original documents.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
