/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: 3D Mars planetary system with single unified MOLA surface texture and landmarks
*/
import * as THREE from 'three';
import {
  MARS_LANDMARKS,
  MARS_AXIAL_TILT_RAD,
  areographicToCartesian,
} from '../data/marsLandmarks.js';

export const MARS_RADIUS = 0.532;
export const MARS_ORBIT_RADIUS = 9.4;
export const MARS_ORBIT_INCLINATION_RAD = (1.85 * Math.PI) / 180;
export const MARS_CENTER = new THREE.Vector3(
  MARS_ORBIT_RADIUS * Math.cos(3.72),
  MARS_ORBIT_RADIUS * Math.sin(3.72) * Math.sin(MARS_ORBIT_INCLINATION_RAD),
  MARS_ORBIT_RADIUS * Math.sin(3.72) * Math.cos(MARS_ORBIT_INCLINATION_RAD)
);

function createMarsCloudCanvasTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 128);
    for (let i = 0; i < 36; i++) {
      const cx = (i * 47) % 256;
      const cy = 28 + ((i * 29) % 72);
      const rx = 18 + (i % 5) * 9;
      const ry = 2.5 + (i % 3) * 2.0;
      const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, rx);
      grad.addColorStop(0, 'rgba(235, 245, 255, 0.52)');
      grad.addColorStop(0.5, 'rgba(219, 234, 254, 0.22)');
      grad.addColorStop(1, 'rgba(219, 234, 254, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
    const northGrad = ctx.createLinearGradient(0, 0, 0, 16);
    northGrad.addColorStop(0, 'rgba(225, 240, 255, 0.65)');
    northGrad.addColorStop(1, 'rgba(225, 240, 255, 0)');
    ctx.fillStyle = northGrad;
    ctx.fillRect(0, 0, 256, 16);

    const southGrad = ctx.createLinearGradient(0, 112, 0, 128);
    southGrad.addColorStop(0, 'rgba(225, 240, 255, 0)');
    southGrad.addColorStop(1, 'rgba(225, 240, 255, 0.65)');
    ctx.fillStyle = southGrad;
    ctx.fillRect(0, 112, 256, 16);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function createMarsPinLabelTexture(text, subtext, hexColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 256, 64);

  ctx.fillStyle = 'rgba(10, 6, 6, 0.88)';
  ctx.strokeStyle = hexColor;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(6, 6, 244, 52, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = hexColor;
  ctx.beginPath();
  ctx.arc(22, 24, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(text).slice(0, 19), 34, 23);

  ctx.fillStyle = '#fca5a5';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillText(String(subtext).slice(0, 26), 34, 43);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createMarsSystem(textures, sunDirection) {
  const group = new THREE.Group();
  group.position.copy(MARS_CENTER);

  const tiltGroup = new THREE.Group();
  tiltGroup.rotation.z = MARS_AXIAL_TILT_RAD;
  group.add(tiltGroup);

  const spinGroup = new THREE.Group();
  tiltGroup.add(spinGroup);

  const geometry = new THREE.SphereGeometry(MARS_RADIUS, 48, 48);
  const material = new THREE.MeshStandardMaterial({
    map: textures.marsAlbedo,
    bumpMap: textures.marsBump || textures.marsAlbedo,
    bumpScale: 0.036,
    roughness: 0.82,
    metalness: 0.06,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { bodyId: 'mars' };
  spinGroup.add(mesh);

  const cloudTex = createMarsCloudCanvasTexture();
  const atmoGeo = new THREE.SphereGeometry(MARS_RADIUS * 1.022, 32, 32);
  const atmoMat = new THREE.ShaderMaterial({
    uniforms: {
      uSunDirection: { value: sunDirection.clone().normalize() },
      uCloudTex: { value: cloudTex },
      uTime: { value: 0 },
      uCloudOpacity: { value: 0.65 },
      uCloudDriftSpeed: { value: 1.0 },
      uDustIntensity: { value: 0.42 },
      uDustColor: { value: new THREE.Color('#e06d44') },
      uTwilightColor: { value: new THREE.Color('#60a5fa') },
      uIceCloudColor: { value: new THREE.Color('#dbeafe') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormalWorld;
      varying vec3 vViewDir;

      void main() {
        vUv = uv;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uSunDirection;
      uniform sampler2D uCloudTex;
      uniform float uTime;
      uniform float uCloudOpacity;
      uniform float uCloudDriftSpeed;
      uniform float uDustIntensity;
      uniform vec3 uDustColor;
      uniform vec3 uTwilightColor;
      uniform vec3 uIceCloudColor;

      varying vec2 vUv;
      varying vec3 vNormalWorld;
      varying vec3 vViewDir;

      void main() {
        vec3 normal = normalize(vNormalWorld);
        vec3 viewDir = normalize(vViewDir);
        vec3 sunDir = normalize(uSunDirection);

        float sunDot = dot(normal, sunDir);
        float dayFactor = smoothstep(-0.22, 0.38, sunDot);
        float terminatorBand = exp(-pow((sunDot - 0.02) / 0.24, 2.0));

        float viewDot = clamp(dot(normal, viewDir), 0.0, 1.0);
        float fresnel = pow(1.0 - viewDot, 2.6);
        float shellAlpha = (0.02 + fresnel * 0.44) * clamp(uDustIntensity * 1.25, 0.12, 0.92) * smoothstep(-0.35, 0.25, sunDot);

        vec2 uv1 = vec2(vUv.x + uTime * 0.012 * uCloudDriftSpeed, vUv.y);
        vec2 uv2 = vec2(vUv.x * 2.0 - uTime * 0.007 * uCloudDriftSpeed, vUv.y);
        float c1 = texture2D(uCloudTex, uv1).a;
        float c2 = texture2D(uCloudTex, uv2).a;
        float cloudSample = mix(c1, c2, 0.35);

        float cloudAlpha = cloudSample * uCloudOpacity * (0.18 + 0.82 * dayFactor) * 0.55;
        float totalAlpha = clamp(shellAlpha + cloudAlpha, 0.0, 0.72);

        vec3 limbRGB = mix(uDustColor, uTwilightColor, terminatorBand * 0.5 + fresnel * 0.28);
        vec3 cloudRGB = mix(uIceCloudColor, uTwilightColor, terminatorBand * 0.45);
        vec3 finalRGB = mix(limbRGB, cloudRGB, clamp(cloudAlpha / max(totalAlpha, 0.001), 0.0, 1.0));

        gl_FragColor = vec4(finalRGB, totalAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
  tiltGroup.add(atmosphereMesh);

  const orbitPoints = [];
  const orbitSegments = 160;
  for (let i = 0; i <= orbitSegments; i++) {
    const theta = (i / orbitSegments) * Math.PI * 2;
    const x = Math.cos(theta) * MARS_ORBIT_RADIUS;
    const y = Math.sin(theta) * Math.sin(MARS_ORBIT_INCLINATION_RAD) * MARS_ORBIT_RADIUS;
    const z = Math.sin(theta) * Math.cos(MARS_ORBIT_INCLINATION_RAD) * MARS_ORBIT_RADIUS;
    orbitPoints.push(new THREE.Vector3(x, y, z));
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.44,
  });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

  const landmarkGroup = new THREE.Group();
  spinGroup.add(landmarkGroup);

  const markerObjects = new Map();
  const disposables = [
    geometry,
    material,
    cloudTex,
    atmoGeo,
    atmoMat,
    orbitGeometry,
    orbitMaterial,
  ];

  const beamHeight = 0.068;
  const beamGeo = new THREE.CylinderGeometry(0.0022, 0.0007, beamHeight, 6);
  const ringGeo = new THREE.RingGeometry(0.012, 0.019, 16);
  const coreGeo = new THREE.SphereGeometry(0.0085, 8, 8);
  const hitGeo = new THREE.SphereGeometry(0.045, 6, 6);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const upVec = new THREE.Vector3(0, 1, 0);

  disposables.push(beamGeo, ringGeo, coreGeo, hitGeo, hitMat);

  MARS_LANDMARKS.forEach((site) => {
    const pos = areographicToCartesian(site.lat, site.lon, MARS_RADIUS);
    const surfaceVec = new THREE.Vector3(pos.x, pos.y, pos.z);
    const normal = surfaceVec.clone().normalize();

    const colorHex =
      site.id.includes('perseverance') || site.id.includes('curiosity')
        ? '#f59e0b'
        : site.id.includes('odyssey')
        ? '#38bdf8'
        : '#fb7185';
    const threeColor = new THREE.Color(colorHex);

    const pinContainer = new THREE.Group();
    pinContainer.position.copy(surfaceVec);
    pinContainer.userData = { landmarkId: site.id, bodyId: 'mars', site };

    const beamMat = new THREE.MeshBasicMaterial({
      color: threeColor,
      transparent: true,
      opacity: 0.85,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    const quat = new THREE.Quaternion().setFromUnitVectors(upVec, normal);
    beam.quaternion.copy(quat);
    beam.position.copy(normal).multiplyScalar(beamHeight * 0.5);
    beam.userData = { landmarkId: site.id, bodyId: 'mars' };
    pinContainer.add(beam);

    const ringMat = new THREE.MeshBasicMaterial({
      color: threeColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    const ringQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal
    );
    ring.quaternion.copy(ringQuat);
    ring.position.copy(normal).multiplyScalar(0.002);
    ring.userData = { landmarkId: site.id, bodyId: 'mars' };
    pinContainer.add(ring);

    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.copy(normal).multiplyScalar(beamHeight);
    core.userData = { landmarkId: site.id, bodyId: 'mars' };
    pinContainer.add(core);

    const labelTex = createMarsPinLabelTexture(
      site.shortLabel || site.name,
      site.mission || site.category,
      colorHex
    );
    const spriteMat = new THREE.SpriteMaterial({
      map: labelTex,
      transparent: true,
      depthTest: false,
    });
    const labelSprite = new THREE.Sprite(spriteMat);
    labelSprite.position.copy(normal).multiplyScalar(beamHeight + 0.036);
    labelSprite.scale.set(0.18, 0.045, 1);
    labelSprite.userData = { landmarkId: site.id, bodyId: 'mars' };
    pinContainer.add(labelSprite);

    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.position.copy(normal).multiplyScalar(beamHeight * 0.5);
    hitMesh.userData = { landmarkId: site.id, bodyId: 'mars' };
    pinContainer.add(hitMesh);

    landmarkGroup.add(pinContainer);
    markerObjects.set(site.id, {
      pinContainer,
      ring,
      core,
      labelSprite,
    });

    disposables.push(beamMat, ringMat, coreMat, labelTex, spriteMat);
  });

  let pulseTimer = 0;
  const _sunDir = new THREE.Vector3();
  const _pinWorldPos = new THREE.Vector3();
  const _pinNormal = new THREE.Vector3();
  const _toCam = new THREE.Vector3();

  return {
    group,
    mesh,
    spinGroup,
    landmarkGroup,
    orbitLine,
    orbitRadius: MARS_ORBIT_RADIUS,
    setOrbitalState(marsState) {
      if (!marsState) return;
      group.position.set(
        marsState.position.x,
        marsState.position.y,
        marsState.position.z
      );
      _sunDir
        .set(-marsState.position.x, -marsState.position.y, -marsState.position.z)
        .normalize();
      if (_sunDir.lengthSq() > 0.0001) {
        atmoMat.uniforms.uSunDirection.value.copy(_sunDir);
      }
    },
    setTextureMode() {
      const nextTex = textures.marsAlbedo;
      const nextBump = textures.marsBump || nextTex;
      if (nextTex && (material.map !== nextTex || material.bumpMap !== nextBump)) {
        material.map = nextTex;
        material.bumpMap = nextBump;
        material.bumpScale = 0.036;
        material.roughness = 0.82;
        material.needsUpdate = true;
      }
    },
    setAtmosphereParams({ cloudOpacity, cloudDriftSpeed, dustIntensity }) {
      if (typeof cloudOpacity === 'number') {
        atmoMat.uniforms.uCloudOpacity.value = cloudOpacity;
      }
      if (typeof cloudDriftSpeed === 'number') {
        atmoMat.uniforms.uCloudDriftSpeed.value = cloudDriftSpeed;
      }
      if (typeof dustIntensity === 'number') {
        atmoMat.uniforms.uDustIntensity.value = dustIntensity;
      }
    },
    update(dt, isPaused, selectedLandmarkId = null, camera = null) {
      pulseTimer += dt * 3.0;
      atmoMat.uniforms.uTime.value = pulseTimer;

      const desiredTex = textures.marsAlbedo;
      const desiredBump = textures.marsBump || desiredTex;
      if (desiredTex && (material.map !== desiredTex || material.bumpMap !== desiredBump)) {
        material.map = desiredTex;
        material.bumpMap = desiredBump;
        material.needsUpdate = true;
      }

      if (!isPaused && !selectedLandmarkId) {
        spinGroup.rotation.y += dt * 0.135;
      }

      if (landmarkGroup.visible) {
        spinGroup.updateWorldMatrix(true, false);
        markerObjects.forEach((marker, id) => {
          const isSelected = id === selectedLandmarkId;
          if (camera) {
            marker.pinContainer.getWorldPosition(_pinWorldPos);
            _pinNormal.copy(_pinWorldPos).sub(group.position).normalize();
            _toCam.copy(camera.position).sub(_pinWorldPos).normalize();
            marker.pinContainer.visible =
              isSelected || _pinNormal.dot(_toCam) > 0.08;
          }
          const scale = isSelected
            ? 1.22 + Math.sin(pulseTimer * 2.0) * 0.14
            : 1.0;
          marker.ring.scale.setScalar(scale);
          marker.core.scale.setScalar(isSelected ? 1.25 : 1.0);
          marker.labelSprite.scale.set(
            isSelected ? 0.15 : 0.17,
            isSelected ? 0.038 : 0.042,
            1
          );
        });
      }
    },
    setOrbitVisibility(visible) {
      orbitLine.visible = visible;
    },
    setLandmarksVisibility(visible) {
      landmarkGroup.visible = visible;
    },
    getPosition() {
      return group.position;
    },
    getLandmarkPosition(id, outVec = new THREE.Vector3()) {
      const marker = markerObjects.get(id);
      if (!marker) return null;
      spinGroup.updateWorldMatrix(true, false);
      marker.pinContainer.getWorldPosition(outVec);
      return outVec;
    },
    dispose() {
      disposables.forEach((d) => d.dispose?.());
    },
  };
}
/* --- End of mars.js --- */
