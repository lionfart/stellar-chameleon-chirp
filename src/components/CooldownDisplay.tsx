import React from 'react';
import { Progress } from '@/components/Progress';
import { Icon as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface CooldownDisplayProps {
  Icon: React.ElementType<any>;
  name: string;
  currentCooldown: number;
  maxCooldown: number;
  colorClass: string;
  iconSizeClass?: string;
  progressBarHeightClass?: string;
}

const CooldownDisplay: React.FC<CooldownDisplayProps> = ({
  Icon,
  name,
  currentCooldown,
  maxCooldown,
  colorClass,
  iconSizeClass = 'h-5 w-5',
  progressBarHeightClass = 'h-6',
}) => {
  const { t } = useLanguage();
  const isReady = currentCooldown <= 0;
  const cooldownPercentage = maxCooldown > 0 ? ((maxCooldown - currentCooldown) / maxCooldown) * 100 : 100;
  const cooldownText = isReady ? t('ready') : `${currentCooldown.toFixed(1)}s`;

  // Bar yüksekliğine göre yazı boyutunu ayarla
  let textSizeClass = 'text-sm';
  if (progressBarHeightClass.includes('h-1.5')) {
    textSizeClass = 'text-[0.6rem]';
  } else if (progressBarHeightClass.includes('h-2')) {
    textSizeClass = 'text-xs';
  }

  // Extract base color from colorClass for shadow
  const shadowColorClass = colorClass.replace('text-', 'shadow-');

  return (
    <div className="flex items-center space-x-2">
      <Icon className={cn(
        iconSizeClass,
        colorClass,
        isReady && `text-white drop-shadow-lg ${shadowColorClass} animate-glow-icon`
      )} />
      <div className="flex-1">
        <Progress
          value={cooldownPercentage}
          className={progressBarHeightClass}
          indicatorClassName={cn(
            isReady ? 'bg-green-500' : colorClass.replace('text-', 'bg-'),
            isReady && 'border border-green-300'
          )}
          showText
          text={`${name}: ${cooldownText}`}
          isCooldown={!isReady}
          isReady={isReady}
          textClass={textSizeClass} // Yeni prop ile yazı boyutunu ayarla
        />
      </div>
    </div>
  );
};

export default CooldownDisplay;