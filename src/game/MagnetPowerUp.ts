import { Player } from './Player';
import { SoundManager } from './SoundManager';
import { GameEngine } from './GameEngine'; // Import GameEngine

export class MagnetPowerUp {
  x: number;
  y: number;
  size: number;
  duration: number;
  radius: number;
  color: string;
  private currentDuration: number;
  private sprite: HTMLImageElement | undefined;
  private soundManager: SoundManager;

  constructor(x: number, y: number, duration: number = 5, radius: number = 300, sprite: HTMLImageElement | undefined, soundManager: SoundManager) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.duration = duration;
    this.radius = radius;
    this.color = 'lightblue';
    this.currentDuration = duration;
    this.sprite = sprite;
    this.soundManager = soundManager;
  }

  update(deltaTime: number): boolean {
    this.currentDuration -= deltaTime;
    return this.currentDuration > 0;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, gameEngine: GameEngine) {
    const { drawX, drawY, scale, scaledSize, shadowOffset, shadowRadius, shadowAlpha } = gameEngine.getDrawProperties(this);

    // Draw shadow
    ctx.save();
    ctx.globalAlpha = shadowAlpha;
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(drawX - cameraX + shadowOffset, drawY - cameraY + scaledSize / 2 + shadowOffset, shadowRadius, shadowRadius * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(drawX - cameraX, drawY - cameraY);
    ctx.scale(scale, scale);

    if (this.sprite) {
      ctx.drawImage(this.sprite, -this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  collidesWith(other: { x: number; y: number; size: number }): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.size / 2 + other.size / 2);
  }
}