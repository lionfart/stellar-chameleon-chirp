import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext'; // NEW: Import useLanguage

interface LevelUpSelectionProps {
  onSelectUpgrade: (upgradeId: string) => void;
  options: { id: string; name: string; description: string }[];
}

const LevelUpSelection: React.FC<LevelUpSelectionProps> = ({ onSelectUpgrade, options }) => {
  const { t } = useLanguage(); // NEW: Use translation hook

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"> {/* Added p-4 for mobile padding */}
      <Card className="w-11/12 max-w-md p-4"> {/* Adjusted width for mobile */}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('levelUp')}</CardTitle>
          <p className="text-muted-foreground">{t('chooseUpgrade')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {options.map((option) => (
            <Button
              key={option.id}
              className="w-full h-auto py-3 text-left flex flex-col items-start"
              variant="secondary"
              onClick={() => onSelectUpgrade(option.id)}
            >
              <span className="font-semibold text-lg">{t(option.id as any)}</span>
              <span className="text-sm text-muted-foreground">{t(`${option.id}Desc` as any)}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelUpSelection;