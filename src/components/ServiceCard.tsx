
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, IndianRupee, FileText } from 'lucide-react';
import { Service } from '@/hooks/useServices';

interface ServiceCardProps {
  service: Service;
  onApply: (service: Service) => void;
}

const categoryColors = {
  certificates: 'bg-blue-100 text-blue-800',
  licenses: 'bg-green-100 text-green-800',
  permits: 'bg-yellow-100 text-yellow-800',
  payments: 'bg-red-100 text-red-800',
  utilities: 'bg-purple-100 text-purple-800',
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onApply }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <Badge className={categoryColors[service.category]}>
            {service.category}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {service.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Processing: {service.processing_time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IndianRupee className="h-4 w-4" />
            <span>Fees: ₹{service.fees}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4 mt-0.5" />
            <div>
              <span className="font-medium">Required Documents:</span>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {service.required_documents.map((doc, index) => (
                  <li key={index} className="text-xs">{doc}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onApply(service)} 
          className="w-full"
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};
