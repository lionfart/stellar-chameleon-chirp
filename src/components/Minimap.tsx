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
  const minimapSize = 150; // Minimap'in genişliği ve yüksekliği küçültüldü

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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Daha belirgin kenarlık
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, minimapSize, minimapSize);

    // Draw player
    ctx.fillStyle = 'cyan'; // Oyuncu rengi daha canlı
    ctx.beginPath();
    ctx.arc(playerX * scaleX, playerY * scaleY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies
    ctx.fillStyle = 'red'; // Düşman rengi
    enemiesMinimap.forEach(enemy => {
      ctx.beginPath();
      ctx.arc(enemy.x * scaleX, enemy.y * scaleY, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw vendor
    ctx.fillStyle = 'gold'; // Satıcı rengi
    ctx.beginPath();
    ctx.arc(vendorX * scaleX, vendorY * scaleY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw camera view rectangle
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)'; // Kamera görünümü için yeşil renk
    ctx.lineWidth = 1;
    ctx.strokeRect(
      cameraX * scaleX,
      cameraY * scaleY,
      canvasWidth * scaleX,
      canvasHeight * scaleY
    );

  }, [playerX, playerY, worldWidth, worldHeight, cameraX, cameraY, canvasWidth, canvasHeight, enemiesMinimap, vendorX, vendorY]);

  return (
    <div className="absolute top-0 right-0 z-50 bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl border border-solid border-gray-700"> {/* Arka plan ve kenarlık güncellendi */}
      <canvas
        ref={minimapCanvasRef}
        width={minimapSize}
        height={minimapSize}
        className="block border border-gray-600 rounded-md" // Kenarlık güncellendi
      />
    </div>
  );
};

export default Minimap;