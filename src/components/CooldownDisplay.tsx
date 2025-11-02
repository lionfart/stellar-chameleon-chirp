import React from 'react';
import { Progress } from '@/components/Progress';
import { Icon as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  progressBarHeightClass = 'h-5',
}) => {
  const cooldownPercentage = maxCooldown > 0 ? ((maxCooldown - currentCooldown) / maxCooldown) * 100 : 100;
  const cooldownText = currentCooldown > 0 ? `${currentCooldown.toFixed(1)}s` : 'Ready';

  return (
    <div className="flex items-center space-x-2">
      <Icon className={cn(iconSizeClass, colorClass)} />
      <div className="flex-1">
        <Progress
          value={cooldownPercentage}
          className={progressBarHeightClass}
          indicatorClassName={colorClass}
          showText
          text={`${name}: ${cooldownText}`}
          isCooldown={currentCooldown > 0}
        />
      </div>
    </div>
  );
};

export default CooldownDisplay;