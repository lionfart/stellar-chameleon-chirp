export class InputHandler {
  private keys: Set<string>;
  private activeTouchKeys: Set<string>; // NEW: To track keys activated by touch

  constructor() {
    this.keys = new Set();
    this.activeTouchKeys = new Set(); // Initialize activeTouchKeys
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.key.toLowerCase());
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
  };

  // NEW: Method to simulate key presses from touch controls
  simulateKeyDown(key: string) {
    const lowerKey = key.toLowerCase();
    this.keys.add(lowerKey);
    this.activeTouchKeys.add(lowerKey); // Mark as touch-activated
  }

  // NEW: Method to simulate key releases from touch controls
  simulateKeyUp(key: string) {
    const lowerKey = key.toLowerCase();
    this.keys.delete(lowerKey);
    this.activeTouchKeys.delete(lowerKey); // Remove from touch-activated
  }

  isPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}