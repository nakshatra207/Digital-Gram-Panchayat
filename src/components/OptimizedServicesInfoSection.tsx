
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const OptimizedServicesInfoSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-12 text-center">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-300">
        <CardContent className="pt-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-2xl">🏛️</span>
              <h3 className="text-lg font-semibold text-blue-900">
                Ready to Get Started?
              </h3>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-blue-800 mb-4">
              Create an account to submit applications, track progress, and access all Gram Panchayat services online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700">
                Create Account
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')} className="border-blue-600 text-blue-700 hover:bg-blue-50">
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
