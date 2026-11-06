import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAxialRotation,
  calculateSubsolarPoint,
  calculateLunarPhase,
  calculateOrbitalPosition,
  calculateTumble,
  formatTelemetryTime,
  LUNAR_AXIAL_TILT_RAD,
  selenographicToCartesian,
  LUNAR_LANDMARKS,
  FULLSCREEN_ORBIT_CONFIG,
  HOMEPAGE_ORBIT_CONFIG,
  computeNestedOrbitalState,
  generateNestedOrbitLoopPoints,
} from './orbitalMath.js';

test('calculateAxialRotation calculates linear progress and wraps at 2π', () => {
  const period = 100;
  assert.equal(calculateAxialRotation(0, 1, period), 0);

  const half = calculateAxialRotation(50, 1, period);
  assert.ok(Math.abs(half - Math.PI) < 1e-5);

  const full = calculateAxialRotation(100, 1, period);
  assert.ok(Math.abs(full) < 1e-5);
});

test('calculateSubsolarPoint produces bounded coordinates within valid degrees', () => {
  const coord = calculateSubsolarPoint(Math.PI / 4, 0);
  assert.ok(coord.longitudeDeg >= -180 && coord.longitudeDeg <= 180);
  const maxLat = (LUNAR_AXIAL_TILT_RAD * 180) / Math.PI;
  assert.ok(Math.abs(coord.latitudeDeg) <= maxLat + 0.01);
});

test('calculateLunarPhase returns correct illumination fraction and phase names', () => {
  const full = calculateLunarPhase(0, 0);
  assert.equal(full.illuminationFraction, 1.0);
  assert.equal(full.phaseName, 'Full Moon');

  const newMoon = calculateLunarPhase(Math.PI, 0);
  assert.equal(newMoon.illuminationFraction, 0.0);
  assert.equal(newMoon.phaseName, 'New Moon');

  const quarter = calculateLunarPhase(Math.PI / 2, 0);
  assert.ok(Math.abs(quarter.illuminationFraction - 0.5) < 0.02);
});

test('calculateOrbitalPosition generates non-zero 3D coordinates for non-zero radius', () => {
  const orbit = {
    semiMajorAxis: 15,
    eccentricity: 0.05,
    inclinationRad: 0.2,
    longitudeOfAscendingNodeRad: 0.1,
    argumentOfPeriapsisRad: 0.3,
    meanMotion: 0.1,
  };
  const pos0 = calculateOrbitalPosition(orbit, 0);
  const pos10 = calculateOrbitalPosition(orbit, 10);

  const dist0 = Math.hypot(pos0.x, pos0.y, pos0.z);
  assert.ok(dist0 > 13 && dist0 < 17);
  assert.notDeepEqual(pos0, pos10);
});

test('calculateTumble updates rotational orientation predictably', () => {
  const currentRot = { x: 0, y: 1.0, z: 2.0 };
  const angularVel = { x: 0.5, y: -0.2, z: 1.0 };
  const dt = 2;
  const nextRot = calculateTumble(currentRot, angularVel, dt);
  assert.ok(Math.abs(nextRot.x - 1.0) < 1e-4);
  assert.ok(Math.abs(nextRot.y - 0.6) < 1e-4);
  assert.ok(Math.abs(nextRot.z - 4.0) < 1e-4);
});

test('formatTelemetryTime formats time to mm:ss.ms', () => {
  assert.equal(formatTelemetryTime(0), '00:00.00');
  assert.equal(formatTelemetryTime(65.42), '01:05.42');
});

test('selenographicToCartesian maps poles and equator properly', () => {
  const northPole = selenographicToCartesian(90, 0, 3.0);
  assert.ok(Math.abs(northPole.x) < 1e-4);
  assert.ok(Math.abs(northPole.y - 3.0) < 1e-4);
  assert.ok(Math.abs(northPole.z) < 1e-4);

  const prime = selenographicToCartesian(0, 0, 3.0);
  assert.ok(Math.abs(prime.x) < 1e-4);
  assert.ok(Math.abs(prime.y) < 1e-4);
  assert.ok(Math.abs(prime.z - 3.0) < 1e-4);

  const testPoint = selenographicToCartesian(45, 60, 3.0);
  const mag = Math.hypot(testPoint.x, testPoint.y, testPoint.z);
  assert.ok(Math.abs(mag - 3.0) < 1e-4);
});

test('LUNAR_LANDMARKS contains Copernicus, Tycho, Komarov, Malapert, Plato, and Earthrise', () => {
  const ids = LUNAR_LANDMARKS.map((l) => l.id);
  assert.ok(ids.includes('copernicus'));
  assert.ok(ids.includes('tycho'));
  assert.ok(ids.includes('komarov'));
  assert.ok(ids.includes('malapert'));
  assert.ok(ids.includes('plato'));
  assert.ok(ids.includes('earthrise'));
});

test('computeNestedOrbitalState maintains stable nested loops with forward speed orthogonal to inward gravity', () => {
  for (const cfg of [FULLSCREEN_ORBIT_CONFIG, HOMEPAGE_ORBIT_CONFIG]) {
    // Verify nested radii never collide: Sun < Earth - MoonOrbit < Earth + MoonOrbit < Mars
    assert.ok(cfg.earthOrbitRadius - cfg.moonOrbitRadius > cfg.sunRadius + 0.5);
    assert.ok(cfg.marsOrbitRadius > cfg.earthOrbitRadius + cfg.moonOrbitRadius + 1.0);

    const state = computeNestedOrbitalState(25.0, cfg);

    // Earth orbits the Sun at earthOrbitRadius
    const earthSunDist = Math.hypot(
      state.earth.position.x,
      state.earth.position.y,
      state.earth.position.z
    );
    assert.ok(Math.abs(earthSunDist - cfg.earthOrbitRadius) < 1e-4);

    // Moon orbits Earth at moonOrbitRadius (nested around Earth's moving position)
    const moonEarthDist = Math.hypot(
      state.moon.position.x - state.earth.position.x,
      state.moon.position.y - state.earth.position.y,
      state.moon.position.z - state.earth.position.z
    );
    assert.ok(Math.abs(moonEarthDist - cfg.moonOrbitRadius) < 1e-4);

    // Mars independently orbits the Sun at marsOrbitRadius
    const marsSunDist = Math.hypot(
      state.mars.position.x,
      state.mars.position.y,
      state.mars.position.z
    );
    assert.ok(Math.abs(marsSunDist - cfg.marsOrbitRadius) < 1e-4);

    // Forward tangential velocity vector is perpendicular (dot product ~ 0) to inward gravity pull vector
    const dotEarth =
      state.earth.forwardDir.x * state.earth.gravityDir.x +
      state.earth.forwardDir.y * state.earth.gravityDir.y +
      state.earth.forwardDir.z * state.earth.gravityDir.z;
    const dotMoon =
      state.moon.forwardDir.x * state.moon.gravityDir.x +
      state.moon.forwardDir.y * state.moon.gravityDir.y +
      state.moon.forwardDir.z * state.moon.gravityDir.z;
    const dotMars =
      state.mars.forwardDir.x * state.mars.gravityDir.x +
      state.mars.forwardDir.y * state.mars.gravityDir.y +
      state.mars.forwardDir.z * state.mars.gravityDir.z;

    assert.ok(Math.abs(dotEarth) < 1e-4);
    assert.ok(Math.abs(dotMoon) < 1e-4);
    assert.ok(Math.abs(dotMars) < 1e-4);
  }

  const loopPts = generateNestedOrbitLoopPoints(5.6, 0, 64);
  assert.equal(loopPts.length, 65);
  assert.ok(Math.abs(loopPts[0].x - loopPts[64].x) < 1e-5);
});
