import { Player } from './Player';
import { SoundManager } from './SoundManager';
import { DamageNumber } from './DamageNumber';
import { GameEngine } from './GameEngine'; // Import GameEngine

export class Enemy {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  maxHealth: number;
  currentHealth: number;
  private sprite: HTMLImageElement | undefined;
  protected soundManager: SoundManager;
  private hitTimer: number = 0; // For hit animation
  private goldDrop: number;
  private onTakeDamageCallback: (x: number, y: number, damage: number) => void;

  constructor(x: number, y: number, size: number, speed: number, color: string, maxHealth: number, sprite: HTMLImageElement | undefined, soundManager: SoundManager, goldDrop: number = 0, onTakeDamage: (x: number, y: number, damage: number) => void) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.sprite = sprite;
    this.soundManager = soundManager;
    this.goldDrop = goldDrop;
    this.onTakeDamageCallback = onTakeDamage;
  }

  update(deltaTime: number, player: Player) {
    if (!this.isAlive()) return;

    // Update hit animation timer
    if (this.hitTimer > 0) {
      this.hitTimer -= deltaTime;
    }

    // Move towards the player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      this.x += (dx / distance) * this.speed * deltaTime;
      this.y += (dy / distance) * this.speed * deltaTime;
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, gameEngine: GameEngine) {
    if (!this.isAlive()) return;

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

    // Apply hit flash effect
    if (this.hitTimer > 0) {
      ctx.filter = 'brightness(200%)'; // Make it brighter
    }

    if (this.sprite) {
      ctx.drawImage(this.sprite, -this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore(); // Restore context to remove filter and scale

    // Draw health bar (simple rectangle above enemy)
    const healthBarWidth = scaledSize * 1.5;
    const healthBarHeight = 3 * scale;
    const healthPercentage = this.currentHealth / this.maxHealth;

    ctx.fillStyle = 'gray';
    ctx.fillRect(drawX - cameraX - healthBarWidth / 2, drawY - cameraY - scaledSize / 2 - 8 * scale, healthBarWidth, healthBarHeight);
    ctx.fillStyle = 'orange';
    ctx.fillRect(drawX - cameraX - healthBarWidth / 2, drawY - cameraY - scaledSize / 2 - 8 * scale, healthBarWidth * healthPercentage, healthBarHeight);
  }

  takeDamage(amount: number) {
    this.currentHealth -= amount;
    this.hitTimer = 0.1; // Set hit flash duration
    this.soundManager.playSound('enemy_hit'); // Play hit sound
    this.onTakeDamageCallback(this.x, this.y, amount); // Trigger damage number callback

    if (this.currentHealth < 0) {
      this.currentHealth = 0;
    }
    console.log(`Enemy took ${amount} damage. Health: ${this.currentHealth}`);

    if (!this.isAlive()) {
      this.soundManager.playSound('enemy_defeat'); // Play defeat sound
    }
  }

  isAlive(): boolean {
    return this.currentHealth > 0;
  }

  getGoldDrop(): number {
    return this.goldDrop;
  }

  collidesWith(other: { x: number; y: number; size: number }): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.size / 2 + other.size / 2);
  }
}