import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine, GameDataProps, MinimapEnemyData } from '@/game/GameEngine';
import LevelUpSelection from './LevelUpSelection';
import ShopScreen from './ShopScreen';
import HUD from './HUD';
import Minimap from './Minimap';
import { showSuccess } from '@/utils/toast';
import LeaderboardWidget from './LeaderboardWidget';
import RestartButton from './RestartButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile'; // NEW: Import useIsMobile
import MobileAbilityButtons from './MobileAbilityButtons'; // NEW: Import MobileAbilityButtons

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'weapon' | 'ability' | 'consumable';
}

interface GameCanvasProps {
  playerName: string;
  initialSoundVolume: number;
}

const getLevelUpOptions = (gameState: any, t: (key: string) => string) => {
  const options = [
    { id: 'auraDamage', name: '', description: '' },
    { id: 'playerSpeed', name: '', description: '' },
    { id: 'playerHealth', name: '', description: '' },
    { id: 'projectileDamage', name: '', description: '' },
    { id: 'projectileFireRate', name: '', description: '' },
    { id: 'homingMissileDamage', name: '', description: '' },
    { id: 'homingMissileFireRate', name: '', description: '' },
    { id: 'homingMissileCount', name: '', description: '' },
    { id: 'laserBeamDamage', name: '', description: '' },
    { id: 'laserBeamRange', name: '', description: '' },
    { id: 'dashCooldown', name: '', description: '' },
    { id: 'bladeDamage', name: '', description: '' },
    { id: 'addBlade', name: '', description: '' },
    { id: 'explosionDamage', name: '', description: '' },
    { id: 'explosionCooldown', name: '', description: '' },
    { id: 'explosionRadius', name: '', description: '' },
    { id: 'shieldHealth', name: '', description: '' },
    { id: 'shieldRegen', name: '', description: '' },
    { id: 'shieldCooldown', name: '', description: '' },
    { id: 'healAmount', name: '', description: '' },
    { id: 'healCooldown', name: '', description: '' },
    { id: 'timeSlowFactor', name: '', description: '' },
    { id: 'timeSlowDuration', name: '', description: '' },
    { id: 'timeSlowCooldown', name: '', description: '' },
    { id: 'playerMagnetRadius', name: '', description: '' },
    { id: 'experienceBoost', name: '', description: '' },
    { id: 'goldBoost', name: '', description: '' },
  ];

  return options.filter(option => {
    if (option.id.startsWith('aura') && !gameState.auraWeapon) return false;
    if (option.id.startsWith('projectile') && !gameState.projectileWeapon) return false;
    if (option.id.startsWith('blade') && !gameState.spinningBladeWeapon) return false;
    if (option.id.startsWith('homingMissile') && !gameState.homingMissileWeapon) return false;
    if (option.id.startsWith('laserBeam') && !gameState.laserBeamWeapon) return false;
    if (option.id.startsWith('explosion') && !gameState.explosionAbility) return false;
    if (option.id.startsWith('shield') && !gameState.shieldAbility) return false;
    if (option.id.startsWith('heal') && !gameState.healAbility) return false;
    if (option.id.startsWith('timeSlow') && !gameState.timeSlowAbility) return false;
    return true;
  });
};

const getShopItems = (t: (key: string) => string): ShopItem[] => [
  { id: 'buy_aura_weapon', name: t('auraWeapon'), description: t('auraWeaponDesc'), cost: 100, type: 'weapon' },
  { id: 'buy_projectile_weapon', name: t('projectileWeapon'), description: t('projectileWeaponDesc'), cost: 100, type: 'weapon' },
  { id: 'buy_spinning_blade_weapon', name: t('spinningBladeWeapon'), description: t('spinningBladeWeaponDesc'), cost: 100, type: 'weapon' },
  { id: 'buy_homing_missile_weapon', name: t('homingMissileWeapon'), description: t('homingMissileWeaponDesc'), cost: 120, type: 'weapon' },
  { id: 'buy_laser_beam_weapon', name: t('laserBeamWeapon'), description: t('laserBeamWeaponDesc'), cost: 150, type: 'weapon' },
  { id: 'buy_explosion_ability', name: t('explosionAbility'), description: t('explosionAbilityDesc'), cost: 150, type: 'ability' },
  { id: 'buy_shield_ability', name: t('shieldAbility'), description: t('shieldAbilityDesc'), cost: 150, type: 'ability' },
  { id: 'buy_heal_ability', name: t('healAbility'), description: t('healAbilityDesc'), cost: 120, type: 'ability' },
  { id: 'buy_time_slow_ability', name: t('timeSlowAbility'), description: t('timeSlowAbilityDesc'), cost: 180, type: 'ability' },
  { id: 'buy_health_potion', name: t('healthPotion'), description: t('healthPotionDesc'), cost: 50, type: 'consumable' },
];


const GameCanvas: React.FC<GameCanvasProps> = ({ playerName, initialSoundVolume }) => {
  console.log("GameCanvas component rendering...");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [showLevelUpScreen, setShowLevelUpScreen] = useState(false);
  const [currentLevelUpOptions, setCurrentLevelUpOptions] = useState<{ id: string; name: string; description: string }[]>([]);
  const [showShopScreen, setShowShopScreen] = useState(false);
  const [currentShopItems, setCurrentShopItems] = useState<ShopItem[]>([]);
  const [playerGold, setPlayerGold] = useState(0);
  const notificationsShownRef = useRef(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile(); // NEW: Use useIsMobile hook

  // NEW: Touch input state
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchMoveThreshold = 5; // Smaller threshold for more immediate response
  const virtualJoystickMaxDistance = 100; // Max distance from touchStart to register full speed

  const [gameDataState, setGameDataState] = useState<GameDataProps>({
    playerName: playerName,
    playerHealth: 100,
    playerMaxHealth: 100,
    playerLevel: 1,
    playerExperience: 0,
    playerExperienceToNextLevel: 100,
    playerGold: 0,
    shieldActive: false,
    shieldCurrentHealth: 0,
    shieldMaxHealth: 0,
    waveNumber: 1,
    waveTimeRemaining: 60,
    dashCooldownCurrent: 0,
    dashCooldownMax: 0,
    explosionCooldownCurrent: 0,
    explosionCooldownMax: 0,
    shieldCooldownCurrent: 0,
    shieldCooldownMax: 0,
    healCooldownCurrent: 0,
    healCooldownMax: 0,
    timeSlowCooldownCurrent: 0,
    timeSlowCooldownMax: 0,
    bossActive: false,
    bossHealth: 0,
    bossMaxHealth: 0,
    bossName: '',
    collectedLetters: [],
    gameWon: false,
    gameOver: false,
    lastGameScoreEntry: null,
    playerX: 0,
    playerY: 0,
    worldWidth: 2000,
    worldHeight: 2000,
    cameraX: 0,
    cameraY: 0,
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    enemiesMinimap: [],
    vendorX: 0,
    vendorY: 0,
  });

  const handleLevelUp = useCallback(() => {
    if (!gameEngineRef.current) return;
    const availableOptions = getLevelUpOptions(gameEngineRef.current.getGameState(), t);
    const shuffled = [...availableOptions].sort(() => 0.5 - Math.random());
    setCurrentLevelUpOptions(shuffled.slice(0, 3));
    setShowLevelUpScreen(true);
    gameEngineRef.current?.pause();
  }, [t]);

  const handleSelectUpgrade = useCallback((upgradeId: string) => {
    gameEngineRef.current?.applyUpgrade(upgradeId);
    setShowLevelUpScreen(false);
    gameEngineRef.current?.resume();
  }, []);

  const handleOpenShop = useCallback((items: ShopItem[], gold: number) => {
    console.log("GameCanvas: handleOpenShop called.");
    const availableShopItems = getShopItems(t).filter(item => {
      if (item.id === 'buy_aura_weapon' && gameEngineRef.current?.getGameState().auraWeapon) return false;
      if (item.id === 'buy_projectile_weapon' && gameEngineRef.current?.getGameState().projectileWeapon) return false;
      if (item.id === 'buy_spinning_blade_weapon' && gameEngineRef.current?.getGameState().spinningBladeWeapon) return false;
      if (item.id === 'buy_homing_missile_weapon' && gameEngineRef.current?.getGameState().homingMissileWeapon) return false;
      if (item.id === 'buy_laser_beam_weapon' && gameEngineRef.current?.getGameState().laserBeamWeapon) return false;
      if (item.id === 'buy_explosion_ability' && gameEngineRef.current?.getGameState().explosionAbility) return false;
      if (item.id === 'buy_shield_ability' && gameEngineRef.current?.getGameState().shieldAbility) return false;
      if (item.id === 'buy_heal_ability' && gameEngineRef.current?.getGameState().healAbility) return false;
      if (item.id === 'buy_time_slow_ability' && gameEngineRef.current?.getGameState().timeSlowAbility) return false;
      return true;
    });
    setCurrentShopItems(availableShopItems);
    setPlayerGold(gold);
    setShowShopScreen(true);
  }, [t]);

  const handleCloseShop = useCallback(() => {
    console.log("GameCanvas: handleCloseShop called.");
    setShowShopScreen(false);
  }, []);

  const handlePurchaseItem = useCallback((itemId: string) => {
    gameEngineRef.current?.purchaseItem(itemId);
  }, []);

  const handleUpdateGameData = useCallback((data: GameDataProps) => {
    setGameDataState(data);
  }, []);

  // NEW: Ability button press handler
  const handleAbilityPress = useCallback((key: string) => {
    gameEngineRef.current?.['inputHandler'].simulateKeyDown(key);
  }, []);

  // NEW: Ability button release handler
  const handleAbilityRelease = useCallback((key: string) => {
    gameEngineRef.current?.['inputHandler'].simulateKeyUp(key);
  }, []);

  // NEW: Full-screen touch movement handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !gameEngineRef.current || e.touches.length !== 1) return;
    e.preventDefault();
    touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    gameEngineRef.current['inputHandler'].setTouchMove(0, 0); // Reset movement on new touch
  }, [isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !gameEngineRef.current || !touchStartPos.current || e.touches.length !== 1) return;
    e.preventDefault();

    const currentTouchX = e.touches[0].clientX;
    const currentTouchY = e.touches[0].clientY;

    const dx = currentTouchX - touchStartPos.current.x;
    const dy = currentTouchY - touchStartPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > touchMoveThreshold) {
      // Normalize dx, dy based on a virtual max distance
      const clampedDistance = Math.min(distance, virtualJoystickMaxDistance);
      const scaleFactor = clampedDistance / virtualJoystickMaxDistance;

      const normalizedX = (dx / distance) * scaleFactor;
      const normalizedY = (dy / distance) * scaleFactor;

      gameEngineRef.current['inputHandler'].setTouchMove(normalizedX, normalizedY);
    } else {
      gameEngineRef.current['inputHandler'].setTouchMove(0, 0); // If within dead zone, stop movement
    }
  }, [isMobile, virtualJoystickMaxDistance]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !gameEngineRef.current) return;
    gameEngineRef.current['inputHandler'].setTouchMove(0, 0); // Stop movement on touch end
    touchStartPos.current = null;
  }, [isMobile]);


  useEffect(() => {
    console.log("GameCanvas useEffect: Initializing GameEngine...");
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameEngineRef.current = new GameEngine(ctx, handleLevelUp, handleOpenShop, handleCloseShop, handleUpdateGameData, playerName, initialSoundVolume, t, isMobile); // NEW: Pass isMobile to GameEngine
    gameEngineRef.current.init();

    // Conditionally show notifications based on isMobile
    if (!isMobile && !notificationsShownRef.current) {
      setTimeout(() => showSuccess(t('moveKeys')), 500);
      setTimeout(() => showSuccess(t('dashKey')), 2500);
      setTimeout(() => showSuccess(t('abilitiesKeys')), 4500);
      setTimeout(() => showSuccess(t('vendorShop')), 12500);
      notificationsShownRef.current = true;
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setGameDataState(prevState => ({
        ...prevState,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
      }));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log("GameCanvas useEffect cleanup: Stopping GameEngine.");
      gameEngineRef.current?.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, [handleLevelUp, handleOpenShop, handleCloseShop, handleUpdateGameData, playerName, initialSoundVolume, t, isMobile]);

  const isGameOverOrWon = gameDataState.gameOver || gameDataState.gameWon;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block bg-black"
        style={{ width: '100vw', height: '100vh' }}
        onTouchStart={handleTouchStart} // NEW: Add touch event listeners to canvas
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />
      {showLevelUpScreen && (
        <LevelUpSelection onSelectUpgrade={handleSelectUpgrade} options={currentLevelUpOptions} />
      )}
      {showShopScreen && (
        <ShopScreen
          items={currentShopItems}
          onPurchase={handlePurchaseItem}
          onClose={() => gameEngineRef.current?.closeShop()}
          playerGold={playerGold}
        />
      )}
      <HUD {...gameDataState} isMobile={isMobile} /> {/* NEW: Pass isMobile prop to HUD */}
      <Minimap {...gameDataState} />

      {isMobile && !isGameOverOrWon && !showLevelUpScreen && !showShopScreen && (
        <>
          {/* MobileJoystick kaldırıldı */}
          <MobileAbilityButtons
            onAbilityPress={handleAbilityPress}
            onAbilityRelease={handleAbilityRelease}
            dashCooldownCurrent={gameDataState.dashCooldownCurrent}
            dashCooldownMax={gameDataState.dashCooldownMax}
            explosionCooldownCurrent={gameDataState.explosionCooldownCurrent}
            explosionCooldownMax={gameDataState.explosionCooldownMax}
            shieldCooldownCurrent={gameDataState.shieldCooldownCurrent}
            shieldCooldownMax={gameDataState.shieldCooldownMax}
            healCooldownCurrent={gameDataState.healCooldownCurrent}
            healCooldownMax={gameDataState.healCooldownMax}
            timeSlowCooldownCurrent={gameDataState.timeSlowCooldownCurrent}
            timeSlowCooldownMax={gameDataState.timeSlowCooldownMax}
            shieldActive={gameDataState.shieldActive}
          />
        </>
      )}

      {isGameOverOrWon && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-8">
            {gameDataState.gameWon ? t('youWin') : t('gameOver')}
          </h1>
          <div className="space-y-4 w-full max-w-md">
            <LeaderboardWidget currentScoreEntry={gameDataState.lastGameScoreEntry} />
            <RestartButton onClick={() => gameEngineRef.current?.restartGame()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;