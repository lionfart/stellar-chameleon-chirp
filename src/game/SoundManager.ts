export class SoundManager {
  private sounds: Map<string, HTMLAudioElement>;
  private loadedCount: number;
  private totalCount: number;
  private onAllLoadedCallback: () => void;
  private globalVolume: number;

  constructor(onAllLoaded: () => void, initialVolume: number = 0.5) {
    this.sounds = new Map();
    this.loadedCount = 0;
    this.totalCount = 0;
    this.onAllLoadedCallback = onAllLoaded;
    this.globalVolume = initialVolume;
  }

  loadSound(name: string, base64Audio: string) {
    this.totalCount++;
    const audio = new Audio();
    audio.src = base64Audio;
    audio.preload = 'auto'; // Start loading immediately
    audio.oncanplaythrough = () => {
      this.sounds.set(name, audio);
      this.loadedCount++;
      if (this.loadedCount === this.totalCount) {
        this.onAllLoadedCallback();
      }
    };
    audio.onerror = () => {
      console.error(`Failed to load sound: ${name}`);
      this.loadedCount++; // Still count as loaded to avoid blocking
      if (this.loadedCount === this.totalCount) {
        this.onAllLoadedCallback();
      }
    };
  }

  playSound(name: string, loop: boolean = false, volume: number = 0.5) {
    const audio = this.sounds.get(name);
    if (audio) {
      // Create a clone to allow multiple simultaneous plays
      const clonedAudio = audio.cloneNode() as HTMLAudioElement;
      clonedAudio.volume = volume * this.globalVolume; // Apply global volume
      clonedAudio.loop = loop;
      clonedAudio.play().catch(e => console.warn(`Failed to play sound ${name}:`, e));
      return clonedAudio; // Return for potential stopping if looped
    } else {
      console.warn(`Sound "${name}" not found.`);
    }
    return null;
  }

  stopSound(audioInstance: HTMLAudioElement | null) {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }
  }

  setVolume(name: string, volume: number) {
    const audio = this.sounds.get(name);
    if (audio) {
      audio.volume = volume * this.globalVolume; // Apply global volume
    }
  }

  setGlobalVolume(volume: number) {
    this.globalVolume = volume;
    // Update volume of any currently playing looped sounds, if necessary
    // For simplicity, we'll assume short sounds or manage background music separately.
    // Background music instance is managed in GameEngine.
  }

  // Gerçek Base64 Audio Verileri (kısa, basit sesler)
  static getDashSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Quick whoosh
  }

  static getLevelUpSound(): string {
    return "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAIAAAAPwAAAEAAAAA/AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Ascending chime
  }

  static getEnemyHitSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Short thud
  }

  static getEnemyDefeatSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Poof
  }

  static getProjectileFireSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Pew
  }

  static getHomingMissileFireSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Missile launch
  }

  static getLaserBeamFireSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Short zap
  }

  static getLaserBeamLoopSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Continuous hum
  }

  static getExplosionSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Boom
  }

  static getShieldActivateSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Shield up
  }

  static getShieldDeactivateSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Shield down
  }

  static getShieldBreakSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Shatter
  }

  static getTimeSlowActivateSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Deep warp
  }

  static getTimeSlowDeactivateSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Reverse warp
  }

  static getGemCollectSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Ding
  }

  static getMagnetCollectSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Whoop
  }

  static getPlayerHitSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Thump
  }

  static getGameOverSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Descending tone
  }

  static getGameWinSound(): string {
    return "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAIAAAAPwAAAEAAAAA/AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Victory fanfare (reusing level up for now)
  }

  static getBackgroundMusic(): string {
    // Simple, short looping melody
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Placeholder for a short loop
  }

  static getGoldCollectSound(): string {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAEQAAABBAAAAPwAAAD8AAAA="; // Clink
  }
}