import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/Progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Shield, Gem, Clock, Swords, Bomb, Footprints, PlusCircle, Crown, Hourglass, User } from 'lucide-react';
import CooldownDisplay from './CooldownDisplay';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export interface HUDProps {
  playerName: string;
  playerHealth: number;
  playerMaxHealth: number;
  playerLevel: number;
  playerExperience: number;
  playerExperienceToNextLevel: number;
  playerGold: number;
  shieldActive: boolean;
  shieldCurrentHealth: number;
  shieldMaxHealth: number;
  waveNumber: number;
  waveTimeRemaining: number;
  dashCooldownCurrent: number;
  dashCooldownMax: number;
  explosionCooldownCurrent: number;
  explosionCooldownMax: number;
  shieldCooldownCurrent: number;
  shieldCooldownMax: number;
  healCooldownCurrent: number;
  healCooldownMax: number;
  timeSlowCooldownCurrent: number;
  timeSlowCooldownMax: number;

  bossActive: boolean;
  bossHealth: number;
  bossMaxHealth: number;
  bossName: string;

  collectedLetters: string[];
  gameWon: boolean;
  gameOver: boolean;
  isMobile: boolean;
}

const HUD: React.FC<HUDProps> = ({
  playerName,
  playerHealth,
  playerMaxHealth,
  playerLevel,
  playerExperience,
  playerExperienceToNextLevel,
  playerGold,
  shieldActive,
  shieldCurrentHealth,
  shieldMaxHealth,
  waveNumber,
  waveTimeRemaining,
  dashCooldownCurrent,
  dashCooldownMax,
  explosionCooldownCurrent,
  explosionCooldownMax,
  shieldCooldownCurrent,
  shieldCooldownMax,
  healCooldownCurrent,
  healCooldownMax,
  timeSlowCooldownCurrent,
  timeSlowCooldownMax,
  bossActive,
  bossHealth,
  bossMaxHealth,
  bossName,
  collectedLetters,
  gameWon,
  gameOver,
  isMobile,
}) => {
  const { t } = useLanguage();

  const healthPercentage = (playerHealth / playerMaxHealth) * 100;
  const xpPercentage = (playerExperience / playerExperienceToNextLevel) * 100;
  const shieldPercentage = shieldMaxHealth > 0 ? (shieldCurrentHealth / shieldMaxHealth) * 100 : 0;
  const bossHealthPercentage = bossMaxHealth > 0 ? (bossHealth / bossMaxHealth) * 100 : 0;

  const princessName = ['S', 'I', 'M', 'G', 'E'];

  return (
    <>
      {/* Sol Üst HUD - Oyuncu İstatistikleri */}
      <div className="absolute top-1 left-1 flex flex-col space-y-1 pointer-events-none z-40">
        <Card className="bg-background/90 backdrop-blur-md p-1 shadow-xl border border-solid border-primary/20 w-full max-w-[160px] max-h-[calc(50vh-0.5rem)] overflow-y-auto">
          <CardContent className="p-0 space-y-1">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-white truncate">{playerName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <div className="flex-1">
                <Progress value={healthPercentage} className="h-1.5" indicatorClassName="bg-red-500" />
                <span className="text-[0.65rem] text-muted-foreground">{playerHealth}/{playerMaxHealth} HP</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <Progress value={xpPercentage} className="h-1.5" indicatorClassName="bg-blue-500" />
                <span className="text-[0.65rem] text-muted-foreground">{playerExperience}/{playerExperienceToNextLevel} XP</span>
              </div>
              <Badge variant="secondary" className="text-[0.65rem]">{t('levelUpShort')} {playerLevel}</Badge>
            </div>

            <div className="flex items-center space-x-1">
              <Gem className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium">{playerGold} {t('gold')}</span>
            </div>

            {shieldMaxHealth > 0 && (
              <div className="flex items-center space-x-1">
                <Shield className={`h-4 w-4 ${shieldActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                <div className="flex-1">
                  <Progress value={shieldPercentage} className="h-1.5" indicatorClassName="bg-cyan-400" />
                  <span className="text-[0.65rem] text-muted-foreground">
                    {shieldActive ? `${shieldCurrentHealth}/${shieldMaxHealth} ${t('shield')}` : t('shieldInactive')}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Yetenek Bekleme Süreleri (Sadece masaüstü için) */}
        {!isMobile && (
          <Card className="bg-background/90 backdrop-blur-md p-2 shadow-xl border border-solid border-primary/20 max-w-sm w-full md:w-auto max-h-[calc(50vh-1rem)] overflow-y-auto">
            <CardContent className="p-0 space-y-1">
              <CooldownDisplay
                Icon={Footprints}
                name={t('dash')}
                currentCooldown={dashCooldownCurrent}
                maxCooldown={dashCooldownMax}
                colorClass="text-purple-500"
                iconSizeClass="h-4 w-4"
                progressBarHeightClass="h-4"
              />

              {explosionCooldownMax > 0 && (
                <CooldownDisplay
                  Icon={Bomb}
                  name={t('explosion')}
                  currentCooldown={explosionCooldownCurrent}
                  maxCooldown={explosionCooldownMax}
                  colorClass="text-orange-500"
                  iconSizeClass="h-4 w-4"
                  progressBarHeightClass="h-4"
                />
              )}

              {shieldCooldownMax > 0 && (
                <CooldownDisplay
                  Icon={Shield}
                  name={t('shield')}
                  currentCooldown={shieldCooldownCurrent}
                  maxCooldown={shieldCooldownMax}
                  colorClass="text-blue-500"
                  iconSizeClass="h-4 w-4"
                  progressBarHeightClass="h-4"
                />
              )}

              {healCooldownMax > 0 && (
                <CooldownDisplay
                  Icon={PlusCircle}
                  name={t('heal')}
                  currentCooldown={healCooldownCurrent}
                  maxCooldown={healCooldownMax}
                  colorClass="text-green-500"
                  iconSizeClass="h-4 w-4"
                  progressBarHeightClass="h-4"
                />
              )}

              {timeSlowCooldownMax > 0 && (
                <CooldownDisplay
                  Icon={Hourglass}
                  name={t('timeSlow')}
                  currentCooldown={timeSlowCooldownCurrent}
                  maxCooldown={timeSlowCooldownMax}
                  colorClass="text-indigo-400"
                  iconSizeClass="h-4 w-4"
                  progressBarHeightClass="h-4"
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Üst Orta HUD - Dalga Bilgisi ve Toplanan Harfler */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-none z-40">
        <Card className="bg-background/90 backdrop-blur-md p-1 shadow-xl border border-solid border-primary/20 w-full max-w-[120px] text-center">
          <CardContent className="p-0 space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <Swords className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium">{t('waveText')} {waveNumber}</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-medium">{Math.max(0, Math.floor(waveTimeRemaining))}s</span>
            </div>
            {/* Toplanan Harfler Göstergesi */}
            <div className="flex items-center justify-center space-x-0.5 mt-1">
              <Crown className="h-3 w-3 text-yellow-400" />
              <span className="text-[0.65rem] font-medium text-white">{t('simge')}:</span>
              {princessName.map((letter, index) => (
                <Badge
                  key={index}
                  variant={collectedLetters.includes(letter) ? 'default' : 'outline'}
                  className={`text-[0.65rem] font-bold ${collectedLetters.includes(letter) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400 border-gray-600'}`}
                >
                  {letter}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Üst Sağ HUD - Boss Sağlık Çubuğu */}
      {bossActive && (
        <div className="absolute top-1 right-1 w-full max-w-[160px] pointer-events-none z-40">
          <Card className="bg-background/90 backdrop-blur-md p-1 shadow-xl border border-solid border-red-500/50 text-center">
            <CardContent className="p-0 space-y-1">
              <h3 className="text-xs font-bold text-red-500 truncate">{bossName}</h3>
              <Progress value={bossHealthPercentage} className="h-2" indicatorClassName="bg-red-600" />
              <span className="text-[0.65rem] text-muted-foreground">{bossHealth}/{bossMaxHealth} HP</span>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default HUD;