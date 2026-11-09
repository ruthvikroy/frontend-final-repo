/*
Author: Space Punks Team
Description: Planetary Analogs comprehensive webpage with restored Earth-Moon analog pairs, Earth-Mars analog pairs, Moon missions (Apollo 11-17 & Artemis), Mars rovers, mountains, craters, creators, and full research articles in the unified Space Punks high-editorial aesthetic.
*/
import React, { useState, useMemo } from 'react';
import {
  Globe,
  Moon,
  Rocket,
  Compass,
  ArrowLeft,
  Search,
  Maximize2,
  BookOpen,
  Mountain,
  Users,
  Layers,
  ChevronRight,
  ExternalLink,
  X,
  Filter,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  EARTH_MOON_ANALOG_PAIRS,
  EARTH_MARS_ANALOG_PAIRS,
  ALL_MOON_MISSIONS,
  MARS_ARTICLES_CATALOG,
  ALL_CURATED_DISPATCHES,
} from '../../data/planetaryAnalogsData.js';
import { NatGeoHeader } from './NatGeoHeader.jsx';
import { NatGeoFooter } from './NatGeoFooter.jsx';

export function PlanetaryAnalogsPage({
  onReturnHome = () => {},
  onLaunchSimulation = () => {},
}) {
  const [activeTab, setActiveTab] = useState('earth-moon');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'pair', 'mission', 'article', 'dispatch'

  // Tabs definition
  const TABS = [
    { id: 'earth-moon', label: '01 • EARTH ⇄ MOON PAIRS', count: EARTH_MOON_ANALOG_PAIRS.length, icon: Moon },
    { id: 'earth-mars', label: '02 • EARTH ⇄ MARS PAIRS', count: EARTH_MARS_ANALOG_PAIRS.length, icon: Rocket },
    { id: 'moon-missions', label: '03 • MOON MISSIONS ARCHIVE', count: ALL_MOON_MISSIONS.length, icon: Globe },
    { id: 'mars-rovers', label: '04 • MARS ROVERS & FIELDWORK', count: MARS_ARTICLES_CATALOG.filter(a => a.section === 'rovers').length, icon: Compass },
    { id: 'mars-mountains', label: '05 • MOUNTAINS & CRATERS', count: MARS_ARTICLES_CATALOG.filter(a => a.section === 'mountains' || a.section === 'craters').length, icon: Mountain },
    { id: 'creators', label: '06 • PIONEERS & CREATORS', count: MARS_ARTICLES_CATALOG.filter(a => a.section === 'creators').length, icon: Users },
    { id: 'dispatches', label: '07 • CURATED DISPATCHES', count: ALL_CURATED_DISPATCHES.length, icon: BookOpen },
  ];

  // Filtering for Earth-Moon pairs
  const filteredEarthMoon = useMemo(() => {
    return EARTH_MOON_ANALOG_PAIRS.filter((pair) => {
      const matchSearch =
        searchQuery === '' ||
        pair.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.earth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.moon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.thematicParallels.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || pair.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // Filtering for Earth-Mars pairs
  const filteredEarthMars = useMemo(() => {
    return EARTH_MARS_ANALOG_PAIRS.filter((pair) => {
      const matchSearch =
        searchQuery === '' ||
        pair.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.earth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.mars.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.thematicParallels.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || pair.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // Filtering for Moon missions
  const filteredMissions = useMemo(() => {
    return ALL_MOON_MISSIONS.filter((m) => {
      const query = searchQuery.toLowerCase();
      return (
        query === '' ||
        m.name.toLowerCase().includes(query) ||
        m.region.toLowerCase().includes(query) ||
        m.astronauts.some((a) => a.toLowerCase().includes(query)) ||
        m.description.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  // Filtering for Mars articles
  const filteredMarsArticles = useMemo(() => {
    return MARS_ARTICLES_CATALOG.filter((art) => {
      const query = searchQuery.toLowerCase();
      const matchSearch =
        query === '' ||
        art.title.toLowerCase().includes(query) ||
        art.subtitle.toLowerCase().includes(query) ||
        art.summary.toLowerCase().includes(query) ||
        art.tags.some((t) => t.toLowerCase().includes(query));

      if (activeTab === 'mars-rovers') {
        return matchSearch && art.section === 'rovers';
      }
      if (activeTab === 'mars-mountains') {
        return matchSearch && (art.section === 'mountains' || art.section === 'craters');
      }
      if (activeTab === 'creators') {
        return matchSearch && art.section === 'creators';
      }
      return matchSearch;
    });
  }, [searchQuery, activeTab]);

  // Curated dispatches
  const filteredDispatches = useMemo(() => {
    return ALL_CURATED_DISPATCHES.filter((d) => {
      const query = searchQuery.toLowerCase();
      return (
        query === '' ||
        d.title.toLowerCase().includes(query) ||
        d.author.toLowerCase().includes(query) ||
        d.body.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const openModal = (item, type) => {
    setActiveModalItem(item);
    setModalType(type);
  };

  const closeModal = () => {
    setActiveModalItem(null);
    setModalType(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#F1F1F1] selection:bg-[#F5D000] selection:text-black font-editorial flex flex-col">
      {/* Top NatGeo Header with Analogs highlighted */}
      <NatGeoHeader
        onLaunchSimulation={onLaunchSimulation}
        onNavigateHome={onReturnHome}
        onNavigateAnalogs={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        activeSection="analogs"
      />

      {/* Hero Banner for Planetary Analogs */}
      <section className="relative w-full border-b border-white/10 bg-[#070707] bg-dotted-grid px-4 sm:px-8 py-8 sm:py-12 select-none">
        <div className="max-w-[1720px] mx-auto flex flex-col gap-6">
          
          {/* Breadcrumb & Navigation Back */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs font-mono-code uppercase tracking-widest text-[#888888]">
              <button
                onClick={onReturnHome}
                className="hover:text-[#F5D000] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>RETURN TO EDITORIAL HOME</span>
              </button>
              <span>/</span>
              <span className="text-[#F5D000] font-bold">PLANETARY ANALOGS ARCHIVE</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onLaunchSimulation('overview')}
                className="px-3.5 py-1.5 border border-[#F5D000] bg-[#F5D000] text-black hover:bg-black hover:text-[#F5D000] font-mono-code text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Maximize2 size={13} />
                <span>FULL SCREEN 3D SIMULATION</span>
              </button>
            </div>
          </div>

          {/* Headline & Abstract */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end pt-2">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#F5D000] text-[10px] font-mono-code uppercase tracking-[0.25em] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#F5D000] animate-ping" />
                <span>USGS ASTROGEOLOGY • NASA PDS • ESA MARS ARCHIVES</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[-0.035em] text-[#F1F1F1] leading-none font-editorial">
                Planetary Analogs.
              </h1>
              <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed max-w-4xl font-editorial">
                Restoring terrestrial geological twins across Earth, the Moon, and Mars. Connecting extreme terrestrial high-altitude observatories, subzero polar ice traps, and acidic river systems to the ancient volcanic shields of Olympus Mons, the cratered highlands of Fra Mauro, and the delta deposits of Jezero Crater.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:items-end gap-2 text-[10px] font-mono-code text-[#888888] border-l border-white/10 pl-4 lg:pl-6">
              <span className="text-[#F1F1F1] font-bold text-xs uppercase tracking-wider">
                COMPREHENSIVE ANALOG METRICS
              </span>
              <div className="flex flex-col sm:items-end gap-1">
                <span>07 EARTH ⇄ MOON ANALOG PAIRS</span>
                <span>06 EARTH ⇄ MARS ANALOG PAIRS</span>
                <span>07 LUNAR MISSIONS & ROVERS</span>
                <span>10 MARS FIELD DOSSIERS</span>
                <span className="text-[#F5D000] font-bold">04 PEER-REVIEWED DISPATCHES</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedCategory('all');
                  }}
                  className={`px-3.5 py-2 text-[11px] font-mono-code tracking-[0.14em] uppercase transition-all duration-200 border flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'border-[#F5D000] bg-[#F5D000] text-black font-bold shadow-[0_0_12px_rgba(245,208,0,0.3)]'
                      : 'border-white/10 bg-[#0A0A0A] text-[#888888] hover:text-[#F1F1F1] hover:border-white/25'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-black' : 'text-[#F5D000]'} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-sm ${
                      isActive ? 'bg-black text-[#F5D000]' : 'bg-white/10 text-[#AAAAAA]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/10 px-4 py-2.5 max-w-xl">
            <Search size={14} className="text-[#F5D000] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH SITES, MISSIONS, ROVERS, ELEVATIONS, CORES..."
              className="w-full bg-transparent border-none text-[#F1F1F1] placeholder-[#555555] text-xs font-mono-code uppercase focus:outline-none tracking-wider"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#888888] hover:text-white text-xs font-mono-code"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Tab Content Area */}
      <main className="flex-1 max-w-[1720px] mx-auto w-full px-4 sm:px-8 py-8 sm:py-12">
        {/* ========================================================= */}
        {/* TAB 01: EARTH ⇄ MOON ANALOG PAIRS (RESTORED PREVIOUS PAIRS) */}
        {/* ========================================================= */}
        {activeTab === 'earth-moon' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F5D000] font-bold block mb-1">
                  RESTORED ARCHIVAL DATASET
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F1F1F1] font-editorial">
                  Earth &amp; Moon Comparative Pairs
                </h2>
              </div>
              <span className="text-xs font-mono-code text-[#888888]">
                SHOWING {filteredEarthMoon.length} OF {EARTH_MOON_ANALOG_PAIRS.length} PAIRS
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {filteredEarthMoon.map((pair) => (
                <div
                  key={pair.id}
                  className="bg-[#080808] border border-white/10 p-5 sm:p-7 flex flex-col gap-6 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 text-[10px] font-mono-code uppercase tracking-widest text-[#F5D000] bg-[#F5D000]/10 border border-[#F5D000]/30 font-bold">
                        {pair.categoryLabel}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold uppercase text-[#F1F1F1] font-editorial">
                        {pair.title}
                      </h3>
                    </div>
                    <span className="text-xs text-[#888888] font-mono-code italic">
                      "{pair.thematicParallels}"
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Earth Card */}
                    <div className="border border-white/10 bg-[#0A0A0A] p-4 sm:p-5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-[#38bdf8]" />
                          <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#38bdf8]">
                            TERRESTRIAL ANALOG
                          </span>
                        </div>
                        <span className="text-[10px] font-mono-code text-[#888888]">
                          {pair.earth.coordinatesFormatted}
                        </span>
                      </div>

                      <div className="h-48 sm:h-56 w-full overflow-hidden border border-white/10 relative">
                        <img
                          src={pair.earth.imageUrl}
                          alt={pair.earth.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/aistudio/images__4__8a6c99e4.jpeg';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[9px] font-mono-code uppercase text-[#F1F1F1]">
                          {pair.earth.terrainType}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold uppercase text-[#F1F1F1]">
                          {pair.earth.name}
                        </h4>
                        <span className="text-xs text-[#888888] font-mono-code block mt-0.5">
                          {pair.earth.region}
                        </span>
                        <p className="text-xs text-[#AAAAAA] mt-2 leading-relaxed">
                          {pair.earth.summary}
                        </p>
                      </div>

                      {/* Earth Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-[10px] font-mono-code">
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">ELEVATION</span>
                          <span className="text-[#F1F1F1] font-bold">{pair.earth.metrics.elevationMeters} M</span>
                        </div>
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">TEMP RANGE</span>
                          <span className="text-[#F1F1F1] font-bold">{pair.earth.metrics.tempMinCelsius}° to {pair.earth.metrics.tempMaxCelsius}°C</span>
                        </div>
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">GRAVITY</span>
                          <span className="text-[#38bdf8] font-bold">{pair.earth.metrics.gravityMps2} m/s²</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#A0A0A0] border-t border-white/5 pt-2">
                        <strong className="text-[#F1F1F1] uppercase font-mono-code block text-[10px] mb-1">
                          Scientific Significance:
                        </strong>
                        {pair.earth.scientificSignificance}
                      </div>
                    </div>

                    {/* Moon Card */}
                    <div className="border border-white/10 bg-[#0A0A0A] p-4 sm:p-5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon size={14} className="text-[#F5D000]" />
                          <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#F5D000]">
                            LUNAR ANALOG TARGET
                          </span>
                        </div>
                        <span className="text-[10px] font-mono-code text-[#888888]">
                          {pair.moon.coordinatesFormatted}
                        </span>
                      </div>

                      <div className="h-48 sm:h-56 w-full overflow-hidden border border-white/10 relative">
                        <img
                          src={pair.moon.imageUrl}
                          alt={pair.moon.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/aistudio/lunarorb_copernicus_000b6074.jpg';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[9px] font-mono-code uppercase text-[#F5D000]">
                          {pair.moon.terrainType}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold uppercase text-[#F1F1F1]">
                          {pair.moon.name}
                        </h4>
                        <span className="text-xs text-[#888888] font-mono-code block mt-0.5">
                          {pair.moon.region}
                        </span>
                        <p className="text-xs text-[#AAAAAA] mt-2 leading-relaxed">
                          {pair.moon.summary}
                        </p>
                      </div>

                      {/* Moon Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-[10px] font-mono-code">
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">ELEVATION</span>
                          <span className="text-[#F5D000] font-bold">{pair.moon.metrics.elevationMeters} M</span>
                        </div>
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">TEMP SWING</span>
                          <span className="text-[#F1F1F1] font-bold">{pair.moon.metrics.tempMinCelsius}° to {pair.moon.metrics.tempMaxCelsius}°C</span>
                        </div>
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">GRAVITY</span>
                          <span className="text-[#F5D000] font-bold">{pair.moon.metrics.gravityMps2} m/s² (0.165g)</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#A0A0A0] border-t border-white/5 pt-2">
                        <strong className="text-[#F5D000] uppercase font-mono-code block text-[10px] mb-1">
                          Selenographic Significance:
                        </strong>
                        {pair.moon.scientificSignificance}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 02: EARTH ⇄ MARS ANALOG PAIRS */}
        {/* ========================================================= */}
        {activeTab === 'earth-mars' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-orange-400 font-bold block mb-1">
                  MARTIAN GEOLOGICAL ANALOGS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F1F1F1] font-editorial">
                  Earth &amp; Mars Comparative Pairs
                </h2>
              </div>
              <span className="text-xs font-mono-code text-[#888888]">
                SHOWING {filteredEarthMars.length} OF {EARTH_MARS_ANALOG_PAIRS.length} PAIRS
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {filteredEarthMars.map((pair) => (
                <div
                  key={pair.id}
                  className="bg-[#080808] border border-white/10 p-5 sm:p-7 flex flex-col gap-6 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 text-[10px] font-mono-code uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/30 font-bold">
                        {pair.categoryLabel}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold uppercase text-[#F1F1F1] font-editorial">
                        {pair.title}
                      </h3>
                    </div>
                    <span className="text-xs text-[#888888] font-mono-code italic">
                      "{pair.thematicParallels}"
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Earth Card */}
                    <div className="border border-white/10 bg-[#0A0A0A] p-4 sm:p-5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-[#38bdf8]" />
                          <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#38bdf8]">
                            TERRESTRIAL ANALOG
                          </span>
                        </div>
                        <span className="text-[10px] font-mono-code text-[#888888]">
                          {pair.earth.coordinatesFormatted}
                        </span>
                      </div>

                      <div className="h-48 sm:h-56 w-full overflow-hidden border border-white/10 relative">
                        <img
                          src={pair.earth.imageUrl}
                          alt={pair.earth.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/aistudio/fjbNR8Cnn8LXizm4Vj5jSY-1280-80_f26e61a4.jpg';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[9px] font-mono-code uppercase text-[#F1F1F1]">
                          {pair.earth.terrainType}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold uppercase text-[#F1F1F1]">
                          {pair.earth.name}
                        </h4>
                        <span className="text-xs text-[#888888] font-mono-code block mt-0.5">
                          {pair.earth.region}
                        </span>
                        <p className="text-xs text-[#AAAAAA] mt-2 leading-relaxed">
                          {pair.earth.summary}
                        </p>
                      </div>

                      {/* Earth Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-[10px] font-mono-code">
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">ELEVATION</span>
                          <span className="text-[#F1F1F1] font-bold">{pair.earth.metrics.elevationMeters} M</span>
                        </div>
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">TEMP RANGE</span>
                          <span className="text-[#F1F1F1] font-bold">{pair.earth.metrics.tempMinCelsius}° to {pair.earth.metrics.tempMaxCelsius}°C</span>
                        </div>
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">GRAVITY</span>
                          <span className="text-[#38bdf8] font-bold">{pair.earth.metrics.gravityMps2} m/s²</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#A0A0A0] border-t border-white/5 pt-2">
                        <strong className="text-[#F1F1F1] uppercase font-mono-code block text-[10px] mb-1">
                          Astrobiological Significance:
                        </strong>
                        {pair.earth.scientificSignificance}
                      </div>
                    </div>

                    {/* Mars Card */}
                    <div className="border border-white/10 bg-[#0A0A0A] p-4 sm:p-5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Rocket size={14} className="text-orange-400" />
                          <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-orange-400">
                            MARTIAN ANALOG TARGET
                          </span>
                        </div>
                        <span className="text-[10px] font-mono-code text-[#888888]">
                          {pair.mars.coordinatesFormatted}
                        </span>
                      </div>

                      <div className="h-48 sm:h-56 w-full overflow-hidden border border-white/10 relative">
                        <img
                          src={pair.mars.imageUrl}
                          alt={pair.mars.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/aistudio/images__5__d7874cf9.jfif';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[9px] font-mono-code uppercase text-orange-400">
                          {pair.mars.terrainType}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold uppercase text-[#F1F1F1]">
                          {pair.mars.name}
                        </h4>
                        <span className="text-xs text-[#888888] font-mono-code block mt-0.5">
                          {pair.mars.region}
                        </span>
                        <p className="text-xs text-[#AAAAAA] mt-2 leading-relaxed">
                          {pair.mars.summary}
                        </p>
                      </div>

                      {/* Mars Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-[10px] font-mono-code">
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">ELEVATION</span>
                          <span className="text-orange-400 font-bold">{pair.mars.metrics.elevationMeters} M</span>
                        </div>
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">TEMP RANGE</span>
                          <span className="text-[#F1F1F1] font-bold">{pair.mars.metrics.tempMinCelsius}° to {pair.mars.metrics.tempMaxCelsius}°C</span>
                        </div>
                        <div className="p-2 bg-[#050505] border border-white/5">
                          <span className="text-[#888888] block">GRAVITY</span>
                          <span className="text-orange-400 font-bold">{pair.mars.metrics.gravityMps2} m/s² (0.38g)</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#A0A0A0] border-t border-white/5 pt-2">
                        <strong className="text-orange-400 uppercase font-mono-code block text-[10px] mb-1">
                          Martian Planetary Significance:
                        </strong>
                        {pair.mars.scientificSignificance}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 03: MOON MISSIONS ARCHIVE */}
        {/* ========================================================= */}
        {activeTab === 'moon-missions' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F5D000] font-bold block mb-1">
                  APOLLO &amp; ARTEMIS SURFACE LOGS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F1F1F1] font-editorial">
                  Lunar Exploration Missions
                </h2>
              </div>
              <span className="text-xs font-mono-code text-[#888888]">
                SHOWING {filteredMissions.length} EXPEDITIONS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMissions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => openModal(mission, 'mission')}
                  className="bg-[#080808] border border-white/10 p-5 flex flex-col justify-between gap-4 hover:border-[#F5D000]/60 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#F5D000] font-bold">
                        {mission.mission}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#888888]">
                        {mission.date}
                      </span>
                    </div>

                    {mission.youtubeId ? (
                      <div
                        className="h-44 w-full overflow-hidden border border-[#F5D000]/60 relative bg-black"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${mission.youtubeId}?${mission.videoStartTime ? `start=${mission.videoStartTime}&` : ''}rel=0`}
                          title={mission.videoTitle || `${mission.name} Video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/85 border border-[#F5D000]/50 text-[#F5D000] text-[9px] font-mono-code uppercase font-bold flex items-center gap-1.5 pointer-events-none z-10">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span>NASA VIDEO</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-44 w-full overflow-hidden border border-white/10 relative">
                        <img
                          src={mission.referenceImage}
                          alt={mission.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/aistudio/lunarorb_copernicus_000b6074.jpg';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[9px] font-mono-code text-[#F1F1F1]">
                          {mission.coordinatesFormatted}
                        </div>
                      </div>
                    )}

                    <h3 className="text-base font-bold uppercase text-[#F1F1F1] group-hover:text-[#F5D000] transition-colors">
                      {mission.name}
                    </h3>
                    <span className="text-xs font-mono-code text-[#888888]">
                      {mission.region}
                    </span>
                    <p className="text-xs text-[#AAAAAA] line-clamp-3 leading-relaxed">
                      {mission.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code">
                      <div className="p-1.5 bg-[#0A0A0A] border border-white/5">
                        <span className="text-[#888888] block">EVAS</span>
                        <span className="text-[#F1F1F1] font-bold">{mission.evaCount} ({mission.evaDuration})</span>
                      </div>
                      <div className="p-1.5 bg-[#0A0A0A] border border-white/5">
                        <span className="text-[#888888] block">SAMPLES</span>
                        <span className="text-[#F5D000] font-bold">{mission.samplesReturnedKg} KG</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-[#888888] pt-1">
                      <span>LM: {mission.lunarModule}</span>
                      <span className="text-[#F5D000] flex items-center gap-1 group-hover:underline">
                        VIEW DOSSIER <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TABS 04, 05, 06: MARS ARTICLES (ROVERS, MOUNTAINS, CREATORS) */}
        {/* ========================================================= */}
        {(activeTab === 'mars-rovers' ||
          activeTab === 'mars-mountains' ||
          activeTab === 'creators') && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-orange-400 font-bold block mb-1">
                  MARS EXPLORATION DOSSIERS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F1F1F1] font-editorial">
                  {activeTab === 'mars-rovers' && 'Mars Rovers & Robotic Fieldwork'}
                  {activeTab === 'mars-mountains' && 'Martian Mountains, Volcanoes & Craters'}
                  {activeTab === 'creators' && 'Planetary Pioneers & Scientific Creators'}
                </h2>
              </div>
              <span className="text-xs font-mono-code text-[#888888]">
                SHOWING {filteredMarsArticles.length} ARTICLES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarsArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => openModal(art, 'article')}
                  className="bg-[#080808] border border-white/10 p-5 flex flex-col justify-between gap-4 hover:border-orange-500/60 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-code uppercase tracking-widest text-orange-400 font-bold">
                        {art.category}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#888888]">
                        {art.date}
                      </span>
                    </div>

                    <div className="h-48 w-full overflow-hidden border border-white/10 relative">
                      <img
                        src={art.heroImage}
                        alt={art.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/aistudio/images__5__d7874cf9.jfif';
                        }}
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[9px] font-mono-code text-[#888888]">
                        {art.imageCredit}
                      </div>
                    </div>

                    <h3 className="text-base font-bold uppercase text-[#F1F1F1] group-hover:text-orange-400 transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#888888] font-mono-code">
                      {art.subtitle}
                    </p>
                    <p className="text-xs text-[#AAAAAA] line-clamp-3 leading-relaxed mt-1">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1">
                      {art.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono-code uppercase px-2 py-0.5 bg-[#0A0A0A] border border-white/10 text-[#888888]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-[#888888] pt-1">
                      <span>{art.author}</span>
                      <span className="text-orange-400 flex items-center gap-1 group-hover:underline">
                        READ ARTICLE <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 07: CURATED DISPATCHES (4 FULL SCIENTIFIC ARTICLES) */}
        {/* ========================================================= */}
        {activeTab === 'dispatches' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F5D000] font-bold block mb-1">
                  PEER-REVIEWED RESEARCH ARCHIVE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#F1F1F1] font-editorial">
                  Curated Scientific Dispatches
                </h2>
              </div>
              <span className="text-xs font-mono-code text-[#888888]">
                SHOWING {filteredDispatches.length} RESEARCH ESSAYS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredDispatches.map((dispatch) => (
                <div
                  key={dispatch.id}
                  onClick={() => openModal(dispatch, 'dispatch')}
                  className="bg-[#080808] border border-white/10 p-6 flex flex-col justify-between gap-5 hover:border-[#F5D000]/60 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#F5D000] font-bold">
                        {dispatch.category}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#888888]">
                        FULL ESSAY
                      </span>
                    </div>

                    <div className="h-56 w-full overflow-hidden border border-white/10 relative">
                      <img
                        src={dispatch.heroImage}
                        alt={dispatch.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold uppercase text-[#F1F1F1] group-hover:text-[#F5D000] transition-colors leading-snug">
                        {dispatch.title}
                      </h3>
                      <p className="text-xs text-[#F5D000]/90 font-mono-code mt-1 uppercase">
                        {dispatch.author}
                      </p>
                      <p className="text-[11px] text-[#888888] font-mono-code mt-0.5">
                        {dispatch.institution}
                      </p>
                      <p className="text-xs text-[#AAAAAA] mt-3 line-clamp-4 leading-relaxed font-editorial">
                        {dispatch.body}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono-code">
                    <div className="flex items-center gap-1.5 text-[#888888]">
                      <BookOpen size={13} className="text-[#F5D000]" />
                      <span>CLICK TO OPEN COMPLETE DISPATCH</span>
                    </div>
                    <span className="text-[#F5D000] font-bold flex items-center gap-1 group-hover:underline">
                      READ FULL <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* FULL READER MODAL (FOR MISSIONS, ARTICLES, DISPATCHES) */}
      {/* ========================================================= */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-[#080808] border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 text-[#F1F1F1] relative shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F5D000] font-bold">
                  {modalType === 'mission' && 'LUNAR CREWED EXPLORATION DOSSIER'}
                  {modalType === 'article' && activeModalItem.category}
                  {modalType === 'dispatch' && 'PEER-REVIEWED SCIENTIFIC DISPATCH'}
                </span>
                <h2 className="text-xl sm:text-3xl font-black uppercase text-[#F1F1F1] font-editorial">
                  {activeModalItem.name || activeModalItem.title}
                </h2>
                {activeModalItem.subtitle && (
                  <p className="text-xs font-mono-code text-[#AAAAAA] mt-1">
                    {activeModalItem.subtitle}
                  </p>
                )}
              </div>

              <button
                onClick={closeModal}
                className="p-2 border border-white/10 hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] bg-[#0A0A0A] transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Hero Video or Image */}
            {activeModalItem.youtubeId ? (
              <div className="w-full h-64 sm:h-96 overflow-hidden border border-[#F5D000]/40 relative bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeModalItem.youtubeId}?${activeModalItem.videoStartTime ? `start=${activeModalItem.videoStartTime}&` : ''}rel=0`}
                  title={activeModalItem.videoTitle || activeModalItem.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/85 border border-[#F5D000]/50 text-[#F5D000] text-[10px] font-mono-code uppercase font-bold flex items-center gap-2 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>NASA VIDEO</span>
                </div>
              </div>
            ) : (activeModalItem.heroImage || activeModalItem.referenceImage) && (
              <div className="w-full h-64 sm:h-80 overflow-hidden border border-white/10 relative">
                <img
                  src={activeModalItem.heroImage || activeModalItem.referenceImage}
                  alt={activeModalItem.name || activeModalItem.title}
                  className="w-full h-full object-cover"
                />
                {activeModalItem.imageCredit && (
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/80 text-[10px] font-mono-code text-[#888888]">
                    {activeModalItem.imageCredit}
                  </div>
                )}
                {activeModalItem.secondaryImage && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <img
                      src={activeModalItem.secondaryImage}
                      alt="Detail view"
                      className="w-20 h-20 object-cover border border-white/30"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Mission Specific Metrics */}
            {modalType === 'mission' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code border-b border-white/10 pb-4">
                <div className="p-3 bg-[#0A0A0A] border border-white/5">
                  <span className="text-[#888888] block text-[10px]">LANDING DATE</span>
                  <span className="text-[#F1F1F1] font-bold">{activeModalItem.date}</span>
                </div>
                <div className="p-3 bg-[#0A0A0A] border border-white/5">
                  <span className="text-[#888888] block text-[10px]">COORDINATES</span>
                  <span className="text-[#F5D000] font-bold">{activeModalItem.coordinatesFormatted}</span>
                </div>
                <div className="p-3 bg-[#0A0A0A] border border-white/5">
                  <span className="text-[#888888] block text-[10px]">SURFACE STAY</span>
                  <span className="text-[#F1F1F1] font-bold">{activeModalItem.totalSurfaceStay || activeModalItem.evaDuration}</span>
                </div>
                <div className="p-3 bg-[#0A0A0A] border border-white/5">
                  <span className="text-[#888888] block text-[10px]">SAMPLES RETURNED</span>
                  <span className="text-[#F5D000] font-bold">{activeModalItem.samplesReturnedKg} KG</span>
                </div>
              </div>
            )}

            {/* Astronaut Crew Roster (Missions) */}
            {modalType === 'mission' && activeModalItem.astronauts && (
              <div className="p-4 bg-[#0A0A0A] border border-white/10 flex flex-col gap-2">
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#F5D000] font-bold">
                  CREW COMPOSITION &amp; ROVER SYSTEMS
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono-code text-[#F1F1F1]">
                  {activeModalItem.astronauts.map((astro, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10">
                      • {astro}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] font-mono-code text-[#888888] pt-2">
                  <span>LM: <strong className="text-[#F1F1F1]">{activeModalItem.lunarModule}</strong></span>
                  <span className="mx-2">•</span>
                  <span>CSM: <strong className="text-[#F1F1F1]">{activeModalItem.commandModule}</strong></span>
                </div>
              </div>
            )}

            {/* Main Content Body */}
            <div className="flex flex-col gap-4 text-sm text-[#CCCCCC] leading-relaxed font-editorial">
              {modalType === 'mission' && (
                <>
                  <p className="text-base text-[#F1F1F1] font-semibold">
                    {activeModalItem.description}
                  </p>
                  <p className="text-xs text-[#888888] font-mono-code">
                    EQUIPMENT &amp; SCIENCE PAYLOAD: {activeModalItem.featureDescription}
                  </p>
                  {activeModalItem.quote && (
                    <blockquote className="border-l-2 border-[#F5D000] pl-4 italic text-[#F5D000] text-sm font-editorial my-2">
                      {activeModalItem.quote}
                    </blockquote>
                  )}
                </>
              )}

              {modalType === 'article' && (
                <>
                  <p className="text-base text-[#F1F1F1] font-semibold font-editorial">
                    {activeModalItem.summary}
                  </p>
                  {Array.isArray(activeModalItem.body) ? (
                    activeModalItem.body.map((p, idx) => (
                      <p key={idx} className="text-sm text-[#CCCCCC] font-editorial">
                        {p}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-[#CCCCCC] font-editorial">{activeModalItem.body}</p>
                  )}
                </>
              )}

              {modalType === 'dispatch' && (
                <div className="flex flex-col gap-3 font-editorial whitespace-pre-line text-sm text-[#CCCCCC]">
                  {activeModalItem.body}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono-code text-[#888888]">
              <span className="uppercase">
                TEAM SPACE PUNKS // PLANETARY ARCHIVE
              </span>
              <button
                onClick={closeModal}
                className="px-4 py-1.5 border border-white/20 bg-white/5 hover:bg-white/10 text-[#F1F1F1] uppercase tracking-wider"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NatGeo Footer */}
      <NatGeoFooter onLaunchSimulation={() => onLaunchSimulation('overview')} />
    </div>
  );
}
