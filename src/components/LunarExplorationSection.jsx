/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Planetary and Lunar Exploration Section with Earth Observatories and NASA Ames Subsurface Astrobiology Information
*/
import React, { useState } from 'react';
import {
  APOLLO_LANDING_SITES,
  LUNAR_LANDMARKS,
  ROBOTIC_LANDERS,
  LUNAR_MARIA,
  NEAR_EARTH_ASTEROIDS,
} from '../data/lunarLandmarks.js';
import {
  EARTH_OBSERVATORIES,
  SUBSURFACE_ASTROBIOLOGY_INFO,
  LOST_OCEANS_OF_MARS_INFO,
  THREE_WORLDS_LIFE_INFO,
  MOON_WATER_ICE_INFO,
} from '../data/marsLandmarks.js';
import {
  Rocket,
  Compass,
  Mountain,
  Radio,
  Eye,
  Disc,
  Clock,
  Weight,
  Sparkles,
} from 'lucide-react';

export function LunarExplorationSection({
  onSelectSite = () => {},
  selectedLandmarkId = null,
  onSwitchToSimulation = () => {},
  onPlayClick = () => {},
}) {
  const [activeTab, setActiveTab] = useState('apollo');

  const TABS = [
    { id: 'apollo', label: `Apollo Crewed (${APOLLO_LANDING_SITES.length})`, icon: Rocket },
    { id: 'earth-obs', label: `Earth Observatories (${EARTH_OBSERVATORIES.length})`, icon: Radio },
    { id: 'craters', label: `Craters & Massifs (${LUNAR_LANDMARKS.length})`, icon: Mountain },
    { id: 'robotic', label: `Robotic Landers (${ROBOTIC_LANDERS.length})`, icon: Radio },
    { id: 'maria', label: `Lunar Maria (${LUNAR_MARIA.length})`, icon: Compass },
    { id: 'asteroids', label: `Asteroids (${NEAR_EARTH_ASTEROIDS.length})`, icon: Disc },
  ];

  const handleSelectSite = (siteId) => {
    onPlayClick();
    onSelectSite(siteId);
  };

  return (
    <section
      id="lunar-exploration"
      aria-label="Lunar Surface Exploration Matrix"
      className="w-full border-t border-[var(--line)] bg-black/60 backdrop-blur-md px-6 py-10 select-none text-[var(--text)]"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              <span>Lunar, Martian &amp; Terrestrial Observatory Telemetry Archive</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[var(--accent)]">
              Apollo Landing Sites, Earth Observatories &amp; Subsurface Astrobiology
            </h2>
            <p className="text-[var(--muted)] text-xs uppercase mt-1">
              All 6 Apollo human landings, Earth observatories researching Moon &amp; Mars, selenographic coordinates, and subsurface cave astrobiology.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onPlayClick();
                onSwitchToSimulation();
              }}
              className="px-3 py-1.5 rounded border border-[var(--accent)] bg-[var(--chip)] text-[var(--accent)] text-xs uppercase font-medium hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} />
              <span>Immersive 3D Space View</span>
            </button>
          </div>
        </div>

        <div className="rounded border border-[var(--accent)]/40 bg-[var(--chip)]/90 p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <img
              src={SUBSURFACE_ASTROBIOLOGY_INFO.image}
              alt={SUBSURFACE_ASTROBIOLOGY_INFO.title}
              className="w-full md:w-56 h-36 rounded object-cover border border-[var(--accent)]/40 shrink-0"
            />
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--accent)] font-bold">
                <span>{SUBSURFACE_ASTROBIOLOGY_INFO.location}</span>
                <span className="text-cyan-300">{SUBSURFACE_ASTROBIOLOGY_INFO.meeting}</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white">
                {SUBSURFACE_ASTROBIOLOGY_INFO.title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {SUBSURFACE_ASTROBIOLOGY_INFO.body}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] flex flex-col md:flex-row gap-4 items-start">
            <img
              src={LOST_OCEANS_OF_MARS_INFO.image}
              alt={LOST_OCEANS_OF_MARS_INFO.title}
              className="w-full md:w-56 h-36 rounded object-cover border border-orange-400/40 shrink-0"
            />
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="text-base md:text-lg font-bold text-orange-300">
                {LOST_OCEANS_OF_MARS_INFO.title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {LOST_OCEANS_OF_MARS_INFO.body}
              </p>
              <div className="text-xs font-mono text-[#F5D000]">
                {LOST_OCEANS_OF_MARS_INFO.authors}
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] flex flex-col md:flex-row gap-4 items-start">
            <img
              src={THREE_WORLDS_LIFE_INFO.image}
              alt={THREE_WORLDS_LIFE_INFO.title}
              className="w-full md:w-56 h-36 rounded object-cover border border-cyan-400/40 shrink-0"
            />
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="text-base md:text-lg font-bold text-cyan-300">
                {THREE_WORLDS_LIFE_INFO.title}
              </h3>
              <div className="text-xs font-mono text-[#F5D000] font-bold uppercase tracking-wider">
                {THREE_WORLDS_LIFE_INFO.author}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {THREE_WORLDS_LIFE_INFO.paragraph1}
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {THREE_WORLDS_LIFE_INFO.paragraph2}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--line)] flex flex-col md:flex-row gap-4 items-start">
            <img
              src={MOON_WATER_ICE_INFO.image}
              alt={MOON_WATER_ICE_INFO.title}
              className="w-full md:w-56 h-36 rounded object-cover border border-amber-400/40 shrink-0"
            />
            <div className="flex-1 flex flex-col gap-2">
              <h3 className="text-base md:text-lg font-bold text-amber-300">
                {MOON_WATER_ICE_INFO.title}
              </h3>
              <div className="text-xs font-mono text-[#F5D000] font-bold tracking-wider">
                {MOON_WATER_ICE_INFO.author}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {MOON_WATER_ICE_INFO.body}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  onPlayClick();
                }}
                className={`px-3 py-1.5 rounded text-xs uppercase font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-[var(--accent)] border border-[var(--accent)] shadow-[0_0_10px_rgba(170,136,255,0.2)]'
                    : 'bg-[var(--chip)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'apollo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {APOLLO_LANDING_SITES.map((mission) => {
              const isSelected = selectedLandmarkId === mission.id;
              return (
                <div
                  key={mission.id}
                  className={`rounded border bg-[var(--chip)]/90 backdrop-blur-md p-4 flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] shadow-[0_0_15px_rgba(170,136,255,0.25)]'
                      : 'border-[var(--line)] hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2 border-b border-[var(--line)] pb-2.5">
                      <div>
                        <div className="text-[10px] text-[var(--accent)] uppercase font-semibold">
                          {mission.mission} • {mission.date}
                        </div>
                        <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                          {mission.name}
                        </h3>
                        <div className="text-[11px] text-[var(--muted)] uppercase mt-0.5">
                          {mission.region}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono">
                        {mission.coordinatesFormatted}
                      </span>
                    </div>

                    {mission.youtubeId ? (
                      <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-amber-500/50">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${mission.youtubeId}?${mission.videoStartTime ? `start=${mission.videoStartTime}&` : ''}rel=0`}
                          title={mission.videoTitle || `${mission.name} Video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 border border-amber-500/40 text-amber-300 text-[9px] font-mono uppercase font-bold flex items-center gap-1 pointer-events-none z-10">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span>NASA VIDEO</span>
                        </div>
                      </div>
                    ) : mission.referenceImage ? (
                      <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                        <img
                          src={mission.referenceImage}
                          alt={mission.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-1.5 left-2 text-[9px] text-zinc-300 font-mono drop-shadow">
                          {mission.referenceCredit}
                        </span>
                      </div>
                    ) : null}

                    <div className="space-y-1.5 text-xs">
                      <div className="text-[10px] text-[var(--muted)] uppercase">Landed Astronauts:</div>
                      <div className="grid grid-cols-1 gap-1">
                        {mission.landedAstronauts.map((astro) => (
                          <div
                            key={astro}
                            className="px-2 py-1 rounded bg-black/60 border border-[var(--line)] text-amber-200/90 text-xs font-mono flex items-center justify-between"
                          >
                            <span>{astro}</span>
                            <span className="text-[9px] text-[var(--muted)]">MOONWALKER</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-b border-[var(--line)] py-2 text-center text-xs font-mono">
                      <div>
                        <div className="text-[9px] text-[var(--muted)] uppercase flex items-center justify-center gap-1">
                          <Clock size={10} />
                          <span>EVA</span>
                        </div>
                        <div className="font-semibold text-[var(--text)] mt-0.5">
                          {mission.evaDuration}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[var(--muted)] uppercase flex items-center justify-center gap-1">
                          <Weight size={10} />
                          <span>Samples</span>
                        </div>
                        <div className="font-semibold text-[var(--accent)] mt-0.5">
                          {mission.samplesReturnedKg} kg
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[var(--muted)] uppercase">Module</div>
                        <div className="font-semibold text-[var(--text)] mt-0.5 truncate">
                          {mission.lunarModule.split(' ')[1] || mission.lunarModule}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {mission.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[var(--muted)] font-mono">
                      {mission.totalSurfaceStay} STAY
                    </span>
                    <button
                      onClick={() => handleSelectSite(mission.id)}
                      className={`px-3 py-1.5 rounded text-xs uppercase font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent)] text-black font-semibold'
                          : 'bg-black text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black'
                      }`}
                    >
                      <Eye size={12} />
                      <span>{isSelected ? 'Framed in 3D' : 'Fly to Site'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'earth-obs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EARTH_OBSERVATORIES.map((obs) => {
              const isSelected = selectedLandmarkId === obs.id;
              return (
                <div
                  key={obs.id}
                  className={`rounded border bg-[var(--chip)]/90 backdrop-blur-md p-4 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-cyan-400 ring-1 ring-cyan-400'
                      : 'border-[var(--line)] hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-1 border-b border-[var(--line)] pb-2">
                      <div>
                        <span className="text-[10px] text-cyan-400 uppercase font-semibold">
                          {obs.categoryLabel}
                        </span>
                        <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                          {obs.name}
                        </h3>
                        <div className="text-[11px] text-[var(--muted)] uppercase">
                          {obs.location}
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono">
                        {obs.coordinatesFormatted}
                      </span>
                    </div>

                    {obs.referenceImage && (
                      <div
                        className={`grid gap-2 ${
                          obs.secondaryImage ? 'grid-cols-2' : 'grid-cols-1'
                        }`}
                      >
                        <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                          <img
                            src={obs.referenceImage}
                            alt={obs.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <span className="absolute bottom-1.5 left-2 text-[9px] text-zinc-300 font-mono drop-shadow truncate max-w-[95%]">
                            {obs.referenceCredit}
                          </span>
                        </div>
                        {obs.secondaryImage && (
                          <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                            <img
                              src={obs.secondaryImage}
                              alt={`${obs.name} view 2`}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {obs.description}
                    </p>

                    <div className="text-[11px] text-zinc-300 font-mono bg-black/40 p-2 rounded border border-[var(--line)]">
                      <span className="text-cyan-400">Research Focus:</span> {obs.researchTargets}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex justify-end">
                    <button
                      onClick={() => handleSelectSite(obs.id)}
                      className={`px-3 py-1.5 rounded text-xs uppercase font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-400 text-black font-semibold'
                          : 'bg-black text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-black'
                      }`}
                    >
                      <Eye size={12} />
                      <span>{isSelected ? 'Framed in 3D' : 'Fly to Observatory'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'craters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LUNAR_LANDMARKS.map((landmark) => {
              const isSelected = selectedLandmarkId === landmark.id;
              return (
                <div
                  key={landmark.id}
                  className={`rounded border bg-[var(--chip)]/90 backdrop-blur-md p-4 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] shadow-[0_0_15px_rgba(170,136,255,0.25)]'
                      : 'border-[var(--line)] hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-2.5">
                    {landmark.referenceImage && (
                      <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                        <img
                          src={landmark.referenceImage}
                          alt={landmark.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-1.5 left-2 text-[9px] text-zinc-300 font-mono drop-shadow">
                          {landmark.referenceCredit}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-1 border-b border-[var(--line)] pb-2">
                      <div>
                        <span className="text-[10px] text-[var(--accent)] uppercase font-semibold">
                          {landmark.categoryLabel}
                        </span>
                        <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                          {landmark.name}
                        </h3>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-black border border-[var(--line)] text-cyan-300 font-mono">
                        {landmark.coordinatesFormatted}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {landmark.description}
                    </p>

                    <div className="text-[11px] text-zinc-300 font-mono bg-black/40 p-2 rounded border border-[var(--line)]">
                      <span className="text-[var(--accent)]">3D Relief:</span> {landmark.featureDescription}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex justify-end">
                    <button
                      onClick={() => handleSelectSite(landmark.id)}
                      className={`px-3 py-1.5 rounded text-xs uppercase font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent)] text-black font-semibold'
                          : 'bg-black text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black'
                      }`}
                    >
                      <Eye size={12} />
                      <span>{isSelected ? 'Framed in 3D' : 'Fly to Crater'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'robotic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROBOTIC_LANDERS.map((lander) => {
              const isSelected = selectedLandmarkId === lander.id;
              return (
                <div
                  key={lander.id}
                  className={`rounded border bg-[var(--chip)]/90 backdrop-blur-md p-4 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                      : 'border-[var(--line)] hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-1 border-b border-[var(--line)] pb-2">
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                          {lander.categoryLabel} • {lander.date}
                        </span>
                        <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                          {lander.name}
                        </h3>
                        <div className="text-[11px] text-[var(--muted)] uppercase">
                          {lander.region}
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono">
                        {lander.coordinatesFormatted}
                      </span>
                    </div>

                    {lander.referenceImage && (
                      <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                        <img
                          src={lander.referenceImage}
                          alt={lander.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-1.5 left-2 text-[9px] text-zinc-300 font-mono drop-shadow">
                          {lander.referenceCredit}
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {lander.description}
                    </p>

                    <div className="text-[11px] text-zinc-300 font-mono bg-black/40 p-2 rounded border border-[var(--line)]">
                      <span className="text-emerald-400">Scientific Milestone:</span> {lander.featureDescription}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex justify-end">
                    <button
                      onClick={() => handleSelectSite(lander.id)}
                      className={`px-3 py-1.5 rounded text-xs uppercase font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-400 text-black font-semibold'
                          : 'bg-black text-emerald-400 border border-emerald-400 hover:bg-emerald-400 hover:text-black'
                      }`}
                    >
                      <Eye size={12} />
                      <span>{isSelected ? 'Framed in 3D' : 'Fly to Probe'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'maria' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LUNAR_MARIA.map((mare) => {
              const isSelected = selectedLandmarkId === mare.id;
              return (
                <div
                  key={mare.id}
                  className={`rounded border bg-[var(--chip)]/90 backdrop-blur-md p-4 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                      : 'border-[var(--line)] hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="border-b border-[var(--line)] pb-2">
                      <span className="text-[10px] text-indigo-400 uppercase font-semibold">
                        {mare.categoryLabel}
                      </span>
                      <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                        {mare.name}
                      </h3>
                      <div className="text-[11px] text-[var(--muted)] uppercase">
                        {mare.region} • {mare.coordinatesFormatted}
                      </div>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {mare.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex justify-end">
                    <button
                      onClick={() => handleSelectSite(mare.id)}
                      className={`px-3 py-1.5 rounded text-xs uppercase font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-400 text-black font-semibold'
                          : 'bg-black text-indigo-400 border border-indigo-400 hover:bg-indigo-400 hover:text-black'
                      }`}
                    >
                      <Eye size={12} />
                      <span>{isSelected ? 'Framed in 3D' : 'Fly to Mare'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'asteroids' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {NEAR_EARTH_ASTEROIDS.map((ast) => (
              <div
                key={ast.name}
                className="rounded border border-[var(--line)] bg-[var(--chip)]/90 backdrop-blur-md p-3.5 flex flex-col justify-between transition-all hover:border-white/30"
              >
                <div className="flex flex-col gap-2">
                  <div className="relative rounded overflow-hidden aspect-[4/3] bg-black border border-[var(--line)]">
                    <img
                      src={ast.image}
                      alt={ast.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xs font-bold uppercase text-[var(--text)]">
                    {ast.name}
                  </h3>
                  <div className="text-[10px] text-[var(--accent)] font-mono">
                    {ast.diameter} • {ast.type}
                  </div>
                  <div className="text-[10px] text-[var(--muted)] leading-tight">
                    {ast.mission}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* --- End of LunarExplorationSection.jsx --- */

