/*
Description: Space Punks editorial hero with embedded 3D Earth & Moon scene and direct Full-Screen Simulation controls
*/
import React from 'react';
import { ArrowDown, Compass, Globe, Moon, Maximize2, Rocket } from 'lucide-react';
import { SpaceScene } from '../../simulation/SpaceScene.jsx';

export function EditorialHero({
  onLaunchSimulation = () => {},
  onLaunchDashboard = () => {},
}) {
  return (
    <section
      id="hero"
      aria-label="Editorial Hero"
      className="relative w-full min-h-[92vh] lg:min-h-[96vh] bg-[#050505] bg-dotted-grid border-b border-white/10 flex flex-col justify-between overflow-hidden select-none"
    >
      <div className="w-full border-b border-white/10 px-4 sm:px-8 py-5 z-20">
        <div className="max-w-[1720px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <div className="md:col-span-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#F5D000] text-[10px] font-mono-code uppercase tracking-[0.25em]">
              <img
                src="/assets/space-punks-logo.png"
                alt="Logo"
                className="w-4 h-4 rounded-full object-cover shrink-0"
              />
              <span>NASA PDS • USGS ASTROGEOLOGY ARCHIVE</span>
            </div>
            <p className="text-xs font-mono-code uppercase tracking-wider text-[#F1F1F1] font-semibold">
              EARTH, MOON &amp; MARS ANALOGS // TEAM SPACE PUNKS
            </p>
          </div>

          <div className="md:col-span-5 border-l border-white/10 pl-0 md:pl-6">
            <p className="text-xs text-[#888888] leading-relaxed max-w-xl font-editorial">
              Connecting extreme terrestrial geological landscapes to the cratered highlands of the Moon and the ancient river deltas of Mars. Grounded in peer-reviewed orbital telemetry, Apollo surface logs, and Perseverance 3D surveys.
            </p>
          </div>

          <div className="md:col-span-3 flex md:justify-end items-start">
            <div className="flex flex-col md:items-end text-[10px] font-mono-code text-[#888888] gap-0.5">
              <span className="text-[#F1F1F1] font-bold">384,400 KM • MEAN LUNAR DISTANCE</span>
              <span>1.00g vs 0.165g vs 0.38g GRAVITY</span>
              <span className="text-[#F5D000]">EARTH • MOON • MARS 3D ENGINE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center w-full max-w-[1720px] mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
          <SpaceScene
            embedded={true}
            className="w-full h-full"
            onLaunchFullSimulation={(target) => {
              const mode =
                target === 'earth' || target === 'moon' || target === 'mars'
                  ? target
                  : 'overview';
              onLaunchSimulation(mode);
            }}
          />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between pointer-events-none gap-6 lg:gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-8">
            <div className="lg:col-span-6">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-none text-[#F1F1F1] uppercase select-none drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
                Explore
              </h1>
            </div>

            <div className="lg:col-span-6 text-left lg:text-right">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-none text-[#F1F1F1] uppercase select-none drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
                The Unknown.
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-white/10 bg-[#0A0A0A]/95 px-4 sm:px-8 py-4 z-20">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] font-mono-code uppercase tracking-wider">
            <button
              onClick={() => onLaunchSimulation('earth')}
              className="text-[#F5D000] hover:underline flex items-center gap-2 cursor-pointer font-bold"
            >
              <Globe size={13} />
              <span>01 • EARTH (3D)</span>
            </button>
            <span className="text-white/20">/</span>
            <button
              onClick={() => onLaunchSimulation('moon')}
              className="text-amber-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer font-bold"
            >
              <Moon size={13} />
              <span>02 • MOON (3D)</span>
            </button>
            <span className="text-white/20">/</span>
            <button
              onClick={() => onLaunchSimulation('mars')}
              className="text-orange-400 hover:text-orange-200 transition-colors flex items-center gap-2 cursor-pointer font-bold"
            >
              <Rocket size={13} />
              <span>03 • MARS MOLA + ZCAM (3D)</span>
            </button>
            <span className="text-white/20">/</span>
            <button
              onClick={onLaunchDashboard}
              className="text-[#888888] hover:text-[#F1F1F1] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Compass size={13} />
              <span>04 • TELEMETRY MATRIX</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunchSimulation('overview')}
              className="pointer-events-auto px-4 py-2 border border-[#F5D000] bg-[#F5D000] text-black hover:bg-black hover:text-[#F5D000] font-mono-code text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Maximize2 size={14} />
              <span>LAUNCH FULL SCREEN 3D</span>
            </button>

            <a
              href="#articles"
              className="p-2 border border-white/10 hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] transition-colors"
              title="Scroll to Articles"
              aria-label="Scroll to Articles"
            >
              <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
