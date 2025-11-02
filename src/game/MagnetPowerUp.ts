import { Player } from './Player';

export class MagnetPowerUp {
  x: number;
  y: number;
  size: number;
  duration: number; // How long the magnet effect lasts in seconds
  radius: number; // How far the magnet pulls gems
  color: string;
  private currentDuration: number;

  constructor(x: number, y: number, duration: number = 5, radius: number = 300) {
    this.x = x;
    this.y = y;
    this.size = 20; // Size of the magnet pickup
    this.duration = duration;
    this.radius = radius;
    this.color = 'lightblue'; // Color of the magnet pickup
    this.currentDuration = duration;
  }

  update(deltaTime: number): boolean {
    this.currentDuration -= deltaTime;
    return this.currentDuration > 0; // Return true if still active
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x - cameraX, this.y - cameraY, this.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw a pulsing effect for the magnet field when active (optional, for visual feedback)
    // This draw method is for the pickup itself, not the active effect.
    // The active effect will be handled in GameEngine.
  }

  // Basic collision check with another circle (e.g., player)
  collidesWith(other: { x: number; y: number; size: number }): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.size / 2 + other.size / 2);
  }
}