import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/Progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Shield, Gem, Clock, Swords, Bomb, Footprints, PlusCircle, Crown, Hourglass, User } from 'lucide-react';
import CooldownDisplay from './CooldownDisplay';
import { useLanguage } from '@/contexts/LanguageContext'; // NEW: Import useLanguage

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
  gameOver: boolean; // NEW: Add gameOver to HUDProps
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
  gameOver, // NEW
}) => {
  const { t } = useLanguage(); // NEW: Use translation hook

  const healthPercentage = (playerHealth / playerMaxHealth) * 100;
  const xpPercentage = (playerExperience / playerExperienceToNextLevel) * 100;
  const shieldPercentage = shieldMaxHealth > 0 ? (shieldCurrentHealth / shieldMaxHealth) * 100 : 0;
  const bossHealthPercentage = bossMaxHealth > 0 ? (bossHealth / bossMaxHealth) * 100 : 0;

  const princessName = ['S', 'I', 'M', 'G', 'E'];

  return (
    <>
      {/* Left HUD - Player Stats and Ability Cooldowns */}
      <div className="absolute top-4 left-4 flex flex-col space-y-4 pointer-events-none z-40">
        {/* Player Stats */}
        <Card className="bg-background/90 backdrop-blur-md p-3 shadow-xl border border-solid border-primary/20 min-w-[250px] max-h-[calc(50vh-2rem)] overflow-y-auto">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-400" />
              <span className="text-base font-medium text-white">{playerName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <div className="flex-1">
                <Progress value={healthPercentage} className="h-3" indicatorClassName="bg-red-500" />
                <span className="text-sm text-muted-foreground">{playerHealth}/{playerMaxHealth} HP</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-blue-500" />
              <div className="flex-1">
                <Progress value={xpPercentage} className="h-3" indicatorClassName="bg-blue-500" />
                <span className="text-sm text-muted-foreground">{playerExperience}/{playerExperienceToNextLevel} XP</span>
              </div>
              <Badge variant="secondary" className="text-base">{t('levelUpShort')} {playerLevel}</Badge> {/* NEW: Translate 'Lv.' */}
            </div>

            <div className="flex items-center space-x-2">
              <Gem className="h-6 w-6 text-yellow-500" />
              <span className="text-base font-medium">{playerGold} {t('gold')}</span> {/* NEW: Translate 'Gold' */}
            </div>

            {shieldMaxHealth > 0 && (
              <div className="flex items-center space-x-2">
                <Shield className={`h-6 w-6 ${shieldActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                <div className="flex-1">
                  <Progress value={shieldPercentage} className="h-3" indicatorClassName="bg-cyan-400" />
                  <span className="text-sm text-muted-foreground">
                    {shieldActive ? `${shieldCurrentHealth}/${shieldMaxHealth} ${t('shield')}` : t('shieldInactive')} {/* NEW: Translate shield status */}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ability Cooldowns (Moved to bottom-left) */}
        <Card className="bg-background/90 backdrop-blur-md p-3 shadow-xl border border-solid border-primary/20 max-w-sm w-full md:w-auto max-h-[calc(50vh-2rem)] overflow-y-auto">
          <CardContent className="p-0 space-y-2">
            <CooldownDisplay
              Icon={Footprints}
              name={t('dash')} // NEW: Translate ability name
              currentCooldown={dashCooldownCurrent}
              maxCooldown={dashCooldownMax}
              colorClass="text-purple-500"
              iconSizeClass="h-4 w-4"
              progressBarHeightClass="h-4"
            />

            {explosionCooldownMax > 0 && (
              <CooldownDisplay
                Icon={Bomb}
                name={t('explosion')} // NEW: Translate ability name
                currentCooldown={explosionCooldownCurrent}
                maxCooldown={explosionCooldownMax}
                colorClass="text-orange-500"
              />
            )}

            {shieldCooldownMax > 0 && (
              <CooldownDisplay
                Icon={Shield}
                name={t('shield')} // NEW: Translate ability name
                currentCooldown={shieldCooldownCurrent}
                maxCooldown={shieldCooldownMax}
                colorClass="text-blue-500"
              />
            )}

            {healCooldownMax > 0 && (
              <CooldownDisplay
                Icon={PlusCircle}
                name={t('heal')} // NEW: Translate ability name
                currentCooldown={healCooldownCurrent}
                maxCooldown={healCooldownMax}
                colorClass="text-green-500"
              />
            )}

            {timeSlowCooldownMax > 0 && (
              <CooldownDisplay
                Icon={Hourglass}
                name={t('timeSlow')} // NEW: Translate ability name
                currentCooldown={timeSlowCooldownCurrent}
                maxCooldown={timeSlowCooldownMax}
                colorClass="text-indigo-400"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top-Center HUD - Wave Info and Collected Letters */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-40">
        <Card className="bg-background/90 backdrop-blur-md p-3 shadow-xl border border-solid border-primary/20 min-w-[180px] text-center">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Swords className="h-6 w-6 text-purple-500" />
              <span className="text-base font-medium">{t('waveText')} {waveNumber}</span> {/* NEW: Translate 'Wave' */}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-6 w-6 text-gray-500" />
              <span className="text-base font-medium">{Math.max(0, Math.floor(waveTimeRemaining))}s</span>
            </div>
            {/* Collected Letters Display */}
            <div className="flex items-center justify-center space-x-1 mt-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-white">{t('simge')}:</span> {/* NEW: Translate 'Simge' */}
              {princessName.map((letter, index) => (
                <Badge
                  key={index}
                  variant={collectedLetters.includes(letter) ? 'default' : 'outline'}
                  className={`text-sm font-bold ${collectedLetters.includes(letter) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400 border-gray-600'}`}
                >
                  {letter}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top-Right HUD - Boss Health Bar */}
      {bossActive && (
        <div className="absolute top-4 right-4 w-1/3 pointer-events-none z-40">
          <Card className="bg-background/90 backdrop-blur-md p-3 shadow-xl border border-solid border-red-500/50 text-center">
            <CardContent className="p-0 space-y-2">
              <h3 className="text-lg font-bold text-red-500">{bossName}</h3>
              <Progress value={bossHealthPercentage} className="h-4" indicatorClassName="bg-red-600" />
              <span className="text-sm text-muted-foreground">{bossHealth}/{bossMaxHealth} HP</span>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default HUD;