import {
  LUNAR_LANDMARKS,
  APOLLO_LANDING_SITES,
  ROBOTIC_LANDERS,
  LUNAR_MARIA,
  ALL_LUNAR_LOCATIONS,
  LUNAR_LOCATIONS_MAP,
} from '../data/lunarLandmarks.js';

export {
  LUNAR_LANDMARKS,
  APOLLO_LANDING_SITES,
  ROBOTIC_LANDERS,
  LUNAR_MARIA,
  ALL_LUNAR_LOCATIONS,
  LUNAR_LOCATIONS_MAP,
};

export const LUNAR_AXIAL_TILT_RAD = (1.5424 * Math.PI) / 180; // 1.54° axial tilt relative to ecliptic

/**
 * Calculates current lunar rotation angle around polar axis in radians.
 */
export function calculateAxialRotation(
  elapsedSeconds,
  speedMultiplier = 1.0,
  basePeriodSeconds = 120
) {
  if (basePeriodSeconds <= 0) return 0;
  const angularVelocity = (2 * Math.PI) / basePeriodSeconds;
  return (elapsedSeconds * speedMultiplier * angularVelocity) % (2 * Math.PI);
}

/**
 * Calculate the sub-solar point in selenographic coordinates (lon, lat in degrees)
 */
export function calculateSubsolarPoint(sunAngleRad, moonRotationRad) {
  const relAngle = sunAngleRad - moonRotationRad;
  let lonDeg = (relAngle * 180) / Math.PI;
  lonDeg = ((lonDeg + 180) % 360) - 180;
  if (lonDeg < -180) lonDeg += 360;
  const latDeg = ((LUNAR_AXIAL_TILT_RAD * 180) / Math.PI) * Math.sin(sunAngleRad);
  return {
    longitudeDeg: Number(lonDeg.toFixed(2)),
    latitudeDeg: Number(latDeg.toFixed(2)),
  };
}

/**
 * Converts selenographic latitude & longitude (degrees) to 3D Cartesian coordinates on a sphere of radius R.
 */
export function selenographicToCartesian(latDeg, lonDeg, radius = 3.0) {
  const latRad = (latDeg * Math.PI) / 180;
  const lonRad = (lonDeg * Math.PI) / 180;
  const y = radius * Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const x = radius * cosLat * Math.sin(lonRad);
  const z = radius * cosLat * Math.cos(lonRad);
  return { x, y, z };
}

/**
 * Computes lunar phase appearance based on angle between Sun vector and Observer vector.
 */
export function calculateLunarPhase(sunAngleRad, observerAngleRad) {
  let angle = Math.abs(sunAngleRad - observerAngleRad) % (2 * Math.PI);
  if (angle > Math.PI) {
    angle = 2 * Math.PI - angle;
  }
  const phaseAngleDeg = (angle * 180) / Math.PI;
  const illuminationFraction = (1 + Math.cos(angle)) / 2;

  let phaseName = 'Full Moon';
  if (illuminationFraction < 0.03) {
    phaseName = 'New Moon';
  } else if (illuminationFraction < 0.47) {
    phaseName = sunAngleRad - observerAngleRad > 0 ? 'Waxing Crescent' : 'Waning Crescent';
  } else if (illuminationFraction <= 0.53) {
    phaseName = sunAngleRad - observerAngleRad > 0 ? 'First Quarter' : 'Last Quarter';
  } else if (illuminationFraction < 0.97) {
    phaseName = sunAngleRad - observerAngleRad > 0 ? 'Waxing Gibbous' : 'Waning Gibbous';
  }

  return {
    phaseName,
    illuminationFraction: Number(illuminationFraction.toFixed(3)),
    phaseAngleDeg: Number(phaseAngleDeg.toFixed(1)),
  };
}

/**
 * Calculates 3D orbital position from simplified Keplerian orbital elements at time t.
 */
export function calculateOrbitalPosition(orbit, timeSeconds) {
  const M = orbit.meanMotion * timeSeconds;
  const E = M + orbit.eccentricity * Math.sin(M);
  const v =
    2 *
    Math.atan2(
      Math.sqrt(1 + orbit.eccentricity) * Math.sin(E / 2),
      Math.sqrt(1 - orbit.eccentricity) * Math.cos(E / 2)
    );
  const r = orbit.semiMajorAxis * (1 - orbit.eccentricity * Math.cos(E));
  const u = v + orbit.argumentOfPeriapsisRad;
  const xOrb = r * Math.cos(u);
  const yOrb = r * Math.sin(u);
  const cosNode = Math.cos(orbit.longitudeOfAscendingNodeRad);
  const sinNode = Math.sin(orbit.longitudeOfAscendingNodeRad);
  const cosInc = Math.cos(orbit.inclinationRad);
  const sinInc = Math.sin(orbit.inclinationRad);
  const x = xOrb * cosNode - yOrb * sinNode * cosInc;
  const y = yOrb * sinInc;
  const z = xOrb * sinNode + yOrb * cosNode * cosInc;
  return { x, y, z };
}

/**
 * Tumbles a space rock across 3 axes based on its chaotic angular velocity vector.
 */
export function calculateTumble(currentRot, angularVelocity, dt) {
  const TWO_PI = Math.PI * 2;
  return {
    x: (currentRot.x + angularVelocity.x * dt) % TWO_PI,
    y: (currentRot.y + angularVelocity.y * dt) % TWO_PI,
    z: (currentRot.z + angularVelocity.z * dt) % TWO_PI,
  };
}

/**
 * Formats time or period for telemetry display.
 */
export function formatTelemetryTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 100);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
}

/**
 * Physical constants and Keplerian orbital ratios for the nested Sun–Earth–Moon–Mars system.
 * - The Moon orbits Earth in a nested geocentric loop (5.145° inclination).
 * - Earth and Mars independently orbit the Sun in heliocentric loops (Kepler's 3rd Law: ω ∝ a^(-3/2)).
 * - Each orbit stays in a stable closed loop because forward tangential speed (v = √(GM/r))
 *   balances the inward centripetal pull of gravity (a_g = v²/r).
 */
export const KEPLER_NESTED_CONSTANTS = {
  marsToEarthSemiMajorRatio: 1.524,
  marsToEarthAngularSpeedRatio: Math.pow(1 / 1.524, 1.5), // ~0.5315
  earthOrbitalVelocityKms: 29.78,
  earthCentripetalAccelMmS2: 5.93,
  moonOrbitalVelocityKms: 1.022,
  moonCentripetalAccelMmS2: 2.72,
  marsOrbitalVelocityKms: 24.07,
  marsCentripetalAccelMmS2: 2.55,
  moonInclinationRad: (5.145 * Math.PI) / 180,
  marsInclinationRad: (1.85 * Math.PI) / 180,
};

export const FULLSCREEN_ORBIT_CONFIG = {
  sunRadius: 1.32,
  earthOrbitRadius: 5.6,
  moonOrbitRadius: 2.05,
  marsOrbitRadius: 9.4,
  earthAngularSpeed: 0.045,
  moonAngularSpeed: 0.24,
  marsAngularSpeed: 0.045 * Math.pow(1 / 1.524, 1.5),
  earthInitialAngle: 0.35,
  moonInitialAngle: 0.85,
  marsInitialAngle: 3.72,
  moonInclinationRad: KEPLER_NESTED_CONSTANTS.moonInclinationRad,
  marsInclinationRad: KEPLER_NESTED_CONSTANTS.marsInclinationRad,
};

export const HOMEPAGE_ORBIT_CONFIG = {
  sunRadius: 1.45,
  earthOrbitRadius: 6.2,
  moonOrbitRadius: 2.15,
  marsOrbitRadius: 10.2,
  earthAngularSpeed: 0.06,
  moonAngularSpeed: 0.32,
  marsAngularSpeed: 0.06 * Math.pow(1 / 1.524, 1.5),
  earthInitialAngle: 0.42,
  moonInitialAngle: 0.9,
  marsInitialAngle: 3.72,
  moonInclinationRad: KEPLER_NESTED_CONSTANTS.moonInclinationRad,
  marsInclinationRad: KEPLER_NESTED_CONSTANTS.marsInclinationRad,
};

/**
 * Generates 3D points {x, y, z} for a closed orbital loop around (0, 0, 0) with given radius and inclination.
 */
export function generateNestedOrbitLoopPoints(radius, inclinationRad = 0, segments = 128) {
  const pts = [];
  const cosInc = Math.cos(inclinationRad);
  const sinInc = Math.sin(inclinationRad);
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = radius * Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const y = radius * sinTheta * sinInc;
    const z = radius * sinTheta * cosInc;
    pts.push({ x, y, z });
  }
  return pts;
}

/**
 * Computes the complete nested Sun–Earth–Moon–Mars orbital positions, forward velocity unit vectors,
 * and inward gravitational pull unit vectors at elapsed simulation time t (seconds).
 *
 * - Sun is fixed at (0, 0, 0).
 * - Earth orbits the Sun at radius `earthOrbitRadius`.
 * - Moon orbits Earth in a nested loop at `moonOrbitRadius` (world pos = earthPos + moonLocalOffset).
 * - Mars independently orbits the Sun at `marsOrbitRadius` with Keplerian angular velocity.
 */
export function computeNestedOrbitalState(
  elapsedSeconds = 0,
  config = FULLSCREEN_ORBIT_CONFIG
) {
  const t = Number(elapsedSeconds) || 0;

  // 1. Earth heliocentric orbit around the Sun (ecliptic plane, inclination = 0)
  const earthAngle = config.earthInitialAngle + t * config.earthAngularSpeed;
  const earthCos = Math.cos(earthAngle);
  const earthSin = Math.sin(earthAngle);
  const earthPos = {
    x: config.earthOrbitRadius * earthCos,
    y: 0,
    z: config.earthOrbitRadius * earthSin,
  };
  // Forward tangential velocity unit vector (perpendicular to inward gravity)
  const earthForwardDir = {
    x: -earthSin,
    y: 0,
    z: earthCos,
  };
  // Inward gravitational pull unit vector (pointing toward the Sun at origin)
  const earthGravityDir = {
    x: -earthCos,
    y: 0,
    z: -earthSin,
  };

  // 2. Moon nested geocentric orbit around Earth (inclined by 5.145° to ecliptic)
  const moonAngle = config.moonInitialAngle + t * config.moonAngularSpeed;
  const moonCos = Math.cos(moonAngle);
  const moonSin = Math.sin(moonAngle);
  const cosMoonInc = Math.cos(config.moonInclinationRad);
  const sinMoonInc = Math.sin(config.moonInclinationRad);

  const moonLocalOffset = {
    x: config.moonOrbitRadius * moonCos,
    y: config.moonOrbitRadius * moonSin * sinMoonInc,
    z: config.moonOrbitRadius * moonSin * cosMoonInc,
  };
  const moonPos = {
    x: earthPos.x + moonLocalOffset.x,
    y: earthPos.y + moonLocalOffset.y,
    z: earthPos.z + moonLocalOffset.z,
  };
  const moonForwardRaw = {
    x: -moonSin,
    y: moonCos * sinMoonInc,
    z: moonCos * cosMoonInc,
  };
  const moonForwardMag =
    Math.hypot(moonForwardRaw.x, moonForwardRaw.y, moonForwardRaw.z) || 1;
  const moonForwardDir = {
    x: moonForwardRaw.x / moonForwardMag,
    y: moonForwardRaw.y / moonForwardMag,
    z: moonForwardRaw.z / moonForwardMag,
  };
  const moonOffsetMag =
    Math.hypot(moonLocalOffset.x, moonLocalOffset.y, moonLocalOffset.z) || 1;
  // Inward gravitational pull toward Earth's center
  const moonGravityDir = {
    x: -moonLocalOffset.x / moonOffsetMag,
    y: -moonLocalOffset.y / moonOffsetMag,
    z: -moonLocalOffset.z / moonOffsetMag,
  };

  // 3. Mars independent heliocentric orbit around the Sun (inclined by 1.85° to ecliptic)
  const marsAngle = config.marsInitialAngle + t * config.marsAngularSpeed;
  const marsCos = Math.cos(marsAngle);
  const marsSin = Math.sin(marsAngle);
  const cosMarsInc = Math.cos(config.marsInclinationRad);
  const sinMarsInc = Math.sin(config.marsInclinationRad);

  const marsPos = {
    x: config.marsOrbitRadius * marsCos,
    y: config.marsOrbitRadius * marsSin * sinMarsInc,
    z: config.marsOrbitRadius * marsSin * cosMarsInc,
  };
  const marsForwardRaw = {
    x: -marsSin,
    y: marsCos * sinMarsInc,
    z: marsCos * cosMarsInc,
  };
  const marsForwardMag =
    Math.hypot(marsForwardRaw.x, marsForwardRaw.y, marsForwardRaw.z) || 1;
  const marsForwardDir = {
    x: marsForwardRaw.x / marsForwardMag,
    y: marsForwardRaw.y / marsForwardMag,
    z: marsForwardRaw.z / marsForwardMag,
  };
  const marsDist = Math.hypot(marsPos.x, marsPos.y, marsPos.z) || 1;
  // Inward gravitational pull toward the Sun at origin
  const marsGravityDir = {
    x: -marsPos.x / marsDist,
    y: -marsPos.y / marsDist,
    z: -marsPos.z / marsDist,
  };

  return {
    sunPos: { x: 0, y: 0, z: 0 },
    earth: {
      angleRad: earthAngle,
      position: earthPos,
      forwardDir: earthForwardDir,
      gravityDir: earthGravityDir,
      orbitalSpeedKms: KEPLER_NESTED_CONSTANTS.earthOrbitalVelocityKms,
      centripetalGravityMmS2: KEPLER_NESTED_CONSTANTS.earthCentripetalAccelMmS2,
      orbitRadius: config.earthOrbitRadius,
    },
    moon: {
      angleRad: moonAngle,
      localOffset: moonLocalOffset,
      position: moonPos,
      forwardDir: moonForwardDir,
      gravityDir: moonGravityDir,
      orbitalSpeedKms: KEPLER_NESTED_CONSTANTS.moonOrbitalVelocityKms,
      centripetalGravityMmS2: KEPLER_NESTED_CONSTANTS.moonCentripetalAccelMmS2,
      orbitRadius: config.moonOrbitRadius,
    },
    mars: {
      angleRad: marsAngle,
      position: marsPos,
      forwardDir: marsForwardDir,
      gravityDir: marsGravityDir,
      orbitalSpeedKms: KEPLER_NESTED_CONSTANTS.marsOrbitalVelocityKms,
      centripetalGravityMmS2: KEPLER_NESTED_CONSTANTS.marsCentripetalAccelMmS2,
      orbitRadius: config.marsOrbitRadius,
    },
  };
}

