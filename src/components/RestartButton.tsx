import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext'; // NEW: Import useLanguage

interface RestartButtonProps {
  onClick: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ onClick }) => {
  const { t } = useLanguage(); // NEW: Use translation hook

  return (
    <Button
      onClick={onClick}
      className="w-11/12 max-w-md py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center space-x-2" // Adjusted width for mobile
    >
      <RotateCcw className="h-5 w-5" />
      <span>{t('restartGame')}</span>
    </Button>
  );
};

export default RestartButton;