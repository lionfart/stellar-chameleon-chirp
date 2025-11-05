import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext'; // NEW: Import useLanguage

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'weapon' | 'ability' | 'consumable';
}

interface ShopScreenProps {
  items: ShopItem[];
  onPurchase: (itemId: string) => void;
  onClose: () => void;
  playerGold: number;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ items, onPurchase, onClose, playerGold }) => {
  const { t } = useLanguage(); // NEW: Use translation hook

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-[600px] p-4 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">{t('vendorShopTitle')}</CardTitle>
          <CardDescription className="text-muted-foreground">{t('currentGold')} {playerGold}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('noItemsAvailable')}</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-md bg-secondary">
                <div>
                  <h3 className="font-semibold text-lg">{t(item.id as any)}</h3> {/* NEW: Translate item name */}
                  <p className="text-sm text-muted-foreground">{t(`${item.id}Desc` as any)}</p> {/* NEW: Translate item description */}
                </div>
                <Button
                  onClick={() => onPurchase(item.id)}
                  disabled={playerGold < item.cost}
                  className="ml-4"
                >
                  {t('buy')} ({item.cost} {t('gold')}) {/* NEW: Translate 'Buy' and 'Gold' */}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopScreen;