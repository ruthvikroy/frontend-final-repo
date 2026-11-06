/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Unit tests for celestial orbital mechanics, single Mars texture mode, Earth observatories, and subsurface astrobiology info
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MARS_LANDMARKS,
  MARS_3D_TEXTURE_MODES,
  EARTH_OBSERVATORIES,
  EARTH_SIMULATION_IMAGES,
  SUBSURFACE_ASTROBIOLOGY_INFO,
  LOST_OCEANS_OF_MARS_INFO,
  THREE_WORLDS_LIFE_INFO,
  MOON_WATER_ICE_INFO,
  getPlanetaryOrbitPolicy,
  areographicToCartesian,
  computeCloudDriftOffset,
  formatMarsSolTime,
} from '../data/marsLandmarks.js';
import {
  APOLLO_LANDING_SITES,
  ROBOTIC_LANDERS,
  MOON_SIMULATION_IMAGES,
} from '../data/lunarLandmarks.js';
import { MARS_CENTER, MARS_RADIUS } from './mars.js';

test('moon orbital coordinates match circular inclination formula', () => {
  const radius = 2.15;
  const incDeg = 5.14;
  const incRad = incDeg * (Math.PI / 180);
  const angle = 0.5 * Math.PI;

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(angle) * Math.sin(incRad) * radius;

  assert.ok(Math.abs(x) < 1e-5);
  assert.ok(Math.abs(z - 2.15) < 1e-5);
  assert.ok(Math.abs(y - 2.15 * Math.sin(incRad)) < 1e-5);
  assert.ok(y > 0.18 && y < 0.21);
});

test('day/night terminator smoothstep thresholds', () => {
  const smoothstep = (min, max, value) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  const daySunDot = 0.8;
  const dayFactor = smoothstep(-0.10, 0.14, daySunDot);
  const nightFactor = 1.0 - smoothstep(-0.18, 0.05, daySunDot);
  assert.equal(dayFactor, 1.0);
  assert.equal(nightFactor, 0.0);

  const nightSunDot = -0.8;
  const dayFactorNight = smoothstep(-0.10, 0.14, nightSunDot);
  const nightFactorNight = 1.0 - smoothstep(-0.18, 0.05, nightSunDot);
  assert.equal(dayFactorNight, 0.0);
  assert.equal(nightFactorNight, 1.0);
});

test('Mars orbits the Sun on an outer heliocentric loop outside the nested Earth-Moon system', () => {
  const earthHelioRadius = 5.6;
  const moonOrbitRadius = 2.05;
  const marsDistFromSun = Math.hypot(MARS_CENTER.x, MARS_CENTER.y, MARS_CENTER.z);

  assert.ok(Math.abs(marsDistFromSun - 9.4) < 1e-3);
  assert.ok(marsDistFromSun > earthHelioRadius + moonOrbitRadius + 1.0);
  assert.equal(MARS_RADIUS, 0.532);
});

test('Planetary orbit policy enables the 3 nested orbital loops (Earth-Sun, Moon-Earth, Mars-Sun)', () => {
  const policy = getPlanetaryOrbitPolicy();
  assert.equal(policy.earthHeliocentricOrbitEnabled, true);
  assert.equal(policy.earthMoonOrbitEnabled, true);
  assert.equal(policy.marsHeliocentricOrbitEnabled, true);
  assert.equal(policy.marsSatelliteOrbitsEnabled, false);
});

test('Mars landmarks, single Mars 3D texture mode, Earth observatories, and Subsurface Astrobiology info', () => {
  assert.equal(MARS_LANDMARKS.length, 6);
  assert.equal(MARS_3D_TEXTURE_MODES.length, 1);
  assert.equal(MARS_3D_TEXTURE_MODES[0].id, 'global-mola');
  assert.equal(EARTH_OBSERVATORIES.length, 6);
  assert.equal(EARTH_SIMULATION_IMAGES.length, 8);
  for (const obs of EARTH_OBSERVATORIES) {
    assert.ok(typeof obs.referenceImage === 'string' && obs.referenceImage.startsWith('/assets/aistudio/'));
    assert.ok(typeof obs.image === 'string' && obs.image.startsWith('/assets/aistudio/'));
  }
  for (const img of EARTH_SIMULATION_IMAGES) {
    assert.ok(typeof img.src === 'string' && img.src.startsWith('/assets/aistudio/'));
  }
  assert.ok(SUBSURFACE_ASTROBIOLOGY_INFO.location.includes('NASA Ames Research Center'));
  assert.ok(SUBSURFACE_ASTROBIOLOGY_INFO.meeting.includes('ELSI Origins Network (EON)'));
  assert.ok(SUBSURFACE_ASTROBIOLOGY_INFO.title.includes('The Astrobiology of the Subsurface'));
  assert.equal(
    SUBSURFACE_ASTROBIOLOGY_INFO.image,
    '/assets/aistudio/WhatsApp_Image_2026-11-05_at_6.25.50_PM_942a037b.jpeg'
  );
  assert.ok(SUBSURFACE_ASTROBIOLOGY_INFO.body.includes('Field Guide to Unknown Organisms'));
  assert.equal(LOST_OCEANS_OF_MARS_INFO.title, 'The Lost Oceans of Mars');
  assert.equal(
    LOST_OCEANS_OF_MARS_INFO.image,
    '/assets/aistudio/WhatsApp_Image_2026-11-05_at_6.25.49_PM__1__beecea09.jpeg'
  );
  assert.ok(LOST_OCEANS_OF_MARS_INFO.body.includes('Northern Hemisphere of Mars'));
  assert.ok(LOST_OCEANS_OF_MARS_INFO.authors.includes('Dr. V. Rizzo and Dr. G. Bianciardi'));
  assert.equal(THREE_WORLDS_LIFE_INFO.title, 'Three Worlds, One Question: Could Life Exist?');
  assert.equal(THREE_WORLDS_LIFE_INFO.author, 'CHRISTOPHER P. MCKAY');
  assert.equal(
    THREE_WORLDS_LIFE_INFO.image,
    '/assets/aistudio/WhatsApp_Image_2026-11-05_at_6.25.48_PM_da6dab17.jpeg'
  );
  assert.ok(THREE_WORLDS_LIFE_INFO.paragraph1.includes('cold deserts of Antarctica'));
  assert.ok(THREE_WORLDS_LIFE_INFO.paragraph2.includes('essential requirement for life'));
  assert.equal(MOON_WATER_ICE_INFO.title, "Moon's Hidden Treasure: Water Ice");
  assert.equal(MOON_WATER_ICE_INFO.author, 'Rahul Sakya');
  assert.equal(
    MOON_WATER_ICE_INFO.image,
    '/assets/aistudio/WhatsApp_Image_2026-11-05_at_6.25.49_PM_b42b9d04.jpeg'
  );
  assert.ok(MOON_WATER_ICE_INFO.body.includes('permanently shadowed regions (PSRs)'));

  for (const mode of MARS_3D_TEXTURE_MODES) {
    assert.ok(typeof mode.primaryImage === 'string' && mode.primaryImage.length > 0);
    assert.ok(Array.isArray(mode.detailImages) && mode.detailImages.length >= 2);
    assert.ok(mode.bumpBoost >= 1.0);
  }

  const jezero = MARS_LANDMARKS.find((s) => s.id === 'jezero-perseverance');
  assert.ok(jezero);
  const olympus = MARS_LANDMARKS.find((s) => s.id === 'olympus-tharsis');
  assert.equal(olympus.referenceImage, '/assets/aistudio/images__5__d7874cf9.jfif');
  const pos = areographicToCartesian(jezero.lat, jezero.lon, 0.532);
  const dist = Math.hypot(pos.x, pos.y, pos.z);
  assert.ok(Math.abs(dist - 0.532) < 1e-4);

  const drift = computeCloudDriftOffset(45, 1.0, 0.5);
  assert.equal(drift.windVelocityMps, 22.4);
  assert.ok(drift.cloudCoverPct >= 30 && drift.cloudCoverPct <= 46);

  assert.equal(formatMarsSolTime(0, 140), 'SOL 1218 · 00:00 MTC');
  assert.ok(formatMarsSolTime(70, 140).startsWith('SOL 1218 · 12:'));

  assert.equal(MOON_SIMULATION_IMAGES.length, 11);
  for (const img of MOON_SIMULATION_IMAGES) {
    assert.ok(typeof img.src === 'string' && img.src.startsWith('/assets/aistudio/'));
  }

  const apollo11 = APOLLO_LANDING_SITES.find((s) => s.id === 'apollo-11');
  assert.equal(
    apollo11.referenceImage,
    '/assets/aistudio/Neil-Armstrong-Apollo-11-Michael-Collins-Edwin_009d97d3.webp'
  );
  const apollo12 = APOLLO_LANDING_SITES.find((s) => s.id === 'apollo-12');
  assert.equal(apollo12.referenceImage, '/assets/aistudio/images__2__e87f39a5.jfif');
  assert.equal(apollo12.secondaryImage, '/assets/aistudio/images__3__ed4c9e6a.jfif');
  const apollo14 = APOLLO_LANDING_SITES.find((s) => s.id === 'apollo-14');
  assert.equal(apollo14.referenceImage, '/assets/aistudio/as14-66-09277_large_e2d149fa.jpg');
  assert.equal(apollo14.secondaryImage, '/assets/aistudio/S70-55635_large_dc7a5a33.jpg');
  const apollo15 = APOLLO_LANDING_SITES.find((s) => s.id === 'apollo-15');
  assert.equal(apollo15.referenceImage, '/assets/aistudio/images__4__459b4502.jfif');
  assert.equal(apollo15.secondaryImage, '/assets/aistudio/S71-37963_large_05a4c240.jpg');
  const apollo16 = APOLLO_LANDING_SITES.find((s) => s.id === 'apollo-16');
  assert.equal(apollo16.referenceImage, '/assets/aistudio/images__6__e1407bde.jfif');
  assert.equal(apollo16.secondaryImage, '/assets/aistudio/images__7__9cfaf9e8.jfif');
  const apollo17 = APOLLO_LANDING_SITES.find((s) => s.id === 'apollo-17');
  assert.equal(
    apollo17.referenceImage,
    '/assets/aistudio/Eugene_Cernan_at_the_LM__Apollo_17__AS17-134-20378_d1c0e605.jpg'
  );
  assert.equal(
    apollo17.secondaryImage,
    '/assets/aistudio/Apollo_17__Cernan_on_moon__AS17-140-21391_dcc18352.jpg'
  );
  const surveyor3 = ROBOTIC_LANDERS.find((s) => s.id === 'surveyor-3');
  assert.equal(surveyor3.referenceImage, '/assets/aistudio/images__2__e87f39a5.jfif');
});

/* --- End of celestial.test.js --- */
