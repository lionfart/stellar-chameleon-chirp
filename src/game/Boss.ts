import { Enemy } from './Enemy';
import { Player } from './Player';
import { SoundManager } from './SoundManager';
import { DamageNumber } from './DamageNumber';
import { BossAttackVisual } from './BossAttackVisual';

export class Boss extends Enemy {
  private bossName: string;
  private phase: number;
  private phaseThresholds: number[];
  private specialAttackCooldown: number;
  private currentSpecialAttackCooldown: number;
  private onAddBossAttackVisual: (visual: BossAttackVisual) => void;
  private onDefeatCallback: () => void; // New: Callback to be triggered on defeat

  constructor(
    x: number, y: number, size: number, speed: number, color: string, maxHealth: number,
    sprite: HTMLImageElement | undefined, soundManager: SoundManager, goldDrop: number,
    onTakeDamage: (x: number, y: number, damage: number) => void,
    bossName: string = "Mega Enemy",
    phaseThresholds: number[] = [0.75, 0.5, 0.25],
    specialAttackCooldown: number = 5,
    onAddBossAttackVisual: (visual: BossAttackVisual) => void
  ) {
    super(x, y, size, speed, color, maxHealth, sprite, soundManager, goldDrop, onTakeDamage);
    this.bossName = bossName;
    this.phase = 0;
    this.phaseThresholds = phaseThresholds.sort((a, b) => b - a);
    this.specialAttackCooldown = specialAttackCooldown;
    this.currentSpecialAttackCooldown = specialAttackCooldown;
    this.onAddBossAttackVisual = onAddBossAttackVisual;
    this.onDefeatCallback = () => {}; // Initialize with an empty function
    console.log(`Boss ${this.bossName} spawned! Health: ${this.maxHealth}`);
  }

  // Setter for the defeat callback
  setOnDefeatCallback(callback: () => void) {
    this.onDefeatCallback = callback;
  }

  takeDamage(amount: number) {
    super.takeDamage(amount); // Call base Enemy takeDamage

    if (!this.isAlive() && this.onDefeatCallback) {
      this.onDefeatCallback(); // Trigger callback on defeat
    }
  }

  update(deltaTime: number, player: Player, separationVector: { x: number, y: number } = { x: 0, y: 0 }) {
    super.update(deltaTime, player, separationVector);

    if (!this.isAlive()) return;

    if (this.currentSpecialAttackCooldown > 0) {
      this.currentSpecialAttackCooldown -= deltaTime;
    } else {
      this.performSpecialAttack(player);
      this.currentSpecialAttackCooldown = this.specialAttackCooldown;
    }

    this.checkPhaseChange();
  }

  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    super.draw(ctx, cameraX, cameraY);

    if (!this.isAlive()) return;

    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.fillText(this.bossName, this.x - cameraX, this.y - cameraY - this.size / 2 - 30);
    ctx.restore();
  }

  private checkPhaseChange() {
    const healthRatio = this.currentHealth / this.maxHealth;
    for (let i = 0; i < this.phaseThresholds.length; i++) {
      if (healthRatio <= this.phaseThresholds[i] && this.phase <= i) {
        this.phase = i + 1;
        console.log(`${this.bossName} entered Phase ${this.phase}!`);
        this.onPhaseChange();
        break;
      }
    }
  }

  private onPhaseChange() {
    switch (this.phase) {
      case 1:
        this.speed *= 1.2;
        this.color = 'darkred';
        this.specialAttackCooldown *= 0.8;
        break;
      case 2:
        this.speed *= 1.1;
        this.color = 'purple';
        this.specialAttackCooldown *= 0.8;
        break;
      case 3:
        this.speed *= 1.1;
        this.color = 'black';
        this.specialAttackCooldown *= 0.8;
        break;
      default:
        break;
    }
  }

  private performSpecialAttack(player: Player) {
    console.log(`${this.bossName} performs a special attack! Phase: ${this.phase}`);
    const attackRadius = this.size * 2;
    const attackDamage = 20 + this.phase * 5;

    this.onAddBossAttackVisual(new BossAttackVisual(this.x, this.y, attackRadius, 0.5, 'red'));

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < attackRadius + player.size / 2) {
      player.takeDamage(attackDamage);
    }
    this.soundManager.playSound('explosion', false, 0.7);
  }

  getBossName(): string {
    return this.bossName;
  }
}