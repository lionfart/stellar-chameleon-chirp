export class BossAttackVisual {
  x: number;
  y: number;
  radius: number;
  private duration: number;
  private currentDuration: number;
  private color: string;
  size: number; // NEW: Add size property for culling

  constructor(x: number, y: number, radius: number, duration: number = 0.5, color: string = 'red') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.duration = duration;
    this.currentDuration = 0;
    this.color = color;
    this.size = radius * 2; // NEW: Initialize size based on radius for culling
  }

  update(deltaTime: number): boolean {
    this.currentDuration += deltaTime;
    return this.currentDuration < this.duration;
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    const progress = this.currentDuration / this.duration;
    const currentRadius = this.radius * (0.2 + progress * 0.8); // Start smaller, grow to full size

    // Main fill: Use the provided color, but make it more opaque as it grows
    // and ensure it doesn't fade out completely.
    const fillColor = this.color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/, (match, r, g, b, a) => {
      const baseAlpha = parseFloat(a);
      const newAlpha = Math.min(0.7, baseAlpha + progress * 0.4); // Increase opacity as it grows, max 0.7
      return `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
    });
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(this.x - cameraX, this.y - cameraY, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    // Clear, pulsing outline
    const outlineAlpha = 0.8 + Math.sin(this.currentDuration * 15) * 0.2; // Faster pulse for urgency
    const outlineWidth = 3 + Math.sin(this.currentDuration * 10) * 1.5; // Thicker, pulsing line
    ctx.strokeStyle = `rgba(255, 255, 255, ${outlineAlpha})`; // Bright white outline
    ctx.lineWidth = outlineWidth;
    ctx.beginPath();
    ctx.arc(this.x - cameraX, this.y - cameraY, currentRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Add a secondary, slightly larger red glow for more emphasis
    ctx.strokeStyle = `rgba(255, 0, 0, ${outlineAlpha * 0.5})`; // Red glow
    ctx.lineWidth = outlineWidth * 1.5;
    ctx.beginPath();
    ctx.arc(this.x - cameraX, this.y - cameraY, currentRadius + outlineWidth / 2, 0, Math.PI * 2);
    ctx.stroke();
  }
}