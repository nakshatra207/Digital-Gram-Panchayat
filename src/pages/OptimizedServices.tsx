
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// UI and component imports
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Custom UI components for service list, search, and header
import { OptimizedServiceCard } from '@/components/OptimizedServiceCard';
import { OptimizedSearch } from '@/components/OptimizedSearch';
import { OptimizedLoader } from '@/components/OptimizedLoader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOptimizedServices, useFilteredServices, useServiceStats } from '@/hooks/useStaticServices';

// Modular page-header and info section
import { OptimizedServicesHeader } from '@/components/OptimizedServicesHeader';
import { OptimizedServicesPageHeader } from '@/components/OptimizedServicesPageHeader';
import { OptimizedServicesStats } from '@/components/OptimizedServicesStats';
import { OptimizedServicesInfoSection } from '@/components/OptimizedServicesInfoSection';

/**
 * Main component for displaying all available Gram Panchayat services.
 * Allows users to search/filter services and view details. No data is fetched
 * from network; everything is preloaded via custom hooks for speed and offline use.
 */
const OptimizedServices = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // State for search and filter UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Static list of services (no API call)
  const { data: services } = useOptimizedServices();

  // Memoize the categories to prevent recomputation on re-render
  const categories = useMemo(() => {
    if (!services) return [];
    return [...new Set(services.map(service => service.category))];
  }, [services]);

  // Compute filtered service list and stats summary
  const filteredServices = useFilteredServices(services || [], searchTerm, selectedCategory);
  const stats = useServiceStats(services || []);

  // Debounced update handlers to avoid unnecessary re-render/calc
  const handleSearchChange = useCallback((newSearchTerm: string) => setSearchTerm(newSearchTerm), []);
  const handleCategoryChange = useCallback((newCategory: string) => setSelectedCategory(newCategory), []);

  // On clicking 'Apply', will navigate the user to registration
  const handleApply = useCallback(() => navigate('/register'), [navigate]);

  // Clear filters button resets search and category selection
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
  }, []);

  // Main render
  // No loading/error states: the data is static
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Decorative page header */}
      <OptimizedServicesHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Big title and subtitle */}
        <OptimizedServicesPageHeader />

        {/* Search inputs and service statistics */}
        <Card className="mb-8 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-green-50">
          <CardContent className="pt-6">
            <OptimizedSearch
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              categories={categories}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
            />
            <OptimizedServicesStats
              filteredCount={filteredServices.length}
              freeServices={stats.freeServices}
              total={stats.total}
            />
          </CardContent>
        </Card>

        {/* Service cards grid */}
        {filteredServices.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredServices.map((service) => (
              <OptimizedServiceCard
                key={service.id}
                service={service}
                onApply={handleApply}
              />
            ))}
          </div>
        )}

        {/* Shown when no matching services found */}
        {filteredServices.length === 0 && services && services.length > 0 && (
          <div className="text-center py-12 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border-2 border-orange-200">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Found</h3>
              <p className="text-gray-600 mb-4">
                Please adjust your search criteria or browse all categories.
              </p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Extra info/help on process */}
        <OptimizedServicesInfoSection />
      </div>
    </div>
  );
};

export default OptimizedServices;

