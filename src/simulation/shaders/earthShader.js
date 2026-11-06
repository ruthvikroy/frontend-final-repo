/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: GLSL shader material for Earth day/night blending and ocean specular highlights without yellow tint
*/
import * as THREE from 'three';

export const EarthShaderMaterial = {
  uniforms: {
    uDayTexture: { value: null },
    uNightTexture: { value: null },
    uSpecularTexture: { value: null },
    uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
    uAtmosphereColor: { value: new THREE.Color(0x5ca0ff) },
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
    uniform sampler2D uDayTexture;
    uniform sampler2D uNightTexture;
    uniform sampler2D uSpecularTexture;
    uniform vec3 uSunDirection;
    uniform vec3 uAtmosphereColor;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 norm = normalize(vNormal);
      vec3 sunDir = normalize(uSunDirection);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);

      float sunDot = dot(norm, sunDir);
      float viewDot = max(dot(norm, viewDir), 0.0);

      vec4 dayColor = texture2D(uDayTexture, vUv);
      vec4 nightColor = texture2D(uNightTexture, vUv);
      vec4 specColor = texture2D(uSpecularTexture, vUv);

      float effectiveLight = clamp(max(sunDot, 0.0) * 0.85 + viewDot * 0.58 + 0.22, 0.28, 1.32);
      float dayFactor = smoothstep(-0.35, 0.15, max(sunDot, viewDot * 0.65 - 0.1));

      vec3 halfDir = normalize(normalize(sunDir + viewDir * 0.5) + viewDir);
      float spec = pow(max(dot(norm, halfDir), 0.0), 36.0);
      vec3 specularHighlight = vec3(0.85, 0.94, 1.0) * spec * specColor.r * 0.55 * max(effectiveLight - 0.3, 0.0);

      float rim = 1.0 - viewDot;
      vec3 atmoGlow = vec3(0.32, 0.65, 1.0) * pow(rim, 3.8) * 0.55;

      vec3 dayLit = dayColor.rgb * effectiveLight + specularHighlight;
      vec3 nightLit = dayColor.rgb * 0.38 + nightColor.rgb * vec3(0.65, 0.82, 1.0) * 0.45;

      vec3 finalColor = mix(nightLit, dayLit, dayFactor) + atmoGlow;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
/* --- End of earthShader.js --- */
