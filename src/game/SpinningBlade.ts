import { Enemy } from './Enemy';

export class SpinningBlade {
  x: number;
  y: number;
  radius: number; // Size of the blade
  damage: number;
  angle: number; // Current angle around the player
  orbitDistance: number; // Distance from the player's center
  rotationSpeed: number; // How fast it orbits in radians per second
  color: string;

  constructor(orbitDistance: number, rotationSpeed: number, damage: number, radius: number, initialAngle: number) {
    this.orbitDistance = orbitDistance;
    this.rotationSpeed = rotationSpeed;
    this.damage = damage;
    this.radius = radius;
    this.angle = initialAngle;
    this.color = 'gray'; // Color of the spinning blade
    this.x = 0; // Will be updated based on player position
    this.y = 0; // Will be updated based on player position
  }

  update(deltaTime: number, playerX: number, playerY: number) {
    this.angle += this.rotationSpeed * deltaTime;

    // Calculate position relative to the player
    this.x = playerX + this.orbitDistance * Math.cos(this.angle);
    this.y = playerY + this.orbitDistance * Math.sin(this.angle);
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x - cameraX, this.y - cameraY, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  collidesWith(enemy: Enemy): boolean {
    const dx = this.x - enemy.x;
    const dy = this.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.radius + enemy.size / 2);
  }
}