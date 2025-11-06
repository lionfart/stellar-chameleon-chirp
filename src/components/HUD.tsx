import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/Progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Shield, Gem, Clock, Swords, Bomb, Footprints, PlusCircle, Crown, Hourglass, User } from 'lucide-react';
import CooldownDisplay from './CooldownDisplay';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils'; // NEW: Import cn for conditional classNames

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
  isMobile: boolean; // NEW: Add isMobile prop
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
  isMobile, // NEW
}) => {
  const { t } = useLanguage();

  const healthPercentage = (playerHealth / playerMaxHealth) * 100;
  const xpPercentage = (playerExperience / playerExperienceToNextLevel) * 100;
  const shieldPercentage = shieldMaxHealth > 0 ? (shieldCurrentHealth / shieldMaxHealth) * 100 : 0;
  const bossHealthPercentage = bossMaxHealth > 0 ? (bossHealth / bossMaxHealth) * 100 : 0;

  const princessName = ['S', 'I', 'M', 'G', 'E'];

  return (
    <>
      {/* Left HUD - Player Stats */}
      <div className="absolute top-2 left-2 flex flex-col space-y-2 pointer-events-none z-40"> {/* Konum ve boşluk güncellendi */}
        <Card className="bg-background/90 backdrop-blur-md p-2 shadow-xl border border-solid border-primary/20 w-full max-w-[200px] max-h-[calc(50vh-1rem)] overflow-y-auto"> {/* Boyut ve padding güncellendi */}
          <CardContent className="p-0 space-y-1"> {/* Boşluk güncellendi */}
            <div className="flex items-center space-x-1"> {/* Boşluk güncellendi */}
              <User className="h-5 w-5 text-gray-400" /> {/* İkon boyutu küçültüldü */}
              <span className="text-sm font-medium text-white truncate">{playerName}</span> {/* Font boyutu küçültüldü */}
            </div>
            <div className="flex items-center space-x-1"> {/* Boşluk güncellendi */}
              <Heart className="h-5 w-5 text-red-500" /> {/* İkon boyutu küçültüldü */}
              <div className="flex-1">
                <Progress value={healthPercentage} className="h-2" indicatorClassName="bg-red-500" /> {/* Yükseklik küçültüldü */}
                <span className="text-xs text-muted-foreground">{playerHealth}/{playerMaxHealth} HP</span> {/* Font boyutu küçültüldü */}
              </div>
            </div>

            <div className="flex items-center space-x-1"> {/* Boşluk güncellendi */}
              <Zap className="h-5 w-5 text-blue-500" /> {/* İkon boyutu küçültüldü */}
              <div className="flex-1">
                <Progress value={xpPercentage} className="h-2" indicatorClassName="bg-blue-500" /> {/* Yükseklik küçültüldü */}
                <span className="text-xs text-muted-foreground">{playerExperience}/{playerExperienceToNextLevel} XP</span> {/* Font boyutu küçültüldü */}
              </div>
              <Badge variant="secondary" className="text-xs">{t('levelUpShort')} {playerLevel}</Badge> {/* Font boyutu küçültüldü */}
            </div>

            <div className="flex items-center space-x-1"> {/* Boşluk güncellendi */}
              <Gem className="h-5 w-5 text-yellow-500" /> {/* İkon boyutu küçültüldü */}
              <span className="text-sm font-medium">{playerGold} {t('gold')}</span> {/* Font boyutu küçültüldü */}
            </div>

            {shieldMaxHealth > 0 && (
              <div className="flex items-center space-x-1"> {/* Boşluk güncellendi */}
                <Shield className={`h-5 w-5 ${shieldActive ? 'text-cyan-400' : 'text-gray-500'}`} /> {/* İkon boyutu küçültüldü */}
                <div className="flex-1">
                  <Progress value={shieldPercentage} className="h-2" indicatorClassName="bg-cyan-400" /> {/* Yükseklik küçültüldü */}
                  <span className="text-xs text-muted-foreground">
                    {shieldActive ? `${shieldCurrentHealth}/${shieldMaxHealth} ${t('shield')}` : t('shieldInactive')}
                  </span> {/* Font boyutu küçültüldü */}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ability Cooldowns (Only show on desktop, mobile has dedicated buttons) */}
        {!isMobile && (
          <Card className="bg-background/90 backdrop-blur-md p-2 shadow-xl border border-solid border-primary/20 max-w-sm w-full md:w-auto max-h-[calc(50vh-1rem)] overflow-y-auto"> {/* Padding ve max-h güncellendi */}
            <CardContent className="p-0 space-y-1"> {/* Boşluk güncellendi */}
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

      {/* Top-Center HUD - Wave Info and Collected Letters */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none z-40"> {/* Konum güncellendi */}
        <Card className="bg-background/90 backdrop-blur-md p-2 shadow-xl border border-solid border-primary/20 w-full max-w-[150px] text-center"> {/* Boyut ve padding güncellendi */}
          <CardContent className="p-0 space-y-1"> {/* Boşluk güncellendi */}
            <div className="flex items-center justify-center space-x-1"> {/* Boşluk güncellendi */}
              <Swords className="h-5 w-5 text-purple-500" /> {/* İkon boyutu küçültüldü */}
              <span className="text-sm font-medium">{t('waveText')} {waveNumber}</span> {/* Font boyutu küçültüldü */}
            </div>
            <div className="flex items-center justify-center space-x-1"> {/* Boşluk güncellendi */}
              <Clock className="h-5 w-5 text-gray-500" /> {/* İkon boyutu küçültüldü */}
              <span className="text-sm font-medium">{Math.max(0, Math.floor(waveTimeRemaining))}s</span> {/* Font boyutu küçültüldü */}
            </div>
            {/* Collected Letters Display */}
            <div className="flex items-center justify-center space-x-0.5 mt-1"> {/* Boşluk ve margin güncellendi */}
              <Crown className="h-4 w-4 text-yellow-400" /> {/* İkon boyutu küçültüldü */}
              <span className="text-xs font-medium text-white">{t('simge')}:</span> {/* Font boyutu küçültüldü */}
              {princessName.map((letter, index) => (
                <Badge
                  key={index}
                  variant={collectedLetters.includes(letter) ? 'default' : 'outline'}
                  className={`text-xs font-bold ${collectedLetters.includes(letter) ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400 border-gray-600'}`}
                > {/* Font boyutu küçültüldü */}
                  {letter}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top-Right HUD - Boss Health Bar */}
      {bossActive && (
        <div className="absolute top-2 right-2 w-full max-w-[200px] pointer-events-none z-40"> {/* Konum ve max-w güncellendi */}
          <Card className="bg-background/90 backdrop-blur-md p-2 shadow-xl border border-solid border-red-500/50 text-center"> {/* Padding güncellendi */}
            <CardContent className="p-0 space-y-1"> {/* Boşluk güncellendi */}
              <h3 className="text-base font-bold text-red-500 truncate">{bossName}</h3> {/* Font boyutu küçültüldü */}
              <Progress value={bossHealthPercentage} className="h-3" indicatorClassName="bg-red-600" /> {/* Yükseklik küçültüldü */}
              <span className="text-xs text-muted-foreground">{bossHealth}/{bossMaxHealth} HP</span> {/* Font boyutu küçültüldü */}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default HUD;