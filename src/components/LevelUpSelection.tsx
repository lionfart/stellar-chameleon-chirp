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
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2"> {/* Padding azaltıldı */}
      <Card className="w-11/12 max-w-sm p-3"> {/* Max-w küçültüldü, padding azaltıldı */}
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('levelUp')}</CardTitle> {/* Font boyutu küçültüldü */}
          <p className="text-sm text-muted-foreground">{t('chooseUpgrade')}</p> {/* Font boyutu küçültüldü */}
        </CardHeader>
        <CardContent className="space-y-3"> {/* Boşluk azaltıldı */}
          {options.map((option) => (
            <Button
              key={option.id}
              className="w-full h-auto py-2 text-left flex flex-col items-start" // Padding azaltıldı
              variant="secondary"
              onClick={() => onSelectUpgrade(option.id)}
            >
              <span className="font-medium text-base">{t(option.id as any)}</span> {/* Font boyutu küçültüldü */}
              <span className="text-xs text-muted-foreground">{t(`${option.id}Desc` as any)}</span> {/* Font boyutu küçültüldü */}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelUpSelection;