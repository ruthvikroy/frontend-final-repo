import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EARTH_MOON_ANALOG_PAIRS,
  EARTH_MARS_ANALOG_PAIRS,
  ALL_MOON_MISSIONS,
  MARS_ARTICLES_CATALOG,
  ALL_CURATED_DISPATCHES,
} from './planetaryAnalogsData.js';

test('EARTH_MOON_ANALOG_PAIRS restores 7 high-fidelity analog pairs', () => {
  assert.equal(EARTH_MOON_ANALOG_PAIRS.length, 7);

  const summits = EARTH_MOON_ANALOG_PAIRS.find((p) => p.id === 'pair-observatories-peaks');
  assert.ok(summits, 'Must have high-altitude summits pair');
  assert.equal(summits.earth.name, 'Mauna Kea Observatory');
  assert.equal(summits.moon.name, 'Mons Huygens Massif');
  assert.ok(summits.moon.metrics.gravityMps2 < 2.0, 'Lunar gravity should be ~1.62 m/s²');

  const trenches = EARTH_MOON_ANALOG_PAIRS.find((p) => p.id === 'pair-deepest-depressions');
  assert.ok(trenches, 'Must have deepest depressions pair');
  assert.equal(trenches.earth.metrics.elevationMeters, -10994);
});

test('EARTH_MARS_ANALOG_PAIRS contains 6 curated planetary pairs', () => {
  assert.equal(EARTH_MARS_ANALOG_PAIRS.length, 6);

  const paleolakes = EARTH_MARS_ANALOG_PAIRS.find((p) => p.id === 'mars-pair-paleolakes');
  assert.ok(paleolakes, 'Must contain paleolakes pair');
  assert.equal(paleolakes.mars.name, 'Jezero Crater Paleolake & Delta Fan');

  const volcanoes = EARTH_MARS_ANALOG_PAIRS.find((p) => p.id === 'mars-pair-volcanoes');
  assert.ok(volcanoes, 'Must contain volcanoes pair');
  assert.equal(volcanoes.mars.metrics.elevationMeters, 21900);
  assert.equal(volcanoes.mars.name, 'Olympus Mons Volcanic Colossus');

  const chasms = EARTH_MARS_ANALOG_PAIRS.find((p) => p.id === 'mars-pair-chasms');
  assert.ok(chasms, 'Must contain Valles Marineris chasm pair');
});

test('ALL_MOON_MISSIONS contains Apollo 11-17 and Artemis with complete metadata', () => {
  assert.ok(ALL_MOON_MISSIONS.length >= 7, 'Must have at least 7 lunar missions');

  const apollo11 = ALL_MOON_MISSIONS.find((m) => m.mission === 'Apollo 11');
  assert.ok(apollo11);
  assert.ok(apollo11.astronauts.some((a) => a.includes('Armstrong')));
  assert.equal(apollo11.youtubeId, 'nOcDftgR5UQ');

  const apollo12 = ALL_MOON_MISSIONS.find((m) => m.mission === 'Apollo 12');
  assert.ok(apollo12);
  assert.equal(apollo12.youtubeId, 'l11sW5KOi_g');

  const apollo14 = ALL_MOON_MISSIONS.find((m) => m.mission === 'Apollo 14');
  assert.ok(apollo14);
  assert.equal(apollo14.youtubeId, 'l7MMTm1-DAA');

  const apollo15 = ALL_MOON_MISSIONS.find((m) => m.mission === 'Apollo 15');
  assert.ok(apollo15);
  assert.equal(apollo15.youtubeId, '1Mqsd0ru_pc');

  const apollo16 = ALL_MOON_MISSIONS.find((m) => m.mission === 'Apollo 16');
  assert.ok(apollo16);
  assert.ok(apollo16.astronauts.some((a) => a.includes('Young')));
  assert.equal(apollo16.youtubeId, 'g5aPoRtF2vw');

  const apollo17 = ALL_MOON_MISSIONS.find((m) => m.mission === 'Apollo 17');
  assert.ok(apollo17);
  assert.ok(apollo17.astronauts.some((a) => a.includes('Cernan')));
  assert.equal(apollo17.youtubeId, 'g5aPoRtF2vw');

  const artemis = ALL_MOON_MISSIONS.find((m) => m.id === 'artemis-program');
  assert.ok(artemis);
  assert.equal(artemis.mission, 'Artemis 2nd');
  assert.equal(artemis.name, 'Artemis 2nd');
  assert.equal(artemis.youtubeId, '7XzhtWcepos');
});

test('MARS_ARTICLES_CATALOG covers rovers, mountains, craters, and creators', () => {
  const rovers = MARS_ARTICLES_CATALOG.filter((a) => a.section === 'rovers');
  const mountains = MARS_ARTICLES_CATALOG.filter((a) => a.section === 'mountains');
  const craters = MARS_ARTICLES_CATALOG.filter((a) => a.section === 'craters');
  const creators = MARS_ARTICLES_CATALOG.filter((a) => a.section === 'creators');

  assert.ok(rovers.length >= 3, 'Must have at least 3 rover articles (Perseverance, Curiosity, etc.)');
  assert.ok(mountains.length >= 2, 'Must have mountain articles (Olympus Mons, Tharsis)');
  assert.ok(craters.length >= 2, 'Must have crater articles (Valles Marineris, Korolev)');
  assert.ok(creators.length >= 2, 'Must have creator articles (Chris McKay, Shoemaker, etc.)');
});

test('ALL_CURATED_DISPATCHES contains the 4 research dispatches', () => {
  assert.equal(ALL_CURATED_DISPATCHES.length, 4);
  const titles = ALL_CURATED_DISPATCHES.map((d) => d.title);
  assert.ok(titles.some((t) => t.includes('Subsurface')));
  assert.ok(titles.some((t) => t.includes('Lost Oceans')));
  assert.ok(titles.some((t) => t.includes('Could Life Exist')));
  assert.ok(titles.some((t) => t.includes('Water Ice')));
});
