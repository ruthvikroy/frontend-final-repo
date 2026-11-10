/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Space flight HUD and controls for the embedded orbital simulation with Full-Screen 3D Simulation launcher
*/
import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
} from 'lucide-react';
import { useSimulationStore } from './simulationStore.js';

export function SimulationUI({ embedded = false, onLaunchFullSimulation }) {
  const isPlaying = useSimulationStore((state) => state.isPlaying);
  const orbitalSpeed = useSimulationStore((state) => state.orbitalSpeed);
  const focusTarget = useSimulationStore((state) => state.focusTarget);
  const showOrbits = useSimulationStore((state) => state.showOrbits);
  const showAtmosphere = useSimulationStore((state) => state.showAtmosphere);
  const simulationEpoch = useSimulationStore((state) => state.simulationEpoch);
  const activeHoverBody = useSimulationStore((state) => state.activeHoverBody);

  const togglePlay = useSimulationStore((state) => state.togglePlay);
  const setOrbitalSpeed = useSimulationStore((state) => state.setOrbitalSpeed);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const toggleOrbits = useSimulationStore((state) => state.toggleOrbits);
  const toggleAtmosphere = useSimulationStore((state) => state.toggleAtmosphere);
  const resetSimulation = useSimulationStore((state) => state.resetSimulation);

  const daysElapsed = (simulationEpoch / 2.0).toFixed(1);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-2.5 sm:p-5 select-none font-mono-code text-[10px] sm:text-[11px]">
      <div className="flex flex-col gap-1.5 sm:gap-2 pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3">
          <div className="flex flex-wrap items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#050505]/90 border border-white/10 shadow-lg w-fit max-w-full">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#F5D000] shrink-0" />
            <span className="text-[#F1F1F1] font-bold tracking-wider uppercase truncate">
              NESTED ORBITAL ENGINE <span className="hidden md:inline">// SUN • EARTH • MOON • MARS</span>
            </span>
            <span className="text-[#888888] hidden sm:inline">|</span>
            <span className="text-[#F5D000] hidden sm:inline tracking-widest">
              T+ {daysElapsed} DAYS
            </span>
            <span className="text-cyan-300 hidden xl:inline text-[10px]">
              v = √(GM/r) ⊥ a_g = v²/r
            </span>
            {activeHoverBody && (
              <span className="text-white bg-white/10 px-1.5 py-0.5 border border-white/20">
                {activeHoverBody}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#050505]/90 border border-white/10 p-1 overflow-x-auto max-w-full w-fit">
            {['system', 'earth', 'moon', 'mars'].map((target) => (
              <button
                key={target}
                onClick={() => setFocusTarget(target)}
                className={`px-2 sm:px-2.5 py-1 uppercase tracking-wider transition-colors cursor-pointer text-[9.5px] sm:text-[10px] shrink-0 ${
                  focusTarget === target
                    ? 'bg-[#F5D000] text-black font-bold'
                    : 'text-[#888888] hover:text-[#F1F1F1] hover:bg-white/5'
                }`}
              >
                {target}
              </button>
            ))}

            {embedded && onLaunchFullSimulation && (
              <button
                onClick={() => onLaunchFullSimulation(focusTarget)}
                className="hidden sm:flex px-2.5 py-1 bg-[#F5D000]/15 hover:bg-[#F5D000] text-[#F5D000] hover:text-black font-bold uppercase tracking-wider transition-colors border-l border-white/10 ml-1 items-center gap-1.5 cursor-pointer text-[10px] shrink-0"
                title="Open Full Screen 3D Simulation"
              >
                <Maximize2 size={12} />
                <span>FULL SCREEN 3D</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pointer-events-auto">
        <div className="flex items-center gap-1 bg-[#050505]/90 border border-white/10 p-1">
          <button
            onClick={togglePlay}
            className="p-1.5 text-[#F1F1F1] hover:text-[#F5D000] transition-colors cursor-pointer"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <button
            onClick={resetSimulation}
            className="p-1.5 text-[#888888] hover:text-[#F1F1F1] transition-colors cursor-pointer"
            title="Reset Simulation (R)"
          >
            <RotateCcw size={13} />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 border-l border-white/10 text-[9.5px] sm:text-[10px]">
            <span className="text-[#888888] uppercase hidden xs:inline sm:inline">SPEED</span>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.2"
              value={orbitalSpeed}
              onChange={(e) => setOrbitalSpeed(parseFloat(e.target.value))}
              className="w-14 sm:w-20 accent-[#F5D000] cursor-pointer"
            />
            <span className="text-[#F5D000] font-bold w-6 sm:w-7 text-right">
              {orbitalSpeed.toFixed(1)}x
            </span>
          </div>
        </div>

        <div className="flex-1 pointer-events-none" />

        <div className="flex items-center gap-1 bg-[#050505]/90 border border-white/10 p-1 text-[9.5px] sm:text-[10px]">
          <button
            onClick={toggleOrbits}
            className={`px-2 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
              showOrbits ? 'text-[#F5D000] bg-[#F5D000]/10' : 'text-[#888888] hover:text-[#F1F1F1]'
            }`}
          >
            ORBITS {showOrbits ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={toggleAtmosphere}
            className={`px-2 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
              showAtmosphere ? 'text-[#38bdf8] bg-[#38bdf8]/10' : 'text-[#888888] hover:text-[#F1F1F1]'
            }`}
          >
            ATMOSPHERE
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- End of SimulationUI.jsx --- */

