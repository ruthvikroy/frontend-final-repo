/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Multi-layer 3D Earth mesh with day/night shader, cloud layer, atmosphere halo, and heliocentric orbit state
*/
import React, { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore.js';
import { PerformanceManager } from './PerformanceManager.js';
import { AssetLoader } from './AssetLoader.js';
import { EarthShaderMaterial } from './shaders/earthShader.js';
import { AtmosphereShaderMaterial } from './shaders/atmosphereShader.js';
import { SUN_DIRECTION } from './LightingSystem.jsx';
import { HOMEPAGE_ORBIT_CONFIG } from '../utils/orbitalMath.js';

const initX =
  HOMEPAGE_ORBIT_CONFIG.earthOrbitRadius *
  Math.cos(HOMEPAGE_ORBIT_CONFIG.earthInitialAngle);
const initZ =
  HOMEPAGE_ORBIT_CONFIG.earthOrbitRadius *
  Math.sin(HOMEPAGE_ORBIT_CONFIG.earthInitialAngle);

export const Earth = forwardRef((_, ref) => {
  const earthRootRef = useRef(null);
  const earthMeshRef = useRef(null);
  const positionVec = useRef(new THREE.Vector3(initX, 0, initZ));
  const sunDirVec = useRef(new THREE.Vector3(-initX, 2.8, -initZ + 3.5).normalize());

  const isPlaying = useSimulationStore((state) => state.isPlaying);
  const orbitalSpeed = useSimulationStore((state) => state.orbitalSpeed);
  const showAtmosphere = useSimulationStore((state) => state.showAtmosphere);
  const quality = useSimulationStore((state) => state.quality);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const setActiveHoverBody = useSimulationStore((state) => state.setActiveHoverBody);

  const config = PerformanceManager.getConfig(quality);
  const textures = AssetLoader.getInstance().getTextures();

  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uDayTexture: { value: textures.earthDay },
        uNightTexture: { value: textures.earthNight },
        uSpecularTexture: { value: textures.earthSpecular },
        uSunDirection: { value: SUN_DIRECTION.clone() },
        uAtmosphereColor: { value: new THREE.Color(0x4da6ff) },
      },
      vertexShader: EarthShaderMaterial.vertexShader,
      fragmentShader: EarthShaderMaterial.fragmentShader,
    });
  }, [textures]);

  const atmoMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSunDirection: { value: SUN_DIRECTION.clone() },
        uAtmosphereColor: { value: new THREE.Color(0x4da6ff) },
        uGlowIntensity: { value: 0.85 },
      },
      vertexShader: AtmosphereShaderMaterial.vertexShader,
      fragmentShader: AtmosphereShaderMaterial.fragmentShader,
      transparent: true,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useImperativeHandle(ref, () => ({
    setOrbitalState: (x, y, z) => {
      positionVec.current.set(x, y, z);
      if (earthRootRef.current) {
        earthRootRef.current.position.set(x, y, z);
      }
      sunDirVec.current.set(-x, -y + 2.8, -z + 3.5);
      if (sunDirVec.current.lengthSq() > 0.0001) {
        sunDirVec.current.normalize();
        earthMaterial.uniforms.uSunDirection.value.copy(sunDirVec.current);
        atmoMaterial.uniforms.uSunDirection.value.copy(sunDirVec.current);
      }
    },
    getPosition: () => positionVec.current,
  }));

  useFrame((_, delta) => {
    if (!isPlaying) return;
    const rotDelta = delta * 0.16 * orbitalSpeed;

    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y += rotDelta;
    }
  });

  const axialTiltRad = (23.44 * Math.PI) / 180;

  return (
    <group
      ref={earthRootRef}
      position={[initX, 0, initZ]}
      rotation={[0, 0, axialTiltRad]}
      onClick={(e) => {
        e.stopPropagation();
        setFocusTarget('earth');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setActiveHoverBody('Earth');
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setActiveHoverBody(null);
      }}
    >
      <mesh ref={earthMeshRef} rotation={[0, -1.65, 0]} material={earthMaterial}>
        <sphereGeometry args={[1.0, config.earthSegments, config.earthSegments]} />
      </mesh>

      {showAtmosphere && config.enableAtmosphereGlow && (
        <mesh material={atmoMaterial}>
          <sphereGeometry args={[1.014, config.earthSegments, config.earthSegments]} />
        </mesh>
      )}
    </group>
  );
});

Earth.displayName = 'Earth';
/* --- End of Earth.jsx --- */
