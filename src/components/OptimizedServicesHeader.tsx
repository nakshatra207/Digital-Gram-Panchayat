
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';

export const OptimizedServicesHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-orange-600 via-white to-green-600 shadow-lg border-b-4 border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-blue-900 hover:bg-blue-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="h-8 w-px bg-blue-300 mx-4" />
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-lg flex items-center justify-center border-2 border-blue-600">
                <span className="text-blue-800 font-bold text-lg">🇮🇳</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">E-Service Portal</h1>
                <p className="text-sm text-blue-800">Browse Available Services</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSelector variant="button" />
            <Button variant="outline" onClick={() => navigate('/login')} className="border-orange-600 text-orange-700 hover:bg-orange-50">
              Login
            </Button>
            <Button onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700">
              Register to Apply
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
