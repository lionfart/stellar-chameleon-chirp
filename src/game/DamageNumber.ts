export class DamageNumber {
  x: number;
  y: number;
  value: number;
  color: string;
  private lifetime: number;
  private currentLifetime: number;
  private velocityY: number;
  private alpha: number;

  constructor(x: number, y: number, value: number, color: string = 'white', lifetime: number = 1.0, velocityY: number = -50) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.color = color;
    this.lifetime = lifetime;
    this.currentLifetime = 0;
    this.velocityY = velocityY;
    this.alpha = 1;
  }

  update(deltaTime: number): boolean {
    this.currentLifetime += deltaTime;
    this.y += this.velocityY * deltaTime;
    this.alpha = 1 - (this.currentLifetime / this.lifetime);

    return this.currentLifetime < this.lifetime;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha); // Ensure alpha doesn't go below 0
    ctx.fillStyle = this.color;
    ctx.font = `bold ${20 + Math.sin(this.currentLifetime * 10) * 2}px Arial`; // Subtle pulse effect
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.fillText(this.value.toString(), this.x - cameraX, this.y - cameraY);
    ctx.restore();
  }
}