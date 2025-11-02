import { Enemy } from './Enemy';

export class AuraWeapon {
  private damage: number;
  private radius: number;
  private attackInterval: number; // seconds
  private lastAttackTime: number;
  private pulseTimer: number; // New: For pulsing visual effect

  constructor(damage: number, radius: number, attackInterval: number) {
    this.damage = damage;
    this.radius = radius;
    this.attackInterval = attackInterval;
    this.lastAttackTime = 0;
    this.pulseTimer = 0; // Initialize pulse timer
  }

  update(deltaTime: number, playerX: number, playerY: number, enemies: Enemy[]) {
    this.lastAttackTime += deltaTime;
    this.pulseTimer += deltaTime * 5; // Adjust pulse speed

    if (this.lastAttackTime >= this.attackInterval) {
      this.lastAttackTime = 0; // Reset timer

      for (const enemy of enemies) {
        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + enemy.size / 2) {
          enemy.takeDamage(this.damage);
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, playerX: number, playerY: number, cameraX: number, cameraY: number) {
    const currentRadius = this.radius * (1 + Math.sin(this.pulseTimer) * 0.05); // Subtle pulse effect on radius
    const alpha = 0.3 + Math.sin(this.pulseTimer * 0.5) * 0.1; // Subtle pulse effect on alpha

    const gradient = ctx.createRadialGradient(
      playerX - cameraX, playerY - cameraY, currentRadius * 0.5,
      playerX - cameraX, playerY - cameraY, currentRadius
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`); // Brighter center
    gradient.addColorStop(0.7, `rgba(173, 216, 230, ${alpha * 0.5})`); // Light blue middle
    gradient.addColorStop(1, `rgba(0, 191, 255, ${alpha * 0.2})`); // Deep sky blue outer, more transparent

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(playerX - cameraX, playerY - cameraY, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 1.2})`; // Stronger white stroke
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(playerX - cameraX, playerY - cameraY, currentRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  increaseDamage(amount: number) {
    this.damage += amount;
    console.log(`Aura weapon damage increased to ${this.damage}`);
  }
}