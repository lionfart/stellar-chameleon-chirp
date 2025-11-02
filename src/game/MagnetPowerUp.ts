import { Player } from './Player';
import { SoundManager } from './SoundManager'; // Import SoundManager

export class MagnetPowerUp {
  x: number;
  y: number;
  size: number;
  duration: number;
  radius: number;
  color: string;
  private currentDuration: number;
  private sprite: HTMLImageElement | undefined;
  private soundManager: SoundManager; // New: SoundManager instance

  constructor(x: number, y: number, duration: number = 5, radius: number = 300, sprite: HTMLImageElement | undefined, soundManager: SoundManager) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.duration = duration;
    this.radius = radius;
    this.color = 'lightblue';
    this.currentDuration = duration;
    this.sprite = sprite;
    this.soundManager = soundManager; // Assign SoundManager
  }

  update(deltaTime: number): boolean {
    this.currentDuration -= deltaTime;
    return this.currentDuration > 0;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    ctx.save();
    // Apply shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    if (this.sprite) {
      ctx.drawImage(this.sprite, this.x - cameraX - this.size / 2, this.y - cameraY - this.size / 2, this.size, this.size);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x - cameraX, this.y - cameraY, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore(); // Restore context to remove shadow
  }

  collidesWith(other: { x: number; y: number; size: number }): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.size / 2 + other.size / 2);
  }
}