
import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid3X3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDebounce } from '@/hooks/useDebounce';

interface OptimizedSearchProps {
  onSearchChange: (searchTerm: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
  searchTerm: string;
  selectedCategory: string;
}

export const OptimizedSearch: React.FC<OptimizedSearchProps> = ({
  onSearchChange,
  onCategoryChange,
  categories,
  searchTerm,
  selectedCategory
}) => {
  const { t } = useLanguage();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Debounce search input for better performance
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  
  // Call parent's search handler when debounced value changes
  React.useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    onCategoryChange(value);
  }, [onCategoryChange]);

  // Memoize category options to prevent unnecessary re-renders
  const categoryOptions = useMemo(() => {
    return categories.map(category => (
      <SelectItem key={category} value={category}>
        <div className="flex items-center space-x-2">
          <Grid3X3 className="h-4 w-4" />
          <span>{t(category)}</span>
        </div>
      </SelectItem>
    ));
  }, [categories, t]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-orange-600" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={localSearchTerm}
            onChange={handleSearchInputChange}
            className="pl-10 border-orange-300 focus:border-green-500"
          />
        </div>
      </div>
      <Select value={selectedCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full md:w-64 border-orange-300 focus:border-green-500">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-orange-600" />
            <SelectValue placeholder={t('allCategories')} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allCategories')}</SelectItem>
          {categoryOptions}
        </SelectContent>
      </Select>
    </div>
  );
};
