import { Enemy } from './Enemy';
import { clamp } from './utils';

export class HomingMissile {
  x: number;
  y: number;
  radius: number;
  speed: number;
  damage: number;
  target: Enemy | null;
  private directionX: number;
  private directionY: number;
  private lifetime: number;
  private currentLifetime: number;
  private sprite: HTMLImageElement | undefined;
  private turnSpeed: number; // How quickly the missile can turn
  private trail: { x: number; y: number; alpha: number; radius: number }[] = [];

  constructor(x: number, y: number, radius: number, speed: number, damage: number, target: Enemy | null, lifetime: number, sprite: HTMLImageElement | undefined, turnSpeed: number = 5) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.damage = damage;
    this.target = target;
    this.lifetime = lifetime;
    this.currentLifetime = 0;
    this.sprite = sprite;
    this.turnSpeed = turnSpeed;

    // Initial direction (straight up if no target, or towards target)
    if (this.target) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    } else {
      this.directionX = 0;
      this.directionY = -1; // Default to pointing upwards
    }
  }

  update(deltaTime: number, enemies: Enemy[]): boolean {
    this.currentLifetime += deltaTime;

    // Re-acquire target if current target is dead or null
    if (!this.target || !this.target.isAlive()) {
      this.target = this.findClosestEnemy(enemies);
    }

    if (this.target) {
      const targetDx = this.target.x - this.x;
      const targetDy = this.target.y - this.y;
      const targetDistance = Math.sqrt(targetDx * targetDx + targetDy * targetDy);

      if (targetDistance > 0) {
        const targetDirectionX = targetDx / targetDistance;
        const targetDirectionY = targetDy / targetDistance;

        // Smoothly turn towards the target
        this.directionX = this.directionX + (targetDirectionX - this.directionX) * this.turnSpeed * deltaTime;
        this.directionY = this.directionY + (targetDirectionY - this.directionY) * this.turnSpeed * deltaTime;

        // Normalize direction vector after turning
        const currentDirectionMagnitude = Math.sqrt(this.directionX * this.directionX + this.directionY * this.directionY);
        if (currentDirectionMagnitude > 0) {
          this.directionX /= currentDirectionMagnitude;
          this.directionY /= currentDirectionMagnitude;
        }
      }
    }

    this.x += this.directionX * this.speed * deltaTime;
    this.y += this.directionY * this.speed * deltaTime;

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

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    // Draw trail
    this.trail.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = `rgba(255, 100, 0, ${p.alpha * 0.5})`; // Orange-red trail
      ctx.beginPath();
      ctx.arc(p.x - cameraX, p.y - cameraY, p.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ctx.save();
    ctx.translate(this.x - cameraX, this.y - cameraY);
    const angle = Math.atan2(this.directionY, this.directionX);
    ctx.rotate(angle + Math.PI / 2); // Rotate to point upwards by default

    // Apply shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    if (this.sprite) {
      ctx.drawImage(this.sprite, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
    } else {
      // Fallback drawing if no sprite
      const gradient = ctx.createLinearGradient(-this.radius, -this.radius, this.radius, this.radius);
      gradient.addColorStop(0, 'red');
      gradient.addColorStop(0.5, 'orange');
      gradient.addColorStop(1, 'yellow');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, -this.radius * 1.5);
      ctx.lineTo(this.radius, this.radius * 1.5);
      ctx.lineTo(-this.radius, this.radius * 1.5);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore(); // Restore context to remove shadow
  }

  collidesWith(other: { x: number; y: number; size: number }): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.radius + other.size / 2);
  }

  private findClosestEnemy(enemies: Enemy[]): Enemy | null {
    let closest: Enemy | null = null;
    let minDistance = Infinity;

    for (const enemy of enemies) {
      if (enemy.isAlive()) {
        const dx = this.x - enemy.x;
        const dy = this.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          minDistance = distance;
          closest = enemy;
        }
      }
    }
    return closest;
  }
}