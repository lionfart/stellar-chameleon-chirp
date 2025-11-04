import { Enemy } from './Enemy';
import { SoundManager } from './SoundManager';

export class LaserBeamWeapon {
  private damagePerSecond: number;
  private range: number;
  private width: number;
  private fireRate: number; // How often damage is applied
  private lastDamageTickTime: number;
  private cooldown: number;
  private currentCooldown: number;
  private duration: number; // How long the beam stays active after activation
  private currentDuration: number;
  private isActive: boolean;
  private soundManager: SoundManager;
  private beamSprite: HTMLImageElement | undefined;
  private targetEnemy: Enemy | null = null; // Current target for the beam

  constructor(damagePerSecond: number, range: number, width: number, fireRate: number, cooldown: number, duration: number, beamSprite: HTMLImageElement | undefined, soundManager: SoundManager) {
    this.damagePerSecond = damagePerSecond;
    this.range = range;
    this.width = width;
    this.fireRate = fireRate;
    this.lastDamageTickTime = 0;
    this.cooldown = cooldown;
    this.currentCooldown = 0;
    this.duration = duration;
    this.currentDuration = 0;
    this.isActive = false;
    this.beamSprite = beamSprite;
    this.soundManager = soundManager;
  }

  update(deltaTime: number, playerX: number, playerY: number, enemies: Enemy[]) {
    if (this.currentCooldown > 0) {
      this.currentCooldown -= deltaTime;
    }

    if (this.isActive) {
      this.currentDuration -= deltaTime;
      if (this.currentDuration <= 0) {
        this.isActive = false;
        this.targetEnemy = null;
        this.soundManager.stopSound(this.soundManager.playSound('laser_beam_loop', true, 0.2)); // Stop looping sound
      }

      // Find closest enemy within range if no target or target is dead/out of range
      if (!this.targetEnemy || !this.targetEnemy.isAlive() || this.getDistanceToEnemy(playerX, playerY, this.targetEnemy) > this.range) {
        this.targetEnemy = this.findClosestEnemy(playerX, playerY, enemies);
      }

      if (this.targetEnemy && this.targetEnemy.isAlive()) {
        this.lastDamageTickTime += deltaTime;
        if (this.lastDamageTickTime >= this.fireRate) {
          this.targetEnemy.takeDamage(this.damagePerSecond * this.fireRate);
          this.lastDamageTickTime = 0;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, playerX: number, playerY: number, cameraX: number, cameraY: number) {
    if (!this.isActive || !this.targetEnemy || !this.targetEnemy.isAlive()) return;

    const startX = playerX - cameraX;
    const startY = playerY - cameraY;
    const endX = this.targetEnemy.x - cameraX;
    const endY = this.targetEnemy.y - cameraY;

    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Draw the beam
    ctx.save();
    ctx.lineWidth = this.width;
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.7 + Math.sin(performance.now() / 100) * 0.2})`; // Pulsing alpha
    ctx.shadowColor = 'cyan';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();

    // Draw a small glow at the target
    ctx.save();
    ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + Math.sin(performance.now() / 50) * 0.3})`;
    ctx.beginPath();
    ctx.arc(endX, endY, this.width * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  triggerBeam(playerX: number, playerY: number, enemies: Enemy[]): boolean {
    if (this.currentCooldown <= 0 && !this.isActive) {
      this.targetEnemy = this.findClosestEnemy(playerX, playerY, enemies);
      if (this.targetEnemy) {
        this.isActive = true;
        this.currentDuration = this.duration;
        this.currentCooldown = this.cooldown;
        this.lastDamageTickTime = 0;
        this.soundManager.playSound('laser_beam_fire');
        this.soundManager.playSound('laser_beam_loop', true, 0.2); // Play looping sound
        console.log("Laser Beam activated!");
        return true;
      }
    }
    return false;
  }

  private findClosestEnemy(playerX: number, playerY: number, enemies: Enemy[]): Enemy | null {
    let closest: Enemy | null = null;
    let minDistance = this.range + 1; // Initialize with a value outside range

    for (const enemy of enemies) {
      if (enemy.isAlive()) {
        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance && distance <= this.range) {
          minDistance = distance;
          closest = enemy;
        }
      }
    }
    return closest;
  }

  private getDistanceToEnemy(playerX: number, playerY: number, enemy: Enemy): number {
    const dx = playerX - enemy.x;
    const dy = playerY - enemy.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  increaseDamage(amount: number) {
    this.damagePerSecond += amount;
    console.log(`Laser Beam damage increased to ${this.damagePerSecond}/s`);
  }

  increaseRange(amount: number) {
    this.range += amount;
    console.log(`Laser Beam range increased to ${this.range}`);
  }

  reduceCooldown(amount: number) {
    this.cooldown = Math.max(1, this.cooldown - amount);
    console.log(`Laser Beam cooldown reduced to ${this.cooldown}s`);
  }

  increaseDuration(amount: number) {
    this.duration += amount;
    console.log(`Laser Beam duration increased to ${this.duration}s`);
  }

  getCooldownCurrent(): number {
    return this.currentCooldown;
  }

  getCooldownMax(): number {
    return this.cooldown;
  }

  getIsActive(): boolean {
    return this.isActive;
  }
}