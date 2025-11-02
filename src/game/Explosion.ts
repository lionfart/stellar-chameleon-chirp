import { Enemy } from './Enemy';

export class Explosion {
  x: number;
  y: number;
  radius: number;
  damage: number;
  private duration: number; // How long the explosion effect lasts visually
  private currentDuration: number;
  private color: string;
  private hasDealtDamage: boolean; // To ensure damage is dealt only once per enemy per explosion

  constructor(x: number, y: number, radius: number, damage: number, duration: number = 0.2, color: string = 'orange') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.damage = damage;
    this.duration = duration;
    this.currentDuration = 0;
    this.color = color;
    this.hasDealtDamage = false; // Damage is dealt when the explosion is created, not over time
  }

  update(deltaTime: number): boolean {
    this.currentDuration += deltaTime;
    return this.currentDuration < this.duration; // Return true if still active visually
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    const alpha = 1 - (this.currentDuration / this.duration); // Fade out effect
    ctx.fillStyle = `rgba(255, 165, 0, ${alpha})`; // Orange color
    ctx.beginPath();
    ctx.arc(this.x - cameraX, this.y - cameraY, this.radius * (1 - alpha * 0.5), 0, Math.PI * 2); // Pulsing effect
    ctx.fill();
  }

  // Check for collision and deal damage to enemies
  dealDamage(enemies: Enemy[]) {
    if (this.hasDealtDamage) return; // Only deal damage once

    for (const enemy of enemies) {
      if (enemy.isAlive()) {
        const dx = this.x - enemy.x;
        const dy = this.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + enemy.size / 2) {
          enemy.takeDamage(this.damage);
        }
      }
    }
    this.hasDealtDamage = true;
  }
}