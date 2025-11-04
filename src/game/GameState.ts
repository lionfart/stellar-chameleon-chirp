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
import { Projectile } from './Projectile';
import { LeaderboardEntry } from '@/components/LeaderboardDialog';

export class GameState {
  player: Player;
  enemies: Enemy[];
  experienceGems: ExperienceGem[];
  magnetPowerUps: MagnetPowerUp[];
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
  damageNumbers: DamageNumber[];
  currentBoss: Boss | undefined;
  bossWarning: BossWarning | undefined;
  isBossWarningActive: boolean;
  activeBossAttackVisuals: BossAttackVisual[];
  bossProjectiles: Projectile[];

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

  isTimeSlowActive: boolean;

  playerName: string;
  soundVolume: number;
  leaderboard: LeaderboardEntry[];
  lastGameScoreEntry: LeaderboardEntry | null; // NEW: Son oyunun skorunu tutar

  constructor(
    player: Player,
    vendor: Vendor,
    worldWidth: number,
    worldHeight: number,
    playerName: string,
    initialSoundVolume: number,
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
    this.bossProjectiles = [];

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

    this.isTimeSlowActive = false;

    this.playerName = playerName;
    this.soundVolume = initialSoundVolume;
    this.leaderboard = [];
    this.lastGameScoreEntry = null; // NEW: Initialize
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
    this.bossProjectiles = [];
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

    this.isTimeSlowActive = false;
    this.lastGameScoreEntry = null; // NEW: Reset last game score
    // Player name and sound volume are not reset here, they come from EntryScreen
    // Leaderboard is managed by GameEngine
  }
}