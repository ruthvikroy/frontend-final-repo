/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: 3D Earth planetary system with day/night shader, clouds, atmosphere, and Earth observatories researching Moon and Mars
*/
import * as THREE from 'three';
import {
  EARTH_OBSERVATORIES,
  areographicToCartesian,
} from '../data/marsLandmarks.js';

const earthSurfaceVertexShader = `
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
`;

const earthSurfaceFragmentShader = `
precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform sampler2D uDayMap;
uniform sampler2D uLightsMap;
uniform sampler2D uSpecularMap;
uniform vec3 uSunDirection;
uniform vec3 uCameraPosition;
uniform float uSunIntensity;
uniform float uAmbientIntensity;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    vec3 sunDir = normalize(uSunDirection);

    float sunDot = dot(normal, sunDir);

    float dayFactor = smoothstep(-0.10, 0.14, sunDot);
    float nightFactor = 1.0 - smoothstep(-0.18, 0.05, sunDot);

    vec4 dayTex = texture2D(uDayMap, vUv);
    vec4 lightsTex = texture2D(uLightsMap, vUv);
    vec4 specTex = texture2D(uSpecularMap, vUv);

    vec3 lightReflect = reflect(-sunDir, normal);
    float specFactor = pow(max(dot(viewDir, lightReflect), 0.0), 28.0) * specTex.r;
    vec3 oceanSpecular = vec3(0.95, 0.98, 1.0) * specFactor * 1.4 * max(sunDot, 0.0);

    vec3 dayColor = dayTex.rgb * (max(sunDot, 0.0) * uSunIntensity + uAmbientIntensity) + oceanSpecular;

    vec3 nightColor = lightsTex.rgb * vec3(1.15, 0.95, 0.7) * 1.8 * nightFactor;

    float rim = 1.0 - max(dot(normal, viewDir), 0.0);
    vec3 atmosphericHaze = vec3(0.35, 0.68, 1.0) * pow(rim, 3.5) * max(sunDot * 0.75 + 0.25, 0.0) * 0.9;

    vec3 finalColor = mix(nightColor, dayColor, dayFactor) + atmosphericHaze;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const atmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const atmosphereFragmentShader = `
precision highp float;

varying vec3 vNormal;
varying vec3 vViewDir;

uniform vec3 uSunDirection;
uniform vec3 uAtmosphereColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDir);
    vec3 sunDir = normalize(uSunDirection);

    float vDot = max(dot(normal, viewDir), 0.0);
    float rim = pow(1.0 - vDot, 4.0);

    float sunFacing = max(dot(normal, sunDir) * 0.65 + 0.35, 0.0);
    float intensity = rim * sunFacing * 1.2;

    if (intensity < 0.005) discard;

    gl_FragColor = vec4(uAtmosphereColor, intensity * 0.85);
}
`;

function createEarthPinLabelTexture(text, subtext, hexColor, imageUrl) {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 72;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (!ctx) return texture;

  const drawBadge = (img) => {
    ctx.clearRect(0, 0, 300, 72);

    ctx.fillStyle = 'rgba(6, 10, 18, 0.92)';
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(6, 6, 288, 60, 10);
    ctx.fill();
    ctx.stroke();

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(36, 36, 20, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 16, 16, 40, 40);
      ctx.restore();

      ctx.strokeStyle = hexColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(36, 36, 20, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = hexColor;
      ctx.beginPath();
      ctx.arc(36, 36, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(text).slice(0, 18), 64, 26);

    ctx.fillStyle = '#7dd3fc';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(String(subtext).slice(0, 24), 64, 46);

    texture.needsUpdate = true;
  };

  drawBadge(null);

  if (typeof Image !== 'undefined' && imageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => drawBadge(img);
    img.src = imageUrl;
  }

  return texture;
}

export function createEarthSystem(textures, sunDirection) {
  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = -0.4091;

  const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
  const surfaceMaterial = new THREE.ShaderMaterial({
    vertexShader: earthSurfaceVertexShader,
    fragmentShader: earthSurfaceFragmentShader,
    uniforms: {
      uDayMap: { value: textures.earthDay },
      uLightsMap: { value: textures.earthLights },
      uSpecularMap: { value: textures.earthSpecular || textures.earthDay },
      uSunDirection: { value: sunDirection },
      uCameraPosition: { value: new THREE.Vector3() },
      uSunIntensity: { value: 1.35 },
      uAmbientIntensity: { value: 0.04 },
    },
  });

  const surfaceMesh = new THREE.Mesh(earthGeometry, surfaceMaterial);
  earthGroup.add(surfaceMesh);

  const cloudsGeometry = new THREE.SphereGeometry(1.008, 48, 48);
  const cloudsMaterial = new THREE.MeshStandardMaterial({
    map: textures.earthClouds,
    transparent: true,
    opacity: 0.75,
    blending: THREE.NormalBlending,
    roughness: 0.95,
    metalness: 0.0,
    depthWrite: false,
  });
  const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  earthGroup.add(cloudsMesh);

  const atmosphereGeometry = new THREE.SphereGeometry(1.014, 48, 48);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: {
      uSunDirection: { value: sunDirection },
      uAtmosphereColor: { value: new THREE.Color(0x60aaff) },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    depthWrite: false,
  });
  const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  earthGroup.add(atmosphereMesh);

  const landmarkGroup = new THREE.Group();
  surfaceMesh.add(landmarkGroup);

  const markerObjects = new Map();
  const disposables = [];
  const beamHeight = 0.095;
  const beamGeo = new THREE.CylinderGeometry(0.003, 0.001, beamHeight, 6);
  const ringGeo = new THREE.RingGeometry(0.016, 0.025, 16);
  const coreGeo = new THREE.SphereGeometry(0.011, 8, 8);
  const hitGeo = new THREE.SphereGeometry(0.06, 6, 6);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const upVec = new THREE.Vector3(0, 1, 0);

  disposables.push(beamGeo, ringGeo, coreGeo, hitGeo, hitMat);

  EARTH_OBSERVATORIES.forEach((site) => {
    const pos = areographicToCartesian(site.lat, site.lon, 1.0);
    const surfaceVec = new THREE.Vector3(pos.x, pos.y, pos.z);
    const normal = surfaceVec.clone().normalize();
    const colorHex = site.id === 'obs-nasa-ames' ? '#facc15' : '#38bdf8';
    const threeColor = new THREE.Color(colorHex);

    const pinContainer = new THREE.Group();
    pinContainer.position.copy(surfaceVec);
    pinContainer.userData = { landmarkId: site.id, bodyId: 'earth', site };

    const beamMat = new THREE.MeshBasicMaterial({
      color: threeColor,
      transparent: true,
      opacity: 0.85,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    const quat = new THREE.Quaternion().setFromUnitVectors(upVec, normal);
    beam.quaternion.copy(quat);
    beam.position.copy(normal).multiplyScalar(beamHeight * 0.5);
    beam.userData = { landmarkId: site.id, bodyId: 'earth' };
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
    ring.position.copy(normal).multiplyScalar(0.003);
    ring.userData = { landmarkId: site.id, bodyId: 'earth' };
    pinContainer.add(ring);

    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.copy(normal).multiplyScalar(beamHeight);
    core.userData = { landmarkId: site.id, bodyId: 'earth' };
    pinContainer.add(core);

    const labelTex = createEarthPinLabelTexture(
      site.shortLabel || site.name,
      site.researchTargets || site.mission,
      colorHex,
      site.referenceImage
    );
    const spriteMat = new THREE.SpriteMaterial({
      map: labelTex,
      transparent: true,
      depthTest: false,
    });
    const labelSprite = new THREE.Sprite(spriteMat);
    labelSprite.position.copy(normal).multiplyScalar(beamHeight + 0.052);
    labelSprite.scale.set(0.27, 0.065, 1);
    labelSprite.userData = { landmarkId: site.id, bodyId: 'earth' };
    pinContainer.add(labelSprite);

    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.position.copy(normal).multiplyScalar(beamHeight * 0.5);
    hitMesh.userData = { landmarkId: site.id, bodyId: 'earth' };
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

  const earthOrbitRadius = 5.6;
  const orbitPoints = [];
  const orbitSegments = 128;
  for (let i = 0; i <= orbitSegments; i++) {
    const theta = (i / orbitSegments) * Math.PI * 2;
    orbitPoints.push(
      new THREE.Vector3(
        Math.cos(theta) * earthOrbitRadius,
        0,
        Math.sin(theta) * earthOrbitRadius
      )
    );
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.42,
  });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

  const _sunDir = new THREE.Vector3();
  const _pinWorldPos = new THREE.Vector3();
  const _pinNormal = new THREE.Vector3();
  const _toCam = new THREE.Vector3();
  let pulseTimer = 0;

  return {
    group: earthGroup,
    surfaceMesh,
    cloudsMesh,
    atmosphereMesh,
    landmarkGroup,
    orbitLine,
    orbitRadius: earthOrbitRadius,
    setOrbitalState(pos) {
      earthGroup.position.set(pos.x, pos.y, pos.z);

      _sunDir.set(-pos.x, -pos.y, -pos.z).normalize();
      if (_sunDir.lengthSq() > 0.0001) {
        surfaceMaterial.uniforms.uSunDirection.value.copy(_sunDir);
        atmosphereMaterial.uniforms.uSunDirection.value.copy(_sunDir);
      }
    },
    setOrbitVisibility(visible) {
      orbitLine.visible = visible;
    },
    setLandmarksVisibility(visible) {
      landmarkGroup.visible = visible;
    },
    getLandmarkPosition(id, outVec = new THREE.Vector3()) {
      const marker = markerObjects.get(id);
      if (!marker) return null;
      surfaceMesh.updateWorldMatrix(true, false);
      marker.pinContainer.getWorldPosition(outVec);
      return outVec;
    },
    update(dt, camera, isPaused = false, selectedLandmarkId = null) {
      pulseTimer += dt * 3.0;
      const isObservatorySelected =
        selectedLandmarkId && markerObjects.has(selectedLandmarkId);
      if (!isPaused && !isObservatorySelected) {
        surfaceMesh.rotation.y += dt * 0.14;
        cloudsMesh.rotation.y += dt * 0.17;
      }

      if (landmarkGroup.visible) {
        surfaceMesh.updateWorldMatrix(true, false);
        markerObjects.forEach((marker, id) => {
          const isSelected = id === selectedLandmarkId;
          if (camera) {
            marker.pinContainer.getWorldPosition(_pinWorldPos);
            _pinNormal.copy(_pinWorldPos).sub(earthGroup.position).normalize();
            _toCam.copy(camera.position).sub(_pinWorldPos).normalize();
            marker.pinContainer.visible =
              isSelected || _pinNormal.dot(_toCam) > 0.08;
          }
          const scale = isSelected
            ? 1.24 + Math.sin(pulseTimer * 2.0) * 0.14
            : 1.0;
          marker.ring.scale.setScalar(scale);
          marker.core.scale.setScalar(isSelected ? 1.25 : 1.0);
        });
      }

      surfaceMaterial.uniforms.uCameraPosition.value.copy(camera.position);
      surfaceMaterial.uniforms.uDayMap.value = textures.earthDay;
      surfaceMaterial.uniforms.uLightsMap.value = textures.earthLights;
      if (textures.earthSpecular) {
        surfaceMaterial.uniforms.uSpecularMap.value = textures.earthSpecular;
      }

      if (textures.earthClouds && cloudsMaterial.map !== textures.earthClouds) {
        cloudsMaterial.map = textures.earthClouds;
        cloudsMaterial.needsUpdate = true;
      }
    },
    dispose() {
      earthGeometry.dispose();
      cloudsGeometry.dispose();
      atmosphereGeometry.dispose();
      surfaceMaterial.dispose();
      cloudsMaterial.dispose();
      atmosphereMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      disposables.forEach((d) => d.dispose?.());
    },
  };
}
/* --- End of earth.js --- */
