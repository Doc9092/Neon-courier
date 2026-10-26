import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyHorizontalSwipe,
  stepTiltPhysics,
  applyObstacleHit,
  calculateShiftPayout,
  getEffectiveSwipeImpulse,
  isDangerTiltZone,
  stepDangerAlarm,
  resolveVisibilityPauseMode,
  getHapticPattern,
} from './rules';

test('pizza order swipe throws package tilt by 35, vase order by 50', () => {
  const pizzaSwipe = applyHorizontalSwipe(1, 0, 0, -1, 'pizza', 0);
  assert.equal(pizzaSwipe.nextTilt, 35);

  const vaseSwipe = applyHorizontalSwipe(1, 0, 0, -1, 'vase', 0);
  assert.equal(vaseSwipe.nextTilt, 50);
});

test('gyro-stabilizer reduces swipe impulse by 15% / 30% / 45%', () => {
  assert.equal(Math.round(getEffectiveSwipeImpulse('vase', 1)), 43); // 50 * 0.85 = 42.5
  assert.equal(Math.round(getEffectiveSwipeImpulse('vase', 2)), 35); // 50 * 0.70 = 35
  assert.equal(Math.round(getEffectiveSwipeImpulse('vase', 3)), 28); // 50 * 0.55 = 27.5
});

test('aquarium order activates 3-second sinusoidal wave slosh on swipe', () => {
  const aqSwipe = applyHorizontalSwipe(1, 0, 0, 1, 'aquarium', 0);
  assert.equal(aqSwipe.waveTimer, 3.0);

  const step1 = stepTiltPhysics(
    {
      tilt: 0,
      tiltVelocity: 0,
      hp: 100,
      timeSinceLastSwipe: 0.5,
      speedMode: 'normal',
      orderId: 'aquarium',
      waveTimer: 3.0,
      wavePhase: 0.4,
    },
    0.1,
    0
  );
  assert.ok(step1.waveTimer < 3.0);
  assert.ok(Math.abs(step1.tilt) > 0, 'Wave slosh should oscillate tilt even at 0');
});

test('titanium packaging reduces tilt crash and obstacle collision damage', () => {
  assert.equal(applyObstacleHit(100, 0), 65); // -35
  assert.equal(applyObstacleHit(100, 3), 82); // -18 (50% reduction)
});

test('payout uses selected order basePay (100, 250, 500)', () => {
  const pizzaWin = calculateShiftPayout({
    victory: true,
    orderId: 'pizza',
    hp: 100,
    coins: 4,
    timeLeft: 10,
  });
  assert.equal(pizzaWin.basePay, 100);

  const aqWin = calculateShiftPayout({
    victory: true,
    orderId: 'aquarium',
    hp: 100,
    coins: 4,
    timeLeft: 10,
  });
  assert.equal(aqWin.basePay, 500);
  assert.ok(aqWin.total > pizzaWin.total);
});

test('danger zone triggers above +75 or below -75 and pulses intermittent alarm', () => {
  assert.equal(isDangerTiltZone(75), false);
  assert.equal(isDangerTiltZone(76), true);
  assert.equal(isDangerTiltZone(-76), true);

  const firstTick = stepDangerAlarm(82, 0, 0.016);
  assert.equal(firstTick.inDanger, true);
  assert.equal(firstTick.shouldBeep, true);
  assert.ok(firstTick.nextCooldown > 0.2);

  const secondTick = stepDangerAlarm(82, firstTick.nextCooldown, 0.05);
  assert.equal(secondTick.shouldBeep, false);
});

test('visibilitychange / blur auto-pauses active gameplay and selects haptic patterns', () => {
  assert.equal(resolveVisibilityPauseMode('playing', true), 'paused');
  assert.equal(resolveVisibilityPauseMode('title', true), 'title');
  assert.equal(resolveVisibilityPauseMode('playing', false), 'playing');
  assert.deepEqual(getHapticPattern('crash'), [45, 30, 70]);
  assert.equal(getHapticPattern('swipe'), 14);
});


