export class GameOverScreen {
  private restartGameCallback: () => void;
  private canvas: HTMLCanvasElement;
  private isListenerActive: boolean = false; // Yeni: Dinleyicinin aktif olup olmadığını takip eder

  constructor(restartGameCallback: () => void, canvas: HTMLCanvasElement) {
    this.restartGameCallback = restartGameCallback;
    this.canvas = canvas;
  }

  draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvasWidth / 2, canvasHeight / 2);
    
    // Draw restart button
    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonX = canvasWidth / 2 - buttonWidth / 2;
    const buttonY = canvasHeight / 2 + 70;

    ctx.fillStyle = '#4CAF50'; // Green button
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Restart', canvasWidth / 2, buttonY + buttonHeight / 2 + 8); // Center text vertically
  }

  // Yeni: Olay dinleyicisini etkinleştirir
  activate() {
    if (this.isListenerActive) return; // Zaten aktifse tekrar ekleme
    this.isListenerActive = true;

    this.canvas.onclick = (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const buttonWidth = 200;
      const buttonHeight = 60;
      const buttonX = this.canvas.width / 2 - buttonWidth / 2;
      const buttonY = this.canvas.height / 2 + 70;

      if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
          mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
        this.restartGameCallback();
      }
    };
  }

  clearClickListener() {
    this.canvas.onclick = null;
    this.isListenerActive = false; // Dinleyici kaldırıldığında bayrağı sıfırla
  }
}