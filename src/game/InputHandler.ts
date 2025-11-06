export class InputHandler {
  private keys: Set<string>;
  private activeTouchKeys: Set<string>;
  private touchMoveX: number = 0; // NEW: Normalized X movement from touch (-1 to 1)
  private touchMoveY: number = 0; // NEW: Normalized Y movement from touch (-1 to 1)

  constructor() {
    this.keys = new Set();
    this.activeTouchKeys = new Set();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.key.toLowerCase());
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
  };

  simulateKeyDown(key: string) {
    const lowerKey = key.toLowerCase();
    this.keys.add(lowerKey);
    this.activeTouchKeys.add(lowerKey);
  }

  simulateKeyUp(key: string) {
    const lowerKey = key.toLowerCase();
    this.keys.delete(lowerKey);
    this.activeTouchKeys.delete(lowerKey);
  }

  // NEW: Set touch movement vector
  setTouchMove(x: number, y: number) {
    this.touchMoveX = x;
    this.touchMoveY = y;
  }

  isPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  // NEW: Get combined movement vector from keyboard and touch
  getMovementVector(): { x: number; y: number } {
    let moveX = 0;
    let moveY = 0;

    // If touch movement is active, it overrides WASD movement.
    if (this.touchMoveX !== 0 || this.touchMoveY !== 0) {
        moveX = this.touchMoveX;
        moveY = this.touchMoveY;
    } else {
        // Keyboard input
        if (this.keys.has('w') || this.keys.has('arrowup')) {
            moveY -= 1;
        }
        if (this.keys.has('s') || this.keys.has('arrowdown')) {
            moveY += 1;
        }
        if (this.keys.has('a') || this.keys.has('arrowleft')) {
            moveX -= 1;
        }
        if (this.keys.has('d') || this.keys.has('arrowright')) {
            moveX += 1;
        }
    }

    // Normalize vector if magnitude > 1 (e.g., pressing W+D on keyboard)
    const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
    if (magnitude > 1) {
      moveX /= magnitude;
      moveY /= magnitude;
    }

    return { x: moveX, y: moveY };
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}