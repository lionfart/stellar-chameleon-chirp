import React from 'react';
import { Progress } from '@/components/Progress';
import { Icon as LucideIcon } from 'lucide-react';

interface CooldownDisplayProps {
  Icon: React.ElementType<any>; // Corrected type for Lucide icon component
  name: string;
  currentCooldown: number;
  maxCooldown: number;
  colorClass: string; // Tailwind class for icon and progress bar color
}

const CooldownDisplay: React.FC<CooldownDisplayProps> = ({
  Icon,
  name,
  currentCooldown,
  maxCooldown,
  colorClass,
}) => {
  const cooldownPercentage = maxCooldown > 0 ? ((maxCooldown - currentCooldown) / maxCooldown) * 100 : 100;
  const cooldownText = currentCooldown > 0 ? `${currentCooldown.toFixed(1)}s` : 'Ready';

  return (
    <div className="flex items-center space-x-2">
      <Icon className={`h-5 w-5 ${colorClass}`} />
      <div className="flex-1">
        <Progress
          value={cooldownPercentage}
          className="h-5"
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