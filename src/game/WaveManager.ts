import { GameState } from './GameState';
import { SpriteManager } from './SpriteManager';
import { SoundManager } from './SoundManager';
import { Enemy } from './Enemy';
import { ShooterEnemy } from './ShooterEnemy';
import { Boss } from './Boss';
import { BossWarning } from './BossWarning';
import { clamp } from './utils';
import { BossAttackVisual } from './BossAttackVisual';
import { EntityManager } from './EntityManager'; // Import EntityManager

type EnemyTypeKey = 'normal' | 'fast' | 'tanky' | 'shooter';

export class WaveManager {
  private gameState: GameState;
  private spriteManager: SpriteManager;
  private soundManager: SoundManager;
  private entityManager: EntityManager; // New: EntityManager instance
  private enemySpawnTimer: number;
  private waveDuration: number = 60; // seconds per wave
  private bossWaveInterval: number = 3; // Spawn a boss every 3 waves
  private bossSpawnLocation: { x: number, y: number } | null = null;
  private bossSpawnCorner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null = null;
  private onBossDefeatCallback: () => void; // Callback for when a boss is defeated
  private isMobile: boolean; // NEW: Track mobile status

  constructor(
    gameState: GameState,
    spriteManager: SpriteManager,
    soundManager: SoundManager,
    entityManager: EntityManager, // Directly pass EntityManager
    onBossDefeat: () => void, // Callback for when a boss is defeated
    isMobile: boolean // NEW: Add isMobile to constructor
  ) {
    this.gameState = gameState;
    this.spriteManager = spriteManager;
    this.soundManager = soundManager;
    this.entityManager = entityManager; // Assign EntityManager
    this.onBossDefeatCallback = onBossDefeat; // Assign the new callback
    this.isMobile = isMobile; // NEW: Assign isMobile
    this.enemySpawnTimer = 0;
  }

  update(deltaTime: number, cameraX: number, cameraY: number, canvasWidth: number, canvasHeight: number) {
    if ((this.gameState.currentBoss && this.gameState.currentBoss.isAlive()) || this.gameState.isBossWarningActive) {
      return;
    }

    this.gameState.waveTimeElapsed += deltaTime;
    if (this.gameState.waveTimeElapsed >= this.waveDuration) {
      this.gameState.waveNumber++;
      this.gameState.waveTimeElapsed = 0;
      this.gameState.enemySpawnInterval = Math.max(0.5, this.gameState.enemySpawnInterval * 0.9);
      console.log(`Advancing to Wave ${this.gameState.waveNumber}! New spawn interval: ${this.gameState.enemySpawnInterval.toFixed(2)}s`);

      if (this.gameState.waveNumber % this.bossWaveInterval === 0) {
        this.triggerBossWarning(canvasWidth, canvasHeight);
      }
    }

    this.enemySpawnTimer += deltaTime;
    if (this.enemySpawnTimer >= this.gameState.enemySpawnInterval) {
      this.spawnRegularEnemy(cameraX, cameraY, canvasWidth, canvasHeight);
      this.enemySpawnTimer = 0;
    }
  }

  private triggerBossWarning(canvasWidth: number, canvasHeight: number) {
    this.gameState.enemies = [];

    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
    const selectedCorner = corners[Math.floor(Math.random() * corners.length)];
    this.bossSpawnCorner = selectedCorner;

    const bossSize = this.isMobile ? 50 : 80; // NEW: Adjust boss size for mobile (from 60 to 50)
    let spawnX, spawnY;

    const offset = bossSize / 2 + 50; 
    switch (selectedCorner) {
      case 'top-left':
        spawnX = offset;
        spawnY = offset;
        break;
      case 'top-right':
        spawnX = this.gameState.worldWidth - offset;
        spawnY = offset;
        break;
      case 'bottom-left':
        spawnX = offset;
        spawnY = this.gameState.worldHeight - offset;
        break;
      case 'bottom-right':
        spawnX = this.gameState.worldWidth - offset;
        spawnY = this.gameState.worldHeight - offset;
        break;
    }
    this.bossSpawnLocation = { x: spawnX, y: spawnY };

    this.gameState.bossWarning = new BossWarning(canvasWidth, canvasHeight, selectedCorner, 3);
    this.gameState.isBossWarningActive = true;
    console.log(`BOSS WARNING: Boss will spawn in ${selectedCorner} corner!`);
  }

  spawnBossAfterWarning() {
    if (!this.bossSpawnLocation || !this.bossSpawnCorner) {
      console.error("Attempted to spawn boss without a valid spawn location/corner.");
      return;
    }

    const bossSize = this.isMobile ? 50 : 80; // NEW: Adjust boss size for mobile (from 60 to 50)
    const bossHealth = 500 + (this.gameState.waveNumber / this.bossWaveInterval - 1) * 200;
    const bossSpeed = 80;
    const bossGold = 100;
    
    const nextLetter = this.gameState.princessNameLetters[this.gameState.nextLetterIndex];
    let bossName: string;

    switch (nextLetter) {
      case 'S': bossName = `Boss S`; break;
      case 'I': bossName = `Boss I`; break;
      case 'M': bossName = `Boss M`; break;
      case 'G': bossName = `Boss G`; break;
      case 'E': bossName = `Boss E`; break;
      default: bossName = `Wave ${this.gameState.waveNumber} Boss`; break;
    }

    this.entityManager.spawnBoss( // Direct call to EntityManager
      this.bossSpawnLocation.x, this.bossSpawnLocation.y, bossSize, bossSpeed, bossHealth,
      bossGold, bossName, this.onBossDefeatCallback
    );
    
    console.log(`BOSS SPAWNED: ${bossName} at (${this.bossSpawnLocation.x.toFixed(0)}, ${this.bossSpawnLocation.y.toFixed(0)})!`);

    this.bossSpawnLocation = null;
    this.bossSpawnCorner = null;
  }

  private spawnRegularEnemy(cameraX: number, cameraY: number, canvasWidth: number, canvasHeight: number) {
    const spawnPadding = 100;
    let spawnX, spawnY;

    const side = Math.floor(Math.random() * 4);

    switch (side) {
      case 0: // Top
        spawnX = Math.random() * this.gameState.worldWidth;
        spawnY = Math.max(0, cameraY - spawnPadding);
        break;
      case 1: // Bottom
        spawnX = Math.random() * this.gameState.worldWidth;
        spawnY = Math.min(this.gameState.worldHeight, cameraY + canvasHeight + spawnPadding);
        break;
      case 2: // Left
        spawnX = Math.max(0, cameraX - spawnPadding);
        spawnY = Math.random() * this.gameState.worldHeight;
        break;
      case 3: // Right
        spawnX = Math.min(this.gameState.worldWidth, cameraX + canvasWidth + spawnPadding);
        spawnY = Math.random() * this.gameState.worldHeight;
        break;
      default:
        spawnX = Math.random() * this.gameState.worldWidth;
        spawnY = Math.random() * this.gameState.worldHeight;
    }

    spawnX = clamp(spawnX, 0, this.gameState.worldWidth);
    spawnY = clamp(spawnY, 0, this.gameState.worldHeight);

    const enemyTypes: {
      name: string;
      type: EnemyTypeKey;
      size: number;
      baseHealth: number;
      baseSpeed: number;
      color: string;
      spriteName: string;
      baseGold: number;
      projectileSpeed?: number;
      fireRate?: number;
      projectileDamage?: number;
      projectileRadius?: number;
      projectileLifetime?: number;
    }[] = [
      { name: 'normal', type: 'normal', size: 20, baseHealth: 30, baseSpeed: 100, color: 'red', spriteName: 'enemy_normal', baseGold: 5 },
      { name: 'fast', type: 'fast', size: 15, baseHealth: 20, baseSpeed: 150, color: 'green', spriteName: 'enemy_fast', baseGold: 3 },
      { name: 'tanky', type: 'tanky', size: 25, baseHealth: 50, baseSpeed: 70, color: 'purple', spriteName: 'enemy_tanky', baseGold: 8 },
      { name: 'shooter', type: 'shooter', size: 22, baseHealth: 25, baseSpeed: 80, color: 'cyan', spriteName: 'enemy_shooter', baseGold: 7,
        projectileSpeed: 200, fireRate: 2, projectileDamage: 10, projectileRadius: 6, projectileLifetime: 2 },
    ];

    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    const healthMultiplier = 1 + (this.gameState.waveNumber - 1) * 0.2;
    const speedMultiplier = 1 + (this.gameState.waveNumber - 1) * 0.05;
    const goldMultiplier = 1 + (this.gameState.waveNumber - 1) * 0.1;
    const projectileDamageMultiplier = 1 + (this.gameState.waveNumber - 1) * 0.1;

    const enemyHealth = Math.floor(randomType.baseHealth * healthMultiplier);
    const enemySpeed = randomType.baseSpeed * speedMultiplier;
    const enemyGold = Math.floor(randomType.baseGold * goldMultiplier);
    const enemySize = this.isMobile ? randomType.size * 0.7 : randomType.size; // NEW: Adjust enemy size for mobile (from 0.8 to 0.7)

    if (randomType.type === 'shooter' && randomType.projectileSpeed) {
      this.entityManager.spawnEnemy( // Direct call to EntityManager
        spawnX, spawnY, randomType.type, enemySize, enemySpeed, enemyHealth, enemyGold,
        {
          speed: randomType.projectileSpeed,
          fireRate: randomType.fireRate,
          damage: Math.floor(randomType.projectileDamage * projectileDamageMultiplier),
          radius: randomType.projectileRadius,
          lifetime: randomType.projectileLifetime
        }
      );
    } else {
      this.entityManager.spawnEnemy(spawnX, spawnY, randomType.type, enemySize, enemySpeed, enemyHealth, enemyGold); // Direct call to EntityManager
    }
  }

  reset() {
    this.enemySpawnTimer = 0;
    this.gameState.currentBoss = undefined;
    this.gameState.isBossWarningActive = false;
    this.gameState.bossWarning = undefined;
    this.bossSpawnLocation = null;
    this.bossSpawnCorner = null;
  }
}