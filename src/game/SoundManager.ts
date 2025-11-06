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

  // Placeholder Base64 Audio Data (very short, simple sounds)
  // In a real game, you would replace these with actual .wav or .mp3 files.
  static getDashSound(): string {
    // A short, sharp "whoosh" or "blip"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getLevelUpSound(): string {
    // A short, ascending tone
    return "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAIAAAAPwAAAEAAAAA/AAAAAA==";
  }

  static getEnemyHitSound(): string {
    // A quick "thwack" or "pop"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getEnemyDefeatSound(): string {
    // A slightly longer "poof" or "crumble"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getProjectileFireSound(): string {
    // A quick "pew"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getHomingMissileFireSound(): string {
    // A distinct "whoosh" or "launch" sound for homing missiles
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getLaserBeamFireSound(): string {
    // A short, high-pitched "zap" or "charge" sound
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getLaserBeamLoopSound(): string {
    // A continuous "hum" or "buzz" for the laser beam
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getExplosionSound(): string {
    // A short "boom"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getShieldActivateSound(): string {
    // A gentle "hum" or "whoosh"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getShieldDeactivateSound(): string {
    // A gentle "fade out" or "blip"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getShieldBreakSound(): string {
    // A "shatter" or "pop"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getTimeSlowActivateSound(): string {
    // A deep, warping sound
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getTimeSlowDeactivateSound(): string {
    // A quick, reversing warp sound
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getGemCollectSound(): string {
    // A short "ding" or "chime"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getMagnetCollectSound(): string {
    // A slightly deeper "ding" or "whoop"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getPlayerHitSound(): string {
    // A short "ouch" or "thump"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getGameOverSound(): string {
    // A dramatic "game over" sound or a descending tone
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getBackgroundMusic(): string {
    // A simple, looping background music placeholder
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }

  static getGoldCollectSound(): string {
    // A short, satisfying "clink" or "chaching"
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAESsAAABAAgAAABAAIAAAABAgAQAEFjdGEAAAAEAAAAAP//AAAAAA==";
  }
}