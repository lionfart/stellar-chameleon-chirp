import { Player } from './Player';
import { Enemy } from './Enemy';
import { ExperienceGem } from './ExperienceGem';
import { MagnetPowerUp } from './MagnetPowerUp';
import { AuraWeapon } from './AuraWeapon';
import { ProjectileWeapon } from './ProjectileWeapon';
import { SpinningBladeWeapon } from './SpinningBladeWeapon';
import { HomingMissileWeapon } from './HomingMissileWeapon';
import { ExplosionAbility } from './ExplosionAbility';
import { ShieldAbility } from './ShieldAbility';
import { Vendor } from './Vendor';
import { DamageNumber } from './DamageNumber';
import { HealAbility } from './HealAbility';
import { Boss } from './Boss';
import { BossWarning } from './BossWarning';
import { BossAttackVisual } from './BossAttackVisual';
import { LaserBeamWeapon } from './LaserBeamWeapon';
import { TimeSlowAbility } from './TimeSlowAbility';
import { Projectile } from './Projectile'; // NEW: Import Projectile
import { LeaderboardEntry } from '@/components/LeaderboardDialog'; // Import LeaderboardEntry interface

export class GameState {
  player: Player;
  enemies: Enemy[]; // Still needed for iteration and collision checks, but EntityManager populates it
  experienceGems: ExperienceGem[]; // Still needed for iteration and collision checks
  magnetPowerUps: MagnetPowerUp[]; // Still needed for iteration and collision checks
  auraWeapon: AuraWeapon | undefined;
  projectileWeapon: ProjectileWeapon | undefined;
  spinningBladeWeapon: SpinningBladeWeapon | undefined;
  homingMissileWeapon: HomingMissileWeapon | undefined;
  laserBeamWeapon: LaserBeamWeapon | undefined;
  explosionAbility: ExplosionAbility | undefined;
  shieldAbility: ShieldAbility | undefined;
  healAbility: HealAbility | undefined;
  timeSlowAbility: TimeSlowAbility | undefined;
  vendor: Vendor;
  damageNumbers: DamageNumber[]; // Still needed for iteration and collision checks
  currentBoss: Boss | undefined;
  bossWarning: BossWarning | undefined;
  isBossWarningActive: boolean;
  activeBossAttackVisuals: BossAttackVisual[]; // Still needed for iteration and collision checks
  bossProjectiles: Projectile[]; // NEW: Array to hold projectiles fired by bosses

  worldWidth: number;
  worldHeight: number;
  waveNumber: number;
  waveTimeElapsed: number;
  enemySpawnInterval: number;
  waveDuration: number;
  
  gameOver: boolean;
  isPaused: boolean;
  showShop: boolean;

  activeMagnetRadius: number;
  activeMagnetDuration: number;

  princessNameLetters: string[] = ['S', 'I', 'M', 'G', 'E'];
  collectedLetters: string[] = [];
  nextLetterIndex: number = 0;
  gameWon: boolean = false;

  isTimeSlowActive: boolean; // NEW: Track if time slow is active for global visual effects

  playerName: string; // NEW: Player name
  soundVolume: number; // NEW: Sound volume
  leaderboard: LeaderboardEntry[]; // NEW: Leaderboard data

  constructor(
    player: Player,
    vendor: Vendor,
    worldWidth: number,
    worldHeight: number,
    playerName: string, // NEW
    initialSoundVolume: number, // NEW
  ) {
    this.player = player;
    this.vendor = vendor;

    this.auraWeapon = undefined;
    this.projectileWeapon = undefined;
    this.spinningBladeWeapon = undefined;
    this.homingMissileWeapon = undefined;
    this.laserBeamWeapon = undefined;
    this.explosionAbility = undefined;
    this.shieldAbility = undefined;
    this.healAbility = undefined;
    this.timeSlowAbility = undefined;

    this.enemies = [];
    this.experienceGems = [];
    this.magnetPowerUps = [];
    this.damageNumbers = [];
    this.currentBoss = undefined;
    this.bossWarning = undefined;
    this.isBossWarningActive = false;
    this.activeBossAttackVisuals = [];
    this.bossProjectiles = []; // NEW: Initialize boss projectiles

    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.waveNumber = 1;
    this.waveTimeElapsed = 0;
    this.enemySpawnInterval = 2;
    this.waveDuration = 60;

    this.gameOver = false;
    this.isPaused = false;
    this.showShop = false;

    this.activeMagnetRadius = 0;
    this.activeMagnetDuration = 0;

    this.isTimeSlowActive = false; // NEW: Initialize

    this.playerName = playerName; // NEW
    this.soundVolume = initialSoundVolume; // NEW
    this.leaderboard = []; // NEW
  }

  reset() {
    this.enemies = [];
    this.experienceGems = [];
    this.magnetPowerUps = [];
    this.damageNumbers = [];
    this.currentBoss = undefined;
    this.bossWarning = undefined;
    this.isBossWarningActive = false;
    this.activeBossAttackVisuals = [];
    this.bossProjectiles = []; // NEW: Reset boss projectiles
    this.waveNumber = 1;
    this.waveTimeElapsed = 0;
    this.enemySpawnInterval = 2;
    this.waveDuration = 60;
    this.gameOver = false;
    this.isPaused = false;
    this.showShop = false;
    this.activeMagnetRadius = 0;
    this.activeMagnetDuration = 0;
    this.auraWeapon = undefined;
    this.projectileWeapon = undefined;
    this.spinningBladeWeapon = undefined;
    this.homingMissileWeapon = undefined;
    this.laserBeamWeapon = undefined;
    this.explosionAbility = undefined;
    this.shieldAbility = undefined;
    this.healAbility = undefined;
    this.timeSlowAbility = undefined;

    this.collectedLetters = [];
    this.nextLetterIndex = 0;
    this.gameWon = false;

    this.isTimeSlowActive = false; // NEW: Reset
    // Player name and sound volume are not reset here, they come from EntryScreen
    // Leaderboard is managed by GameEngine
  }
}