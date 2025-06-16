
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, IndianRupee, FileText, MapPin } from 'lucide-react';
import { ServiceLogo } from './ServiceLogo';
import { useLanguage } from '@/contexts/LanguageContext';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredDocuments: string[];
  processingTime: string;
  fees: number;
  status: 'active' | 'inactive';
}

interface IndianServiceCardProps {
  service: Service;
  onApply: () => void;
}

const categoryThemes = {
  certificates: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    border: 'border-l-4 border-l-orange-500',
    badge: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  licenses: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    border: 'border-l-4 border-l-purple-500',
    badge: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  permits: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    border: 'border-l-4 border-l-indigo-500',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  payments: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-l-4 border-l-blue-500',
    badge: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  utilities: {
    bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
    border: 'border-l-4 border-l-cyan-500',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  }
};

export const IndianServiceCard: React.FC<IndianServiceCardProps> = ({ service, onApply }) => {
  const { t } = useLanguage();
  const theme = categoryThemes[service.category as keyof typeof categoryThemes] || categoryThemes.certificates;

  return (
    <Card className={`h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-105 ${theme.bg} ${theme.border} border-2`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <ServiceLogo category={service.category} serviceName={service.name} />
          <Badge className={`${theme.badge} border text-xs font-semibold`}>
            {t(service.category)}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
          {service.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-700 leading-relaxed">
          {service.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        {/* Service Details with Indian styling */}
        <div className="bg-white/70 rounded-lg p-3 space-y-3 backdrop-blur-sm">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-gray-700 font-medium">{t('timeRequired')}</span>
            </div>
            <span className="font-semibold text-gray-900">{service.processingTime}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <IndianRupee className="h-4 w-4 text-green-600" />
              <span className="text-gray-700 font-medium">{t('fees')}</span>
            </div>
            <span className="font-semibold text-gray-900">
              {service.fees === 0 ? t('free') : `₹${service.fees}`}
            </span>
          </div>
        </div>

        {/* Required Documents with Indian touch */}
        <div className="bg-white/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-semibold text-gray-800">{t('requiredDocuments')}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {service.requiredDocuments.slice(0, 2).map((doc, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-white/80 text-gray-700">
                {doc}
              </Badge>
            ))}
            {service.requiredDocuments.length > 2 && (
              <Badge variant="secondary" className="text-xs bg-white/80 text-gray-700">
                +{service.requiredDocuments.length - 2} {t('more')}
              </Badge>
            )}
          </div>
        </div>

        {/* Government Office Indicator */}
        <div className="flex items-center space-x-2 text-xs text-gray-600 bg-white/30 rounded p-2">
          <MapPin className="h-3 w-3" />
          <span>{t('govOffice')}</span>
          <span className="ml-auto text-orange-600 font-medium">🇮🇳</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          onClick={onApply}
          className="w-full bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white font-semibold py-3 shadow-lg"
        >
          {t('applyNow')}
        </Button>
      </CardFooter>
    </Card>
  );
};
