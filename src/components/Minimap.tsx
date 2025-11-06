import React, { useRef, useEffect } from 'react';

interface MinimapEnemyData {
  x: number;
  y: number;
  size: number;
}

interface MinimapProps {
  playerName: string;
  playerHealth: number;
  playerMaxHealth: number;
  playerLevel: number;
  playerExperience: number;
  playerExperienceToNextLevel: number;
  playerGold: number;
  shieldActive: boolean;
  shieldCurrentHealth: number;
  shieldMaxHealth: number;
  waveNumber: number;
  waveTimeRemaining: number;
  dashCooldownCurrent: number;
  dashCooldownMax: number;
  explosionCooldownCurrent: number;
  explosionCooldownMax: number;
  shieldCooldownCurrent: number;
  shieldCooldownMax: number;
  healCooldownCurrent: number;
  healCooldownMax: number;
  timeSlowCooldownCurrent: number;
  timeSlowCooldownMax: number;

  bossActive: boolean;
  bossHealth: number;
  bossMaxHealth: number;
  bossName: string;

  collectedLetters: string[];
  gameWon: boolean;
  gameOver: boolean;

  playerX: number;
  playerY: number;
  worldWidth: number;
  worldHeight: number;
  cameraX: number;
  cameraY: number;
  canvasWidth: number;
  canvasHeight: number;
  enemiesMinimap: MinimapEnemyData[];
  vendorX: number;
  vendorY: number;
  lastGameScoreEntry: any | null;
}

const Minimap: React.FC<MinimapProps> = ({
  playerX,
  playerY,
  worldWidth,
  worldHeight,
  cameraX,
  cameraY,
  canvasWidth,
  canvasHeight,
  enemiesMinimap,
  vendorX,
  vendorY,
}) => {
  const minimapCanvasRef = useRef<HTMLCanvasElement>(null);
  const minimapSize = 100;

  useEffect(() => {
    const canvas = minimapCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the minimap
    ctx.clearRect(0, 0, minimapSize, minimapSize);

    // Calculate scaling factor
    const scaleX = minimapSize / worldWidth;
    const scaleY = minimapSize / worldHeight;

    // Draw world boundary
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, minimapSize, minimapSize);

    // Draw player
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.arc(playerX * scaleX, playerY * scaleY, 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies
    ctx.fillStyle = 'red';
    enemiesMinimap.forEach(enemy => {
      ctx.beginPath();
      ctx.arc(enemy.x * scaleX, enemy.y * scaleY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw vendor
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.arc(vendorX * scaleX, vendorY * scaleY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw camera view rectangle
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      cameraX * scaleX,
      cameraY * scaleY,
      canvasWidth * scaleX,
      canvasHeight * scaleY
    );

  }, [playerX, playerY, worldWidth, worldHeight, cameraX, cameraY, canvasWidth, canvasHeight, enemiesMinimap, vendorX, vendorY]);

  return (
    <div className="absolute top-2 right-2 z-50 bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl border border-solid border-gray-700 p-1">
      <canvas
        ref={minimapCanvasRef}
        width={minimapSize}
        height={minimapSize}
        className="block border border-gray-600 rounded-md"
      />
    </div>
  );
};

export default Minimap;