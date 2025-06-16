
import React from 'react';
import { FileText, Home, Users, Briefcase, Zap, Car, GraduationCap, Heart, Shield, Building } from 'lucide-react';

interface ServiceLogoProps {
  category: string;
  serviceName: string;
  className?: string;
}

export const ServiceLogo: React.FC<ServiceLogoProps> = ({ category, serviceName, className = "h-12 w-12" }) => {
  const getServiceIcon = () => {
    const name = serviceName.toLowerCase();
    
    if (name.includes('birth') || name.includes('marriage') || name.includes('death')) {
      return <FileText className={`${className} text-orange-600`} />;
    }
    if (name.includes('income') || name.includes('caste') || name.includes('domicile')) {
      return <Shield className={`${className} text-green-600`} />;
    }
    if (name.includes('property') || name.includes('tax')) {
      return <Home className={`${className} text-blue-600`} />;
    }
    if (name.includes('water') || name.includes('connection')) {
      return <Zap className={`${className} text-cyan-600`} />;
    }
    if (name.includes('business') || name.includes('license') || name.includes('trade')) {
      return <Briefcase className={`${className} text-purple-600`} />;
    }
    if (name.includes('building') || name.includes('construction') || name.includes('permission')) {
      return <Building className={`${className} text-indigo-600`} />;
    }
    if (name.includes('senior') || name.includes('citizen') || name.includes('pension')) {
      return <Heart className={`${className} text-pink-600`} />;
    }
    if (name.includes('driving') || name.includes('vehicle')) {
      return <Car className={`${className} text-gray-600`} />;
    }
    if (name.includes('education') || name.includes('scholarship')) {
      return <GraduationCap className={`${className} text-yellow-600`} />;
    }
    
    // Default based on category
    switch (category) {
      case 'certificates':
        return <FileText className={`${className} text-orange-600`} />;
      case 'licenses':
        return <Briefcase className={`${className} text-purple-600`} />;
      case 'permits':
        return <Building className={`${className} text-indigo-600`} />;
      case 'payments':
        return <Home className={`${className} text-blue-600`} />;
      case 'utilities':
        return <Zap className={`${className} text-cyan-600`} />;
      default:
        return <FileText className={`${className} text-gray-600`} />;
    }
  };

  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-orange-100 to-green-100 p-3 rounded-full border-2 border-orange-200">
        {getServiceIcon()}
      </div>
      <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs">🇮🇳</span>
      </div>
    </div>
  );
};
