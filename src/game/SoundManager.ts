export class SoundManager {
  private sounds: Map<string, AudioBuffer>;
  private audioContext: AudioContext;
  private loadedCount: number;
  private totalCount: number;
  private onAllLoadedCallback: () => void;
  private globalVolume: number;

  constructor(onAllLoaded: () => void, initialVolume: number = 0.5) {
    this.sounds = new Map();
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.loadedCount = 0;
    this.totalCount = 0;
    this.onAllLoadedCallback = onAllLoaded;
    this.globalVolume = initialVolume;
    
    // Ses efektlerini oluştur
    this.createSounds();
  }

  private createSounds() {
    const soundCreators: { [key: string]: () => AudioBuffer } = {
      dash: () => this.createWhooshSound(0.1, 200, 50),
      level_up: () => this.createToneSound(880, 0.3, 'sine'),
      enemy_hit: () => this.createNoiseSound(0.1, 200),
      enemy_defeat: () => this.createToneSound(220, 0.5, 'square'),
      projectile_fire: () => this.createPewSound(0.1),
      homing_missile_fire: () => this.createPewSound(0.15),
      laser_beam_fire: () => this.createLaserSound(0.2),
      laser_beam_loop: () => this.createLaserLoopSound(0.3),
      explosion: () => this.createExplosionSound(0.5),
      shield_activate: () => this.createToneSound(440, 0.2, 'sine'),
      shield_deactivate: () => this.createToneSound(220, 0.2, 'sine'),
      shield_break: () => this.createNoiseSound(0.3, 1000),
      time_slow_activate: () => this.createToneSound(110, 0.4, 'sine'),
      time_slow_deactivate: () => this.createToneSound(220, 0.4, 'sine'),
      gem_collect: () => this.createToneSound(1760, 0.15, 'sine'),
      magnet_collect: () => this.createToneSound(880, 0.2, 'sine'),
      player_hit: () => this.createNoiseSound(0.2, 300),
      game_over: () => this.createToneSound(110, 1.0, 'sine'),
      game_win: () => this.createToneSound(880, 0.5, 'sine'),
      background_music: () => this.createBackgroundMusic(0.1),
      gold_collect: () => this.createToneSound(1320, 0.1, 'sine')
    };

    this.totalCount = Object.keys(soundCreators).length;

    Object.entries(soundCreators).forEach(([name, creator]) => {
      try {
        const buffer = creator();
        this.sounds.set(name, buffer);
        this.loadedCount++;
        if (this.loadedCount === this.totalCount) {
          this.onAllLoadedCallback();
        }
      } catch (error) {
        console.error(`Error creating sound ${name}:`, error);
        this.loadedCount++;
        if (this.loadedCount === this.totalCount) {
          this.onAllLoadedCallback();
        }
      }
    });
  }

  private createAudioBuffer(duration: number, sampleRate: number = 44100): AudioBuffer {
    const frameCount = sampleRate * duration;
    const channels = 1;
    const buffer = this.audioContext.createBuffer(channels, frameCount, sampleRate);
    return buffer;
  }

  private createWhooshSound(duration: number, startFreq: number, endFreq: number): AudioBuffer {
    const buffer = this.createAudioBuffer(duration);
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = startFreq + (endFreq - startFreq) * (t / duration);
      const amplitude = Math.exp(-t * 5); // Exponential decay
      data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.5;
    }
    
    return buffer;
  }

  private createToneSound(frequency: number, duration: number, type: OscillatorType): AudioBuffer {
    const buffer = this.createAudioBuffer(duration);
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const amplitude = Math.exp(-t * 3); // Exponential decay
      data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.5;
    }
    
    return buffer;
  }

  private createNoiseSound(duration: number, frequency: number): AudioBuffer {
    const buffer = this.createAudioBuffer(duration);
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const amplitude = Math.exp(-t * 5); // Exponential decay
      data[i] = amplitude * (Math.random() * 2 - 1) * 0.5;
    }
    
    return buffer;
  }

  private createPewSound(duration: number): AudioBuffer {
    const buffer = this.createAudioBuffer(duration);
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = 880 - 660 * (t / duration); // Descending frequency
      const amplitude = Math.exp(-t * 10); // Fast decay
      data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.5;
    }
    
    return buffer;
  }

  private createLaserSound(duration: number): AudioBuffer {
    const buffer = this.createAudioBuffer(duration);
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = 440 + 220 * Math.sin(2 * Math.PI * 20 * t); // Modulated frequency
      const amplitude = Math.exp(-t * 2); // Slow decay
      data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.5;
    }
    
    return buffer;
  }

  private createLaserLoopSound(duration: number): AudioBuffer {
    const buffer = this.createAudioBuffer(duration);
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = 220 + 110 * Math.sin(2 * Math.PI * 10 * t); // Modulated frequency
      data[i] = Math.sin(2 * Math.PI * frequency * t) * 0.3;
    }
    
    return buffer;
  }

  private createExplosionSound(duration: number): AudioBuffer {
    const buffer = this.createAudioBuffer(duration);
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const noise = Math.random() * 2 - 1;
      const frequency = 100 - 50 * (t / duration); // Descending frequency
      const sineWave = Math.sin(2 * Math.PI * frequency * t);
      const amplitude = Math.exp(-t * 3); // Exponential decay
      data[i] = amplitude * (noise * 0.7 + sineWave * 0.3) * 0.5;
    }
    
    return buffer;
  }

  private createBackgroundMusic(duration: number): AudioBuffer {
    const buffer = this.createAudioBuffer(duration);
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    
    // Simple arpeggiated melody
    const notes = [220, 277.18, 329.63, 440, 554.37, 659.25]; // Some notes in Hz
    const noteDuration = duration / notes.length;
    
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t / noteDuration) % notes.length;
      const frequency = notes[noteIndex];
      const amplitude = 0.1;
      data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) * 0.3;
    }
    
    return buffer;
  }

  playSound(name: string, loop: boolean = false, volume: number = 0.5): AudioBufferSourceNode | null {
    const buffer = this.sounds.get(name);
    if (buffer) {
      // AudioContext'i yeniden başlat (tarayıcı politikaları nedeniyle gerekli olabilir)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = loop;
      
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = volume * this.globalVolume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
      return source;
    } else {
      console.warn(`Sound "${name}" not found.`);
    }
    return null;
  }

  stopSound(audioInstance: AudioBufferSourceNode | null) {
    if (audioInstance) {
      audioInstance.stop();
    }
  }

  setVolume(name: string, volume: number) {
    // Bu uygulamada ses seviyesi çalma sırasında ayarlanıyor
    // Buffer başına ayrı ses seviyesi ayarı için daha karmaşık bir sistem gerekebilir
  }

  setGlobalVolume(volume: number) {
    this.globalVolume = volume;
  }
}