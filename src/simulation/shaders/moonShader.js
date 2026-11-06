/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: GLSL shader material for bright Moon crater detail and lunar terminator shading
*/
import * as THREE from 'three';

export const MoonShaderMaterial = {
  uniforms: {
    uSurfaceTexture: { value: null },
    uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform sampler2D uSurfaceTexture;
    uniform vec3 uSunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 norm = normalize(vNormal);
      vec3 sunDir = normalize(uSunDirection);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);

      float sunDot = dot(norm, sunDir);
      float directLight = smoothstep(-0.12, 0.85, sunDot);
      directLight = pow(directLight, 0.92);

      vec4 texColor = texture2D(uSurfaceTexture, vUv);
      vec3 lunarAlbedo = texColor.rgb * 1.04;

      float rim = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.5);
      float ambient = 0.20;
      vec3 finalColor = lunarAlbedo * (directLight * 0.92 + ambient) + vec3(0.76, 0.82, 0.90) * rim * directLight * 0.14;

      gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
    }
  `,
};
/* --- End of moonShader.js --- */
