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
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2"> {/* Padding azaltıldı */}
      <Card className="w-11/12 max-w-sm p-3 relative"> {/* Max-w küçültüldü, padding azaltıldı */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8" // Boyut küçültüldü
          onClick={onClose}
        >
          <X className="h-5 w-5" /> {/* İkon boyutu küçültüldü */}
        </Button>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('vendorShopTitle')}</CardTitle> {/* Font boyutu küçültüldü */}
          <CardDescription className="text-sm text-muted-foreground">{t('currentGold')} {playerGold}</CardDescription> {/* Font boyutu küçültüldü */}
        </CardHeader>
        <CardContent className="space-y-3 max-h-[300px] overflow-y-auto pr-2"> {/* Boşluk ve max-h güncellendi */}
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">{t('noItemsAvailable')}</p> // Font boyutu küçültüldü
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded-md bg-secondary"> {/* Padding azaltıldı */}
                <div>
                  <h3 className="font-medium text-base">{t(item.id as any)}</h3> {/* Font boyutu küçültüldü */}
                  <p className="text-xs text-muted-foreground">{t(`${item.id}Desc` as any)}</p> {/* Font boyutu küçültüldü */}
                </div>
                <Button
                  onClick={() => onPurchase(item.id)}
                  disabled={playerGold < item.cost}
                  className="ml-3 py-1 px-2 text-sm" // Padding ve font boyutu küçültüldü
                >
                  {t('buy')} ({item.cost} {t('gold')})
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