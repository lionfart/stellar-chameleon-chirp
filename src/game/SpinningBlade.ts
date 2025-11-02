import { Enemy } from './Enemy';
import { GameEngine } from './GameEngine'; // Import GameEngine

export class SpinningBlade {
  x: number;
  y: number;
  radius: number;
  size: number; // Added size property
  damage: number;
  angle: number;
  orbitDistance: number;
  rotationSpeed: number;
  color: string;
  private sprite: HTMLImageElement | undefined;

  constructor(orbitDistance: number, rotationSpeed: number, damage: number, radius: number, initialAngle: number, sprite: HTMLImageElement | undefined) {
    this.orbitDistance = orbitDistance;
    this.rotationSpeed = rotationSpeed;
    this.damage = damage;
    this.radius = radius;
    this.size = radius * 2; // Initialize size based on radius
    this.angle = initialAngle;
    this.color = 'gray';
    this.x = 0;
    this.y = 0;
    this.sprite = sprite;
  }

  update(deltaTime: number, playerX: number, playerY: number) {
    this.angle += this.rotationSpeed * deltaTime;

    this.x = playerX + this.orbitDistance * Math.cos(this.angle);
    this.y = playerY + this.orbitDistance * Math.sin(this.angle);
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, gameEngine: GameEngine) {
    const { drawX, drawY, scale } = gameEngine.getDrawProperties(this);

    ctx.save();
    ctx.translate(drawX - cameraX, drawY - cameraY);
    ctx.scale(scale, scale);
    ctx.rotate(this.angle); // Rotate the sprite with its orbit

    if (this.sprite) {
      ctx.drawImage(this.sprite, -this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  collidesWith(enemy: Enemy): boolean {
    const dx = this.x - enemy.x;
    const dy = this.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.radius + enemy.size / 2);
  }
}