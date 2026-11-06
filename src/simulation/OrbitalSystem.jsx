/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Unified nested Sun-Earth-Moon-Mars orbital mechanics coordinator
*/
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore.js';
import { Earth } from './Earth.jsx';
import { Moon } from './Moon.jsx';
import { Mars } from './Mars.jsx';
import {
  HOMEPAGE_ORBIT_CONFIG,
  computeNestedOrbitalState,
  generateNestedOrbitLoopPoints,
} from '../utils/orbitalMath.js';

export const ORBIT_RADIUS = HOMEPAGE_ORBIT_CONFIG.earthOrbitRadius;
export const ORBIT_INCLINATION_RAD = HOMEPAGE_ORBIT_CONFIG.moonInclinationRad;

function createLoopLine(radius, inclinationRad, hexColor, opacity = 0.45) {
  const pts = generateNestedOrbitLoopPoints(radius, inclinationRad, 128).map(
    (p) => new THREE.Vector3(p.x, p.y, p.z)
  );
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color: hexColor,
    transparent: true,
    opacity,
  });
  return new THREE.Line(geo, mat);
}

export function OrbitalSystem({
  onEarthPositionUpdate,
  onMoonPositionUpdate,
  onMarsPositionUpdate,
}) {
  const sunCoreRef = useRef(null);
  const earthRef = useRef(null);
  const moonRef = useRef(null);
  const marsRef = useRef(null);
  const simTimeRef = useRef(0);
  const epochAccumRef = useRef(0);

  const isPlaying = useSimulationStore((state) => state.isPlaying);
  const orbitalSpeed = useSimulationStore((state) => state.orbitalSpeed);
  const showOrbits = useSimulationStore((state) => state.showOrbits);
  const incrementEpoch = useSimulationStore((state) => state.incrementEpoch);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const setActiveHoverBody = useSimulationStore((state) => state.setActiveHoverBody);

  const sunCoreMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCoreColor: { value: new THREE.Color('#fff7d6') },
        uMidColor: { value: new THREE.Color('#f59e0b') },
        uLimbColor: { value: new THREE.Color('#ea580c') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPos;
        void main() {
          vPos = position;
          vNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uCoreColor;
        uniform vec3 uMidColor;
        uniform vec3 uLimbColor;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPos;
        void main() {
          float viewDot = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
          float gran = 0.5 + 0.5 * sin(vPos.x * 8.0 + uTime * 1.4) * cos(vPos.y * 8.0 - uTime * 1.1);
          vec3 base = mix(uLimbColor, uMidColor, pow(viewDot, 0.45));
          vec3 col = mix(base, uCoreColor, pow(viewDot, 1.35) * (0.75 + 0.25 * gran));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  const sunCoronaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uGlowColor: { value: new THREE.Color('#fbbf24') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uGlowColor;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float viewDot = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
          float glow = pow(viewDot, 2.6);
          gl_FragColor = vec4(uGlowColor, glow * 0.52);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
  }, []);

  const orbitalObjects = useMemo(() => {
    const earthOrbitLine = createLoopLine(
      HOMEPAGE_ORBIT_CONFIG.earthOrbitRadius,
      0,
      0x38bdf8,
      0.42
    );
    const moonOrbitLine = createLoopLine(
      HOMEPAGE_ORBIT_CONFIG.moonOrbitRadius,
      HOMEPAGE_ORBIT_CONFIG.moonInclinationRad,
      0xcbd5e1,
      0.46
    );
    const marsOrbitLine = createLoopLine(
      HOMEPAGE_ORBIT_CONFIG.marsOrbitRadius,
      HOMEPAGE_ORBIT_CONFIG.marsInclinationRad,
      0xf97316,
      0.42
    );

    return {
      earthOrbitLine,
      moonOrbitLine,
      marsOrbitLine,
    };
  }, []);

  useEffect(() => {
    const state = computeNestedOrbitalState(0, HOMEPAGE_ORBIT_CONFIG);
    orbitalObjects.moonOrbitLine.position.set(
      state.earth.position.x,
      state.earth.position.y,
      state.earth.position.z
    );
    return () => {
      orbitalObjects.earthOrbitLine.geometry.dispose();
      orbitalObjects.earthOrbitLine.material.dispose();
      orbitalObjects.moonOrbitLine.geometry.dispose();
      orbitalObjects.moonOrbitLine.material.dispose();
      orbitalObjects.marsOrbitLine.geometry.dispose();
      orbitalObjects.marsOrbitLine.material.dispose();
      sunCoreMaterial.dispose();
      sunCoronaMaterial.dispose();
    };
  }, [orbitalObjects, sunCoreMaterial, sunCoronaMaterial]);

  useFrame((_, delta) => {
    if (isPlaying) {
      const dt = Math.min(delta, 0.1) * orbitalSpeed;
      simTimeRef.current += dt;

      epochAccumRef.current += dt;
      if (epochAccumRef.current >= 0.25) {
        incrementEpoch(epochAccumRef.current);
        epochAccumRef.current = 0;
      }
    }

    const t = simTimeRef.current;
    sunCoreMaterial.uniforms.uTime.value = t;
    if (sunCoreRef.current && isPlaying) {
      sunCoreRef.current.rotation.y = t * 0.06;
    }

    const state = computeNestedOrbitalState(t, HOMEPAGE_ORBIT_CONFIG);

    if (earthRef.current) {
      earthRef.current.setOrbitalState(
        state.earth.position.x,
        state.earth.position.y,
        state.earth.position.z
      );
      if (onEarthPositionUpdate) {
        onEarthPositionUpdate(earthRef.current.getPosition());
      }
    }

    orbitalObjects.moonOrbitLine.position.set(
      state.earth.position.x,
      state.earth.position.y,
      state.earth.position.z
    );
    if (moonRef.current) {
      moonRef.current.setPosition(
        state.moon.position.x,
        state.moon.position.y,
        state.moon.position.z,
        state.earth.position
      );
      if (onMoonPositionUpdate) {
        onMoonPositionUpdate(moonRef.current.getPosition());
      }
    }

    if (marsRef.current) {
      marsRef.current.setOrbitalState(
        state.mars.position.x,
        state.mars.position.y,
        state.mars.position.z
      );
      if (onMarsPositionUpdate) {
        onMarsPositionUpdate(marsRef.current.getPosition());
      }
    }
  });

  return (
    <group>
      <group
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setFocusTarget('system');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setActiveHoverBody('Sun (Heliocentric Center)');
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          setActiveHoverBody(null);
        }}
      >
        <pointLight intensity={3.2} distance={120} decay={0.25} color="#ffffff" />
        <mesh ref={sunCoreRef} material={sunCoreMaterial}>
          <sphereGeometry args={[HOMEPAGE_ORBIT_CONFIG.sunRadius, 48, 48]} />
        </mesh>
        <mesh material={sunCoronaMaterial}>
          <sphereGeometry args={[HOMEPAGE_ORBIT_CONFIG.sunRadius * 1.32, 32, 32]} />
        </mesh>
      </group>

      <Earth ref={earthRef} />
      <Moon ref={moonRef} />
      <Mars ref={marsRef} />

      {showOrbits && (
        <>
          <primitive object={orbitalObjects.earthOrbitLine} />
          <primitive object={orbitalObjects.moonOrbitLine} />
          <primitive object={orbitalObjects.marsOrbitLine} />
        </>
      )}
    </group>
  );
}
/* --- End of OrbitalSystem.jsx --- */
