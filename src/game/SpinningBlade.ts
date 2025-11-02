import { Enemy } from './Enemy';

export class SpinningBlade {
  x: number;
  y: number;
  radius: number;
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

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    ctx.save();
    ctx.translate(this.x - cameraX, this.y - cameraY);
    ctx.rotate(this.angle); // Rotate the sprite with its orbit

    // Apply shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    if (this.sprite) {
      ctx.drawImage(this.sprite, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore(); // Restore context to remove shadow
  }

  collidesWith(enemy: Enemy): boolean {
    const dx = this.x - enemy.x;
    const dy = this.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.radius + enemy.size / 2);
  }
}