
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage, languageOptions } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'select' | 'button';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'select',
  className = "" 
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  if (variant === 'button') {
    return (
      <div className={`relative group ${className}`}>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-2 border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languageOptions.find(lang => lang.code === currentLanguage)?.nativeName}
          </span>
        </Button>
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-orange-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2">
            <p className="text-xs font-semibold text-gray-600 mb-2 px-2">{t('selectLanguage')}</p>
            {languageOptions.map((language) => (
              <button
                key={language.code}
                onClick={() => setLanguage(language.code as any)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-orange-50 flex justify-between items-center ${
                  currentLanguage === language.code ? 'bg-orange-100 text-orange-800 font-medium' : 'text-gray-700'
                }`}
              >
                <span>{language.nativeName}</span>
                <span className="text-xs text-gray-500">{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Select value={currentLanguage} onValueChange={setLanguage}>
      <SelectTrigger className={`w-40 border-orange-300 focus:border-green-500 ${className}`}>
        <div className="flex items-center space-x-2">
          <Languages className="h-4 w-4 text-orange-600" />
          <SelectValue placeholder={t('selectLanguage')} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border-orange-200 z-50">
        {languageOptions.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex justify-between items-center w-full">
              <span>{language.nativeName}</span>
              <span className="text-xs text-gray-500 ml-2">{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
