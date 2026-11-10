/*
Description: Celestial orbital camera controller with smooth target focus and orbit controls (Plain JavaScript JSX)
*/
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore.js';
import { MARS_MAIN_POSITION } from './Mars.jsx';

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

  const currentTargetPos = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCamOffset = useRef(new THREE.Vector3(0, 8.8, 17.5));

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
  }, [focusTarget]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

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
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [setFocusTarget, togglePlay]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

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
      .add(desiredCamOffset.current);

    camera.position.lerp(_idealCamPos, lerpSpeed * 0.45);

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
