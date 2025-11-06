import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Footprints, Shield, Bomb, PlusCircle, Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileAbilityButtonsProps {
  onAbilityPress: (key: string) => void;
  onAbilityRelease: (key: string) => void;
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
  shieldActive: boolean;
}

interface AbilityButtonProps {
  Icon: React.ElementType<any>;
  abilityKey: string;
  cooldownCurrent: number;
  cooldownMax: number;
  onPress: (key: string) => void;
  onRelease: (key: string) => void;
  isActive?: boolean; // For toggle abilities like shield
  label: string;
}

const AbilityButton: React.FC<AbilityButtonProps> = ({
  Icon,
  abilityKey,
  cooldownCurrent,
  cooldownMax,
  onPress,
  onRelease,
  isActive = false,
  label,
}) => {
  const isReady = cooldownCurrent <= 0;
  const cooldownPercentage = cooldownMax > 0 ? (cooldownCurrent / cooldownMax) * 100 : 0;

  const handleTouchStart = useCallback(() => {
    onPress(abilityKey);
  }, [onPress, abilityKey]);

  const handleTouchEnd = useCallback(() => {
    onRelease(abilityKey);
  }, [onRelease, abilityKey]);

  return (
    <div className="relative w-16 h-16"> {/* Düğme boyutu küçültüldü */}
      <Button
        className={cn(
          "w-full h-full rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-100",
          "bg-gray-700/80 border border-gray-600",
          isReady && "bg-green-600/80 border-green-500 animate-pulse-ready",
          isActive && "bg-blue-600/80 border-blue-500 animate-none", // Active state for toggle abilities
          !isReady && "opacity-70"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        disabled={!isReady && !isActive} // Disable if not ready and not active (for toggle)
      >
        <Icon className={cn("w-8 h-8", isReady ? "text-white" : "text-gray-400")} /> {/* İkon boyutu küçültüldü */}
      </Button>
      {!isReady && (
        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white text-xs font-bold">
          {cooldownCurrent.toFixed(1)}s
        </div>
      )}
      <div
        className="absolute inset-0 rounded-full bg-blue-500/30"
        style={{
          clipPath: `inset(${cooldownPercentage}% 0 0 0)`,
        }}
      />
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white text-shadow-sm whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};

const MobileAbilityButtons: React.FC<MobileAbilityButtonsProps> = ({
  onAbilityPress,
  onAbilityRelease,
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
  shieldActive,
}) => {
  const { t } = useLanguage();

  return (
    <div className="absolute bottom-8 right-8 flex flex-col items-end space-y-4 z-50">
      <AbilityButton
        Icon={Footprints}
        abilityKey="shift"
        cooldownCurrent={dashCooldownCurrent}
        cooldownMax={dashCooldownMax}
        onPress={onAbilityPress}
        onRelease={onAbilityRelease}
        label={t('dash')}
      />
      <div className="flex space-x-4">
        {explosionCooldownMax > 0 && (
          <AbilityButton
            Icon={Bomb}
            abilityKey="e"
            cooldownCurrent={explosionCooldownCurrent}
            cooldownMax={explosionCooldownMax}
            onPress={onAbilityPress}
            onRelease={onAbilityRelease}
            label={t('explosion')}
          />
        )}
        {shieldCooldownMax > 0 && (
          <AbilityButton
            Icon={Shield}
            abilityKey="q"
            cooldownCurrent={shieldCooldownCurrent}
            cooldownMax={shieldCooldownMax}
            onPress={onAbilityPress}
            onRelease={onAbilityRelease}
            isActive={shieldActive}
            label={t('shield')}
          />
        )}
      </div>
      <div className="flex space-x-4">
        {healCooldownMax > 0 && (
          <AbilityButton
            Icon={PlusCircle}
            abilityKey="r"
            cooldownCurrent={healCooldownCurrent}
            cooldownMax={healCooldownMax}
            onPress={onAbilityPress}
            onRelease={onAbilityRelease}
            label={t('heal')}
          />
        )}
        {timeSlowCooldownMax > 0 && (
          <AbilityButton
            Icon={Hourglass}
            abilityKey="t"
            cooldownCurrent={timeSlowCooldownCurrent}
            cooldownMax={timeSlowCooldownMax}
            onPress={onAbilityPress}
            onRelease={onAbilityRelease}
            label={t('timeSlow')}
          />
        )}
      </div>
    </div>
  );
};

export default MobileAbilityButtons;