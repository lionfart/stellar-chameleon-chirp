import React, { useRef, useEffect } from 'react';
import { GameDataProps } from '@/game/GameEngine'; // Import GameDataProps

interface MinimapProps extends GameDataProps {} // MinimapProps, GameDataProps'ın tüm özelliklerini miras alır

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
  const minimapSize = 200; // Minimap'in genişliği ve yüksekliği

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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, minimapSize, minimapSize);

    // Draw player
    ctx.fillStyle = 'lime';
    ctx.beginPath();
    ctx.arc(playerX * scaleX, playerY * scaleY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies
    ctx.fillStyle = 'red';
    enemiesMinimap.forEach(enemy => {
      ctx.beginPath();
      ctx.arc(enemy.x * scaleX, enemy.y * scaleY, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw vendor
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.arc(vendorX * scaleX, vendorY * scaleY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw camera view rectangle
    ctx.strokeStyle = 'rgba(0, 191, 255, 0.7)'; // Deep Sky Blue
    ctx.lineWidth = 1;
    ctx.strokeRect(
      cameraX * scaleX,
      cameraY * scaleY,
      canvasWidth * scaleX,
      canvasHeight * scaleY
    );

  }, [playerX, playerY, worldWidth, worldHeight, cameraX, cameraY, canvasWidth, canvasHeight, enemiesMinimap, vendorX, vendorY]);

  return (
    <div className="absolute top-4 right-4 z-50 bg-background/90 backdrop-blur-md p-2 rounded-lg shadow-xl border border-solid border-primary/20">
      <h3 className="text-sm font-semibold text-white mb-1">Minimap</h3>
      <canvas
        ref={minimapCanvasRef}
        width={minimapSize}
        height={minimapSize}
        className="block border border-gray-700 rounded-md"
      />
    </div>
  );
};

export default Minimap;