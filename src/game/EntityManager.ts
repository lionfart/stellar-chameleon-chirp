import { GameState } from './GameState';
import { SpriteManager } from './SpriteManager';
import { SoundManager } from './SoundManager';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { ShooterEnemy } from './ShooterEnemy';
import { Boss } from './Boss';
import { ExperienceGem } from './ExperienceGem';
import { MagnetPowerUp } from './MagnetPowerUp';
import { DamageNumber } from './DamageNumber';
import { BossAttackVisual } from './BossAttackVisual';
import { Projectile } from './Projectile'; // For enemy projectiles

export class EntityManager {
  private gameState: GameState;
  private spriteManager: SpriteManager;
  private soundManager: SoundManager;

  constructor(gameState: GameState, spriteManager: SpriteManager, soundManager: SoundManager) {
    this.gameState = gameState;
    this.spriteManager = spriteManager;
    this.soundManager = soundManager;
  }

  // Helper to check if an entity is within camera view
  private isInCameraView(entity: { x: number; y: number; size: number }, cameraX: number, cameraY: number, canvasWidth: number, canvasHeight: number): boolean {
    const buffer = 50; // Extra buffer to ensure objects entering view are drawn smoothly
    return (
      entity.x + entity.size / 2 > cameraX - buffer &&
      entity.x - entity.size / 2 < cameraX + canvasWidth + buffer &&
      entity.y + entity.size / 2 > cameraY - buffer &&
      entity.y - entity.size / 2 < cameraY + canvasHeight + buffer
    );
  }

  // --- Spawning Methods ---
  spawnEnemy(x: number, y: number, type: 'normal' | 'fast' | 'tanky' | 'shooter', size: number, speed: number, health: number, goldDrop: number, projectileStats?: { speed: number, fireRate: number, damage: number, radius: number, lifetime: number }) {
    const sprite = this.spriteManager.getSprite(`enemy_${type}`);
    const onTakeDamage = (dx: number, dy: number, damage: number) => this.addDamageNumber(dx, dy, damage);

    if (type === 'shooter' && projectileStats) {
      this.gameState.enemies.push(new ShooterEnemy(
        x, y, size, speed, 'cyan', health, sprite, this.soundManager, goldDrop, onTakeDamage,
        projectileStats.speed, projectileStats.fireRate, projectileStats.damage, projectileStats.radius, projectileStats.lifetime, this.spriteManager.getSprite('projectile')
      ));
    } else {
      this.gameState.enemies.push(new Enemy(x, y, size, speed, 'red', health, sprite, this.soundManager, goldDrop, onTakeDamage));
    }
  }

  spawnBoss(x: number, y: number, size: number, speed: number, health: number, goldDrop: number, bossName: string, onBossDefeat: () => void) {
    const spriteName = `boss_${bossName.charAt(bossName.length - 1).toLowerCase()}`; // e.g., 'boss_s'
    const bossSprite = this.spriteManager.getSprite(spriteName) || this.spriteManager.getSprite('boss'); // Fallback to generic boss
    const onTakeDamage = (dx: number, dy: number, damage: number) => this.addDamageNumber(dx, dy, damage);
    const onAddBossAttackVisual = (visual: BossAttackVisual) => this.addBossAttackVisual(visual);
    const onAddBossProjectile = (projectile: Projectile) => this.addBossProjectile(projectile);

    const boss = new Boss(
      x, y, size, speed, 'red', health, bossSprite, this.soundManager, goldDrop, onTakeDamage,
      bossName, undefined, undefined, onAddBossAttackVisual, onAddBossProjectile
    );
    this.gameState.enemies.push(boss);
    this.gameState.currentBoss = boss;
    boss.setOnDefeatCallback(onBossDefeat);
    // console.log(`Boss ${this.bossName} spawned! Health: ${this.maxHealth}`); // Removed for optimization
  }

  spawnExperienceGem(x: number, y: number, value: number) {
    const gemSprite = this.spriteManager.getSprite('experience_gem');
    this.gameState.experienceGems.push(new ExperienceGem(x, y, value, gemSprite, this.soundManager));
  }

  spawnMagnetPowerUp(x: number, y: number) {
    const magnetSprite = this.spriteManager.getSprite('magnet_powerup');
    this.gameState.magnetPowerUps.push(new MagnetPowerUp(x, y, 5, 300, magnetSprite, this.soundManager));
  }

  addDamageNumber(x: number, y: number, value: number, color: string = 'white') {
    this.gameState.damageNumbers.push(new DamageNumber(x, y, value, color));
  }

  addBossAttackVisual(visual: BossAttackVisual) {
    this.gameState.activeBossAttackVisuals.push(visual);
  }

  addBossProjectile(projectile: Projectile) {
    this.gameState.bossProjectiles.push(projectile);
  }

  // --- Update Methods ---
  update(deltaTime: number, player: Player, cameraX: number, cameraY: number, canvasWidth: number, canvasHeight: number) {
    // Update enemies and handle collisions
    const separationForces: { x: number, y: number }[] = new Array(this.gameState.enemies.length).fill(null).map(() => ({ x: 0, y: 0 }));
    const separationStrength = 100;

    for (let i = 0; i < this.gameState.enemies.length; i++) {
      const enemyA = this.gameState.enemies[i];
      for (let j = i + 1; j < this.gameState.enemies.length; j++) {
        const enemyB = this.gameState.enemies[j];

        const dx = enemyA.x - enemyB.x;
        const dy = enemyA.y - enemyB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const minDistance = enemyA.size / 2 + enemyB.size / 2;
        const separationRadius = minDistance * 1.5;

        if (distance < separationRadius) {
          const overlap = separationRadius - distance;
          const forceMagnitude = (overlap / separationRadius) * separationStrength;

          if (distance === 0) {
            const randomAngle = Math.random() * Math.PI * 2;
            separationForces[i].x += Math.cos(randomAngle) * forceMagnitude;
            separationForces[i].y += Math.sin(randomAngle) * forceMagnitude;
            separationForces[j].x -= Math.cos(randomAngle) * forceMagnitude;
            separationForces[j].y -= Math.sin(randomAngle) * forceMagnitude;
          } else {
            const normalX = dx / distance;
            const normalY = dy / distance;

            separationForces[i].x += normalX * forceMagnitude;
            separationForces[i].y += normalY * forceMagnitude;
            separationForces[j].x -= normalX * forceMagnitude;
            separationForces[j].y -= normalY * forceMagnitude;
          }
        }
      }
    }

    this.gameState.enemies.forEach((enemy, index) => {
      if (enemy instanceof ShooterEnemy) {
        enemy.update(deltaTime, player, separationForces[index]);
      } else if (enemy instanceof Boss) {
        enemy.update(deltaTime, player, separationForces[index]);
      } else {
        enemy.update(deltaTime, player, separationForces[index]);
      }

      // Check for enemy-player collision
      if (player.collidesWith(enemy)) {
        player.takeDamage(5); // Base damage for collision
      }
    });

    // Update player's projectiles (if any)
    this.gameState.projectileWeapon?.update(deltaTime, player.x, player.y, this.gameState.enemies);
    this.gameState.homingMissileWeapon?.update(deltaTime, player.x, player.y, this.gameState.enemies);
    this.gameState.laserBeamWeapon?.update(deltaTime, player.x, player.y, this.gameState.enemies);

    // Update other entities
    this.gameState.auraWeapon?.update(deltaTime, player.x, player.y, this.gameState.enemies);
    this.gameState.spinningBladeWeapon?.update(deltaTime, player.x, player.y, this.gameState.enemies);
    this.gameState.explosionAbility?.update(deltaTime, this.gameState.enemies);
    this.gameState.shieldAbility?.update(deltaTime, player.x, player.y);
    this.gameState.healAbility?.update(deltaTime);
    this.gameState.timeSlowAbility?.update(deltaTime, this.gameState.enemies);

    this.gameState.experienceGems.forEach(gem => gem.update(deltaTime));
    this.gameState.magnetPowerUps.forEach(magnet => magnet.update(deltaTime));

    // Update and filter damage numbers
    this.gameState.damageNumbers = this.gameState.damageNumbers.filter(dn => dn.update(deltaTime));

    // Update and filter boss attack visuals
    this.gameState.activeBossAttackVisuals = this.gameState.activeBossAttackVisuals.filter(visual => visual.update(deltaTime));

    // Update and filter boss projectiles
    this.gameState.bossProjectiles = this.gameState.bossProjectiles.filter(projectile => {
      const isAlive = projectile.update(deltaTime);
      if (!isAlive) return false;

      if (projectile.collidesWith(player)) {
        player.takeDamage(projectile.damage);
        return false; // Remove projectile after hitting player
      }
      return true;
    });

    // Filter out defeated enemies and spawn drops
    const defeatedEnemies = this.gameState.enemies.filter(enemy => !enemy.isAlive());
    defeatedEnemies.forEach(enemy => {
      this.spawnExperienceGem(enemy.x, enemy.y, 10);
      player.gainGold(enemy.getGoldDrop());
      if (Math.random() < 0.1) { // 10% chance to drop magnet power-up
        this.spawnMagnetPowerUp(enemy.x, enemy.y);
      }
    });
    this.gameState.enemies = this.gameState.enemies.filter(enemy => enemy.isAlive());

    // Update power-up effects (magnet)
    if (this.gameState.activeMagnetDuration > 0) {
      this.gameState.activeMagnetDuration -= deltaTime;
      if (this.gameState.activeMagnetDuration <= 0) {
        this.gameState.activeMagnetRadius = 0; // Deactivate magnet
        // console.log("Magnet effect ended."); // Removed for optimization
      }
    }

    // Determine effective magnet radius (player's base + active power-up)
    const effectiveMagnetRadius = Math.max(player.baseMagnetRadius, this.gameState.activeMagnetRadius);

    // Handle experience gem collection and magnet pull
    this.gameState.experienceGems = this.gameState.experienceGems.filter(gem => {
      // If magnet is active and gem is within range, pull it towards the player
      if (effectiveMagnetRadius > 0) {
        const dx = player.x - gem.x;
        const dy = player.y - gem.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < effectiveMagnetRadius) { // Use effective magnet radius
          gem.pullTowards(player.x, player.y, deltaTime);
        }
      }

      if (gem.collidesWith(player)) {
        player.gainExperience(gem.value);
        this.soundManager.playSound('gem_collect');
        return false;
      }
      return true;
    });

    // Update magnet power-ups (collection is handled above)
    this.gameState.magnetPowerUps = this.gameState.magnetPowerUps.filter(magnet => {
      if (magnet.collidesWith(player)) {
        this.gameState.activeMagnetRadius = magnet.radius;
        this.gameState.activeMagnetDuration = magnet.duration;
        this.soundManager.playSound('magnet_collect');
        // console.log(`Magnet power-up collected! Radius: ${this.gameState.activeMagnetRadius}, Duration: ${this.gameState.activeMagnetDuration}`); // Removed for optimization
        return false; // Remove power-up after collection
      }
      return true;
    });
  }

  // --- Draw Methods ---
  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, canvasWidth: number, canvasHeight: number) {
    // Draw player's weapons and abilities
    this.gameState.auraWeapon?.draw(ctx, this.gameState.player.x, this.gameState.player.y, cameraX, cameraY);
    this.gameState.spinningBladeWeapon?.draw(ctx, cameraX, cameraY);
    this.gameState.explosionAbility?.draw(ctx, cameraX, cameraY);
    this.gameState.shieldAbility?.draw(ctx, cameraX, cameraY);

    // Draw entities only if they are within the camera's view
    this.gameState.experienceGems.forEach(gem => {
      if (this.isInCameraView(gem, cameraX, cameraY, canvasWidth, canvasHeight)) {
        gem.draw(ctx, cameraX, cameraY);
      }
    });
    this.gameState.magnetPowerUps.forEach(magnet => {
      if (this.isInCameraView(magnet, cameraX, cameraY, canvasWidth, canvasHeight)) {
        magnet.draw(ctx, cameraX, cameraY);
      }
    });

    this.gameState.player.draw(ctx, cameraX, cameraY);

    this.gameState.enemies.forEach(enemy => {
      if (this.isInCameraView(enemy, cameraX, cameraY, canvasWidth, canvasHeight)) {
        enemy.draw(ctx, cameraX, cameraY);
      }
    });

    // Projectiles and Homing Missiles are handled separately as their 'size' is 'radius'
    this.gameState.projectileWeapon?.projectiles.forEach(p => {
      if (this.isInCameraView({ x: p.x, y: p.y, size: p.radius * 2 }, cameraX, cameraY, canvasWidth, canvasHeight)) {
        p.draw(ctx, cameraX, cameraY);
      }
    });
    this.gameState.homingMissileWeapon?.missiles.forEach(m => {
      if (this.isInCameraView({ x: m.x, y: m.y, size: m.radius * 2 }, cameraX, cameraY, canvasWidth, canvasHeight)) {
        m.draw(ctx, cameraX, cameraY);
      }
    });
    this.gameState.laserBeamWeapon?.draw(ctx, this.gameState.player.x, this.gameState.player.y, cameraX, cameraY);


    this.gameState.vendor.draw(ctx, cameraX, cameraY);

    this.gameState.damageNumbers.forEach(dn => {
      // Damage numbers are usually short-lived and close to enemies, so culling might not be strictly necessary
      // but for consistency, we can apply it.
      if (this.isInCameraView({ x: dn.x, y: dn.y, size: 20 }, cameraX, cameraY, canvasWidth, canvasHeight)) { // Approximate size for damage numbers
        dn.draw(ctx, cameraX, cameraY);
      }
    });

    this.gameState.activeBossAttackVisuals.forEach(visual => {
      if (this.isInCameraView(visual, cameraX, cameraY, canvasWidth, canvasHeight)) {
        visual.draw(ctx, cameraX, cameraY);
      }
    });

    this.gameState.bossProjectiles.forEach(projectile => {
      if (this.isInCameraView({ x: projectile.x, y: projectile.y, size: projectile.radius * 2 }, cameraX, cameraY, canvasWidth, canvasHeight)) {
        projectile.draw(ctx, cameraX, cameraY);
      }
    });

    if (this.gameState.activeMagnetRadius > 0) {
      ctx.strokeStyle = 'rgba(173, 216, 230, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.gameState.player.x - cameraX, this.gameState.player.y - cameraY, this.gameState.activeMagnetRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // --- Reset Method ---
  reset() {
    this.gameState.enemies = [];
    this.gameState.experienceGems = [];
    this.gameState.magnetPowerUps = [];
    this.gameState.damageNumbers = [];
    this.gameState.activeBossAttackVisuals = [];
    this.gameState.bossProjectiles = [];
    this.gameState.currentBoss = undefined;
  }
}