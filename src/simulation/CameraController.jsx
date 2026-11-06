/*
Description: Camera flight controller with WASD thrusters, warp boost, and orbit controls (Plain JavaScript JSX)
*/
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore.js';
import { MARS_MAIN_POSITION } from './Mars.jsx';

const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _moveInput = new THREE.Vector3();
const _targetDest = new THREE.Vector3();
const _idealCamPos = new THREE.Vector3();

export function CameraController({
  earthPositionRef,
  moonPositionRef,
  marsPositionRef,
}) {
  const controlsRef = useRef(null);
  const { camera } = useThree();

  const focusTarget = useSimulationStore((state) => state.focusTarget);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const togglePlay = useSimulationStore((state) => state.togglePlay);
  const setIsWarping = useSimulationStore((state) => state.setIsWarping);
  const setFlightVelocity = useSimulationStore((state) => state.setFlightVelocity);

  const currentTargetPos = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCamOffset = useRef(new THREE.Vector3(0, 8.8, 17.5));
  const manualOffset = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef({});

  useEffect(() => {
    if (focusTarget === 'earth') {
      desiredCamOffset.current.set(0, 0.85, 3.15);
    } else if (focusTarget === 'moon') {
      desiredCamOffset.current.set(0, 0.35, 1.35);
    } else if (focusTarget === 'mars') {
      desiredCamOffset.current.set(0, 0.45, 1.85);
    } else {
      desiredCamOffset.current.set(0, 8.8, 17.5);
    }
    manualOffset.current.set(0, 0, 0);
  }, [focusTarget]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      keys.current[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'Digit1') {
        setFocusTarget('system');
      } else if (e.code === 'Digit2') {
        setFocusTarget('earth');
      } else if (e.code === 'Digit3') {
        setFocusTarget('moon');
      } else if (e.code === 'Digit4') {
        setFocusTarget('mars');
      } else if (e.code === 'KeyR') {
        manualOffset.current.set(0, 0, 0);
        velocity.current.set(0, 0, 0);
      }
    };

    const onKeyUp = (e) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [setFocusTarget, togglePlay]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const isShift = Boolean(keys.current['ShiftLeft'] || keys.current['ShiftRight']);
    setIsWarping(isShift);

    const accel = isShift ? 18.0 : 6.0;
    camera.getWorldDirection(_forward);
    _right.crossVectors(_forward, camera.up).normalize();

    _moveInput.set(0, 0, 0);
    if (keys.current['KeyW'] || keys.current['ArrowUp']) _moveInput.add(_forward);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) _moveInput.sub(_forward);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) _moveInput.add(_right);
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) _moveInput.sub(_right);
    if (keys.current['KeyE']) _moveInput.y += 1;
    if (keys.current['KeyQ']) _moveInput.y -= 1;

    if (_moveInput.lengthSq() > 0) {
      _moveInput.normalize();
      velocity.current.addScaledVector(_moveInput, accel * delta);
    }

    const damping = Math.pow(0.85, delta * 60);
    velocity.current.multiplyScalar(damping);
    manualOffset.current.addScaledVector(velocity.current, delta);

    const baseOrbitalSpeed =
      focusTarget === 'moon' ? 1.02 : focusTarget === 'mars' ? 24.07 : 29.78;
    const currentSpeed = (
      baseOrbitalSpeed +
      velocity.current.length() * (isShift ? 45.0 : 12.0)
    ).toFixed(2);
    setFlightVelocity(parseFloat(currentSpeed));

    _targetDest.set(0, 0, 0);
    if (focusTarget === 'earth' && earthPositionRef?.current) {
      _targetDest.copy(earthPositionRef.current);
    } else if (focusTarget === 'moon' && moonPositionRef?.current) {
      _targetDest.copy(moonPositionRef.current);
    } else if (focusTarget === 'mars' && marsPositionRef?.current) {
      _targetDest.copy(marsPositionRef.current);
    } else if (focusTarget === 'mars') {
      _targetDest.set(MARS_MAIN_POSITION[0], MARS_MAIN_POSITION[1], MARS_MAIN_POSITION[2]);
    }

    currentTargetPos.current.lerp(_targetDest, Math.min(1.0, delta * 4.5));
    controlsRef.current.target.copy(currentTargetPos.current);

    const lerpSpeed = Math.min(1.0, delta * 2.8);
    _idealCamPos
      .copy(currentTargetPos.current)
      .add(desiredCamOffset.current)
      .add(manualOffset.current);

    camera.position.lerp(_idealCamPos, lerpSpeed * 0.45);

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isShift ? 52 : 42;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 4);
      camera.updateProjectionMatrix();
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={0.8}
      maxDistance={55.0}
      rotateSpeed={0.65}
      zoomSpeed={0.8}
      panSpeed={0.5}
      enablePan={false}
    />
  );
}
