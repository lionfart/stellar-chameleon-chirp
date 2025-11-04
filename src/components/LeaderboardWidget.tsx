import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '@/components/LeaderboardDialog'; // Re-use the interface

interface LeaderboardWidgetProps {
  currentScoreEntry: LeaderboardEntry | null;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ currentScoreEntry }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      const parsedLeaderboard: LeaderboardEntry[] = JSON.parse(savedLeaderboard);
      setLeaderboard(parsedLeaderboard.sort((a, b) => b.wave - a.wave || b.score - a.score));
    }
  }, [currentScoreEntry]); // Re-fetch if currentScoreEntry changes (i.e., new game ended)

  return (
    <Card className="w-full max-w-md bg-background/90 backdrop-blur-md shadow-2xl border border-primary/30">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white flex items-center justify-center space-x-2">
          <Trophy className="h-7 w-7 text-yellow-400" />
          <span>Leaderboard</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground text-center">
          Top scores from your adventures!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] w-full rounded-md border bg-gray-800/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700/70 hover:bg-gray-700/70">
                <TableHead className="w-[50px] text-white">Rank</TableHead>
                <TableHead className="text-white">Player</TableHead>
                <TableHead className="text-white">Wave</TableHead>
                <TableHead className="text-white">Letters</TableHead>
                <TableHead className="text-right text-white">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
                    No scores yet.
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