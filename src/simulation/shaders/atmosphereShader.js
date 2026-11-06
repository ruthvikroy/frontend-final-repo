/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: GLSL shader material for Earth atmospheric limb scattering and Fresnel rim glow
*/
import * as THREE from 'three';

export const AtmosphereShaderMaterial = {
  uniforms: {
    uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
    uAtmosphereColor: { value: new THREE.Color(0x4da6ff) },
    uGlowIntensity: { value: 1.05 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform vec3 uSunDirection;
    uniform vec3 uAtmosphereColor;
    uniform float uGlowIntensity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 norm = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 sunDir = normalize(uSunDirection);

      float vDot = max(dot(norm, viewDir), 0.0);
      float rim = pow(1.0 - vDot, 3.8);

      float sunFacing = max(dot(norm, sunDir) * 0.65 + 0.35, 0.0);
      float intensity = rim * sunFacing * uGlowIntensity;

      if (intensity < 0.005) discard;

      gl_FragColor = vec4(uAtmosphereColor, clamp(intensity * 0.82, 0.0, 0.85));
    }
  `,
};
/* --- End of atmosphereShader.js --- */
