/*
Description: Unified React Three Fiber space scene wrapper with adaptive DPR and viewport visibility pausing (Plain JavaScript JSX)
*/
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore.js';
import { PerformanceManager } from './PerformanceManager.js';
import { LightingSystem } from './LightingSystem.jsx';
import { StarField } from './StarField.jsx';
import { OrbitalSystem } from './OrbitalSystem.jsx';
import { CameraController } from './CameraController.jsx';
import { SimulationUI } from './SimulationUI.jsx';

function LoadingPlaceholder() {
  const loadingProgress = useSimulationStore((state) => state.loadingProgress);

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]/95 select-none font-mono-code text-xs">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#F5D000] border-t-transparent animate-spin rounded-full" />
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#F5D000]" />
          <span className="tracking-[0.25em] text-[#F1F1F1] uppercase font-bold text-[10px]">
            INITIALIZING CELESTIAL ENGINE
          </span>
          <span className="text-[#F5D000] font-bold text-[10px]">
            {loadingProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function SpaceScene({
  embedded = true,
  className = 'w-full h-full',
  onLaunchFullSimulation,
}) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);
  const quality = useSimulationStore((state) => state.quality);
  const isLoaded = useSimulationStore((state) => state.isLoaded);
  const earthPositionRef = useRef(new THREE.Vector3(5.6, 0, 2.5));
  const moonPositionRef = useRef(new THREE.Vector3(7.0, 0.1, 4.1));
  const marsPositionRef = useRef(new THREE.Vector3(-7.8, 0.2, 6.5));

  const config = PerformanceManager.getConfig(quality);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className} overflow-hidden bg-[#050505]`}
    >
      {!isLoaded && <LoadingPlaceholder />}

      <Canvas
        frameloop={isInView ? 'always' : 'never'}
        camera={{ position: [0, 8.8, 17.5], fov: 45, near: 0.1, far: 600 }}
        dpr={config.dpr}
        gl={{
          antialias: quality !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <LightingSystem />
          <StarField />
          <OrbitalSystem
            onEarthPositionUpdate={(pos) => {
              earthPositionRef.current.copy(pos);
            }}
            onMoonPositionUpdate={(pos) => {
              moonPositionRef.current.copy(pos);
            }}
            onMarsPositionUpdate={(pos) => {
              marsPositionRef.current.copy(pos);
            }}
          />
          <CameraController
            earthPositionRef={earthPositionRef}
            moonPositionRef={moonPositionRef}
            marsPositionRef={marsPositionRef}
          />
        </Suspense>
      </Canvas>

      <SimulationUI embedded={embedded} onLaunchFullSimulation={onLaunchFullSimulation} />
    </div>
  );
}
