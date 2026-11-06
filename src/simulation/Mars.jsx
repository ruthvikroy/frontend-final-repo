/*
Description: High-relief 3D Mars planet for the Main Homepage Simulation (Plain JavaScript JSX)
Features:
- 25.19° axial obliquity and true 0.532x Earth radius scale
- Synthesized NASA Global Mosaic + Perseverance Mastcam-Z 3D diffuse & bump textures
- Lightweight CO2 butterscotch/blue Fresnel atmosphere rim
- Independent outer heliocentric orbit around the Sun
*/
import React, { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore.js';
import { PerformanceManager } from './PerformanceManager.js';
import { AssetLoader } from './AssetLoader.js';
import { SUN_DIRECTION } from './LightingSystem.jsx';
import { HOMEPAGE_ORBIT_CONFIG } from '../utils/orbitalMath.js';

export const MARS_MAIN_POSITION = [
  HOMEPAGE_ORBIT_CONFIG.marsOrbitRadius * Math.cos(HOMEPAGE_ORBIT_CONFIG.marsInitialAngle),
  HOMEPAGE_ORBIT_CONFIG.marsOrbitRadius *
    Math.sin(HOMEPAGE_ORBIT_CONFIG.marsInitialAngle) *
    Math.sin(HOMEPAGE_ORBIT_CONFIG.marsInclinationRad),
  HOMEPAGE_ORBIT_CONFIG.marsOrbitRadius *
    Math.sin(HOMEPAGE_ORBIT_CONFIG.marsInitialAngle) *
    Math.cos(HOMEPAGE_ORBIT_CONFIG.marsInclinationRad),
];
export const MARS_AXIAL_TILT_RAD = (25.19 * Math.PI) / 180;
export const MARS_SCALE_RADIUS = 0.532;

export const Mars = forwardRef((_, ref) => {
  const marsGroupRef = useRef(null);
  const spinRef = useRef(null);
  const positionVec = useRef(
    new THREE.Vector3(
      MARS_MAIN_POSITION[0],
      MARS_MAIN_POSITION[1],
      MARS_MAIN_POSITION[2]
    )
  );
  const sunDirVec = useRef(new THREE.Vector3(-1, 0, 0));

  const isPlaying = useSimulationStore((state) => state.isPlaying);
  const orbitalSpeed = useSimulationStore((state) => state.orbitalSpeed);
  const showAtmosphere = useSimulationStore((state) => state.showAtmosphere);
  const quality = useSimulationStore((state) => state.quality);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const setActiveHoverBody = useSimulationStore((state) => state.setActiveHoverBody);

  const config = PerformanceManager.getConfig(quality);
  const textures = AssetLoader.getInstance().getTextures();

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSunDirection: { value: SUN_DIRECTION.clone() },
        uDustColor: { value: new THREE.Color('#e06d44') },
        uTwilightColor: { value: new THREE.Color('#60a5fa') },
      },
      vertexShader: `
        varying vec3 vNormalWorld;
        varying vec3 vViewDir;
        void main() {
          vNormalWorld = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uSunDirection;
        uniform vec3 uDustColor;
        uniform vec3 uTwilightColor;
        varying vec3 vNormalWorld;
        varying vec3 vViewDir;
        void main() {
          vec3 n = normalize(vNormalWorld);
          vec3 v = normalize(vViewDir);
          float sunDot = dot(n, normalize(uSunDirection));
          float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.5);
          float terminator = exp(-pow((sunDot - 0.02) / 0.25, 2.0));
          vec3 col = mix(uDustColor, uTwilightColor, terminator * 0.55 + fresnel * 0.25);
          float alpha = fresnel * 0.48 * smoothstep(-0.35, 0.28, sunDot);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, []);

  useImperativeHandle(ref, () => ({
    setOrbitalState: (x, y, z) => {
      positionVec.current.set(x, y, z);
      if (marsGroupRef.current) {
        marsGroupRef.current.position.set(x, y, z);
      }
      sunDirVec.current.set(-x, -y, -z);
      if (sunDirVec.current.lengthSq() > 0.0001) {
        sunDirVec.current.normalize();
        atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirVec.current);
      }
    },
    getPosition: () => positionVec.current,
  }));

  useFrame((_, delta) => {
    if (!isPlaying || !spinRef.current) return;
    const dt = Math.min(delta, 0.1) * orbitalSpeed;
    spinRef.current.rotation.y += dt * 0.22;
  });

  return (
    <group
      ref={marsGroupRef}
      position={MARS_MAIN_POSITION}
      rotation={[0, 0, MARS_AXIAL_TILT_RAD]}
    >
      <pointLight position={[2.2, 1.2, 2.4]} intensity={2.2} distance={8} color="#fff3e6" />
      <group ref={spinRef}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            setFocusTarget('mars');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
            setActiveHoverBody('Mars');
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
            setActiveHoverBody(null);
          }}
        >
          <sphereGeometry
            args={[MARS_SCALE_RADIUS, config.moonSegments, config.moonSegments]}
          />
          <meshStandardMaterial
            map={textures.marsSurface}
            bumpMap={textures.marsBump || textures.marsSurface}
            bumpScale={0.042}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
      </group>

      {showAtmosphere && (
        <mesh material={atmosphereMaterial}>
          <sphereGeometry args={[MARS_SCALE_RADIUS * 1.028, 32, 32]} />
        </mesh>
      )}
    </group>
  );
});

Mars.displayName = 'Mars';
