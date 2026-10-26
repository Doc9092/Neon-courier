export type OrderId = 'pizza' | 'vase' | 'aquarium';

export interface OrderConfig {
  id: OrderId;
  title: string;
  difficulty: string;
  basePay: number;
  swipeImpulse: number;
  hasWaveSlosh: boolean;
}

export const ORDERS: Record<OrderId, OrderConfig> = {
  pizza: {
    id: 'pizza',
    title: 'Коробка с пиццей',
    difficulty: 'Легкий',
    basePay: 100,
    swipeImpulse: 35,
    hasWaveSlosh: false,
  },
  vase: {
    id: 'vase',
    title: 'Хрустальная ваза',
    difficulty: 'Средний',
    basePay: 250,
    swipeImpulse: 50,
    hasWaveSlosh: false,
  },
  aquarium: {
    id: 'aquarium',
    title: 'Аквариум с пираньями',
    difficulty: 'Сложный',
    basePay: 500,
    swipeImpulse: 38,
    hasWaveSlosh: true,
  },
};

export interface UpgradeLevels {
  gyro: number; // 0..3 -> 0%, 15%, 30%, 45% swipe impulse reduction
  titanium: number; // 0..3 -> 0%, 20%, 35%, 50% damage reduction
  magnet: number; // 0..3 -> coin attraction range & pull speed
}

export const GYRO_REDUCTION = [0, 0.15, 0.3, 0.45];
export const TITANIUM_REDUCTION = [0, 0.2, 0.35, 0.5];
export const UPGRADE_COSTS = [150, 350, 700];

export interface TiltPhysicsState {
  tilt: number; // -100 to +100
  tiltVelocity: number;
  hp: number; // 0 to 100
  timeSinceLastSwipe: number; // seconds
  speedMode: 'normal' | 'boost' | 'brake';
  orderId?: OrderId;
  waveTimer?: number; // 3s sinusoidal wave timer for aquarium
  wavePhase?: number;
  titaniumLevel?: number;
}

export const GAME_CONFIG = {
  TARGET_DISTANCE: 1500,
  TIME_LIMIT: 60,
  INITIAL_HP: 100,
  TILT_LIMIT: 100,
  SWIPE_INERTIA_IMPULSE: 35,
  TILT_DAMAGE: 25,
  OBSTACLE_DAMAGE: 35,
  BASE_SPEED: 26,
  BOOST_SPEED: 42,
  BRAKE_SPEED: 15,
};

export function getEffectiveSwipeImpulse(
  orderId: OrderId = 'pizza',
  gyroLevel = 0
): number {
  const base = ORDERS[orderId].swipeImpulse;
  const reduction = GYRO_REDUCTION[Math.max(0, Math.min(3, gyroLevel))] || 0;
  return base * (1 - reduction);
}

export function getEffectiveDamage(baseDamage: number, titaniumLevel = 0): number {
  const reduction = TITANIUM_REDUCTION[Math.max(0, Math.min(3, titaniumLevel))] || 0;
  return Math.round(baseDamage * (1 - reduction));
}

export function applyHorizontalSwipe(
  currentLane: number,
  currentTilt: number,
  currentTiltVel: number,
  direction: -1 | 1,
  orderId: OrderId = 'pizza',
  gyroLevel = 0
): {
  nextLane: number;
  nextTilt: number;
  nextTiltVel: number;
  caughtBalance: boolean;
  waveTimer: number;
} {
  const nextLane = Math.max(0, Math.min(2, currentLane + direction));
  const impulse = getEffectiveSwipeImpulse(orderId, gyroLevel);
  const inertiaDelta = -direction * impulse;

  const isCatching =
    (currentTilt > 15 && direction === 1) ||
    (currentTilt < -15 && direction === -1);

  let nextTilt = currentTilt + inertiaDelta;
  let nextTiltVel = currentTiltVel + inertiaDelta * 0.45;

  if (isCatching) {
    nextTiltVel *= 0.35;
  }

  nextTilt = Math.max(-GAME_CONFIG.TILT_LIMIT, Math.min(GAME_CONFIG.TILT_LIMIT, nextTilt));

  return {
    nextLane,
    nextTilt,
    nextTiltVel,
    caughtBalance: isCatching,
    waveTimer: ORDERS[orderId].hasWaveSlosh ? 3.0 : 0,
  };
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
} {
  let {
    tilt,
    tiltVelocity,
    hp,
    timeSinceLastSwipe,
    speedMode,
    orderId = 'pizza',
    waveTimer = 0,
    wavePhase = 0,
    titaniumLevel = 0,
  } = state;

  const normalizedTilt = tilt / GAME_CONFIG.TILT_LIMIT;
  const pendulumPull =
    Math.sign(tilt) *
    (Math.abs(normalizedTilt) * 28 + Math.pow(Math.abs(normalizedTilt), 2) * 42);

  const boostFactor = speedMode === 'boost' ? 1.65 : speedMode === 'brake' ? 0.65 : 1.0;

  const stabilizing = timeSinceLastSwipe > 0.35 && Math.abs(tilt) < 82;
  const stabilizePull = stabilizing ? -tilt * (speedMode === 'brake' ? 2.4 : 1.55) : 0;

  // Aquarium 3-second sinusoidal slosh wave after swiping
  let waveSloshAccel = 0;
  if ( ORDERS[orderId].hasWaveSlosh && waveTimer > 0) {
    waveTimer = Math.max(0, waveTimer - dt);
    wavePhase += dt * 7.5; // ~1.2 Hz slosh oscillation
    const waveEnvelope = waveTimer / 3.0;
    waveSloshAccel = Math.sin(wavePhase) * 95 * waveEnvelope;
  }

  const wobbleAccel = turbulenceSample * (speedMode === 'boost' ? 38 : 10);

  const totalAccel =
    pendulumPull * boostFactor + stabilizePull + wobbleAccel + waveSloshAccel;
  tiltVelocity += totalAccel * dt;
  tiltVelocity *= Math.pow(0.18, dt);
  tilt += tiltVelocity * dt;

  if (
    stabilizing &&
    waveTimer <= 0 &&
    Math.abs(tilt) < 1.2 &&
    Math.abs(tiltVelocity) < 4
  ) {
    tilt = 0;
    tiltVelocity = 0;
  }

  if (Math.abs(tilt) >= GAME_CONFIG.TILT_LIMIT) {
    const dmg = getEffectiveDamage(GAME_CONFIG.TILT_DAMAGE, titaniumLevel);
    hp = Math.max(0, hp - dmg);
    return {
      tilt: 0,
      tiltVelocity: 0,
      hp,
      crashedTilt: true,
      waveTimer: 0,
      wavePhase: 0,
    };
  }

  return {
    tilt,
    tiltVelocity,
    hp,
    crashedTilt: false,
    waveTimer,
    wavePhase,
  };
}

export function applyObstacleHit(currentHp: number, titaniumLevel = 0): number {
  const dmg = getEffectiveDamage(GAME_CONFIG.OBSTACLE_DAMAGE, titaniumLevel);
  return Math.max(0, currentHp - dmg);
}

export function calculateShiftPayout(params: {
  victory: boolean;
  orderId?: OrderId;
  hp: number;
  coins: number;
  timeLeft: number;
}): {
  basePay: number;
  conditionTip: number;
  speedTip: number;
  coinBonus: number;
  total: number;
  grade: string;
} {
  const order = ORDERS[params.orderId || 'pizza'];
  const basePay = params.victory ? order.basePay : 0;
  const conditionTip = params.victory ? Math.round((params.hp / 100) * (order.basePay * 0.6)) : 0;
  const speedTip = params.victory ? Math.round(Math.max(0, params.timeLeft) * 8) : 0;
  const coinBonus = params.coins * 15;
  const total = basePay + conditionTip + speedTip + coinBonus;

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

  return { basePay, conditionTip, speedTip, coinBonus, total, grade };
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
  | 'title'
  | 'orders'
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


