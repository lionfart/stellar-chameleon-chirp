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
      className="w-11/12 max-w-sm py-2 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center space-x-2" // Adjusted width, padding, and font size for mobile
    >
      <RotateCcw className="h-4 w-4" /> {/* İkon boyutu küçültüldü */}
      <span>{t('restartGame')}</span>
    </Button>
  );
};

export default RestartButton;