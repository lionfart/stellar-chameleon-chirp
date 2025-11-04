import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface RestartButtonProps {
  onClick: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center space-x-2"
    >
      <RotateCcw className="h-5 w-5" />
      <span>Restart Game</span>
    </Button>
  );
};

export default RestartButton;