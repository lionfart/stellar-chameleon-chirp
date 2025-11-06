import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '@/components/LeaderboardDialog'; // Re-use the interface
import { useLanguage } from '@/contexts/LanguageContext'; // NEW: Import useLanguage

interface LeaderboardWidgetProps {
  currentScoreEntry: LeaderboardEntry | null;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ currentScoreEntry }) => {
  const { t } = useLanguage(); // NEW: Use translation hook
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      const parsedLeaderboard: LeaderboardEntry[] = JSON.parse(savedLeaderboard);
      setLeaderboard(parsedLeaderboard.sort((a, b) => b.wave - a.wave || b.score - a.score));
    }
  }, [currentScoreEntry]); // Re-fetch if currentScoreEntry changes (i.e., new game ended)

  return (
    <Card className="w-11/12 max-w-md bg-background/90 backdrop-blur-md shadow-2xl border border-primary/30"> {/* Adjusted width for mobile */}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white flex items-center justify-center space-x-2">
          <Trophy className="h-7 w-7 text-yellow-400" />
          <span>{t('leaderboard')}</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-center">
          {t('leaderboardDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] w-full rounded-md border bg-gray-800/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700/70 hover:bg-gray-700/70">
                <TableHead className="w-[50px] text-white">{t('rank')}</TableHead>
                <TableHead className="text-white">{t('player')}</TableHead>
                <TableHead className="text-white">{t('wave')}</TableHead>
                <TableHead className="text-white">{t('letters')}</TableHead>
                <TableHead className="text-right text-white">{t('score')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
                    {t('noScoresYet')}
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard.map((entry, index) => (
                  <TableRow
                    key={entry.timestamp}
                    className={
                      currentScoreEntry && entry.timestamp === currentScoreEntry.timestamp
                        ? 'bg-yellow-600/50 hover:bg-yellow-600/60' // Highlight current player's score
                        : 'hover:bg-gray-700/50'
                    }
                  >
                    <TableCell className="font-medium text-white">{index + 1}</TableCell>
                    <TableCell className="text-white">{entry.playerName}</TableCell>
                    <TableCell className="text-white">{entry.wave}</TableCell>
                    <TableCell className="text-white">{entry.collectedLetters || 'N/A'}</TableCell>
                    <TableCell className="text-right text-white">{entry.score}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;