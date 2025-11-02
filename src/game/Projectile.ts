import { Enemy } from './Enemy';
import { GameEngine } from './GameEngine'; // Import GameEngine

export class Projectile {
  x: number;
  y: number;
  radius: number;
  size: number; // Added size property
  speed: number;
  damage: number;
  directionX: number;
  directionY: number;
  color: string;
  lifetime: number;
  private currentLifetime: number;
  private sprite: HTMLImageElement | undefined;
  private trail: { x: number; y: number; alpha: number; radius: number }[] = [];

  constructor(x: number, y: number, radius: number, speed: number, damage: number, directionX: number, directionY: number, color: string, lifetime: number, sprite: HTMLImageElement | undefined) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.size = radius * 2; // Initialize size based on radius
    this.speed = speed;
    this.damage = damage;
    this.directionX = directionX;
    this.directionY = directionY;
    this.color = color;
    this.lifetime = lifetime;
    this.currentLifetime = 0;
    this.sprite = sprite;
  }

  update(deltaTime: number): boolean {
    this.x += this.directionX * this.speed * deltaTime;
    this.y += this.directionY * this.speed * deltaTime;
    this.currentLifetime += deltaTime;

    // Add current position to trail
    this.trail.push({ x: this.x, y: this.y, alpha: 1, radius: this.radius });

    // Update and filter trail particles
    this.trail = this.trail.filter(p => {
      p.alpha -= deltaTime * 5; // Fade out faster
      p.radius *= 0.9; // Shrink
      return p.alpha > 0 && p.radius > 1; // Remove if too transparent or too small
    });

    return this.currentLifetime < this.lifetime;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, gameEngine: GameEngine) {
    const { drawX, drawY, scale, scaledSize } = gameEngine.getDrawProperties(this);

    // Draw trail
    this.trail.forEach(p => {
      const { drawX: trailDrawX, drawY: trailDrawY, scale: trailScale } = gameEngine.getDrawProperties({ x: p.x, y: p.y, size: p.radius * 2 });
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = `rgba(0, 191, 255, ${p.alpha * 0.5})`; // Light blue trail
      ctx.beginPath();
      ctx.arc(trailDrawX - cameraX, trailDrawY - cameraY, p.radius * trailScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw the main projectile
    ctx.save();
    ctx.translate(drawX - cameraX, drawY - cameraY);
    ctx.scale(scale, scale);

    if (this.sprite) {
      ctx.drawImage(this.sprite, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
    } else {
      const gradient = ctx.createRadialGradient(
        0, 0, this.radius * 0.2,
        0, 0, this.radius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // White hot center
      gradient.addColorStop(0.5, `rgba(0, 191, 255, 1)`); // Deep Sky Blue
      gradient.addColorStop(1, `rgba(0, 191, 255, 0.5)`); // Fading blue outer

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  collidesWith(other: { x: number; y: number; size: number }): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.radius + other.size / 2);
  }
}