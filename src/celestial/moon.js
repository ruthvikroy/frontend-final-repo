/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: 3D Moon planetary system with bright lunar surface material and front-hemisphere landmark culling
*/
import * as THREE from 'three';
import { ALL_LUNAR_LOCATIONS, selenographicToCartesian } from '../data/lunarLandmarks.js';

const _upAxis = new THREE.Vector3(0, 1, 0);
const _zAxis = new THREE.Vector3(0, 0, 1);

function createLunarBadgeCanvas(text, subtext, color = '#F5D000') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(10, 15, 24, 0.92)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 64, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(32, 40, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(text, 50, 36);

  if (subtext) {
    ctx.fillStyle = color;
    ctx.font = 'bold 15px monospace';
    ctx.fillText(subtext, 50, 56);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export function createMoonSystem(textures) {
  const moonGroup = new THREE.Group();

  const moonRadius = 0.32;
  const moonGeometry = new THREE.SphereGeometry(moonRadius, 48, 48);

  const moonMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffffff),
    map: textures.moonAlbedo || null,
    bumpMap: textures.moonAlbedo || null,
    bumpScale: 0.028,
    roughness: 0.62,
    metalness: 0.04,
    emissive: new THREE.Color(0x4b5563),
    emissiveIntensity: 0.45,
  });

  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.userData = { bodyId: 'moon' };
  moonGroup.add(moonMesh);

  const sharedRingGeo = new THREE.RingGeometry(0.008, 0.018, 16);
  const sharedApolloCoreGeo = new THREE.SphereGeometry(0.0055, 8, 8);
  const sharedDefaultCoreGeo = new THREE.SphereGeometry(0.0042, 8, 8);
  const sharedHitboxGeo = new THREE.SphereGeometry(0.032, 6, 6);
  const sharedHitboxMat = new THREE.MeshBasicMaterial({ visible: false });

  const landmarkGroup = new THREE.Group();
  const pulsingRings = [];
  const beaconBeams = [];
  const pinContainers = [];
  const disposableResources = [
    sharedRingGeo,
    sharedApolloCoreGeo,
    sharedDefaultCoreGeo,
    sharedHitboxGeo,
    sharedHitboxMat,
  ];

  for (const lm of ALL_LUNAR_LOCATIONS) {
    const coords = selenographicToCartesian(
      lm.selenographic.latitudeDeg,
      lm.selenographic.longitudeDeg,
      moonRadius
    );
    const posVec = new THREE.Vector3(coords.x, coords.y, coords.z);
    const norm = posVec.clone().normalize();
    const isApollo = lm.category === 'apollo';
    const isRobotic = lm.category === 'robotic';

    const colorHex = lm.pinColor
      ? new THREE.Color(lm.pinColor).getHex()
      : isApollo
      ? 0xf5d000
      : isRobotic
      ? 0x10b981
      : 0x38bdf8;

    const colorCss = isApollo ? '#f5d000' : isRobotic ? '#10b981' : '#38bdf8';

    const pinContainer = new THREE.Group();
    pinContainer.position.copy(posVec);
    pinContainer.userData = { landmarkId: lm.id, bodyId: 'moon' };

    const beamHeight = isApollo ? 0.075 : 0.055;
    const beamGeo = new THREE.CylinderGeometry(0.003, 0.0045, beamHeight, 6);
    const beamMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    disposableResources.push(beamGeo, beamMat);

    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.copy(norm).multiplyScalar(beamHeight * 0.5);
    beam.quaternion.setFromUnitVectors(_upAxis, norm);
    beam.userData = { landmarkId: lm.id, bodyId: 'moon' };
    pinContainer.add(beam);
    beaconBeams.push({ mesh: beam, id: lm.id });

    const ringMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    disposableResources.push(ringMat);

    const ring = new THREE.Mesh(sharedRingGeo, ringMat);
    ring.position.copy(norm).multiplyScalar(0.002);
    ring.quaternion.setFromUnitVectors(_zAxis, norm);
    ring.userData = { landmarkId: lm.id, bodyId: 'moon' };
    pinContainer.add(ring);
    pulsingRings.push(ring);

    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: false,
    });
    disposableResources.push(coreMat);

    const coreMesh = new THREE.Mesh(
      isApollo ? sharedApolloCoreGeo : sharedDefaultCoreGeo,
      coreMat
    );
    coreMesh.position.copy(norm).multiplyScalar(beamHeight);
    coreMesh.renderOrder = 1000;
    coreMesh.userData = { landmarkId: lm.id, bodyId: 'moon' };
    pinContainer.add(coreMesh);

    const badgeText = isApollo
      ? lm.mission.replace('Apollo ', 'A')
      : lm.mission || lm.name.split(' ')[0];
    const subBadge = isApollo ? 'APOLLO' : isRobotic ? 'LANDER' : 'MARE';
    const badgeTexture = createLunarBadgeCanvas(badgeText, subBadge, colorCss);
    const spriteMat = new THREE.SpriteMaterial({
      map: badgeTexture,
      transparent: true,
      depthTest: false,
    });
    disposableResources.push(badgeTexture, spriteMat);

    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(norm).multiplyScalar(beamHeight + 0.028);
    sprite.scale.set(0.07, 0.024, 1);
    sprite.renderOrder = 1001;
    sprite.userData = { landmarkId: lm.id, bodyId: 'moon' };
    pinContainer.add(sprite);

    const hitbox = new THREE.Mesh(sharedHitboxGeo, sharedHitboxMat);
    hitbox.position.copy(norm).multiplyScalar(beamHeight * 0.5);
    hitbox.userData = { landmarkId: lm.id, bodyId: 'moon' };
    pinContainer.add(hitbox);

    landmarkGroup.add(pinContainer);
    pinContainers.push({ id: lm.id, pinContainer });
  }

  moonMesh.add(landmarkGroup);

  const orbitRadius = 2.05;
  const inclinationAngle = 5.145 * (Math.PI / 180);
  const orbitPoints = [];
  const segments = 96;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * orbitRadius;
    const z = Math.sin(theta) * Math.cos(inclinationAngle) * orbitRadius;
    const y = Math.sin(theta) * Math.sin(inclinationAngle) * orbitRadius;
    orbitPoints.push(new THREE.Vector3(x, y, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0xfde047,
    transparent: true,
    opacity: 0.45,
  });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

  let currentOrbitAngle = 0.85;
  let simulationTime = 0;
  const _pinWorldPos = new THREE.Vector3();
  const _pinNormal = new THREE.Vector3();
  const _toCam = new THREE.Vector3();

  return {
    group: moonGroup,
    mesh: moonMesh,
    material: moonMaterial,
    landmarkGroup,
    orbitLine,
    orbitRadius,
    radius: moonRadius,
    getOrbitAngle() {
      return currentOrbitAngle;
    },
    setOrbitalState(moonState, earthPos) {
      if (earthPos) {
        orbitLine.position.set(earthPos.x, earthPos.y, earthPos.z);
      }
      if (moonState) {
        currentOrbitAngle = moonState.angleRad;
        moonMesh.position.set(
          moonState.position.x,
          moonState.position.y,
          moonState.position.z
        );
        moonMesh.rotation.y = currentOrbitAngle + Math.PI * 0.5;
      }
    },
    update(dt, isPaused = false, selectedLandmarkId = null, camera = null) {
      if (!isPaused) {
        simulationTime += dt;
      }

      if (landmarkGroup.visible && camera) {
        moonMesh.updateWorldMatrix(true, false);
        for (let i = 0; i < pinContainers.length; i++) {
          const { id, pinContainer } = pinContainers[i];
          pinContainer.getWorldPosition(_pinWorldPos);
          _pinNormal.copy(_pinWorldPos).sub(moonMesh.position).normalize();
          _toCam.copy(camera.position).sub(_pinWorldPos).normalize();
          pinContainer.visible =
            id === selectedLandmarkId || _pinNormal.dot(_toCam) > 0.08;
        }
      }

      if (!isPaused) {
        for (let idx = 0; idx < pulsingRings.length; idx++) {
          const ring = pulsingRings[idx];
          const wave = Math.sin(simulationTime * 3.5 + idx * 0.9);
          const pulse = 1.0 + wave * 0.35;
          ring.scale.set(pulse, pulse, 1);
          ring.material.opacity = 0.45 + wave * 0.4;
        }
      }

      for (let i = 0; i < beaconBeams.length; i++) {
        const { mesh, id } = beaconBeams[i];
        if (selectedLandmarkId === id) {
          const surge = 1.8 + Math.sin(simulationTime * 5.0) * 0.4;
          mesh.scale.set(1.4, surge, 1.4);
          mesh.material.opacity = 1.0;
        } else {
          mesh.scale.set(1.0, 1.0, 1.0);
          mesh.material.opacity = 0.9;
        }
      }

      if (textures.moonAlbedo && moonMaterial.map !== textures.moonAlbedo) {
        moonMaterial.map = textures.moonAlbedo;
        moonMaterial.bumpMap = textures.moonAlbedo;
        moonMaterial.needsUpdate = true;
      }
    },
    setOrbitVisibility(visible) {
      orbitLine.visible = visible;
    },
    setLandmarksVisibility(visible) {
      landmarkGroup.visible = visible;
    },
    getPosition() {
      return moonMesh.position;
    },
    getLandmarkPosition(landmarkId, outVec = new THREE.Vector3()) {
      const lm = ALL_LUNAR_LOCATIONS.find((l) => l.id === landmarkId);
      if (!lm) return null;
      const coords = selenographicToCartesian(
        lm.selenographic.latitudeDeg,
        lm.selenographic.longitudeDeg,
        moonRadius
      );
      outVec.set(coords.x, coords.y, coords.z);
      outVec.applyEuler(moonMesh.rotation);
      outVec.add(moonMesh.position);
      return outVec;
    },
    dispose() {
      moonGeometry.dispose();
      moonMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      for (const res of disposableResources) {
        res.dispose();
      }
    },
  };
}
/* --- End of moon.js --- */
