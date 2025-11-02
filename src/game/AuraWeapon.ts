import { Enemy } from './Enemy';
import { GameEngine } from './GameEngine'; // Import GameEngine

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
    // Aura is drawn relative to the player's actual position, but its visual scale can be influenced by player's 2.5D scale
    // We'll get player's draw properties to ensure consistency
    // Note: Aura itself doesn't need to be sorted with other entities, it's a player effect.
    const tempPlayerEntity = { x: playerX, y: playerY, size: 30 }; // Use player's size as reference
    const { drawX, drawY, scale, scaledSize } = new GameEngine(ctx, () => {}, () => {}, () => {}, () => {}).getDrawProperties(tempPlayerEntity); // Temporary GameEngine instance to get properties

    const currentRadius = this.radius * scale * (1 + Math.sin(this.pulseTimer) * 0.05); // Subtle pulse effect on radius, scaled
    const alpha = 0.3 + Math.sin(this.pulseTimer * 0.5) * 0.1; // Subtle pulse effect on alpha

    const gradient = ctx.createRadialGradient(
      drawX - cameraX, drawY - cameraY + scaledSize / 2 - currentRadius / 2, currentRadius * 0.5,
      drawX - cameraX, drawY - cameraY + scaledSize / 2 - currentRadius / 2, currentRadius
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`); // Brighter center
    gradient.addColorStop(0.7, `rgba(173, 216, 230, ${alpha * 0.5})`); // Light blue middle
    gradient.addColorStop(1, `rgba(0, 191, 255, ${alpha * 0.2})`); // Deep sky blue outer, more transparent

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(drawX - cameraX, drawY - cameraY + scaledSize / 2 - currentRadius / 2, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 1.2})`; // Stronger white stroke
    ctx.lineWidth = 2 * scale; // Scale line width
    ctx.beginPath();
    ctx.arc(drawX - cameraX, drawY - cameraY + scaledSize / 2 - currentRadius / 2, currentRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  increaseDamage(amount: number) {
    this.damage += amount;
    console.log(`Aura weapon damage increased to ${this.damage}`);
  }
}