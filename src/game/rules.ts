export type OrderId = 'pizza' | 'vase' | 'aquarium';
export type TrackId = 'neon_city' | 'cyber_wasteland' | 'sky_bridge';
export type UpgradeKey = 'stabilizer' | 'armor' | 'magnet' | 'afterburner';
export type WheelId = 'classic' | 'speedster' | 'heavy_duty' | 'phantom';

export const MAX_UPGRADE_LEVEL = 7;
export const UPGRADE_COSTS: readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
] = [50, 120, 250, 500, 900, 1500, 2500];

export interface WheelConfig {
  id: WheelId;
  title: string;
  badge: string;
  description: string;
  cost: number;
  trailColor: string;
  secondaryTrailColor: string;
  wheelWidth: number;
  speedMultiplier: number; // Спидстер: +15% (1.15)
  tiltGrowthMultiplier: number; // Тяжеловес: -20% (0.80)
  laneLerpMultiplier: number; // Тяжеловес: чуть дольше перестроение (0.72)
  hitboxMultiplier: number; // Призрак: уменьшенный хитбокс (0.68)
}

export const MONOWHEELS: Record<WheelId, WheelConfig> = {
  classic: {
    id: 'classic',
    title: 'Классика',
    badge: 'Базовый · Желтый шлейф',
    description: 'Сбалансированное моноколесо курьера. Открыто по умолчанию.',
    cost: 0,
    trailColor: '#ffb800',
    secondaryTrailColor: '#fde047',
    wheelWidth: 16,
    speedMultiplier: 1.0,
    tiltGrowthMultiplier: 1.0,
    laneLerpMultiplier: 1.0,
    hitboxMultiplier: 1.0,
  },
  speedster: {
    id: 'speedster',
    title: 'Спидстер',
    badge: 'Скорость +15% · Синий шлейф',
    description: 'Форсированный ротор: базовая скорость выше на 15%, узкий профиль.',
    cost: 200,
    trailColor: '#00f0ff',
    secondaryTrailColor: '#38bdf8',
    wheelWidth: 13,
    speedMultiplier: 1.15,
    tiltGrowthMultiplier: 1.0,
    laneLerpMultiplier: 1.08,
    hitboxMultiplier: 0.95,
  },
  heavy_duty: {
    id: 'heavy_duty',
    title: 'Тяжеловес',
    badge: 'Крен -20% · Оранжевый шлейф',
    description:
      'Наклон баланса растет на 20% медленнее, но смена полосы идет плавнее.',
    cost: 600,
    trailColor: '#ff6b00',
    secondaryTrailColor: '#fb923c',
    wheelWidth: 24,
    speedMultiplier: 1.0,
    tiltGrowthMultiplier: 0.8,
    laneLerpMultiplier: 0.72,
    hitboxMultiplier: 1.05,
  },
  phantom: {
    id: 'phantom',
    title: 'Призрак',
    badge: 'Хитбокс -32% · Фиолетовый шлейф',
    description:
      'Фазовый контур уменьшает хитбокс: легко проскальзывать между машинами.',
    cost: 1500,
    trailColor: '#a855f7',
    secondaryTrailColor: '#e879f9',
    wheelWidth: 12,
    speedMultiplier: 1.05,
    tiltGrowthMultiplier: 0.95,
    laneLerpMultiplier: 1.12,
    hitboxMultiplier: 0.68,
  },
};

export interface OrderConfig {
  id: OrderId;
  title: string;
  difficulty: string;
  swipeImpulse: number;
  hasWaveSlosh: boolean;
}

export const ORDERS: Record<OrderId, OrderConfig> = {
  pizza: {
    id: 'pizza',
    title: 'Коробка с пиццей',
    difficulty: 'Стандарт',
    swipeImpulse: 35,
    hasWaveSlosh: false,
  },
  vase: {
    id: 'vase',
    title: 'Хрустальная ваза',
    difficulty: 'Повышенная инерция',
    swipeImpulse: 50,
    hasWaveSlosh: false,
  },
  aquarium: {
    id: 'aquarium',
    title: 'Аквариум с пираньями',
    difficulty: 'Волна 3 сек',
    swipeImpulse: 38,
    hasWaveSlosh: true,
  },
};

export interface TrackConfig {
  id: TrackId;
  title: string;
  subtitle: string;
  coinMultiplier: number;
  speedMultiplier: number;
  roadWidthMultiplier: number;
  spawnRateMultiplier: number;
  hasWind: boolean;
  windPeakAccel: number;
  palette: {
    primary: string;
    secondary: string;
    skyTop: string;
    skyMid: string;
    skyBot: string;
    roadTop: string;
    roadBot: string;
  };
}

export const TRACKS: Record<TrackId, TrackConfig> = {
  neon_city: {
    id: 'neon_city',
    title: 'Неоновый Сити',
    subtitle: 'Базовая трасса · Стандартная скорость и препятствия',
    coinMultiplier: 1.0,
    speedMultiplier: 1.0,
    roadWidthMultiplier: 1.0,
    spawnRateMultiplier: 1.0,
    hasWind: false,
    windPeakAccel: 0,
    palette: {
      primary: '#00f0ff',
      secondary: '#ff2a85',
      skyTop: '#04050c',
      skyMid: '#0d0822',
      skyBot: '#050711',
      roadTop: '#090d1e',
      roadBot: '#070b18',
    },
  },
  cyber_wasteland: {
    id: 'cyber_wasteland',
    title: 'Кибер-Пустошь',
    subtitle: 'Сложная физика · Порывы бокового ветра кренят груз',
    coinMultiplier: 1.5,
    speedMultiplier: 1.05,
    roadWidthMultiplier: 0.94,
    spawnRateMultiplier: 1.12,
    hasWind: true,
    windPeakAccel: 44,
    palette: {
      primary: '#ff6b00',
      secondary: '#ff2e4c',
      skyTop: '#160608',
      skyMid: '#2c0d0b',
      skyBot: '#120506',
      roadTop: '#24100d',
      roadBot: '#140807',
    },
  },
  sky_bridge: {
    id: 'sky_bridge',
    title: 'Скай-Бридж',
    subtitle: 'Скоростная · Узкая трасса, скорость +30%, плотный трафик',
    coinMultiplier: 2.0,
    speedMultiplier: 1.3,
    roadWidthMultiplier: 0.74,
    spawnRateMultiplier: 1.35,
    hasWind: false,
    windPeakAccel: 0,
    palette: {
      primary: '#e0f2fe',
      secondary: '#38bdf8',
      skyTop: '#020b18',
      skyMid: '#08203e',
      skyBot: '#041022',
      roadTop: '#0c2340',
      roadBot: '#07162c',
    },
  },
};

export interface UpgradeLevels {
  stabilizer: number; // 0..7
  armor: number; // 0..7
  magnet: number; // 0..7
  afterburner: number; // 0..7
}

export interface CourierProfileData {
  coins: number;
  upgrades: UpgradeLevels;
  ownedWheels: WheelId[];
  equippedWheel: WheelId;
}

export type ProfilesMap = Record<string, CourierProfileData>;

export const UPGRADE_TREES: Record<
  UpgradeKey,
  {
    title: string;
    description: string;
    costs: readonly number[];
    effects: readonly number[];
  }
> = {
  stabilizer: {
    title: 'Стабилизатор',
    description: 'Гасит силу инерции при резких свайпах и порывах ветра (до -56%).',
    costs: UPGRADE_COSTS,
    effects: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56],
  },
  armor: {
    title: 'Броня',
    description: 'Снижает процент урона по посылке при ударах и крене (до -60%).',
    costs: UPGRADE_COSTS,
    effects: [0, 0.1, 0.18, 0.26, 0.34, 0.42, 0.5, 0.6],
  },
  magnet: {
    title: 'Неоновый Магнит',
    description: 'Притягивает монеты с соседних полос, радиус растет с уровнем.',
    costs: UPGRADE_COSTS,
    effects: [0, 0.85, 1.15, 1.45, 1.75, 2.05, 2.35, 2.65],
  },
  afterburner: {
    title: 'Форсаж',
    description: 'Ускоряет пассивное выравнивание баланса, когда курьер едет прямо.',
    costs: UPGRADE_COSTS,
    effects: [0, 0.15, 0.3, 0.45, 0.65, 0.85, 1.1, 1.4],
  },
};

export const GAME_CONFIG = {
  TARGET_DISTANCE: 1500,
  TIME_LIMIT: 60,
  INITIAL_HP: 100,
  TILT_LIMIT: 100,
  SWIPE_INERTIA_IMPULSE: 35,
  TILT_DAMAGE: 25,
  OBSTACLE_DAMAGE: 35,
  BASE_SPEED: 26.5,
  BOOST_SPEED: 42.0,
  BRAKE_SPEED: 15.5,
};

export function createDefaultProfileData(initialCoins = 0): CourierProfileData {
  return {
    coins: Math.max(0, Math.floor(initialCoins)),
    upgrades: {
      stabilizer: 0,
      armor: 0,
      magnet: 0,
      afterburner: 0,
    },
    ownedWheels: ['classic'],
    equippedWheel: 'classic',
  };
}

export function normalizeProfilesMap(raw: unknown): ProfilesMap {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }
  const validWheels: WheelId[] = ['classic', 'speedster', 'heavy_duty', 'phantom'];
  const result: ProfilesMap = {};
  for (const [name, val] of Object.entries(raw as Record<string, unknown>)) {
    const trimmed = name.trim();
    if (!trimmed || !val || typeof val !== 'object') continue;
    const obj = val as Record<string, unknown>;
    const coins =
      typeof obj.coins === 'number' && !Number.isNaN(obj.coins)
        ? Math.max(0, Math.floor(obj.coins))
        : 0;
    const upg =
      obj.upgrades && typeof obj.upgrades === 'object'
        ? (obj.upgrades as Record<string, unknown>)
        : {};
    const rawArmor =
      typeof upg.armor === 'number' ? upg.armor : Number(upg.shocks) || 0;

    const rawOwned = Array.isArray(obj.ownedWheels) ? obj.ownedWheels : ['classic'];
    const ownedSet = new Set<WheelId>(['classic']);
    for (const w of rawOwned) {
      if (typeof w === 'string' && validWheels.includes(w as WheelId)) {
        ownedSet.add(w as WheelId);
      }
    }
    const ownedWheels = Array.from(ownedSet);
    const equippedWheel =
      typeof obj.equippedWheel === 'string' &&
      ownedSet.has(obj.equippedWheel as WheelId)
        ? (obj.equippedWheel as WheelId)
        : 'classic';

    result[trimmed] = {
      coins,
      upgrades: {
        stabilizer: Math.max(
          0,
          Math.min(MAX_UPGRADE_LEVEL, Number(upg.stabilizer) || 0)
        ),
        armor: Math.max(0, Math.min(MAX_UPGRADE_LEVEL, rawArmor)),
        magnet: Math.max(0, Math.min(MAX_UPGRADE_LEVEL, Number(upg.magnet) || 0)),
        afterburner: Math.max(
          0,
          Math.min(MAX_UPGRADE_LEVEL, Number(upg.afterburner) || 0)
        ),
      },
      ownedWheels,
      equippedWheel,
    };
  }
  return result;
}

export function getNextUpgradeCost(
  key: UpgradeKey,
  currentLevel: number
): number | null {
  const tree = UPGRADE_TREES[key];
  if (!tree || currentLevel < 0 || currentLevel >= MAX_UPGRADE_LEVEL) {
    return null;
  }
  return tree.costs[currentLevel];
}

export function canPurchaseUpgrade(
  profile: CourierProfileData,
  key: UpgradeKey
): { allowed: boolean; cost: number | null; nextLevel: number } {
  const currentLevel = profile.upgrades[key] || 0;
  const cost = getNextUpgradeCost(key, currentLevel);
  if (cost === null || profile.coins < cost) {
    return { allowed: false, cost, nextLevel: currentLevel };
  }
  return { allowed: true, cost, nextLevel: currentLevel + 1 };
}

export function purchaseOrEquipWheel(
  profile: CourierProfileData,
  wheelId: WheelId
): {
  success: boolean;
  action: 'equipped' | 'purchased_and_equipped' | 'insufficient_funds';
} {
  const wheel = MONOWHEELS[wheelId];
  if (!wheel) {
    return { success: false, action: 'insufficient_funds' };
  }
  if (profile.ownedWheels.includes(wheelId)) {
    profile.equippedWheel = wheelId;
    return { success: true, action: 'equipped' };
  }
  if (profile.coins < wheel.cost) {
    return { success: false, action: 'insufficient_funds' };
  }
  profile.coins -= wheel.cost;
  profile.ownedWheels.push(wheelId);
  profile.equippedWheel = wheelId;
  return { success: true, action: 'purchased_and_equipped' };
}

export function getEffectiveSwipeImpulse(
  orderId: OrderId = 'pizza',
  stabilizerLevel = 0,
  wheelId: WheelId = 'classic'
): number {
  const base = ORDERS[orderId].swipeImpulse;
  const lvl = Math.max(0, Math.min(MAX_UPGRADE_LEVEL, stabilizerLevel));
  const reduction = UPGRADE_TREES.stabilizer.effects[lvl] || 0;
  const wheel = MONOWHEELS[wheelId] || MONOWHEELS.classic;
  return base * (1 - reduction) * wheel.tiltGrowthMultiplier;
}

export function getEffectiveDamage(baseDamage: number, armorLevel = 0): number {
  const lvl = Math.max(0, Math.min(MAX_UPGRADE_LEVEL, armorLevel));
  const reduction = UPGRADE_TREES.armor.effects[lvl] || 0;
  return Math.round(baseDamage * (1 - reduction));
}

export function computeTrackBaseSpeed(
  trackId: TrackId = 'neon_city',
  wheelId: WheelId = 'classic'
): number {
  const track = TRACKS[trackId] || TRACKS.neon_city;
  const wheel = MONOWHEELS[wheelId] || MONOWHEELS.classic;
  return Number(
    (GAME_CONFIG.BASE_SPEED * track.speedMultiplier * wheel.speedMultiplier).toFixed(
      2
    )
  );
}

export function computeWindAcceleration(
  trackId: TrackId,
  elapsedTime: number,
  stabilizerLevel = 0,
  wheelId: WheelId = 'classic'
): number {
  const track = TRACKS[trackId] || TRACKS.neon_city;
  if (!track.hasWind) return 0;
  const gustWave =
    Math.sin(elapsedTime * 1.35) * 0.7 + Math.cos(elapsedTime * 0.62) * 0.3;
  const lvl = Math.max(0, Math.min(MAX_UPGRADE_LEVEL, stabilizerLevel));
  const stabReduction = (UPGRADE_TREES.stabilizer.effects[lvl] || 0) * 0.65;
  const wheel = MONOWHEELS[wheelId] || MONOWHEELS.classic;
  return (
    gustWave *
    track.windPeakAccel *
    (1 - stabReduction) *
    wheel.tiltGrowthMultiplier
  );
}

export function applyHorizontalSwipe(
  currentLane: number,
  currentTilt: number,
  currentTiltVel: number,
  direction: -1 | 1,
  orderId: OrderId = 'pizza',
  stabilizerLevel = 0,
  wheelId: WheelId = 'classic'
): {
  nextLane: number;
  nextTilt: number;
  nextTiltVel: number;
  caughtBalance: boolean;
  waveTimer: number;
} {
  const nextLane = Math.max(0, Math.min(2, currentLane + direction));
  const impulse = getEffectiveSwipeImpulse(orderId, stabilizerLevel, wheelId);
  const inertiaDelta = -direction * impulse;

  const isCatching =
    (currentTilt > 15 && direction === 1) ||
    (currentTilt < -15 && direction === -1);

  let nextTilt = currentTilt + inertiaDelta;
  let nextTiltVel = currentTiltVel + inertiaDelta * 0.45;

  if (isCatching) {
    nextTiltVel *= 0.35;
  }

  nextTilt = Math.max(
    -GAME_CONFIG.TILT_LIMIT,
    Math.min(GAME_CONFIG.TILT_LIMIT, nextTilt)
  );

  return {
    nextLane,
    nextTilt,
    nextTiltVel,
    caughtBalance: isCatching,
    waveTimer: ORDERS[orderId].hasWaveSlosh ? 3.0 : 0,
  };
}

export interface TiltPhysicsState {
  tilt: number;
  tiltVelocity: number;
  hp: number;
  timeSinceLastSwipe: number;
  speedMode: 'normal' | 'boost' | 'brake';
  orderId?: OrderId;
  trackId?: TrackId;
  wheelId?: WheelId;
  elapsedTime?: number;
  waveTimer?: number;
  wavePhase?: number;
  stabilizerLevel?: number;
  armorLevel?: number;
  afterburnerLevel?: number;
}

export function stepTiltPhysics(
  state: TiltPhysicsState,
  dt: number,
  turbulenceSample = 0
): {
  tilt: number;
  tiltVelocity: number;
  hp: number;
  crashedTilt: boolean;
  waveTimer: number;
  wavePhase: number;
  windAccel: number;
} {
  let {
    tilt,
    tiltVelocity,
    hp,
    timeSinceLastSwipe,
    speedMode,
    orderId = 'pizza',
    trackId = 'neon_city',
    wheelId = 'classic',
    elapsedTime = 0,
    waveTimer = 0,
    wavePhase = 0,
    stabilizerLevel = 0,
    armorLevel = 0,
    afterburnerLevel = 0,
  } = state;

  const wheel = MONOWHEELS[wheelId] || MONOWHEELS.classic;
  const normalizedTilt = tilt / GAME_CONFIG.TILT_LIMIT;
  const pendulumPull =
    Math.sign(tilt) *
    (Math.abs(normalizedTilt) * 28 + Math.pow(Math.abs(normalizedTilt), 2) * 42) *
    wheel.tiltGrowthMultiplier;

  const boostFactor =
    speedMode === 'boost' ? 1.65 : speedMode === 'brake' ? 0.65 : 1.0;

  const afterburnerLvl = Math.max(
    0,
    Math.min(MAX_UPGRADE_LEVEL, afterburnerLevel)
  );
  const afterburnerBoost = 1 + (UPGRADE_TREES.afterburner.effects[afterburnerLvl] || 0);

  const stabilizing = timeSinceLastSwipe > 0.35 && Math.abs(tilt) < 82;
  const stabilizePull = stabilizing
    ? -tilt * (speedMode === 'brake' ? 2.4 : 1.55) * afterburnerBoost
    : 0;

  let waveSloshAccel = 0;
  if (ORDERS[orderId].hasWaveSlosh && waveTimer > 0) {
    waveTimer = Math.max(0, waveTimer - dt);
    wavePhase += dt * 7.5;
    const waveEnvelope = waveTimer / 3.0;
    waveSloshAccel =
      Math.sin(wavePhase) * 95 * waveEnvelope * wheel.tiltGrowthMultiplier;
  }

  const windAccel = computeWindAcceleration(
    trackId,
    elapsedTime,
    stabilizerLevel,
    wheelId
  );
  const wobbleAccel =
    turbulenceSample *
    (speedMode === 'boost' ? 38 : 10) *
    wheel.tiltGrowthMultiplier;

  const totalAccel =
    pendulumPull * boostFactor +
    stabilizePull +
    wobbleAccel +
    waveSloshAccel +
    windAccel;
  tiltVelocity += totalAccel * dt;
  tiltVelocity *= Math.pow(0.18, dt);
  tilt += tiltVelocity * dt;

  if (
    stabilizing &&
    waveTimer <= 0 &&
    Math.abs(windAccel) < 4 &&
    Math.abs(tilt) < 1.2 &&
    Math.abs(tiltVelocity) < 4
  ) {
    tilt = 0;
    tiltVelocity = 0;
  }

  if (Math.abs(tilt) >= GAME_CONFIG.TILT_LIMIT) {
    const dmg = getEffectiveDamage(GAME_CONFIG.TILT_DAMAGE, armorLevel);
    hp = Math.max(0, hp - dmg);
    return {
      tilt: 0,
      tiltVelocity: 0,
      hp,
      crashedTilt: true,
      waveTimer: 0,
      wavePhase: 0,
      windAccel,
    };
  }

  return {
    tilt,
    tiltVelocity,
    hp,
    crashedTilt: false,
    waveTimer,
    wavePhase,
    windAccel,
  };
}

export function applyObstacleHit(currentHp: number, armorLevel = 0): number {
  const dmg = getEffectiveDamage(GAME_CONFIG.OBSTACLE_DAMAGE, armorLevel);
  return Math.max(0, currentHp - dmg);
}

export function calculateShiftPayout(params: {
  victory: boolean;
  trackId?: TrackId;
  hp: number;
  coins: number;
  timeLeft: number;
}): {
  collectedCoins: number;
  multiplier: number;
  trackBonus: number;
  total: number;
  grade: string;
} {
  const track = TRACKS[params.trackId || 'neon_city'] || TRACKS.neon_city;
  const collectedCoins = Math.max(0, Math.floor(params.coins));
  const multiplier = track.coinMultiplier;
  const total = Math.round(collectedCoins * multiplier);
  const trackBonus = Math.max(0, total - collectedCoins);

  let grade = 'C';
  if (!params.victory) {
    grade = 'F';
  } else if (params.hp >= 90 && params.timeLeft >= 10) {
    grade = 'S+';
  } else if (params.hp >= 75) {
    grade = 'A';
  } else if (params.hp >= 50) {
    grade = 'B';
  }

  return {
    collectedCoins,
    multiplier,
    trackBonus,
    total,
    grade,
  };
}

export const DANGER_TILT_THRESHOLD = 75;

export function isDangerTiltZone(tilt: number): boolean {
  return Math.abs(tilt) > DANGER_TILT_THRESHOLD;
}

export function stepDangerAlarm(
  tilt: number,
  cooldownTimer: number,
  dt: number
): {
  inDanger: boolean;
  shouldBeep: boolean;
  nextCooldown: number;
} {
  if (!isDangerTiltZone(tilt)) {
    return {
      inDanger: false,
      shouldBeep: false,
      nextCooldown: 0,
    };
  }
  const next = cooldownTimer - dt;
  if (next <= 0) {
    return {
      inDanger: true,
      shouldBeep: true,
      nextCooldown: 0.28,
    };
  }
  return {
    inDanger: true,
    shouldBeep: false,
    nextCooldown: next,
  };
}

export type GameMode =
  | 'auth'
  | 'tracks'
  | 'garage'
  | 'playing'
  | 'paused'
  | 'gameover';

export function resolveVisibilityPauseMode(
  currentMode: GameMode,
  isHiddenOrBlurred: boolean
): GameMode {
  if (isHiddenOrBlurred && currentMode === 'playing') {
    return 'paused';
  }
  return currentMode;
}

export function getHapticPattern(
  event: 'swipe' | 'catch' | 'boost' | 'coin' | 'crash' | 'ui'
): number | number[] {
  switch (event) {
    case 'crash':
      return [45, 30, 70];
    case 'catch':
      return [12, 24, 18];
    case 'boost':
      return [16, 20, 24];
    case 'swipe':
      return 14;
    case 'coin':
    case 'ui':
    default:
      return 10;
  }
}
