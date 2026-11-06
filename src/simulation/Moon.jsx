/*
Description: Realistic 3D Moon mesh with crater terminator shading and tidal locking (Plain JavaScript JSX)
*/
import React, { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore.js';
import { PerformanceManager } from './PerformanceManager.js';
import { AssetLoader } from './AssetLoader.js';
import { MoonShaderMaterial } from './shaders/moonShader.js';
import { SUN_DIRECTION } from './LightingSystem.jsx';

export const Moon = forwardRef((_, ref) => {
  const moonMeshRef = useRef(null);
  const positionVec = useRef(new THREE.Vector3(7.5, 0, 0));

  const quality = useSimulationStore((state) => state.quality);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const setActiveHoverBody = useSimulationStore((state) => state.setActiveHoverBody);

  const config = PerformanceManager.getConfig(quality);
  const textures = AssetLoader.getInstance().getTextures();

  const sunDirVec = useRef(new THREE.Vector3(-1, 0, 0));

  const moonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSurfaceTexture: { value: textures.moonSurface },
        uSunDirection: { value: SUN_DIRECTION.clone() },
      },
      vertexShader: MoonShaderMaterial.vertexShader,
      fragmentShader: MoonShaderMaterial.fragmentShader,
    });
  }, [textures]);

  useImperativeHandle(ref, () => ({
    setPosition: (x, y, z, earthPos = null) => {
      positionVec.current.set(x, y, z);
      if (moonMeshRef.current) {
        moonMeshRef.current.position.set(x, y, z);
        if (earthPos) {
          moonMeshRef.current.lookAt(earthPos.x, earthPos.y, earthPos.z);
        } else {
          moonMeshRef.current.lookAt(0, 0, 0);
        }
      }
      sunDirVec.current.set(-x, -y, -z);
      if (sunDirVec.current.lengthSq() > 0.0001) {
        sunDirVec.current.normalize();
        moonMaterial.uniforms.uSunDirection.value.copy(sunDirVec.current);
      }
    },
    getPosition: () => positionVec.current,
  }));

  return (
    <mesh
      ref={moonMeshRef}
      position={[7.5, 0, 0]}
      material={moonMaterial}
      onClick={(e) => {
        e.stopPropagation();
        setFocusTarget('moon');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setActiveHoverBody('Moon');
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setActiveHoverBody(null);
      }}
    >
      <sphereGeometry args={[0.2727, config.moonSegments, config.moonSegments]} />
    </mesh>
  );
});

Moon.displayName = 'Moon';
