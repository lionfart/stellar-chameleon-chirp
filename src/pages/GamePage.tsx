import React from 'react';
import { useLocation } from 'react-router-dom';
import GameCanvas from "@/components/GameCanvas";

const GamePage = () => {
  const location = useLocation();
  const { playerName, soundVolume } = location.state || { playerName: 'Guest', soundVolume: 0.5 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-0 m-0 overflow-hidden">
      <GameCanvas playerName={playerName} initialSoundVolume={soundVolume} />
    </div>
  );
};

export default GamePage;