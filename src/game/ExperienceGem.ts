export class ExperienceGem {
  x: number;
  y: number;
  size: number;
  value: number; // How much experience this gem gives
  color: string;
  private pullSpeed: number = 300; // Speed at which gems are pulled

  constructor(x: number, y: number, value: number) {
    this.x = x;
    this.y = y;
    this.size = 10; // Small size for gems
    this.value = value;
    this.color = 'yellow'; // Experience gems are yellow
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x - cameraX, this.y - cameraY, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Basic collision check with another circle (e.g., player)
  collidesWith(other: { x: number; y: number; size: number }): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.size / 2 + other.size / 2);
  }

  // New method to pull the gem towards a target
  pullTowards(targetX: number, targetY: number, deltaTime: number) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const directionX = dx / distance;
      const directionY = dy / distance;
      this.x += directionX * this.pullSpeed * deltaTime;
      this.y += directionY * this.pullSpeed * deltaTime;
    }
  }
}