import { SoundManager } from './SoundManager';
import { GameEngine } from './GameEngine'; // Import GameEngine

export class ExperienceGem {
  x: number;
  y: number;
  size: number;
  value: number;
  color: string;
  private pullSpeed: number = 300;
  private sprite: HTMLImageElement | undefined;
  private soundManager: SoundManager;
  private initialY: number; // For bobbing animation
  private bobbingOffset: number = 0;
  private bobbingSpeed: number = 5; // Adjust speed of bobbing
  private bobbingHeight: number = 5; // Adjust height of bobbing

  constructor(x: number, y: number, value: number, sprite: HTMLImageElement | undefined, soundManager: SoundManager) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.value = value;
    this.color = 'yellow';
    this.sprite = sprite;
    this.soundManager = soundManager;
    this.initialY = y;
  }

  update(deltaTime: number) {
    this.bobbingOffset = Math.sin(performance.now() / 1000 * this.bobbingSpeed) * this.bobbingHeight;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, gameEngine: GameEngine) {
    const { drawX, drawY, scale, scaledSize, shadowOffset, shadowRadius, shadowAlpha } = gameEngine.getDrawProperties(this);
    const bobbedDrawY = drawY + this.bobbingOffset * scale; // Apply bobbing offset to scaled position

    // Draw shadow
    ctx.save();
    ctx.globalAlpha = shadowAlpha;
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(drawX - cameraX + shadowOffset, bobbedDrawY - cameraY + scaledSize / 2 + shadowOffset, shadowRadius, shadowRadius * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(drawX - cameraX, bobbedDrawY - cameraY);
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

  pullTowards(targetX: number, targetY: number, deltaTime: number) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const directionX = dx / distance;
      const directionY = dy / distance;
      this.x += directionX * this.pullSpeed * deltaTime;
      this.y += directionY * this.pullSpeed * deltaTime;
      this.initialY = this.y; // Update initialY for bobbing when pulled
    }
  }
}