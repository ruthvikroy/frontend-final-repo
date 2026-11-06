/*
Description: Dedicated top separation section to launch and control full screen Earth, Moon, and Mars 3D simulation
*/

import React from 'react';
import { Eye, Rocket, Globe, Moon, Disc, Play, Pause } from 'lucide-react';
import { APOLLO_LANDING_SITES } from '../data/lunarLandmarks.js';

export function SimulationSeparationSection({
  onEnterSimulation,
  onFocusEarth,
  onFocusMoon,
  onFocusMars = () => {},
  onFocusOrbit,
  onSelectApolloSite,
  isPaused,
  onTogglePause,
  onPlayClick = () => {},
}) {
  return (
    <section
      aria-label="3D Earth, Moon & Mars Simulation Section"
      className="w-full border-b border-[var(--line)] bg-[#05080f] px-6 py-4 relative z-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider font-mono">
                3D CELESTIAL SIMULATION // EARTH, MOON &amp; MARS
              </span>
              <span className="hidden sm:inline text-[var(--line)]">|</span>
              <span className="text-[10px] text-[var(--muted)] uppercase font-mono">
                UNIFIED REAL-TIME PLANETARY ENGINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onPlayClick();
                onEnterSimulation();
              }}
              className="px-3.5 py-1.5 rounded border border-[var(--accent)] bg-[var(--chip)] text-[var(--accent)] font-bold text-xs uppercase transition-all flex items-center gap-1.5 cursor-pointer font-mono"
              title="Launch Full Screen 3D Simulation"
            >
              <Eye size={13} />
              <span>FULL SCREEN 3D VIEW</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-[var(--line)]/60 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-[var(--muted)] uppercase mr-1">QUICK VIEW:</span>

            <button
              onClick={() => {
                onPlayClick();
                onFocusEarth();
              }}
              className="px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--chip)] text-[var(--muted)] hover:text-white hover:border-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer uppercase text-[11px]"
            >
              <Globe size={11} className="text-blue-400" />
              <span>EARTH</span>
            </button>

            <button
              onClick={() => {
                onPlayClick();
                onFocusMoon();
              }}
              className="px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--chip)] text-[var(--muted)] hover:text-white hover:border-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer uppercase text-[11px]"
            >
              <Moon size={11} className="text-amber-300" />
              <span>MOON</span>
            </button>

            <button
              onClick={() => {
                onPlayClick();
                onFocusMars();
              }}
              className="px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--chip)] text-orange-300 hover:text-white hover:border-orange-400 transition-colors flex items-center gap-1 cursor-pointer uppercase text-[11px]"
            >
              <Rocket size={11} className="text-orange-400" />
              <span>MARS 3D</span>
            </button>

            <button
              onClick={() => {
                onPlayClick();
                onFocusOrbit();
              }}
              className="px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--chip)] text-[var(--muted)] hover:text-white hover:border-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer uppercase text-[11px]"
            >
              <Disc size={11} className="text-[var(--accent)]" />
              <span>ORBIT DYNAMICS</span>
            </button>

            <button
              onClick={() => {
                onPlayClick();
                onTogglePause();
              }}
              className="px-2 py-1 rounded border border-[var(--line)] bg-[var(--chip)] text-[var(--muted)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer uppercase text-[11px]"
              title={isPaused ? 'Resume Motion' : 'Pause Motion'}
            >
              {isPaused ? <Play size={11} className="text-emerald-400" /> : <Pause size={11} />}
              <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-amber-400 uppercase font-semibold flex items-center gap-1 mr-1">
              <Rocket size={11} />
              <span>APOLLO SITES:</span>
            </span>
            {APOLLO_LANDING_SITES.map((site) => (
              <button
                key={site.id}
                onClick={() => {
                  onPlayClick();
                  onSelectApolloSite(site.id);
                }}
                className="px-2 py-0.5 rounded border border-[var(--line)] bg-black/60 text-[10px] text-zinc-300 hover:text-amber-300 hover:border-amber-400/60 transition-colors cursor-pointer font-mono"
                title={`${site.mission}: ${site.landedAstronauts.join(', ')}`}
              >
                {site.mission.replace('Apollo ', 'A-')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
