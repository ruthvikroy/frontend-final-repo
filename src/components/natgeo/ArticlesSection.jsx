/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Bordered Space Punks editorial articles section with NASA Ames subsurface astrobiology information and Earth observatories researching Moon and Mars
*/
import React from 'react';
import { Radio, Sparkles } from 'lucide-react';
import {
  EARTH_OBSERVATORIES,
  SUBSURFACE_ASTROBIOLOGY_INFO,
  LOST_OCEANS_OF_MARS_INFO,
  THREE_WORLDS_LIFE_INFO,
  MOON_WATER_ICE_INFO,
} from '../../data/marsLandmarks.js';

export function ArticlesSection({ onLaunchSimulation = () => {} }) {
  return (
    <section
      id="articles"
      aria-label="Editorial Articles Panel"
      className="w-full bg-[#050505] border-b border-white/10 relative overflow-hidden"
    >
      <div className="max-w-[1720px] mx-auto border-x border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:py-8 flex lg:flex-col justify-between items-center text-[10px] font-mono-code text-[#888888] tracking-[0.25em] uppercase">
            <span className="text-[#F5D000] font-bold">SEC 02</span>
            <div className="hidden lg:block [writing-mode:vertical-rl] rotate-180 tracking-[0.35em] text-[#888888]">
              DISPATCH &amp; FIELD NOTES
            </div>
            <span>2026</span>
          </div>

          <div className="lg:col-span-8 p-4 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F5D000] block mb-2 font-bold">
                  CURATED DISPATCHES
                </span>
                <h2 className="text-3xl sm:text-6xl md:text-7xl font-black uppercase tracking-[-0.05em] text-[#F1F1F1] font-editorial leading-none">
                  Articles.
                </h2>
              </div>
            </div>

            <div className="mb-8 border border-[#F5D000]/40 bg-[#0A0A0A] p-4 sm:p-8 relative overflow-hidden space-y-6 sm:space-y-7">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-5 items-start">
                <div className="w-full md:w-64 lg:w-72 shrink-0 rounded overflow-hidden border border-[#F5D000]/40 bg-black aspect-[16/10]">
                  <img
                    src={SUBSURFACE_ASTROBIOLOGY_INFO.image}
                    alt={SUBSURFACE_ASTROBIOLOGY_INFO.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2.5 sm:gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-mono-code text-[#F5D000] font-bold uppercase tracking-wider leading-snug">
                    <span>{SUBSURFACE_ASTROBIOLOGY_INFO.location}</span>
                    <span className="text-cyan-300">{SUBSURFACE_ASTROBIOLOGY_INFO.meeting}</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-[#F1F1F1] font-editorial leading-snug">
                    {SUBSURFACE_ASTROBIOLOGY_INFO.title}
                  </h3>
                  <p className="text-[13px] sm:text-sm text-[#D0D0D0] leading-[1.7] sm:leading-relaxed font-editorial">
                    {SUBSURFACE_ASTROBIOLOGY_INFO.body}
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4 sm:gap-5 items-start">
                <div className="w-full md:w-64 lg:w-72 shrink-0 rounded overflow-hidden border border-orange-400/40 bg-black aspect-[16/10]">
                  <img
                    src={LOST_OCEANS_OF_MARS_INFO.image}
                    alt={LOST_OCEANS_OF_MARS_INFO.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2.5 sm:gap-3">
                  <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-orange-300 font-editorial leading-snug">
                    {LOST_OCEANS_OF_MARS_INFO.title}
                  </h3>
                  <p className="text-[13px] sm:text-sm text-[#D0D0D0] leading-[1.7] sm:leading-relaxed font-editorial">
                    {LOST_OCEANS_OF_MARS_INFO.body}
                  </p>
                  <div className="text-[11px] font-mono-code text-[#F5D000] font-bold leading-snug">
                    {LOST_OCEANS_OF_MARS_INFO.authors}
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4 sm:gap-5 items-start">
                <div className="w-full md:w-64 lg:w-72 shrink-0 rounded overflow-hidden border border-cyan-400/40 bg-black aspect-[16/10]">
                  <img
                    src={THREE_WORLDS_LIFE_INFO.image}
                    alt={THREE_WORLDS_LIFE_INFO.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2.5 sm:gap-3">
                  <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-cyan-300 font-editorial leading-snug">
                    {THREE_WORLDS_LIFE_INFO.title}
                  </h3>
                  <div className="text-[11px] font-mono-code text-[#F5D000] font-bold uppercase tracking-wider">
                    {THREE_WORLDS_LIFE_INFO.author}
                  </div>
                  <p className="text-[13px] sm:text-sm text-[#D0D0D0] leading-[1.7] sm:leading-relaxed font-editorial">
                    {THREE_WORLDS_LIFE_INFO.paragraph1}
                  </p>
                  <p className="text-[13px] sm:text-sm text-[#D0D0D0] leading-[1.7] sm:leading-relaxed font-editorial">
                    {THREE_WORLDS_LIFE_INFO.paragraph2}
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4 sm:gap-5 items-start">
                <div className="w-full md:w-64 lg:w-72 shrink-0 rounded overflow-hidden border border-amber-400/40 bg-black aspect-[16/10]">
                  <img
                    src={MOON_WATER_ICE_INFO.image}
                    alt={MOON_WATER_ICE_INFO.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2.5 sm:gap-3">
                  <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-amber-300 font-editorial leading-snug">
                    {MOON_WATER_ICE_INFO.title}
                  </h3>
                  <div className="text-[11px] font-mono-code text-[#F5D000] font-bold tracking-wider">
                    {MOON_WATER_ICE_INFO.author}
                  </div>
                  <p className="text-[13px] sm:text-sm text-[#D0D0D0] leading-[1.7] sm:leading-relaxed font-editorial">
                    {MOON_WATER_ICE_INFO.body}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border border-white/10 bg-[#0A0A0A] p-4 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-[10.5px] sm:text-[11px] font-mono-code text-cyan-400 uppercase tracking-wider sm:tracking-widest font-bold">
                  <Radio size={13} className="shrink-0" />
                  <span>EARTH OBSERVATORIES RESEARCHING THE MOON &amp; MARS</span>
                </div>
                <span className="text-[10px] font-mono-code text-[#888888]">
                  6 TERRESTRIAL RESEARCH STATIONS
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-3">
                {EARTH_OBSERVATORIES.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-4 border border-white/10 bg-[#050505] flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono-code text-cyan-400 uppercase font-bold">
                        <span>{obs.categoryLabel}</span>
                        <span className="text-zinc-400">{obs.coordinatesFormatted}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold uppercase text-[#F1F1F1] mt-1.5 font-editorial leading-snug">
                        {obs.name}
                      </h4>
                      <div className="text-[10.5px] font-mono-code text-[#F5D000] mt-0.5">
                        {obs.location}
                      </div>
                      {obs.referenceImage && (
                        <div
                          className={`mt-3 grid gap-2 ${
                            obs.secondaryImage ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                          }`}
                        >
                          <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-white/15">
                            <img
                              src={obs.referenceImage}
                              alt={obs.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            <span className="absolute bottom-1 left-1.5 text-[8.5px] font-mono-code text-zinc-300 drop-shadow truncate max-w-[95%]">
                              {obs.referenceCredit}
                            </span>
                          </div>
                          {obs.secondaryImage && (
                            <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-white/15">
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
                      <p className="text-[12.5px] sm:text-xs text-[#A8A8A8] leading-[1.65] sm:leading-relaxed mt-2.5 font-editorial">
                        {obs.description}
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono-code text-zinc-400">
                      <span>TARGETS: {obs.researchTargets}</span>
                      <span className="text-cyan-300 font-bold">{obs.elevationKm}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border border-white/10 bg-[#0A0A0A] p-4 sm:p-7 relative overflow-hidden flex flex-col md:flex-row items-center gap-5 sm:gap-6">
              <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden shrink-0 border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <img
                  src="/assets/aistudio/lunarorb_copernicus_000b6074.jpg"
                  alt="Lunar Copernicus crater monochromatic reconnaissance"
                  className="w-full h-full object-cover filter contrast-125 grayscale"
                />
                <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70" />
                <div className="absolute top-2 left-2 text-[8px] font-mono-code text-[#F5D000] bg-black/70 px-1 border border-[#F5D000]/40">
                  LUNAR RECON
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#F5D000] uppercase tracking-wider sm:tracking-widest font-bold">
                  <Sparkles size={12} className="shrink-0" />
                  <span>SPECIAL ORBITAL FEATURE // MOON HIGH-RESOLUTION ATLAS</span>
                </div>
                <h4 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-[#F1F1F1] font-editorial leading-snug">
                  Copernicus Crater &amp; Fra Mauro Formation
                </h4>
                <p className="text-[12.5px] sm:text-xs text-[#A8A8A8] leading-[1.65] sm:leading-relaxed font-editorial">
                  Copernicus, a 93-kilometer impact crater in eastern Oceanus Procellarum, was surveyed during Apollo 12 and Lunar Orbiter 2. Central peaks rise 1.2 kilometers above the sunken crater floor.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    onClick={onLaunchSimulation}
                    className="px-3.5 py-2 sm:py-1.5 border border-[#F5D000] bg-[#F5D000]/10 hover:bg-[#F5D000] text-[#F5D000] hover:text-black font-mono-code text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    FLY TO COPERNICUS IN 3D
                  </button>
                  <span className="text-[10px] font-mono-code text-[#888888]">
                    COORD: 9.62° N, 20.08° W
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-3 p-6 sm:p-8 bg-[#070707] flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F5D000] block mb-1 font-bold">
                  EDITOR'S NOTEBOOK
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#F1F1F1] font-editorial">
                  The Imperative to Probe
                </h3>
                <p className="text-xs text-[#888888] leading-relaxed mt-2 font-editorial">
                  "Every millimeter of lunar basalt and Martian iron oxide carries the genesis log of our solar system. In exploration, humanity looks directly into its own cosmic ancestry."
                </p>
                <span className="text-[9px] font-mono-code uppercase text-[#F1F1F1]/70 block mt-2 tracking-wider">
                  — K. STRICKLAND, EDITOR IN CHIEF
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#888888] font-bold">
                  ARCHIVAL INDICES
                </span>
                <ul className="text-xs font-mono-code text-[#888888] space-y-1.5">
                  <li className="flex items-center justify-between hover:text-[#F1F1F1] cursor-pointer">
                    <span>• VOYAGER INTERSTELLAR ARCHIVE</span>
                    <span className="text-[#F5D000]">1977</span>
                  </li>
                  <li className="flex items-center justify-between hover:text-[#F1F1F1] cursor-pointer">
                    <span>• APOLLO 11 TRANQUILITY BASE</span>
                    <span className="text-[#F5D000]">1969</span>
                  </li>
                  <li className="flex items-center justify-between hover:text-[#F1F1F1] cursor-pointer">
                    <span>• HUBBLE DEEP FIELD SOUTH</span>
                    <span className="text-[#F5D000]">1998</span>
                  </li>
                  <li className="flex items-center justify-between hover:text-[#F1F1F1] cursor-pointer">
                    <span>• JAMES WEBB COSMIC INFRARED</span>
                    <span className="text-[#F5D000]">2022</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 border border-[#F5D000]/40 bg-[#F5D000]/5 text-center flex flex-col gap-2">
              <span className="text-[9px] font-mono-code uppercase tracking-[0.2em] text-[#F5D000] font-bold">
                TEAM SPACE PUNKS // FIELD REPORT
              </span>
              <p className="text-[11px] text-[#F1F1F1] font-editorial">
                Support planetary science &amp; extreme environmental fieldwork worldwide.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* --- End of ArticlesSection.jsx --- */

