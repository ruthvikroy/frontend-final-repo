/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Full-screen Three.js celestial canvas rendering Sun, Earth, Moon, Mars, and interactive observatories and landmarks
*/
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createEarthSystem } from '../celestial/earth.js';
import { createMoonSystem } from '../celestial/moon.js';
import { createMarsSystem } from '../celestial/mars.js';
import { createStarField } from '../celestial/starfield.js';
import { loadCelestialTextures } from '../celestial/textures.js';
import { LUNAR_LOCATIONS_MAP } from '../data/lunarLandmarks.js';
import {
  MARS_LOCATIONS_MAP,
  EARTH_OBSERVATORIES_MAP,
  formatMarsSolTime,
} from '../data/marsLandmarks.js';
import {
  FULLSCREEN_ORBIT_CONFIG,
  computeNestedOrbitalState,
} from '../utils/orbitalMath.js';

const _landmarkWorldPos = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _moonOffset = new THREE.Vector3(0.45, 0.2, 0.85);
const _marsOffset = new THREE.Vector3(0.75, 0.28, 1.45);
const _sunToBodyDir = new THREE.Vector3();

function createSunSystem(sunRadius = 1.32) {
  const group = new THREE.Group();

  const coreGeo = new THREE.SphereGeometry(sunRadius, 48, 48);
  const coreMat = new THREE.ShaderMaterial({
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
        float gran = 0.5 + 0.5 * sin(vPos.x * 9.0 + uTime * 1.4) * cos(vPos.y * 9.0 - uTime * 1.1) * sin(vPos.z * 9.0 + uTime * 0.9);
        vec3 base = mix(uLimbColor, uMidColor, pow(viewDot, 0.45));
        vec3 col = mix(base, uCoreColor, pow(viewDot, 1.35) * (0.75 + 0.25 * gran));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.userData = { bodyId: 'overview' };
  group.add(coreMesh);

  const coronaGeo = new THREE.SphereGeometry(sunRadius * 1.32, 32, 32);
  const coronaMat = new THREE.ShaderMaterial({
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
  const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
  group.add(coronaMesh);

  return {
    group,
    coreMesh,
    update(timeSeconds) {
      coreMat.uniforms.uTime.value = timeSeconds;
      coreMesh.rotation.y = timeSeconds * 0.05;
    },
    dispose() {
      coreGeo.dispose();
      coreMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
    },
  };
}

function detectSoftwareGl() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

export function CelestialCanvas({
  viewMode = 'overview',
  isPaused = false,
  showOrbits = true,
  showLandingSites = true,
  resetTrigger = 0,
  selectedLandmarkId = null,
  marsTextureMode = 'global-mola',
  marsCloudOpacity = 0.65,
  marsCloudDriftSpeed = 1.0,
  marsDustIntensity = 0.42,
  onSelectLandmarkId = () => {},
  onSelectBody = () => {},
  onUserInteracted = () => {},
  onFlightTelemetry = () => {},
}) {
  const mountRef = useRef(null);

  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const showOrbitsRef = useRef(showOrbits);
  showOrbitsRef.current = showOrbits;

  const showLandingSitesRef = useRef(showLandingSites);
  showLandingSitesRef.current = showLandingSites;

  const marsConfigRef = useRef({
    marsTextureMode,
    marsCloudOpacity,
    marsCloudDriftSpeed,
    marsDustIntensity,
  });
  marsConfigRef.current = {
    marsTextureMode,
    marsCloudOpacity,
    marsCloudDriftSpeed,
    marsDustIntensity,
  };

  const onSelectLandmarkRef = useRef(onSelectLandmarkId);
  onSelectLandmarkRef.current = onSelectLandmarkId;

  const onSelectBodyRef = useRef(onSelectBody);
  onSelectBodyRef.current = onSelectBody;

  const onFlightTelemetryRef = useRef(onFlightTelemetry);
  onFlightTelemetryRef.current = onFlightTelemetry;

  const interactionRef = useRef(onUserInteracted);
  interactionRef.current = onUserInteracted;

  const resetTriggerRef = useRef(resetTrigger);
  const landmarkIdRef = useRef(selectedLandmarkId);
  landmarkIdRef.current = selectedLandmarkId;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020308, 0.0025);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    const currentCamPos = new THREE.Vector3(0.0, 10.6, 21.2);
    const targetCamPos = new THREE.Vector3(0.0, 10.6, 21.2);
    const currentLookAt = new THREE.Vector3(0.0, 0.0, 0.0);
    const targetLookAt = new THREE.Vector3(0.0, 0.0, 0.0);

    const sun = createSunSystem(FULLSCREEN_ORBIT_CONFIG.sunRadius);
    scene.add(sun.group);

    const solarPointLight = new THREE.PointLight(0xfff5db, 3.4, 120, 0.25);
    solarPointLight.position.set(0, 0, 0);
    scene.add(solarPointLight);

    const sunDirection = new THREE.Vector3(-1, 0.15, -0.35).normalize();
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(0, 12, 8);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x101829, 0.45);
    scene.add(ambientLight);
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x090d16, 0.35);
    scene.add(hemiLight);

    const earthshineLight = new THREE.DirectionalLight(0x5aa8ff, 1.25);
    scene.add(earthshineLight);

    const lunarKeyLight = new THREE.DirectionalLight(0xfff7ed, 1.85);
    scene.add(lunarKeyLight);

    const lunarRimLight = new THREE.DirectionalLight(0x93c5fd, 0.75);
    scene.add(lunarRimLight);

    const starCount = isSoftwareGl ? 1400 : width <= 768 ? 1800 : 2800;
    const starfield = createStarField(starCount);
    scene.add(starfield.group);

    const textures = loadCelestialTextures();
    const earth = createEarthSystem(textures, sunDirection);
    earth.surfaceMesh.userData = { bodyId: 'earth' };
    scene.add(earth.group);
    scene.add(earth.orbitLine);

    const moon = createMoonSystem(textures);
    moon.mesh.userData = { bodyId: 'moon' };
    scene.add(moon.group);
    scene.add(moon.orbitLine);

    const mars = createMarsSystem(textures, sunDirection);
    mars.mesh.userData = { bodyId: 'mars' };
    scene.add(mars.group);
    scene.add(mars.orbitLine);

    const initOrbitalState = computeNestedOrbitalState(0, FULLSCREEN_ORBIT_CONFIG);
    earth.setOrbitalState(
      initOrbitalState.earth.position,
      initOrbitalState.earth.forwardDir,
      initOrbitalState.earth.gravityDir
    );
    moon.setOrbitalState(initOrbitalState.moon, initOrbitalState.earth.position);
    mars.setOrbitalState(initOrbitalState.mars);
    const initMode = viewModeRef.current;
    const initLm = landmarkIdRef.current;
    const initActiveBody =
      initLm && EARTH_OBSERVATORIES_MAP.has(initLm)
        ? 'earth'
        : initLm && LUNAR_LOCATIONS_MAP.has(initLm)
        ? 'moon'
        : initLm && MARS_LOCATIONS_MAP.has(initLm)
        ? 'mars'
        : initMode === 'earth' || initMode === 'moon' || initMode === 'mars'
        ? initMode
        : null;
    earth.setLandmarksVisibility(showLandingSitesRef.current && initActiveBody === 'earth');
    moon.setLandmarksVisibility(showLandingSitesRef.current && initActiveBody === 'moon');
    mars.setLandmarksVisibility(showLandingSitesRef.current && initActiveBody === 'mars');
    moon.update(0, true, landmarkIdRef.current, camera);
    mars.update(0, true, landmarkIdRef.current, camera);

    const initEarthPos = earth.group.position;
    const initMoonPos = moon.getPosition();
    const initMarsPos = mars.getPosition();

    if (viewModeRef.current === 'earth') {
      currentCamPos.set(initEarthPos.x, initEarthPos.y + 0.18, initEarthPos.z + 2.15);
      currentLookAt.copy(initEarthPos);
    } else if (viewModeRef.current === 'moon') {
      currentCamPos.copy(initMoonPos).add(_moonOffset);
      currentLookAt.copy(initMoonPos);
    } else if (viewModeRef.current === 'mars') {
      currentCamPos.copy(initMarsPos).add(_marsOffset);
      currentLookAt.copy(initMarsPos);
    } else if (viewModeRef.current === 'orbit') {
      currentCamPos.set(0.0, 20.5, 11.5);
      currentLookAt.set(0.0, 0, 0);
    } else {
      currentCamPos.set(0.0, 10.6, 21.2);
      currentLookAt.set(0.0, 0, 0);
    }
    targetCamPos.copy(currentCamPos);
    targetLookAt.copy(currentLookAt);
    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;
    let orbitRotationX = 0;
    let orbitRotationY = 0;

    const mouseNorm = { x: 0, y: 0 };
    const gazeTarget = new THREE.Vector2(0, 0);
    const currentGaze = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const mouseRay = new THREE.Vector2();

    const updatePointerPosition = (clientX, clientY) => {
      const ndcX = (clientX / window.innerWidth) * 2.0 - 1.0;
      const ndcY = -(clientY / window.innerHeight) * 2.0 + 1.0;

      mouseNorm.x = ndcX;
      mouseNorm.y = -ndcY;

      gazeTarget.set(ndcX * 0.22, ndcY * 0.16);
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      updatePointerPosition(e.clientX, e.clientY);
      interactionRef.current();
    };

    const handlePointerMove = (e) => {
      updatePointerPosition(e.clientX, e.clientY);

      if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        rotationVelocityY += dx * 0.003;
        rotationVelocityX += dy * 0.003;
      }
    };

    const handlePointerUp = (e) => {
      if (isDragging && e) {
        const moveDist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
        if (moveDist < 8) {
          mouseRay.set(
            (e.clientX / window.innerWidth) * 2.0 - 1.0,
            -(e.clientY / window.innerHeight) * 2.0 + 1.0
          );
          raycaster.setFromCamera(mouseRay, camera);

          const curLm = landmarkIdRef.current;
          const curMode = viewModeRef.current;
          const activeBody =
            curLm && EARTH_OBSERVATORIES_MAP.has(curLm)
              ? 'earth'
              : curLm && LUNAR_LOCATIONS_MAP.has(curLm)
              ? 'moon'
              : curLm && MARS_LOCATIONS_MAP.has(curLm)
              ? 'mars'
              : curMode === 'earth' || curMode === 'moon' || curMode === 'mars'
              ? curMode
              : null;
          const landmarkTargets =
            activeBody === 'earth'
              ? (earth.landmarkGroup?.children || []).filter((c) => c.visible)
              : activeBody === 'moon'
              ? moon.landmarkGroup.children.filter((c) => c.visible)
              : activeBody === 'mars'
              ? mars.landmarkGroup.children.filter((c) => c.visible)
              : [];
          const intersects = raycaster.intersectObjects(landmarkTargets, true);

          if (intersects.length > 0) {
            for (const hit of intersects) {
              const hitId = hit.object?.userData?.landmarkId;
              const hitBody =
                hit.object?.userData?.bodyId ||
                (EARTH_OBSERVATORIES_MAP.has(hitId)
                  ? 'earth'
                  : MARS_LOCATIONS_MAP.has(hitId)
                  ? 'mars'
                  : 'moon');
              if (hitId) {
                onSelectLandmarkRef.current(hitId, hitBody);
                isDragging = false;
                return;
              }
            }
          }

          const bodyHits = raycaster.intersectObjects(
            [sun.coreMesh, earth.surfaceMesh, moon.mesh, mars.mesh],
            true
          );
          if (bodyHits.length > 0) {
            const bodyId = bodyHits[0].object?.userData?.bodyId;
            if (bodyId) {
              onSelectBodyRef.current(bodyId);
            }
          }
        }
      }
      isDragging = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        updatePointerPosition(touch.clientX, touch.clientY);
        interactionRef.current();
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        updatePointerPosition(touch.clientX, touch.clientY);
      }
    };

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Digit1') {
        onSelectBodyRef.current('overview');
      } else if (e.code === 'Digit2') {
        onSelectBodyRef.current('earth');
      } else if (e.code === 'Digit3') {
        onSelectBodyRef.current('moon');
      } else if (e.code === 'Digit4') {
        onSelectBodyRef.current('mars');
      } else if (e.code === 'Digit5') {
        onSelectBodyRef.current('orbit');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: false,
      powerPreference: 'high-performance',
    });
    const dpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const nextDpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(nextDpr);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      starfield.setDPR(nextDpr);
    };
    window.addEventListener('resize', handleResize);

    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb) {
      if (isDisposed) return;
      const gl = renderer.getContext();
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    let lastTime = performance.now();
    let accumulatedTime = 0;
    let lastTelemetryPush = 0;
    let lastThrustMode = '';
    let lastTargetBody = '';

    const tick = () => {
      if (isDisposed) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const mode = viewModeRef.current;
      const currentLandmark = landmarkIdRef.current;

      if (!isPausedRef.current && !currentLandmark) {
        accumulatedTime += dt;
      }

      if (resetTriggerRef.current !== resetTrigger) {
        resetTriggerRef.current = resetTrigger;
        orbitRotationX = 0;
        orbitRotationY = 0;
        rotationVelocityX = 0;
        rotationVelocityY = 0;
        gazeTarget.set(0, 0);
      }

      orbitRotationY += rotationVelocityY;
      orbitRotationX += rotationVelocityX;
      rotationVelocityX *= 0.92;
      rotationVelocityY *= 0.92;

      currentGaze.lerp(gazeTarget, 0.055);

      sun.update(accumulatedTime);
      starfield.update(accumulatedTime);

      const orbitalState = computeNestedOrbitalState(
        accumulatedTime,
        FULLSCREEN_ORBIT_CONFIG
      );

      const activeBody =
        currentLandmark && EARTH_OBSERVATORIES_MAP.has(currentLandmark)
          ? 'earth'
          : currentLandmark && LUNAR_LOCATIONS_MAP.has(currentLandmark)
          ? 'moon'
          : currentLandmark && MARS_LOCATIONS_MAP.has(currentLandmark)
          ? 'mars'
          : mode === 'earth' || mode === 'moon' || mode === 'mars'
          ? mode
          : null;

      earth.setOrbitalState(
        orbitalState.earth.position,
        orbitalState.earth.forwardDir,
        orbitalState.earth.gravityDir
      );
      earth.setOrbitVisibility(showOrbitsRef.current);
      earth.setLandmarksVisibility(
        showLandingSitesRef.current && activeBody === 'earth'
      );
      earth.update(dt, camera, isPausedRef.current, currentLandmark);

      moon.setOrbitalState(orbitalState.moon, orbitalState.earth.position);
      moon.setOrbitVisibility(showOrbitsRef.current);
      moon.setLandmarksVisibility(
        showLandingSitesRef.current && activeBody === 'moon'
      );
      moon.update(dt, isPausedRef.current, currentLandmark, camera);

      const mCfg = marsConfigRef.current;
      mars.setOrbitalState(orbitalState.mars);
      mars.setTextureMode(mCfg.marsTextureMode);
      mars.setAtmosphereParams({
        cloudOpacity: mCfg.marsCloudOpacity,
        cloudDriftSpeed: mCfg.marsCloudDriftSpeed,
        dustIntensity: mCfg.marsDustIntensity,
      });
      mars.setOrbitVisibility(showOrbitsRef.current);
      mars.setLandmarksVisibility(
        showLandingSitesRef.current && activeBody === 'mars'
      );
      mars.update(dt, isPausedRef.current, currentLandmark, camera);

      const earthPos = earth.group.position;
      const moonPos = moon.getPosition();
      const marsPos = mars.getPosition();

      earthshineLight.position.copy(earthPos);
      earthshineLight.target = moon.mesh;

      if (mode === 'mars' || MARS_LOCATIONS_MAP.has(currentLandmark)) {
        _sunToBodyDir.copy(marsPos).normalize();
        lunarKeyLight.position.set(
          marsPos.x - _sunToBodyDir.x * 2.2 + 0.8,
          marsPos.y + 1.1,
          marsPos.z - _sunToBodyDir.z * 2.2 + 0.8
        );
        lunarKeyLight.target = mars.mesh;
        lunarKeyLight.intensity = 2.6;

        lunarRimLight.position.set(
          marsPos.x + _sunToBodyDir.x * 1.8,
          marsPos.y + 0.4,
          marsPos.z + _sunToBodyDir.z * 1.8
        );
        lunarRimLight.target = mars.mesh;
        lunarRimLight.intensity = 0.85;
      } else if (mode === 'moon' || LUNAR_LOCATIONS_MAP.has(currentLandmark)) {
        _sunToBodyDir.copy(moonPos).normalize();
        lunarKeyLight.position.set(
          moonPos.x - _sunToBodyDir.x * 1.6 + 0.6,
          moonPos.y + 0.8,
          moonPos.z - _sunToBodyDir.z * 1.6 + 0.6
        );
        lunarKeyLight.target = moon.mesh;
        lunarKeyLight.intensity = 2.4;

        lunarRimLight.position.set(
          moonPos.x + _sunToBodyDir.x * 1.2,
          moonPos.y + 0.3,
          moonPos.z + _sunToBodyDir.z * 1.2
        );
        lunarRimLight.target = moon.mesh;
        lunarRimLight.intensity = 0.95;
      } else {
        lunarKeyLight.position.set(0, 4.0, 4.0);
        lunarKeyLight.target = moon.mesh;
        lunarKeyLight.intensity = 1.2;
        lunarRimLight.intensity = 0.45;
      }

      const parallaxX = mouseNorm.x * 0.12 + currentGaze.x;
      const parallaxY = -mouseNorm.y * 0.1 + currentGaze.y;

      if (currentLandmark && EARTH_OBSERVATORIES_MAP.has(currentLandmark)) {
        const worldPos = earth.getLandmarkPosition(currentLandmark, _landmarkWorldPos);
        if (worldPos) {
          _normal.copy(worldPos).sub(earthPos).normalize();
          targetCamPos.copy(worldPos).addScaledVector(_normal, 1.05);
          targetCamPos.x += parallaxX * 0.14;
          targetCamPos.y += parallaxY * 0.14;
          targetLookAt.copy(worldPos);
        }
      } else if (currentLandmark && LUNAR_LOCATIONS_MAP.has(currentLandmark)) {
        const worldPos = moon.getLandmarkPosition(currentLandmark, _landmarkWorldPos);
        if (worldPos) {
          _normal.copy(worldPos).sub(moonPos).normalize();
          targetCamPos.copy(worldPos).addScaledVector(_normal, 0.48);
          targetCamPos.x += parallaxX * 0.12;
          targetCamPos.y += parallaxY * 0.12;
          targetLookAt.copy(worldPos);
        }
      } else if (currentLandmark && MARS_LOCATIONS_MAP.has(currentLandmark)) {
        const worldPos = mars.getLandmarkPosition(currentLandmark, _landmarkWorldPos);
        if (worldPos) {
          _normal.copy(worldPos).sub(marsPos).normalize();
          targetCamPos.copy(worldPos).addScaledVector(_normal, 0.82);
          targetCamPos.x += parallaxX * 0.16;
          targetCamPos.y += parallaxY * 0.16;
          targetLookAt.copy(worldPos);
        }
      } else if (mode === 'overview') {
        const radius = 21.2;
        targetCamPos.set(
          Math.sin(orbitRotationY) * radius * 0.65 + parallaxX,
          10.6 + orbitRotationX * 2.5 + parallaxY,
          Math.cos(orbitRotationY * 0.5) * radius
        );
        targetLookAt.set(currentGaze.x * 0.5, currentGaze.y * 0.5, 0);
      } else if (mode === 'earth') {
        const radius = 2.15;
        targetCamPos.set(
          earthPos.x + Math.sin(orbitRotationY) * radius + parallaxX * 0.3,
          earthPos.y + orbitRotationX * 0.8 + 0.18 + parallaxY * 0.3,
          earthPos.z + Math.cos(orbitRotationY) * radius
        );
        targetLookAt.set(
          earthPos.x + currentGaze.x * 0.3,
          earthPos.y + currentGaze.y * 0.3,
          earthPos.z
        );
      } else if (mode === 'moon') {
        targetCamPos.copy(moonPos).add(_moonOffset);
        targetCamPos.x += parallaxX * 0.25;
        targetCamPos.y += parallaxY * 0.25;
        targetLookAt.copy(moonPos);
        targetLookAt.x += currentGaze.x * 0.2;
        targetLookAt.y += currentGaze.y * 0.2;
      } else if (mode === 'mars') {
        const radius = 1.65;
        targetCamPos.set(
          marsPos.x + Math.sin(orbitRotationY + 0.4) * radius + parallaxX * 0.28,
          marsPos.y + orbitRotationX * 0.6 + 0.22 + parallaxY * 0.28,
          marsPos.z + Math.cos(orbitRotationY + 0.4) * radius
        );
        targetLookAt.set(
          marsPos.x + currentGaze.x * 0.22,
          marsPos.y + currentGaze.y * 0.22,
          marsPos.z
        );
      } else if (mode === 'orbit') {
        targetCamPos.set(
          Math.sin(orbitRotationY) * 5.2 + parallaxX,
          20.5 + orbitRotationX * 2.4 + parallaxY,
          Math.cos(orbitRotationY * 0.4) * 11.5
        );
        targetLookAt.set(currentGaze.x * 0.4, currentGaze.y * 0.4, 0);
      }

      const dampFactor = 1 - Math.exp(-4.2 * dt);
      currentCamPos.lerp(targetCamPos, dampFactor);
      currentLookAt.lerp(targetLookAt, dampFactor);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      const thrustMode = 'GRAVITY-SPEED BALANCE';

      const distEarth = camera.position.distanceTo(earthPos);
      const distMoon = camera.position.distanceTo(moonPos);
      const distMars = camera.position.distanceTo(marsPos);

      let targetBody = 'EARTH';
      let targetDistance = (distEarth * 6371).toFixed(0) + ' KM';
      let orbitalVelocityKms = '29.78';
      let centripetalAccel = '5.93 MM/S²';
      if (distMoon < distEarth && distMoon < distMars) {
        targetBody = 'MOON';
        targetDistance = (distMoon * 3844).toFixed(0) + ' KM';
        orbitalVelocityKms = '1.022';
        centripetalAccel = '2.72 MM/S²';
      } else if (distMars < distEarth && distMars < distMoon) {
        targetBody = 'MARS';
        targetDistance = (distMars * 6779).toFixed(0) + ' KM';
        orbitalVelocityKms = '24.07';
        centripetalAccel = '2.55 MM/S²';
      }

      if (
        now - lastTelemetryPush > 250 ||
        thrustMode !== lastThrustMode ||
        targetBody !== lastTargetBody
      ) {
        lastTelemetryPush = now;
        lastThrustMode = thrustMode;
        lastTargetBody = targetBody;
        const speedKms = orbitalVelocityKms;
        const marsSolTime = formatMarsSolTime(accumulatedTime, 140);

        onFlightTelemetryRef.current({
          speedKms,
          centripetalAccel,
          thrustMode,
          targetBody,
          targetDistance,
          marsSolTime,
          isWarping: false,
          isBraking: false,
          thrustActive: false,
          isPiloting: false,
        });
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sun.dispose();
      earth.dispose();
      moon.dispose();
      mars.dispose();
      starfield.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="celestial-fullscreen-canvas"
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
}
/* --- End of CelestialCanvas.jsx --- */
