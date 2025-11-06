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

  // Masaüstü ve mobil için farklı boyutlar
  const cardMaxWidth = isMobile ? "max-w-[180px]" : "max-w-[200px]";
  const iconSize = isMobile ? "h-4 w-4" : "h-5 w-5";
  const textSize = isMobile ? "text-xs" : "text-sm";
  const progressHeight = isMobile ? "h-1.5" : "h-2";
  const badgeSize = isMobile ? "text-[0.65rem]" : "text-xs";
  const bossCardMaxWidth = isMobile ? "max-w-[160px]" : "max-w-[220px]";

  return (
    <>
      {/* Sol Üst HUD - Oyuncu İstatistikleri */}
      <div className="absolute top-1 left-1 flex flex-col space-y-1 pointer-events-none z-40">
        <Card className={`bg-background/90 backdrop-blur-md p-2 shadow-xl border border-solid border-primary/20 w-full ${cardMaxWidth}`}>
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center space-x-2">
              <User className={`${iconSize} text-gray-400 flex-shrink-0`} />
              <span className={`${textSize} font-medium text-white truncate`}>{playerName}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Heart className={`${iconSize} text-red-500 flex-shrink-0`} />
                <div className="flex-1">
                  <Progress value={healthPercentage} className={progressHeight} indicatorClassName="bg-red-500" />
                </div>
              </div>
              <div className={`${badgeSize} text-muted-foreground ml-7`}>{playerHealth.toFixed(0)}/{playerMaxHealth} HP</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Zap className={`${iconSize} text-blue-500 flex-shrink-0`} />
                <div className="flex-1">
                  <Progress value={xpPercentage} className={progressHeight} indicatorClassName="bg-blue-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className={`${badgeSize} text-muted-foreground ml-7`}>{playerExperience.toFixed(0)}/{playerExperienceToNextLevel} XP</div>
                <Badge variant="secondary" className={`${badgeSize} flex-shrink-0 mr-1`}>{t('levelUpShort')} {playerLevel}</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Gem className={`${iconSize} text-yellow-500 flex-shrink-0`} />
              <span className={`${textSize} font-medium`}>{playerGold} {t('gold')}</span>
            </div>

            {shieldMaxHealth > 0 && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className={`${iconSize} flex-shrink-0 ${shieldActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                  <div className="flex-1">
                    <Progress value={shieldPercentage} className={progressHeight} indicatorClassName="bg-cyan-400" />
                  </div>
                </div>
                <div className={`${badgeSize} text-muted-foreground ml-7`}>
                  {shieldActive ? `${shieldCurrentHealth.toFixed(0)}/${shieldMaxHealth} ${t('shield')}` : t('shieldInactive')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Yetenek Bekleme Süreleri */}
        <Card className={`bg-background/90 backdrop-blur-md p-2 shadow-xl border border-solid border-primary/20 w-full ${cardMaxWidth}`}>
          <CardContent className="p-0 space-y-2">
            <CooldownDisplay
              Icon={Footprints}
              name={t('dash')}
              currentCooldown={dashCooldownCurrent}
              maxCooldown={dashCooldownMax}
              colorClass="text-purple-500"
              iconSizeClass={iconSize}
              progressBarHeightClass={progressHeight}
            />

            {explosionCooldownMax > 0 && (
              <CooldownDisplay
                Icon={Bomb}
                name={t('explosion')}
                currentCooldown={explosionCooldownCurrent}
                maxCooldown={explosionCooldownMax}
                colorClass="text-orange-500"
                iconSizeClass={iconSize}
                progressBarHeightClass={progressHeight}
              />
            )}

            {shieldCooldownMax > 0 && (
              <CooldownDisplay
                Icon={Shield}
                name={t('shield')}
                currentCooldown={shieldCooldownCurrent}
                maxCooldown={shieldCooldownMax}
                colorClass="text-blue-500"
                iconSizeClass={iconSize}
                progressBarHeightClass={progressHeight}
              />
            )}

            {healCooldownMax > 0 && (
              <CooldownDisplay
                Icon={PlusCircle}
                name={t('heal')}
                currentCooldown={healCooldownCurrent}
                maxCooldown={healCooldownMax}
                colorClass="text-green-500"
                iconSizeClass={iconSize}
                progressBarHeightClass={progressHeight}
              />
            )}

            {timeSlowCooldownMax > 0 && (
              <CooldownDisplay
                Icon={Hourglass}
                name={t('timeSlow')}
                currentCooldown={timeSlowCooldownCurrent}
                maxCooldown={timeSlowCooldownMax}
                colorClass="text-indigo-400"
                iconSizeClass={iconSize}
                progressBarHeightClass={progressHeight}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Üst Orta HUD - Dalga Bilgisi ve Toplanan Harfler */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-none z-40">
        <Card className={`bg-background/90 backdrop-blur-md p-2 shadow-xl border border-solid border-primary/20 w-full max-w-[160px] text-center`}>
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Swords className={`${iconSize} text-purple-500`} />
              <span className={`${textSize} font-medium`}>{t('waveText')} {waveNumber}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className={`${iconSize} text-gray-500`} />
              <span className={`${textSize} font-medium`}>{Math.max(0, Math.floor(waveTimeRemaining))}s</span>
            </div>
            {/* Toplanan Harfler Göstergesi */}
            <div className="flex items-center justify-center space-x-1 mt-1">
              <Crown className="h-4 w-4 text-yellow-400 flex-shrink-0" />
              <span className="text-xs font-medium text-white">{t('simge')}:</span>
              {princessName.map((letter, index) => (
                <Badge
                  key={index}
                  variant={collectedLetters.includes(letter) ? 'default' : 'outline'}
                  className={`text-xs font-bold h-5 w-5 p-0 flex items-center justify-center ${collectedLetters.includes(letter) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400 border-gray-600'}`}
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
        <div className={`absolute top-1 right-1 w-full ${bossCardMaxWidth} pointer-events-none z-40`}>
          <Card className="bg-background/90 backdrop-blur-md p-2 shadow-xl border border-solid border-red-500/50 text-center">
            <CardContent className="p-0 space-y-2">
              <h3 className={`${textSize} font-bold text-red-500 truncate`}>{bossName}</h3>
              <div className="space-y-1">
                <Progress value={bossHealthPercentage} className={progressHeight} indicatorClassName="bg-red-600" />
                <div className={`${badgeSize} text-muted-foreground`}>{bossHealth.toFixed(0)}/{bossMaxHealth} HP</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default HUD;