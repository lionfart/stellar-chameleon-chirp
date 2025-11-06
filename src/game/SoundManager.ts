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

  async loadSound(name: string, url: string) {
    this.totalCount++;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const objectUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(objectUrl);
      audio.preload = 'auto';
      
      audio.oncanplaythrough = () => {
        this.sounds.set(name, audio);
        this.loadedCount++;
        if (this.loadedCount === this.totalCount) {
          this.onAllLoadedCallback();
        }
      };
      
      audio.onerror = () => {
        console.error(`Failed to load sound: ${name}`);
        this.loadedCount++;
        if (this.loadedCount === this.totalCount) {
          this.onAllLoadedCallback();
        }
      };
    } catch (error) {
      console.error(`Error loading sound ${name}:`, error);
      this.loadedCount++;
      if (this.loadedCount === this.totalCount) {
        this.onAllLoadedCallback();
      }
    }
  }

  playSound(name: string, loop: boolean = false, volume: number = 0.5) {
    const audio = this.sounds.get(name);
    if (audio) {
      const clonedAudio = audio.cloneNode() as HTMLAudioElement;
      clonedAudio.volume = volume * this.globalVolume;
      clonedAudio.loop = loop;
      clonedAudio.play().catch(e => console.warn(`Failed to play sound ${name}:`, e));
      return clonedAudio;
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
      audio.volume = volume * this.globalVolume;
    }
  }

  setGlobalVolume(volume: number) {
    this.globalVolume = volume;
  }

  // Ses dosyaları için URL'ler
  static getDashSound(): string {
    return "/sounds/dash.wav";
  }

  static getLevelUpSound(): string {
    return "/sounds/level_up.wav";
  }

  static getEnemyHitSound(): string {
    return "/sounds/enemy_hit.wav";
  }

  static getEnemyDefeatSound(): string {
    return "/sounds/enemy_defeat.wav";
  }

  static getProjectileFireSound(): string {
    return "/sounds/projectile_fire.wav";
  }

  static getHomingMissileFireSound(): string {
    return "/sounds/homing_missile_fire.wav";
  }

  static getLaserBeamFireSound(): string {
    return "/sounds/laser_beam_fire.wav";
  }

  static getLaserBeamLoopSound(): string {
    return "/sounds/laser_beam_loop.wav";
  }

  static getExplosionSound(): string {
    return "/sounds/explosion.wav";
  }

  static getShieldActivateSound(): string {
    return "/sounds/shield_activate.wav";
  }

  static getShieldDeactivateSound(): string {
    return "/sounds/shield_deactivate.wav";
  }

  static getShieldBreakSound(): string {
    return "/sounds/shield_break.wav";
  }

  static getTimeSlowActivateSound(): string {
    return "/sounds/time_slow_activate.wav";
  }

  static getTimeSlowDeactivateSound(): string {
    return "/sounds/time_slow_deactivate.wav";
  }

  static getGemCollectSound(): string {
    return "/sounds/gem_collect.wav";
  }

  static getMagnetCollectSound(): string {
    return "/sounds/magnet_collect.wav";
  }

  static getPlayerHitSound(): string {
    return "/sounds/player_hit.wav";
  }

  static getGameOverSound(): string {
    return "/sounds/game_over.wav";
  }

  static getGameWinSound(): string {
    return "/sounds/game_win.wav";
  }

  static getBackgroundMusic(): string {
    return "/sounds/background_music.wav";
  }

  static getGoldCollectSound(): string {
    return "/sounds/gold_collect.wav";
  }
}