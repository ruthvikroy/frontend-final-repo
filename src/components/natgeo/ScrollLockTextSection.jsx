/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Scroll-locked kinetic text animation section featuring peer-reviewed terrestrial analog and planetary science narratives from Analog Atlas
*/
import React, { useRef, useState, useEffect } from 'react';
import { Compass, Sparkles, Orbit, Layers, ArrowDown, ChevronRight, ChevronsDown } from 'lucide-react';

const TEXT_STAGES = [
  {
    step: '01',
    tag: '01 / TERRESTRIAL & LUNAR ANALOGS',
    heading: 'Connecting Extreme Terrestrial Landscapes to the Highlands of the Moon.',
    highlight: 'Terrestrial Landscapes to the Highlands',
    deck: 'From the hyper-arid Chajnantor Plateau in Chile to the 5,500-meter anorthositic heights of Mons Huygens, Earth preserves natural geological laboratories that prepare humanity for deep space exploration.',
    metrics: [
      { label: 'ANALOG PAIRS', value: '07 CURATED' },
      { label: 'DATA REPOSITORY', value: 'NASA PDS / USGS' },
      { label: 'FIELD SITES', value: 'GLOBAL COVERAGE' },
    ],
  },
  {
    step: '02',
    tag: '02 / GRAVITATIONAL & ATMOSPHERIC DYNAMICS',
    heading: '1.00g vs 0.165g — Weighing 83.5% Less on the Pristine Lunar Regolith.',
    highlight: '1.00g vs 0.165g',
    deck: 'With near-total vacuum exosphere and extreme radiation swings reaching 420 mSv/year, lunar surface operations demand rigorous analog simulation before flight hardware departs Earth.',
    metrics: [
      { label: 'LUNAR DISTANCE', value: '384,400 KM' },
      { label: 'ESCAPE SPEED', value: '11.2 vs 2.38 KM/S' },
      { label: 'RADIATION SWING', value: '420 MSV / YR' },
    ],
  },
  {
    step: '03',
    tag: '03 / APOLLO ARCHIVES & PLANETARY OBSERVATIONS',
    heading: 'Grounded in Apollo ALSEP Archives & High-Fidelity Planetary Orbits.',
    highlight: 'Apollo ALSEP Archives & High-Fidelity',
    deck: 'Synthesizing real coordinates from 6 Apollo landing sites, Lunar Reconnaissance Orbiter laser altimetry, and Mars MOLA surface topographies into a unified celestial navigation engine.',
    metrics: [
      { label: 'APOLLO MISSIONS', value: '6 CREWED BASES' },
      { label: 'RETURNED REGOLITH', value: '382.4 KG BASALT' },
      { label: 'COORDINATE FIDELITY', value: 'LROC SUB-METER' },
    ],
  },
];

export function ScrollLockTextSection() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (containerHeight <= 0) return;

      const scrolled = -rect.top;
      const clamped = Math.max(0, Math.min(1, scrolled / containerHeight));
      setProgress(clamped);

      if (clamped < 0.33) {
        setActiveStage(0);
      } else if (clamped < 0.66) {
        setActiveStage(1);
      } else {
        setActiveStage(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const jumpToStage = (stageIdx) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    if (containerHeight <= 0) return;

    // stage 0 -> 0.12, stage 1 -> 0.48, stage 2 -> 0.82
    const targetProgress = stageIdx === 0 ? 0.12 : stageIdx === 1 ? 0.48 : 0.82;
    window.scrollTo({
      top: containerTop + containerHeight * targetProgress,
      behavior: 'smooth',
    });
  };

  const advanceNarrative = () => {
    if (activeStage < TEXT_STAGES.length - 1) {
      jumpToStage(activeStage + 1);
    } else {
      skipNarrative();
    }
  };

  const skipNarrative = () => {
    const articlesEl = document.getElementById('articles');
    if (articlesEl) {
      articlesEl.scrollIntoView({ behavior: 'smooth' });
    } else if (containerRef.current) {
      const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: containerTop + containerRef.current.offsetHeight,
        behavior: 'smooth',
      });
    }
  };

  const current = TEXT_STAGES[activeStage];

  return (
    <section
      ref={containerRef}
      id="scroll-lock-stage"
      aria-label="Interactive Kinetic Text Stage"
      className="relative w-full h-[260vh] bg-[#030407] border-b border-white/10 select-none"
    >
      {/* Sticky Viewport Container - Locks the text on screen while scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-16 py-8 sm:py-12 pointer-events-none">
        
        {/* Ambient Cosmic Radial Glow */}
        <div className="absolute inset-0 bg-radial from-[#F5D000]/5 via-transparent to-transparent pointer-events-none" />

        {/* Top Header for Scroll Lock Stage */}
        <div className="relative z-10 max-w-[1720px] w-full mx-auto flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#F5D000] animate-ping" />
            <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F5D000] font-bold">
              SCROLL LOCK NARRATIVE // PLANETARY INSIGHTS
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#888888]">
            <span className="hidden sm:inline">CYCLE STAGE</span>
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {TEXT_STAGES.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => jumpToStage(idx)}
                  className={`w-7 h-2 transition-all duration-300 cursor-pointer ${
                    activeStage === idx
                      ? 'bg-[#F5D000] shadow-[0_0_8px_rgba(245,208,0,0.6)]'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  title={`Jump to Stage 0${idx + 1}`}
                  aria-label={`Jump to Stage 0${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-[#F1F1F1] font-bold">
              0{activeStage + 1} / 03
            </span>
          </div>
        </div>

        {/* Central Kinetic Locked Text Content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full my-auto flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-code uppercase tracking-[0.22em] text-[#F5D000] font-bold bg-[#F5D000]/10 px-2.5 py-1 border border-[#F5D000]/30">
              {current.tag}
            </span>
            <span className="text-white/20 text-xs">•</span>
            <span className="text-[10px] font-mono-code uppercase text-[#888888] tracking-widest hidden sm:inline">
              NASA PDS // PEER-REVIEWED ARCHIVES
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[-0.035em] text-[#F1F1F1] leading-[1.1] font-editorial transition-all duration-500">
            {current.heading}
          </h2>

          <p className="text-sm sm:text-lg text-[#A0A0A0] leading-relaxed max-w-3xl font-editorial transition-all duration-500">
            {current.deck}
          </p>

          {/* Interactive Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-white/10">
            {current.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-[#080808]/80 backdrop-blur-md border border-white/10 p-3 sm:p-4 flex flex-col gap-1 transition-all duration-300"
              >
                <span className="text-[9px] font-mono-code uppercase tracking-widest text-[#888888]">
                  {m.label}
                </span>
                <span className="text-sm sm:text-base font-mono-code font-bold text-[#F5D000]">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Progress Bar & Skip/Advance Interactive Controls */}
        <div className="relative z-10 max-w-[1720px] w-full mx-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-[10px] font-mono-code text-[#888888]">
          <div className="flex items-center gap-2">
            <span className="text-[#F5D000]">LOCK PROGRESS:</span>
            <div className="w-28 sm:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F5D000] transition-all duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="text-[#F1F1F1] font-bold">
              {Math.round(progress * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2.5 pointer-events-auto">
            <button
              onClick={skipNarrative}
              className="px-3 py-1.5 border border-white/20 bg-black/70 hover:bg-white/10 hover:border-white/40 text-[#888888] hover:text-[#F1F1F1] transition-all duration-200 text-[10px] font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              title="Skip all narrative stages and proceed directly to curated dispatches"
            >
              <span>SKIP ALL</span>
              <ChevronsDown size={12} className="text-current" />
            </button>

            <button
              onClick={advanceNarrative}
              className="px-3.5 py-1.5 border border-[#F5D000] bg-[#F5D000] hover:bg-black text-black hover:text-[#F5D000] transition-all duration-200 text-[10px] font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(245,208,0,0.25)]"
              title="Skip to next narrative stage or dispatches"
            >
              <span>
                {activeStage < TEXT_STAGES.length - 1
                  ? 'SKIP TO ADVANCE NARRATIVE'
                  : 'ADVANCE TO DISPATCHES'}
              </span>
              <ChevronRight size={12} className="text-current" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- End of ScrollLockTextSection.jsx --- */

