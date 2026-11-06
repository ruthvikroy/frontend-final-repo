/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Pure white directional solar lighting and deep-space ambient light for mini simulation
*/
import React, { useRef } from 'react';
import * as THREE from 'three';

export const SUN_DIRECTION = new THREE.Vector3(1, 0, 0).normalize();

export function LightingSystem() {
  const dirLightRef = useRef(null);

  return (
    <>
      <directionalLight
        ref={dirLightRef}
        position={[30, 2, 5]}
        intensity={2.4}
        color={0xffffff}
        castShadow={false}
      />
      <ambientLight intensity={0.18} color={0x1e293b} />
      <directionalLight
        position={[-30, -5, -10]}
        intensity={0.12}
        color={0x38bdf8}
      />
    </>
  );
}
/* --- End of LightingSystem.jsx --- */
