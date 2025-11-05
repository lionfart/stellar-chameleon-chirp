import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
    >
      {language === 'en' ? 'Türkçe' : 'English'}
    </Button>
  );
};

export default LanguageToggle;