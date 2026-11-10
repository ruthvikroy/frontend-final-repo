/*
Description: Space Punks editorial header with branding and direct Full-Screen 3D Simulation launcher
*/
import React, { useState } from 'react';
import { Search, Globe, Menu, X, Maximize2 } from 'lucide-react';

export function NatGeoHeader({
  onLaunchSimulation = () => {},
  onLaunchDashboard = () => {},
  onNavigateAnalogs = () => {},
  onNavigateHome = () => {},
  activeSection = 'hero',
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { id: 'hero', label: 'ORBITAL EXPLORE', href: '#hero', action: onNavigateHome },
    { id: 'analogs', label: 'PLANETARY ANALOGS', href: '#analogs', action: onNavigateAnalogs },
    { id: 'narrative', label: 'ADVANCE NARRATIVE', href: '#scroll-lock-stage', action: onNavigateHome },
    { id: 'articles', label: 'ANALOG DISPATCHES', href: '#articles', action: onNavigateHome },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505]/95 border-b border-white/10 select-none">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 xl:gap-4">
        <div className="flex items-center gap-3 xl:gap-4 min-w-0 shrink">
          <a
            href="#hero"
            onClick={(e) => {
              if (onNavigateHome) {
                onNavigateHome();
              }
            }}
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer min-w-0"
          >
            <img
              src="/assets/space-punks-logo.png"
              alt="Space Punks Logo"
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#F5D000]/70 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-black tracking-[-0.04em] text-sm sm:text-base text-[#F1F1F1] leading-none uppercase font-editorial truncate">
                TEAM SPACE PUNKS
              </span>
              <span className="text-[8px] sm:text-[8.5px] xl:text-[9px] tracking-[0.08em] xl:tracking-[0.12em] text-[#888888] font-mono-code uppercase mt-1 leading-none truncate">
                ASTRODASHBOARD // EARTH, MOON &amp; MARS
              </span>
            </div>
          </a>

          <div className="hidden 2xl:flex items-center gap-2 pl-4 border-l border-white/10 text-[10px] font-mono-code text-[#888888] shrink-0 whitespace-nowrap">
            <span className="text-[#F5D000] font-bold">VOL. 248</span>
            <span>•</span>
            <span>ISSUE 11.26</span>
            <span>•</span>
            <span className="text-[#F1F1F1]/80">OCTOBER 2026</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => {
                if (link.action) {
                  link.action();
                }
              }}
              className={`px-3 xl:px-4 py-1.5 text-[10.5px] xl:text-[11px] font-mono-code tracking-[0.14em] xl:tracking-[0.16em] uppercase transition-all duration-200 border cursor-pointer whitespace-nowrap text-center flex items-center justify-center min-w-[136px] xl:min-w-[152px] ${
                activeSection === link.id
                  ? 'border-[#F5D000] text-[#F5D000] bg-[#F5D000]/10 font-bold shadow-[0_0_12px_rgba(245,208,0,0.12)]'
                  : 'border-white/5 text-[#888888] hover:text-[#F1F1F1] hover:border-white/20 hover:bg-white/[0.03]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 border border-white/10 hover:border-white/20 text-[#888888] hover:text-[#F1F1F1] bg-[#0A0A0A] transition-colors"
            title="Search AstroDashboard"
            aria-label="Search"
          >
            <Search size={14} />
          </button>

          <button
            onClick={() => onLaunchSimulation('overview')}
            className="px-3.5 py-1.5 border border-[#F5D000] bg-[#F5D000] hover:bg-black text-black hover:text-[#F5D000] font-mono-code text-[11px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer"
            title="Open Full Screen 3D Earth, Moon & Mars Simulation"
          >
            <Maximize2 size={13} />
            <span className="hidden sm:inline">FULL SCREEN 3D SIMULATION</span>
            <span className="sm:hidden">3D SIM</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 border border-white/10 text-[#F1F1F1] bg-[#0A0A0A]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/10 bg-[#0A0A0A] px-4 py-3">
          <div className="max-w-[1720px] mx-auto flex items-center gap-3">
            <Search size={16} className="text-[#F5D000]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH DISPATCHES, APOLLO SITES, MARS RECONNAISSANCE..."
              className="w-full bg-transparent border-none text-[#F1F1F1] placeholder-[#555555] text-xs font-mono-code uppercase focus:outline-none tracking-wider"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-[#888888] hover:text-[#F1F1F1] text-xs font-mono-code uppercase"
            >
              ESC
            </button>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#050505] px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link, idx) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.action) link.action();
                }}
                className={`py-3 px-3 text-xs font-mono-code tracking-[0.16em] uppercase flex items-center justify-between border transition-colors ${
                  activeSection === link.id
                    ? 'border-[#F5D000] text-[#F5D000] bg-[#F5D000]/10 font-bold'
                    : 'border-white/5 text-[#888888] hover:text-[#F5D000] hover:border-white/20'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-[10px] text-[#F5D000]/70 font-mono-code">0{idx + 1}</span>
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchSimulation('overview');
              }}
              className="w-full py-2.5 border border-[#F5D000] bg-[#F5D000] text-black font-mono-code text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Globe size={14} />
              <span>FULL SCREEN 3D SIMULATION</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
