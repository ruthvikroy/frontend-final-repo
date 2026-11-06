/*
Description: Zustand state store for the 3D Solar System Simulation (Plain JavaScript)
Beginner Note: Zustand is a tiny state manager. Any component can read or update these values
without passing props down through 10 layers of components.
*/
import { create } from 'zustand';

export const useSimulationStore = create((set) => ({
  isPlaying: true,
  orbitalSpeed: 1.0,
  focusTarget: 'system', // 'system' | 'earth' | 'moon' | 'mars'
  showOrbits: true,
  showAtmosphere: true,
  quality: 'high', // 'high' | 'medium' | 'low'
  simulationEpoch: 0,
  isExpanded: false,
  isLoaded: false,
  loadingProgress: 0,
  activeHoverBody: null,
  isWarping: false,
  flightVelocity: 29.78,

  setIsWarping: (warping) => set({ isWarping: warping }),
  setFlightVelocity: (vel) => set({ flightVelocity: vel }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setOrbitalSpeed: (speed) => set({ orbitalSpeed: Math.max(0.1, Math.min(10.0, speed)) }),
  setFocusTarget: (target) => set({ focusTarget: target }),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleAtmosphere: () => set((state) => ({ showAtmosphere: !state.showAtmosphere })),
  setQuality: (quality) => set({ quality }),
  resetSimulation: () =>
    set({
      simulationEpoch: 0,
      focusTarget: 'system',
      isPlaying: true,
      orbitalSpeed: 1.0,
    }),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  setLoadingProgress: (progress) => set({ loadingProgress: Math.min(100, progress) }),
  setActiveHoverBody: (body) => set({ activeHoverBody: body }),
  incrementEpoch: (deltaSeconds) =>
    set((state) => ({
      simulationEpoch: state.simulationEpoch + deltaSeconds,
    })),
}));
