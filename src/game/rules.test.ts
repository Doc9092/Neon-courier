import test from 'node:test';
import assert from 'node:assert/strict';
import {
  stepTiltPhysics,
  applyObstacleHit,
  calculateShiftPayout,
  getEffectiveSwipeImpulse,
  isDangerTiltZone,
  stepDangerAlarm,
  resolveVisibilityPauseMode,
  getHapticPattern,
  normalizeProfilesMap,
  getNextUpgradeCost,
  canPurchaseUpgrade,
  purchaseOrEquipWheel,
  computeTrackBaseSpeed,
  computeWindAcceleration,
  createDefaultProfileData,
  MONOWHEELS,
  GAME_CONFIG,
} from './rules';

test('multi-profile storage normalizes 7-level upgrades, ownedWheels, and equippedWheel', () => {
  const raw = {
    Alex: {
      coins: 320,
      upgrades: { stabilizer: 5, armor: 3, magnet: 2, afterburner: 4 },
      ownedWheels: ['classic', 'speedster'],
      equippedWheel: 'speedster',
    },
    Max: {
      coins: 45,
      upgrades: { stabilizer: 9, shocks: 2, magnet: 3 },
      ownedWheels: ['invalid_wheel'],
      equippedWheel: 'phantom',
    },
  };
  const map = normalizeProfilesMap(raw);
  assert.equal(map.Alex.coins, 320);
  assert.equal(map.Alex.upgrades.stabilizer, 5);
  assert.equal(map.Alex.upgrades.armor, 3);
  assert.equal(map.Alex.upgrades.afterburner, 4);
  assert.deepEqual(map.Alex.ownedWheels, ['classic', 'speedster']);
  assert.equal(map.Alex.equippedWheel, 'speedster');

  // Clamped to 7, legacy shocks mapped to armor, unowned wheel falls back to classic
  assert.equal(map.Max.upgrades.stabilizer, 7);
  assert.equal(map.Max.upgrades.armor, 2);
  assert.deepEqual(map.Max.ownedWheels, ['classic']);
  assert.equal(map.Max.equippedWheel, 'classic');
});

test('4 upgrade branches use 7 exponential levels (50, 120, 250, 500, 900, 1500, 2500)', () => {
  const expectedCosts = [50, 120, 250, 500, 900, 1500, 2500];
  for (let lvl = 0; lvl < 7; lvl++) {
    assert.equal(getNextUpgradeCost('stabilizer', lvl), expectedCosts[lvl]);
    assert.equal(getNextUpgradeCost('armor', lvl), expectedCosts[lvl]);
    assert.equal(getNextUpgradeCost('magnet', lvl), expectedCosts[lvl]);
    assert.equal(getNextUpgradeCost('afterburner', lvl), expectedCosts[lvl]);
  }
  assert.equal(getNextUpgradeCost('stabilizer', 7), null);

  const profile = createDefaultProfileData(100);
  assert.equal(canPurchaseUpgrade(profile, 'stabilizer').allowed, true);
  profile.upgrades.stabilizer = 1; // next cost is 120
  assert.equal(canPurchaseUpgrade(profile, 'stabilizer').allowed, false);
});

test('monowheel shop purchases, equips, and applies stats (Speedster +15% speed, Heavy Duty -20% tilt growth, Phantom reduced hitbox)', () => {
  const profile = createDefaultProfileData(850);
  assert.equal(profile.equippedWheel, 'classic');

  // Buy Speedster (200 coins)
  const resSpeedster = purchaseOrEquipWheel(profile, 'speedster');
  assert.equal(resSpeedster.success, true);
  assert.equal(resSpeedster.action, 'purchased_and_equipped');
  assert.equal(profile.coins, 650);
  assert.equal(profile.equippedWheel, 'speedster');

  // Buy Heavy Duty (600 coins)
  const resHeavy = purchaseOrEquipWheel(profile, 'heavy_duty');
  assert.equal(resHeavy.success, true);
  assert.equal(profile.coins, 50);
  assert.equal(profile.equippedWheel, 'heavy_duty');

  // Try buying Phantom (1500 coins) with 50 coins -> fails
  const resPhantom = purchaseOrEquipWheel(profile, 'phantom');
  assert.equal(resPhantom.success, false);
  assert.equal(resPhantom.action, 'insufficient_funds');
  assert.equal(profile.equippedWheel, 'heavy_duty');

  // Re-equip Speedster -> free
  const reEquip = purchaseOrEquipWheel(profile, 'speedster');
  assert.equal(reEquip.success, true);
  assert.equal(reEquip.action, 'equipped');
  assert.equal(profile.equippedWheel, 'speedster');

  // Check wheel physics multipliers
  const baseSpeed = computeTrackBaseSpeed('neon_city', 'classic');
  const speedsterSpeed = computeTrackBaseSpeed('neon_city', 'speedster');
  assert.equal(
    speedsterSpeed,
    Number((GAME_CONFIG.BASE_SPEED * 1.15).toFixed(2))
  );
  assert.ok(speedsterSpeed > baseSpeed);

  const classicImpulse = getEffectiveSwipeImpulse('pizza', 0, 'classic');
  const heavyImpulse = getEffectiveSwipeImpulse('pizza', 0, 'heavy_duty');
  assert.equal(heavyImpulse, classicImpulse * 0.8);
  assert.ok(MONOWHEELS.phantom.hitboxMultiplier < 0.75);
});

test('afterburner upgrade accelerates passive balance recovery when riding straight', () => {
  const baseStep = stepTiltPhysics(
    {
      tilt: 40,
      tiltVelocity: 0,
      hp: 100,
      timeSinceLastSwipe: 0.6,
      speedMode: 'normal',
      afterburnerLevel: 0,
    },
    0.1,
    0
  );
  const maxAfterburnerStep = stepTiltPhysics(
    {
      tilt: 40,
      tiltVelocity: 0,
      hp: 100,
      timeSinceLastSwipe: 0.6,
      speedMode: 'normal',
      afterburnerLevel: 7,
    },
    0.1,
    0
  );
  assert.ok(
    maxAfterburnerStep.tilt < baseStep.tilt,
    'Level 7 Afterburner should pull tilt back toward 0 faster than Level 0'
  );
});

test('stabilizer and armor 7 levels reduce swipe impulse and collision damage', () => {
  assert.equal(Math.round(getEffectiveSwipeImpulse('vase', 0)), 50);
  assert.equal(Math.round(getEffectiveSwipeImpulse('vase', 7)), 22); // -56%

  assert.equal(applyObstacleHit(100, 0), 65); // -35
  assert.equal(applyObstacleHit(100, 7), 86); // -14 (-60% reduction)
});

test('rebalanced economy and track physics work', () => {
  const skyBridgePayout = calculateShiftPayout({
    victory: true,
    trackId: 'sky_bridge',
    hp: 90,
    coins: 12,
    timeLeft: 12,
  });
  assert.equal(skyBridgePayout.total, 24);
  assert.ok(Math.abs(computeWindAcceleration('cyber_wasteland', 1.2, 0)) > 0);
  assert.equal(isDangerTiltZone(76), true);
  assert.equal(stepDangerAlarm(80, 0, 0.016).shouldBeep, true);
  assert.equal(resolveVisibilityPauseMode('playing', true), 'paused');
  assert.deepEqual(getHapticPattern('crash'), [45, 30, 70]);
});
