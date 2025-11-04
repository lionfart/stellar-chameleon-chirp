import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Volume2 } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentVolume: number;
  onVolumeChange: (volume: number) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose, currentVolume, onVolumeChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background/90 backdrop-blur-md shadow-2xl border border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Game Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Adjust game preferences here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-4">
            <Volume2 className="h-6 w-6 text-white" />
            <Label htmlFor="volume" className="text-white w-20">Volume</Label>
            <Slider
              id="volume"
              min={0}
              max={1}
              step={0.05}
              value={[currentVolume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              className="flex-1"
            />
            <span className="text-white w-10 text-right">{(currentVolume * 100).toFixed(0)}%</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;