import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';

export interface LeaderboardEntry {
  playerName: string;
  score: number; // Could be wave number or a calculated score
  wave: number;
  collectedLetters: string;
  timestamp: number;
}

const LeaderboardDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      const savedLeaderboard = localStorage.getItem('leaderboard');
      if (savedLeaderboard) {
        const parsedLeaderboard: LeaderboardEntry[] = JSON.parse(savedLeaderboard);
        // Sort by score (e.g., wave number) in descending order
        setLeaderboard(parsedLeaderboard.sort((a, b) => b.wave - a.wave || b.score - a.score));
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-background/90 backdrop-blur-md shadow-2xl border border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center justify-center space-x-2">
            <Trophy className="h-7 w-7 text-yellow-400" />
            <span>Leaderboard</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Top scores from your adventures!
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border bg-gray-800/50">
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
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No scores yet. Be the first!
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard.map((entry, index) => (
                  <TableRow key={entry.timestamp} className="hover:bg-gray-700/50">
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
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardDialog;