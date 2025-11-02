import { SpinningBlade } from './SpinningBlade';
import { Enemy } from './Enemy';

export class SpinningBladeWeapon {
  blades: SpinningBlade[];
  private baseDamage: number;
  private orbitDistance: number;
  private rotationSpeed: number; // radians per second
  private bladeRadius: number;
  private numBlades: number;
  private attackCooldown: number; // How often a blade can hit the same enemy
  private lastHitTime: Map<string, number>; // Map<enemyId_bladeId, timestamp>

  constructor(baseDamage: number, orbitDistance: number, rotationSpeed: number, bladeRadius: number, numBlades: number) {
    this.baseDamage = baseDamage;
    this.orbitDistance = orbitDistance;
    this.rotationSpeed = rotationSpeed;
    this.bladeRadius = bladeRadius;
    this.numBlades = numBlades;
    this.attackCooldown = 0.2; // Blades can hit every 0.2 seconds
    this.lastHitTime = new Map();
    this.blades = this.createBlades();
  }

  private createBlades(): SpinningBlade[] {
    const newBlades: SpinningBlade[] = [];
    for (let i = 0; i < this.numBlades; i++) {
      const angle = (Math.PI * 2 / this.numBlades) * i;
      newBlades.push(new SpinningBlade(this.orbitDistance, this.rotationSpeed, this.baseDamage, this.bladeRadius, angle));
    }
    return newBlades;
  }

  update(deltaTime: number, playerX: number, playerY: number, enemies: Enemy[]) {
    this.blades.forEach(blade => {
      blade.update(deltaTime, playerX, playerY);

      for (const enemy of enemies) {
        if (enemy.isAlive() && blade.collidesWith(enemy)) {
          const hitKey = `${enemy.x}_${enemy.y}_${blade.angle}`; // Unique key for enemy-blade interaction
          const currentTime = performance.now() / 1000; // Convert to seconds

          if (!this.lastHitTime.has(hitKey) || (currentTime - this.lastHitTime.get(hitKey)! > this.attackCooldown)) {
            enemy.takeDamage(blade.damage);
            this.lastHitTime.set(hitKey, currentTime);
          }
        }
      }
    });

    // Clean up old hit times to prevent memory leak
    const currentTime = performance.now() / 1000;
    for (const [key, time] of this.lastHitTime.entries()) {
      if (currentTime - time > this.attackCooldown * 2) { // Keep for a bit longer than cooldown
        this.lastHitTime.delete(key);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    this.blades.forEach(blade => {
      blade.draw(ctx, cameraX, cameraY);
    });
  }

  increaseDamage(amount: number) {
    this.baseDamage += amount;
    this.blades.forEach(blade => blade.damage = this.baseDamage);
    console.log(`Spinning blade damage increased to ${this.baseDamage}`);
  }

  addBlade() {
    this.numBlades++;
    this.blades = this.createBlades(); // Recreate blades to evenly space them
    console.log(`Added a spinning blade. Total blades: ${this.numBlades}`);
  }
}