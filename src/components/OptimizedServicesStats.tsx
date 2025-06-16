
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OptimizedServicesStatsProps {
  filteredCount: number;
  freeServices: number;
  total: number;
}

export const OptimizedServicesStats: React.FC<OptimizedServicesStatsProps> = ({
  filteredCount,
  freeServices,
  total
}) => (
  <div className="flex justify-center mt-4 space-x-6">
    <Badge className="bg-orange-100 text-orange-800 border-orange-300 px-3 py-1">
      {filteredCount} services available
    </Badge>
    <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
      {freeServices}+ Free Processing
    </Badge>
    <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-3 py-1">
      {total} Total Services
    </Badge>
  </div>
);
