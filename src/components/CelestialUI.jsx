/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Full screen 3D simulation overlay and telemetry HUD for Earth, Moon and Mars with Earth observatories and subsurface astrobiology info
*/
import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Disc,
  MapPin,
  Rocket,
  X,
  Compass,
  Radio,
  Layers,
  Cloud,
} from 'lucide-react';
import {
  APOLLO_LANDING_SITES,
  LUNAR_LANDMARKS,
  ROBOTIC_LANDERS,
  LUNAR_MARIA,
  LUNAR_LOCATIONS_MAP,
  MOON_SIMULATION_IMAGES,
} from '../data/lunarLandmarks.js';
import {
  MARS_LANDMARKS,
  MARS_LOCATIONS_MAP,
  MARS_3D_TEXTURE_MODES,
  EARTH_OBSERVATORIES,
  EARTH_SIMULATION_IMAGES,
  EARTH_OBSERVATORIES_MAP,
} from '../data/marsLandmarks.js';

export function CelestialUI({
  viewMode,
  setViewMode,
  isPaused,
  setIsPaused,
  showOrbits,
  setShowOrbits,
  showLandingSites = true,
  setShowLandingSites = () => {},
  marsTextureMode = 'global-mola',
  setMarsTextureMode = () => {},
  marsCloudOpacity = 0.65,
  setMarsCloudOpacity = () => {},
  marsCloudDriftSpeed = 1.0,
  setMarsCloudDriftSpeed = () => {},
  marsDustIntensity = 0.42,
  setMarsDustIntensity = () => {},
  onResetCamera,
  hasInteracted,
  selectedLandmarkId = null,
  setSelectedLandmarkId = () => {},
  onPlayClick = () => {},
  onReturnToDashboard = () => {},
  onReturnToEditorial = () => {},
  flightTelemetry = null,
}) {
  const [showInfo, setShowInfo] = useState(true);
  const [showSitesDrawer, setShowSitesDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState('apollo');

  const NAV_ITEMS = [
    { id: 'overview', label: 'System' },
    { id: 'earth', label: 'Earth' },
    { id: 'moon', label: 'Moon' },
    { id: 'mars', label: 'Mars' },
    { id: 'orbit', label: 'Orbits' },
  ];

  const DESCRIPTIONS = {
    overview: {
      tag: 'NESTED HELIOCENTRIC & GEOCENTRIC SYSTEM',
      title: 'Sun, Earth, Moon & Mars Nested Orbits',
      desc: 'The Moon orbits Earth, while both Earth and Mars independently orbit the Sun, all kept in stable, nested loops by the balance of their forward speed against the inward pull of gravity.',
      data: [
        { label: 'EARTH → SUN', value: '1.000 AU (29.78 KM/S)' },
        { label: 'MOON → EARTH', value: '384,400 KM (1.022 KM/S)' },
        { label: 'MARS → SUN', value: '1.524 AU (24.07 KM/S)' },
        { label: 'FORCE BALANCE', value: 'v = √(GM/r) ⊥ a_g = v²/r' },
      ],
    },
    earth: {
      tag: 'INNER HELIOCENTRIC ORBIT • 1.000 AU',
      title: 'Planet Earth & Lunar/Martian Observatories',
      desc: 'Earth orbits the Sun at 29.78 km/s while hosting high-altitude optical, submillimeter, radar, and astrobiology observatories researching the Moon and Mars.',
      data: [
        { label: 'ORBITAL SPEED', value: '29.78 KM/S' },
        { label: 'SOLAR GRAVITY', value: '5.93 MM/S² INWARD' },
        { label: 'AXIAL TILT', value: '23.44°' },
        { label: 'OBSERVATORIES', value: '6 MOON & MARS SITES' },
      ],
    },
    moon: {
      tag: 'NESTED GEOCENTRIC ORBIT • 384,400 KM',
      title: 'The Moon',
      desc: 'The Moon orbits Earth in a 5.145° inclined nested loop at 1.022 km/s, balanced against Earth’s 2.72 mm/s² inward gravitational pull as both travel around the Sun.',
      data: [
        { label: 'ORBITAL SPEED', value: '1.022 KM/S (AROUND EARTH)' },
        { label: 'EARTH GRAVITY', value: '2.72 MM/S² INWARD' },
        { label: 'INCLINATION', value: '5.145° TO ECLIPTIC' },
        { label: 'RADIUS', value: '1,737.4 KM' },
      ],
    },
    mars: {
      tag: 'OUTER HELIOCENTRIC ORBIT • 1.524 AU',
      title: 'The Red Planet (Mars)',
      desc: 'Mars independently orbits the Sun at 24.07 km/s along an outer heliocentric loop, featuring 25.19° axial obliquity and a unified Global MOLA + Viking/MRO 3D surface texture.',
      data: [
        { label: 'ORBITAL SPEED', value: '24.07 KM/S (AROUND SUN)' },
        { label: 'SOLAR GRAVITY', value: '2.55 MM/S² INWARD' },
        { label: 'AXIAL TILT', value: '25.19°' },
        { label: 'SIDEREAL SOL', value: '24H 37M 22S' },
      ],
    },
    orbit: {
      tag: 'KEPLERIAN DYNAMICS • 3 NESTED LOOPS',
      title: 'Forward Speed vs. Inward Gravity Balance',
      desc: 'The Moon orbits Earth in a nested loop while Earth and Mars independently orbit the Sun—each body’s tangential forward velocity (cyan vector) balances inward gravity (gold vector).',
      data: [
        { label: 'LOOP 1 (BLUE)', value: 'EARTH → SUN (29.78 KM/S)' },
        { label: 'LOOP 2 (GOLD)', value: 'MOON → EARTH (1.022 KM/S)' },
        { label: 'LOOP 3 (ORANGE)', value: 'MARS → SUN (24.07 KM/S)' },
        { label: 'VECTORS', value: 'CYAN: SPEED • GOLD: GRAVITY' },
      ],
    },
  };

  const currentDesc = DESCRIPTIONS[viewMode] || DESCRIPTIONS.overview;
  const activeSite = selectedLandmarkId
    ? LUNAR_LOCATIONS_MAP.get(selectedLandmarkId) ||
      MARS_LOCATIONS_MAP.get(selectedLandmarkId) ||
      EARTH_OBSERVATORIES_MAP.get(selectedLandmarkId)
    : null;
  const isMarsSelected =
    viewMode === 'mars' || Boolean(selectedLandmarkId && MARS_LOCATIONS_MAP.has(selectedLandmarkId));
  const isEarthSelected =
    viewMode === 'earth' || Boolean(selectedLandmarkId && EARTH_OBSERVATORIES_MAP.has(selectedLandmarkId));
  const isMoonSelected =
    viewMode === 'moon' || Boolean(selectedLandmarkId && LUNAR_LOCATIONS_MAP.has(selectedLandmarkId));

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 select-none font-mono text-xs">
      <header className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded border border-[var(--line)] bg-[#0b101b] flex items-center justify-center relative shadow-sm overflow-hidden shrink-0">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-26_at_4.07.32_PM_5d7e99cc.jpeg"
              alt="Space Punks Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--accent)] uppercase leading-none">
              3D CELESTIAL ENGINE
            </span>
            <span className="text-[var(--muted)] uppercase mt-1 leading-none text-[10px]">
              EARTH, MOON &amp; MARS FULL-SCREEN SIMULATION
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <nav
            aria-label="Celestial Views"
            className="flex items-center gap-1 p-1 rounded border border-[var(--line)] bg-[#0b101b]/95"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = viewMode === item.id && !selectedLandmarkId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedLandmarkId(null);
                    setViewMode(item.id);
                    onPlayClick();
                  }}
                  className={`px-2.5 py-1.5 rounded uppercase transition-all duration-200 cursor-pointer text-[11px] ${
                    isActive
                      ? item.id === 'mars'
                        ? 'bg-red-950/90 text-orange-300 border border-orange-400 font-bold'
                        : 'bg-black text-[var(--accent)] border border-[var(--accent)]'
                      : 'text-[var(--muted)] hover:text-[var(--text)] border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => {
              if (viewMode === 'mars') setActiveTab('mars');
              if (viewMode === 'earth') setActiveTab('earth-obs');
              setShowSitesDrawer(!showSitesDrawer);
              onPlayClick();
            }}
            className={`px-3 py-1.5 rounded border uppercase transition-all flex items-center gap-1.5 cursor-pointer text-[11px] ${
              showSitesDrawer || selectedLandmarkId
                ? 'bg-[var(--accent)] text-black font-semibold border-[var(--accent)]'
                : 'bg-[#0b101b]/95 text-[var(--accent)] border-[var(--line)] hover:border-[var(--accent)]'
            }`}
          >
            <Rocket size={13} />
            <span>
              Exploration Sites (
              {APOLLO_LANDING_SITES.length +
                ROBOTIC_LANDERS.length +
                LUNAR_LANDMARKS.length +
                LUNAR_MARIA.length +
                MARS_LANDMARKS.length +
                EARTH_OBSERVATORIES.length}
              )
            </span>
          </button>
          <button
            onClick={() => {
              onPlayClick();
              onReturnToEditorial();
            }}
            className="px-3 py-1.5 rounded border border-[#F5D000]/60 bg-[#0b101b]/95 text-[#F5D000] hover:bg-[#F5D000] hover:text-black font-semibold transition-colors flex items-center gap-1.5 cursor-pointer uppercase text-[11px]"
            title="Exit Full Screen to AstroDashboard Home"
          >
            <X size={13} />
            <span>Exit Full Screen</span>
          </button>
        </div>
      </header>

      {(isEarthSelected || isMoonSelected || isMarsSelected) && (
        <div className="pointer-events-auto mt-2 flex flex-col items-center justify-center gap-1.5 z-20">
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-full">
            {isMarsSelected && (
              <div className="px-3 py-1 rounded-full border border-orange-500/30 bg-[#070a12]/95 flex items-center gap-2 overflow-x-auto max-w-full">
                <span className="text-[10px] text-orange-400 font-semibold uppercase flex items-center gap-1 shrink-0">
                  <Radio size={11} />
                  <span>Mars Recon Sites:</span>
                </span>
                {MARS_LANDMARKS.map((site) => {
                  const isSelected = selectedLandmarkId === site.id;
                  return (
                    <button
                      key={site.id}
                      onClick={() => {
                        setSelectedLandmarkId(site.id);
                        setViewMode('mars');
                        setMarsTextureMode('global-mola');
                        onPlayClick();
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all uppercase whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-orange-500 text-black font-bold border-orange-300'
                          : 'bg-black/80 text-zinc-300 border-[var(--line)] hover:border-orange-400/60 hover:text-orange-200'
                      }`}
                      title={`${site.name} — ${site.coords}`}
                    >
                      {site.referenceImage && (
                        <img
                          src={site.referenceImage}
                          alt={site.name}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded-full object-cover shrink-0 border border-orange-400/60"
                        />
                      )}
                      <span>{site.shortLabel || site.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {isMoonSelected && (
              <div className="flex flex-col items-center gap-1 max-w-full">
                <div className="px-3 py-1 rounded-full border border-[var(--line)] bg-[#070a12]/95 flex items-center gap-1.5 overflow-x-auto max-w-full">
                  <span className="text-[10px] text-amber-400 font-semibold uppercase flex items-center gap-1 shrink-0">
                    <Radio size={11} />
                    <span>Apollo Missions:</span>
                  </span>
                  {APOLLO_LANDING_SITES.map((site) => {
                    const isSelected = selectedLandmarkId === site.id;
                    const primaryWalkers = site.landedAstronauts
                      ? site.landedAstronauts.map((a) => a.split(' ')[0]).join(' & ')
                      : '';
                    return (
                      <button
                        key={site.id}
                        onClick={() => {
                          setSelectedLandmarkId(site.id);
                          setViewMode('moon');
                          onPlayClick();
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all uppercase whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-amber-400 text-black font-bold border-amber-300'
                            : 'bg-black/80 text-zinc-300 border-[var(--line)] hover:border-amber-400/60 hover:text-amber-200'
                        }`}
                        title={`${site.name} — ${site.landedAstronauts.join(' & ')}`}
                      >
                        {site.referenceImage && (
                          <img
                            src={site.referenceImage}
                            alt={site.mission}
                            referrerPolicy="no-referrer"
                            className="w-4 h-4 rounded-full object-cover shrink-0 border border-amber-400/60"
                          />
                        )}
                        <span>{site.mission.replace('Apollo ', 'A')}</span>
                        <span className="text-[9px] opacity-75">({primaryWalkers})</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-full">
                  <div className="px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-[#070a12]/95 flex items-center gap-1.5 overflow-x-auto max-w-full">
                    <span className="text-[9px] text-emerald-400 font-semibold uppercase shrink-0">
                      Rovers &amp; Landers:
                    </span>
                    {ROBOTIC_LANDERS.map((lander) => {
                      const isSelected = selectedLandmarkId === lander.id;
                      return (
                        <button
                          key={lander.id}
                          onClick={() => {
                            setSelectedLandmarkId(lander.id);
                            setViewMode('moon');
                            onPlayClick();
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all uppercase whitespace-nowrap cursor-pointer flex items-center gap-1 border ${
                            isSelected
                              ? 'bg-emerald-400 text-black font-bold border-emerald-300'
                              : 'bg-black/80 text-zinc-300 border-[var(--line)] hover:border-emerald-400/60 hover:text-emerald-200'
                          }`}
                          title={`${lander.name} — ${lander.coordinatesFormatted}`}
                        >
                          {lander.referenceImage && (
                            <img
                              src={lander.referenceImage}
                              alt={lander.name}
                              referrerPolicy="no-referrer"
                              className="w-3.5 h-3.5 rounded-full object-cover shrink-0 border border-emerald-400/60"
                            />
                          )}
                          <span>{lander.mission || lander.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-[#070a12]/95 flex items-center gap-1.5 overflow-x-auto max-w-full">
                    <span className="text-[9px] text-cyan-400 font-semibold uppercase shrink-0">
                      Craters &amp; Massifs:
                    </span>
                    {LUNAR_LANDMARKS.map((crater) => {
                      const isSelected = selectedLandmarkId === crater.id;
                      return (
                        <button
                          key={crater.id}
                          onClick={() => {
                            setSelectedLandmarkId(crater.id);
                            setViewMode('moon');
                            onPlayClick();
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all uppercase whitespace-nowrap cursor-pointer flex items-center gap-1 border ${
                            isSelected
                              ? 'bg-cyan-400 text-black font-bold border-cyan-300'
                              : 'bg-black/80 text-zinc-300 border-[var(--line)] hover:border-cyan-400/60 hover:text-cyan-200'
                          }`}
                          title={`${crater.name} — ${crater.coordinatesFormatted}`}
                        >
                          {crater.referenceImage && (
                            <img
                              src={crater.referenceImage}
                              alt={crater.name}
                              referrerPolicy="no-referrer"
                              className="w-3.5 h-3.5 rounded-full object-cover shrink-0 border border-cyan-400/60"
                            />
                          )}
                          <span>{crater.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-2.5 py-0.5 rounded-full border border-indigo-500/30 bg-[#070a12]/95 flex items-center gap-1.5 overflow-x-auto max-w-full">
                    <span className="text-[9px] text-indigo-400 font-semibold uppercase shrink-0">
                      Maria:
                    </span>
                    {LUNAR_MARIA.map((mare) => {
                      const isSelected = selectedLandmarkId === mare.id;
                      return (
                        <button
                          key={mare.id}
                          onClick={() => {
                            setSelectedLandmarkId(mare.id);
                            setViewMode('moon');
                            onPlayClick();
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all uppercase whitespace-nowrap cursor-pointer flex items-center gap-1 border ${
                            isSelected
                              ? 'bg-indigo-400 text-black font-bold border-indigo-300'
                              : 'bg-black/80 text-zinc-300 border-[var(--line)] hover:border-indigo-400/60 hover:text-indigo-200'
                          }`}
                          title={`${mare.name} — ${mare.coordinatesFormatted}`}
                        >
                          {mare.referenceImage && (
                            <img
                              src={mare.referenceImage}
                              alt={mare.name}
                              referrerPolicy="no-referrer"
                              className="w-3.5 h-3.5 rounded-full object-cover shrink-0 border border-indigo-400/60"
                            />
                          )}
                          <span>{mare.name.split('(')[0].trim()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {isEarthSelected && (
              <div className="px-3 py-1 rounded-full border border-cyan-500/30 bg-[#070a12]/95 flex items-center gap-2 overflow-x-auto max-w-full">
                <span className="text-[10px] text-cyan-400 font-semibold uppercase flex items-center gap-1 shrink-0">
                  <Radio size={11} />
                  <span>Earth Research Centers (Moon &amp; Mars):</span>
                </span>
                {EARTH_OBSERVATORIES.map((obs) => {
                  const isSelected = selectedLandmarkId === obs.id;
                  return (
                    <button
                      key={obs.id}
                      onClick={() => {
                        setSelectedLandmarkId(obs.id);
                        setViewMode('earth');
                        onPlayClick();
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all uppercase whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-cyan-400 text-black font-bold border-cyan-300'
                          : 'bg-black/80 text-zinc-300 border-[var(--line)] hover:border-cyan-400/60 hover:text-cyan-200'
                      }`}
                      title={`${obs.name} — ${obs.location || obs.region}`}
                    >
                      {obs.referenceImage && (
                        <img
                          src={obs.referenceImage}
                          alt={obs.name}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded-full object-cover shrink-0 border border-cyan-400/60"
                        />
                      )}
                      <span>{obs.shortLabel || obs.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSite && (
        <aside
          aria-label="Exploration Site Dossier"
          className="fixed top-36 right-4 sm:right-6 pointer-events-auto w-88 max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--line)] bg-[#080d14]/95 shadow-2xl p-4 text-[var(--text)] z-40 transition-all flex flex-col gap-3 max-h-[72vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[var(--line)] pb-2">
            <div>
              <div className="text-[10px] text-[var(--accent)] uppercase font-semibold flex items-center gap-1">
                <Compass size={11} />
                <span>{activeSite.categoryLabel || activeSite.category}</span>
              </div>
              <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                {activeSite.name}
              </h3>
              <div className="text-[10px] text-[var(--muted)] uppercase font-mono mt-0.5">
                {activeSite.coords || activeSite.coordinatesFormatted}
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedLandmarkId(null);
                onPlayClick();
              }}
              title="Close landmark view"
              className="p-1 rounded text-[var(--muted)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {activeSite.referenceImage && (
            <div className="space-y-1.5">
              <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                <img
                  src={activeSite.referenceImage}
                  alt={activeSite.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                {activeSite.referenceCredit && (
                  <span className="absolute bottom-1 left-2 text-[9px] text-zinc-300 font-mono">
                    {activeSite.referenceCredit}
                  </span>
                )}
              </div>
              {activeSite.secondaryImage && (
                <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                  <img
                    src={activeSite.secondaryImage}
                    alt={`${activeSite.name} secondary view`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {activeSite.landedAstronauts && (
            <div className="space-y-1">
              <div className="text-[10px] text-amber-400 uppercase font-semibold flex items-center gap-1">
                <Rocket size={11} />
                <span>Astronauts Landed on Lunar Surface:</span>
              </div>
              <div className="space-y-0.5">
                {activeSite.landedAstronauts.map((astro) => (
                  <div
                    key={astro}
                    className="px-2 py-1 rounded bg-black/70 border border-amber-500/30 text-amber-200 text-[11px] font-mono flex items-center justify-between"
                  >
                    <span>{astro}</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">
                      MOONWALKER
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSite.specs && (
            <div className="grid grid-cols-2 gap-1.5 bg-black/50 p-2 rounded border border-orange-500/20 text-[10px] font-mono">
              {Object.entries(activeSite.specs).map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-zinc-500 uppercase text-[9px]">{k}</span>
                  <span className="text-orange-200 font-semibold truncate">{v}</span>
                </div>
              ))}
            </div>
          )}

          {activeSite.elevationKm && (
            <div className="text-[10px] text-zinc-300 font-mono bg-black/40 p-1.5 rounded border border-white/5">
              <span className="text-zinc-500 uppercase">ELEVATION:</span> {activeSite.elevationKm}
            </div>
          )}

          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            {activeSite.description}
          </p>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                const targetBody = MARS_LOCATIONS_MAP.has(activeSite.id)
                  ? 'mars'
                  : EARTH_OBSERVATORIES_MAP.has(activeSite.id)
                  ? 'earth'
                  : 'moon';
                setSelectedLandmarkId(null);
                setViewMode(targetBody);
                onPlayClick();
              }}
              className="flex-1 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)] text-center text-[10px] uppercase text-[var(--muted)] hover:text-white hover:bg-black transition-colors cursor-pointer"
            >
              {MARS_LOCATIONS_MAP.has(activeSite.id)
                ? 'Orbit Mars'
                : EARTH_OBSERVATORIES_MAP.has(activeSite.id)
                ? 'Orbit Earth'
                : 'Orbit Moon'}
            </button>
            <button
              onClick={() => {
                setSelectedLandmarkId(null);
                onResetCamera();
              }}
              className="flex-1 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)] text-center text-[10px] uppercase text-[var(--muted)] hover:text-white hover:bg-black transition-colors cursor-pointer"
            >
              Reset View
            </button>
          </div>
        </aside>
      )}

      {showSitesDrawer && (
        <aside
          aria-label="Exploration Coordinates Registry Drawer"
          className="fixed top-24 left-4 sm:left-6 pointer-events-auto w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--line)] bg-[#080d14]/95 shadow-2xl p-3.5 z-40 transition-all flex flex-col gap-2.5 max-h-[75vh] overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
            <span className="text-[11px] font-bold text-[var(--accent)] uppercase flex items-center gap-1.5">
              <Rocket size={13} />
              <span>Planetary Exploration Registry</span>
            </span>
            <button
              onClick={() => setShowSitesDrawer(false)}
              className="p-1 rounded text-[var(--muted)] hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-b border-[var(--line)]/70 pb-1.5 text-[10px] overflow-x-auto">
            <button
              onClick={() => setActiveTab('apollo')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap cursor-pointer ${
                activeTab === 'apollo'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Apollo (6)
            </button>
            <button
              onClick={() => setActiveTab('mars')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap cursor-pointer ${
                activeTab === 'mars'
                  ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Mars (6)
            </button>
            <button
              onClick={() => setActiveTab('earth-obs')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap cursor-pointer ${
                activeTab === 'earth-obs'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Earth Obs (6)
            </button>
            <button
              onClick={() => setActiveTab('robotic')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap cursor-pointer ${
                activeTab === 'robotic'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Robotic (5)
            </button>
            <button
              onClick={() => setActiveTab('craters')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap cursor-pointer ${
                activeTab === 'craters'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Craters (8)
            </button>
            <button
              onClick={() => setActiveTab('maria')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap cursor-pointer ${
                activeTab === 'maria'
                  ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Maria (4)
            </button>
          </div>

          <div className="overflow-y-auto space-y-1.5 pr-1 max-h-[55vh]">
            {activeTab === 'apollo' && (
              <div className="space-y-1.5">
                {APOLLO_LANDING_SITES.map((site) => {
                  const isSelected = selectedLandmarkId === site.id;
                  return (
                    <button
                      key={site.id}
                      onClick={() => {
                        setSelectedLandmarkId(site.id);
                        setViewMode('moon');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-amber-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {site.referenceImage && (
                          <div className="flex items-center gap-1 shrink-0">
                            <img
                              src={site.referenceImage}
                              alt={site.name}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded object-cover border border-amber-400/50 shrink-0"
                            />
                            {site.secondaryImage && (
                              <img
                                src={site.secondaryImage}
                                alt={`${site.name} crew`}
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded object-cover border border-amber-400/50 shrink-0"
                              />
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-amber-300 truncate">
                              {site.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              {site.date}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-300 mt-0.5 truncate">
                            {site.landedAstronauts.join(' & ')}
                          </div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5 flex justify-between">
                            <span>{site.coordinatesFormatted}</span>
                            <span>{site.samplesReturnedKg} kg</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'mars' && (
              <div className="space-y-1.5">
                {MARS_LANDMARKS.map((site) => {
                  const isSelected = selectedLandmarkId === site.id;
                  return (
                    <button
                      key={site.id}
                      onClick={() => {
                        setSelectedLandmarkId(site.id);
                        setViewMode('mars');
                        setMarsTextureMode('global-mola');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500/20 border-orange-400 text-orange-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-orange-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {site.referenceImage && (
                          <img
                            src={site.referenceImage}
                            alt={site.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded object-cover border border-orange-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-orange-300 truncate">
                              {site.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              {site.catalogId}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-300 mt-0.5 truncate">
                            {site.missionName}
                          </div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5 flex justify-between">
                            <span>{site.coordinatesFormatted}</span>
                            <span>{site.elevationKm}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'earth-obs' && (
              <div className="space-y-1.5">
                {EARTH_OBSERVATORIES.map((obs) => {
                  const isSelected = selectedLandmarkId === obs.id;
                  return (
                    <button
                      key={obs.id}
                      onClick={() => {
                        setSelectedLandmarkId(obs.id);
                        setViewMode('earth');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {obs.referenceImage && (
                          <img
                            src={obs.referenceImage}
                            alt={obs.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded object-cover border border-cyan-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-cyan-300 truncate">
                              {obs.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              {obs.catalogId}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-300 mt-0.5 truncate">
                            {obs.researchTargets}
                          </div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5 flex justify-between">
                            <span>{obs.coordinatesFormatted}</span>
                            <span>{obs.elevationKm}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'robotic' && (
              <div className="space-y-1.5">
                {ROBOTIC_LANDERS.map((lander) => {
                  const isSelected = selectedLandmarkId === lander.id;
                  return (
                    <button
                      key={lander.id}
                      onClick={() => {
                        setSelectedLandmarkId(lander.id);
                        setViewMode('moon');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-emerald-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {lander.referenceImage && (
                          <img
                            src={lander.referenceImage}
                            alt={lander.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded object-cover border border-emerald-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-emerald-300 truncate">
                              {lander.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              {lander.agency}
                            </span>
                          </div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5">
                            {lander.coordinatesFormatted}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'craters' && (
              <div className="space-y-1.5">
                {LUNAR_LANDMARKS.map((crater) => {
                  const isSelected = selectedLandmarkId === crater.id;
                  return (
                    <button
                      key={crater.id}
                      onClick={() => {
                        setSelectedLandmarkId(crater.id);
                        setViewMode('moon');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {crater.referenceImage && (
                          <img
                            src={crater.referenceImage}
                            alt={crater.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded object-cover border border-cyan-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-cyan-300 truncate">
                              {crater.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              {crater.categoryLabel}
                            </span>
                          </div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5">
                            {crater.coordinatesFormatted}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'maria' && (
              <div className="space-y-1.5">
                {LUNAR_MARIA.map((mare) => {
                  const isSelected = selectedLandmarkId === mare.id;
                  return (
                    <button
                      key={mare.id}
                      onClick={() => {
                        setSelectedLandmarkId(mare.id);
                        setViewMode('moon');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-indigo-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {mare.referenceImage && (
                          <img
                            src={mare.referenceImage}
                            alt={mare.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded object-cover border border-indigo-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-indigo-300 truncate">
                              {mare.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              {mare.region}
                            </span>
                          </div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5">
                            {mare.coordinatesFormatted}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      )}

      <div className="flex-1 flex items-end justify-between gap-6 pointer-events-none pb-2">
        {showInfo && !selectedLandmarkId && (
          <aside className="pointer-events-auto max-w-[290px] sm:max-w-[310px] max-h-[42vh] overflow-y-auto p-2.5 sm:p-3 rounded-lg border border-[var(--line)] bg-[#070a12]/90 shadow-2xl transition-all duration-300 text-[10px]">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[var(--accent)] uppercase text-[9px] font-bold tracking-wider">
                {currentDesc.tag}
              </span>
              {viewMode === 'mars' && flightTelemetry?.marsSolTime && (
                <span className="px-1.5 py-0.5 rounded bg-orange-950/90 border border-orange-500/40 text-orange-300 text-[9px] font-mono font-semibold">
                  {flightTelemetry.marsSolTime}
                </span>
              )}
            </div>
            <h1 className="font-bold text-[var(--accent)] text-xs sm:text-sm leading-tight mb-1">
              {currentDesc.title}
            </h1>
            <p className="text-zinc-300 leading-snug mb-2 text-[10px]">
              {currentDesc.desc}
            </p>

            <div className="border-t border-[var(--line)] pt-2 grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-[10px]">
              {currentDesc.data.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-zinc-400 uppercase text-[9px] font-semibold">
                    {item.label}
                  </span>
                  <span className="text-white font-medium mt-0.5 font-mono text-[10px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {viewMode === 'mars' && (
              <div className="mt-2 pt-2 border-t border-[var(--line)] space-y-1.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-orange-400 font-bold uppercase flex items-center gap-1">
                    <Layers size={10} />
                    <span>3D Surface Texture</span>
                  </span>
                  <span className="text-orange-200 font-bold">
                    {MARS_3D_TEXTURE_MODES[0]?.shortLabel || 'Global MOLA 3D'}
                  </span>
                </div>

                <div className="bg-black/60 p-2 rounded border border-white/10 space-y-1.5 text-[9px]">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 flex items-center gap-1">
                      <Cloud size={10} className="text-sky-300" />
                      <span>H2O/CO2 Cloud Cover</span>
                    </span>
                    <span className="text-sky-300 font-bold">
                      {Math.round(marsCloudOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={marsCloudOpacity}
                    onChange={(e) => setMarsCloudOpacity(parseFloat(e.target.value))}
                    className="w-full accent-orange-400 cursor-pointer h-1"
                  />

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-zinc-300">Zonal Wind Drift &amp; Dust</span>
                    <div className="flex items-center gap-1">
                      {[0.5, 1.0, 2.0].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setMarsCloudDriftSpeed(spd)}
                          className={`px-1 py-0.5 rounded border cursor-pointer ${
                            marsCloudDriftSpeed === spd
                              ? 'bg-orange-500 text-black font-bold border-orange-300'
                              : 'bg-black text-zinc-400 border-white/10'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setMarsDustIntensity(marsDustIntensity > 0.5 ? 0.25 : 0.72)
                        }
                        className={`px-1 py-0.5 rounded border cursor-pointer ${
                          marsDustIntensity > 0.5
                            ? 'bg-amber-600 text-white border-amber-400'
                            : 'bg-black text-zinc-400 border-white/10'
                        }`}
                        title="Toggle Dust Storm Optical Depth"
                      >
                        {marsDustIntensity > 0.5 ? 'Storm' : 'Clear'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isEarthSelected && (
              <div className="mt-2 pt-2 border-t border-[var(--line)] space-y-1.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-cyan-400 font-bold uppercase flex items-center gap-1">
                    <Radio size={10} />
                    <span>Earth Locations &amp; Research Centers</span>
                  </span>
                  <span className="text-zinc-400 font-mono">
                    {EARTH_SIMULATION_IMAGES.length} IMAGES • 6 SITES
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 max-h-28 overflow-y-auto pr-1">
                  {EARTH_SIMULATION_IMAGES.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedLandmarkId(item.obsId);
                        setViewMode('earth');
                        onPlayClick();
                      }}
                      className="p-1 rounded bg-black/70 border border-white/10 hover:border-cyan-400/60 flex items-center gap-1.5 text-left transition-colors cursor-pointer group"
                    >
                      <img
                        src={item.src}
                        alt={item.label}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded object-cover border border-cyan-400/40 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-bold text-cyan-300 group-hover:text-white truncate">
                          {item.label}
                        </div>
                        <div className="text-[8px] text-zinc-400 truncate">
                          {item.coords}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isMoonSelected && (
              <div className="mt-2 pt-2 border-t border-[var(--line)] space-y-1.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-amber-400 font-bold uppercase flex items-center gap-1">
                    <MapPin size={10} />
                    <span>Moon Locations (Apollo, Rovers, Craters &amp; Maria)</span>
                  </span>
                  <span className="text-zinc-400 font-mono">
                    {MOON_SIMULATION_IMAGES.length} IMAGES •{' '}
                    {APOLLO_LANDING_SITES.length +
                      ROBOTIC_LANDERS.length +
                      LUNAR_LANDMARKS.length +
                      LUNAR_MARIA.length}{' '}
                    SITES
                  </span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  <div className="text-[8px] font-bold uppercase text-amber-400 tracking-wider">
                    Apollo Missions &amp; Lunar Rovers (11–17)
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {MOON_SIMULATION_IMAGES.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedLandmarkId(item.siteId);
                          setViewMode('moon');
                          onPlayClick();
                        }}
                        className="p-1 rounded bg-black/70 border border-white/10 hover:border-amber-400/60 flex items-center gap-1.5 text-left transition-colors cursor-pointer group"
                      >
                        <img
                          src={item.src}
                          alt={item.label}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded object-cover border border-amber-400/40 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[9px] font-bold text-amber-300 group-hover:text-white truncate">
                            {item.label}
                          </div>
                          <div className="text-[8px] text-zinc-400 truncate">
                            {item.coords}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-[8px] font-bold uppercase text-emerald-400 tracking-wider pt-1">
                    Robotic Rovers &amp; Landers ({ROBOTIC_LANDERS.length})
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {ROBOTIC_LANDERS.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          setSelectedLandmarkId(site.id);
                          setViewMode('moon');
                          onPlayClick();
                        }}
                        className="p-1 rounded bg-black/70 border border-white/10 hover:border-emerald-400/60 flex items-center gap-1.5 text-left transition-colors cursor-pointer group"
                      >
                        {site.referenceImage && (
                          <img
                            src={site.referenceImage}
                            alt={site.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded object-cover border border-emerald-400/40 shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-[9px] font-bold text-emerald-300 group-hover:text-white truncate">
                            {site.name}
                          </div>
                          <div className="text-[8px] text-zinc-400 truncate">
                            {site.coordinatesFormatted}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-[8px] font-bold uppercase text-cyan-400 tracking-wider pt-1">
                    Craters, Massifs &amp; Polar Ice Traps ({LUNAR_LANDMARKS.length})
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {LUNAR_LANDMARKS.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          setSelectedLandmarkId(site.id);
                          setViewMode('moon');
                          onPlayClick();
                        }}
                        className="p-1 rounded bg-black/70 border border-white/10 hover:border-cyan-400/60 flex items-center gap-1.5 text-left transition-colors cursor-pointer group"
                      >
                        {site.referenceImage && (
                          <img
                            src={site.referenceImage}
                            alt={site.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded object-cover border border-cyan-400/40 shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-[9px] font-bold text-cyan-300 group-hover:text-white truncate">
                            {site.name}
                          </div>
                          <div className="text-[8px] text-zinc-400 truncate">
                            {site.coordinatesFormatted}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-[8px] font-bold uppercase text-indigo-400 tracking-wider pt-1">
                    Lunar Maria &amp; Basaltic Seas ({LUNAR_MARIA.length})
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {LUNAR_MARIA.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          setSelectedLandmarkId(site.id);
                          setViewMode('moon');
                          onPlayClick();
                        }}
                        className="p-1 rounded bg-black/70 border border-white/10 hover:border-indigo-400/60 flex items-center gap-1.5 text-left transition-colors cursor-pointer group"
                      >
                        {site.referenceImage && (
                          <img
                            src={site.referenceImage}
                            alt={site.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded object-cover border border-indigo-400/40 shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-[9px] font-bold text-indigo-300 group-hover:text-white truncate">
                            {site.name}
                          </div>
                          <div className="text-[8px] text-zinc-400 truncate">
                            {site.coordinatesFormatted}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isMarsSelected && (
              <div className="mt-2 pt-2 border-t border-[var(--line)] space-y-1.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-orange-400 font-bold uppercase flex items-center gap-1">
                    <MapPin size={10} />
                    <span>Mars Locations &amp; Recon Sites</span>
                  </span>
                  <span className="text-zinc-400 font-mono">
                    {MARS_LANDMARKS.length} SITES
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 max-h-28 overflow-y-auto pr-1">
                  {MARS_LANDMARKS.map((site) => (
                    <button
                      key={site.id}
                      onClick={() => {
                        setSelectedLandmarkId(site.id);
                        setViewMode('mars');
                        setMarsTextureMode('global-mola');
                        onPlayClick();
                      }}
                      className="p-1 rounded bg-black/70 border border-white/10 hover:border-orange-400/60 flex items-center gap-1.5 text-left transition-colors cursor-pointer group"
                    >
                      {site.referenceImage && (
                        <img
                          src={site.referenceImage}
                          alt={site.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded object-cover border border-orange-400/40 shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-bold text-orange-300 group-hover:text-white truncate">
                          {site.shortLabel || site.name}
                        </div>
                        <div className="text-[8px] text-zinc-400 truncate">
                          {site.coordinatesFormatted || site.coords}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}

        <div
          className={`flex-1 text-center transition-opacity duration-700 pointer-events-none mb-2 ${
            hasInteracted ? 'opacity-0' : 'opacity-80'
          }`}
        >
          <span className="inline-block px-3 py-1 rounded border border-[var(--line)] bg-[#0b101b]/95 text-[var(--muted)] uppercase text-[10px]">
            Drag to rotate • Click planets or landmarks to inspect
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded border border-[var(--line)] bg-[#0b101b]/95">
          <button
            onClick={() => {
              setIsPaused(!isPaused);
              onPlayClick();
            }}
            title={isPaused ? 'Resume Motion' : 'Pause Motion'}
            aria-label={isPaused ? 'Resume Motion' : 'Pause Motion'}
            className="p-2 rounded text-[var(--muted)] hover:text-[var(--text)] hover:bg-black transition-colors cursor-pointer"
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
          </button>

          <button
            onClick={() => {
              onResetCamera();
              onPlayClick();
            }}
            title="Reset Camera View"
            aria-label="Reset Camera View"
            className="p-2 rounded text-[var(--muted)] hover:text-[var(--text)] hover:bg-black transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={() => {
              setShowOrbits(!showOrbits);
              onPlayClick();
            }}
            title={showOrbits ? 'Hide Orbit Path' : 'Show Orbit Path'}
            aria-label={showOrbits ? 'Hide Orbit Path' : 'Show Orbit Path'}
            className={`p-2 rounded transition-colors cursor-pointer ${
              showOrbits
                ? 'text-[var(--accent)] bg-black border border-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-black'
            }`}
          >
            <Disc size={15} />
          </button>

          <button
            onClick={() => {
              setShowLandingSites(!showLandingSites);
              onPlayClick();
            }}
            title={showLandingSites ? 'Hide Beacons & Markers' : 'Show Beacons & Markers'}
            aria-label={showLandingSites ? 'Hide Beacons & Markers' : 'Show Beacons & Markers'}
            className={`p-2 rounded transition-colors cursor-pointer ${
              showLandingSites
                ? 'text-amber-400 bg-black border border-amber-400'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-black'
            }`}
          >
            <MapPin size={15} />
          </button>

          <button
            onClick={() => {
              setShowInfo(!showInfo);
              onPlayClick();
            }}
            title={showInfo ? 'Hide Information Panel' : 'Show Information Panel'}
            aria-label={showInfo ? 'Hide Information Panel' : 'Show Information Panel'}
            className={`p-2 rounded transition-colors cursor-pointer ${
              showInfo
                ? 'text-[var(--accent)] bg-black border border-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-black'
            }`}
          >
            {showInfo ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- End of CelestialUI.jsx --- */

