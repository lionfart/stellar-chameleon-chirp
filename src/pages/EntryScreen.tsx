import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import SettingsDialog from '@/components/SettingsDialog';
import LeaderboardDialog from '@/components/LeaderboardDialog';
import LanguageToggle from '@/components/LanguageToggle'; // NEW: Import LanguageToggle
import { useLanguage } from '@/contexts/LanguageContext'; // NEW: Import useLanguage
import { showSuccess } from '@/utils/toast';

const EntryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage(); // NEW: Use translation hook
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('playerName') || '';
  });
  const [soundVolume, setSoundVolume] = useState<number>(() => {
    const savedVolume = localStorage.getItem('soundVolume');
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  useEffect(() => {
    if (playerName) {
      localStorage.setItem('playerName', playerName);
    }
  }, [playerName]);

  const handleStartGame = () => {
    if (playerName.trim() === '') {
      showSuccess(t('pleaseEnterName')); // NEW: Use translated message
      return;
    }
    navigate('/game', { state: { playerName, soundVolume } });
  };

  const handleVolumeChange = (newVolume: number) => {
    setSoundVolume(newVolume);
    localStorage.setItem('soundVolume', newVolume.toString());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <LanguageToggle /> {/* NEW: Add language toggle */}
      <Card className="w-full max-w-md bg-background/90 backdrop-blur-md shadow-2xl border border-primary/30">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-white drop-shadow-lg">{t('gameTitle')}</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            {t('gameDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-lg text-white">{t('enterYourName')}</Label>
            <Input
              id="playerName"
              placeholder={t('playerNamePlaceholder')}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-gray-800 text-white border-gray-600 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={handleStartGame}
            className="w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            {t('startGame')}
          </Button>
          <div className="flex justify-between space-x-4">
            <Button
              onClick={() => setIsSettingsOpen(true)}
              variant="secondary"
              className="flex-1 py-3 text-md bg-gray-700 hover:bg-gray-600 text-white"
            >
              {t('settings')}
            </Button>
            <Button
              onClick={() => setIsLeaderboardOpen(true)}
              variant="secondary"
              className="flex-1 py-3 text-md bg-gray-700 hover:bg-gray-600 text-white"
            >
              {t('leaderboard')}
            </Button>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground text-center pt-4">
            <h4 className="font-semibold text-white">{t('howToPlay')}</h4>
            <ul className="list-disc list-inside text-left mx-auto max-w-xs">
              <li>{t('moveKeys')}</li>
              <li>{t('dashKey')}</li>
              <li>{t('abilitiesKeys')}</li>
              <li>{t('vendorShop')}</li>
              <li>{t('collectLetters')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentVolume={soundVolume}
        onVolumeChange={handleVolumeChange}
      />
      <LeaderboardDialog
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
};

export default EntryScreen;