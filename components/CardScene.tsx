"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_TARGET,
  useCardStore,
} from "@/lib/useCardStore";
import CardRig from "./CardRig";

const CAMERA_LERP_ALPHA = 0.15;
const CAMERA_EPSILON = 0.02;

const CardScene = () => {
  const cameraGoal = useCardStore((state) => state.cameraPosition);
  const targetGoal = useCardStore((state) => state.cameraTarget);
  const cameraAnimating = useCardStore((state) => state.cameraAnimating);
  const completeCameraReset = useCardStore((state) => state.completeCameraReset);

  const { camera, controls } = useThree();
  const cameraTargetRef = useRef(new Vector3(...DEFAULT_CAMERA_TARGET));
  const cameraPositionRef = useRef(new Vector3(...DEFAULT_CAMERA_POSITION));

  useEffect(() => {
    camera.position.set(...DEFAULT_CAMERA_POSITION);
    if (controls) {
      controls.target.set(...DEFAULT_CAMERA_TARGET);
      controls.update();
    }
  }, [camera, controls]);

  useEffect(() => {
    cameraPositionRef.current.set(...cameraGoal);
  }, [cameraGoal]);

  useEffect(() => {
    cameraTargetRef.current.set(...targetGoal);
  }, [targetGoal]);

  useFrame(() => {
    if (!controls) return;
    if (cameraAnimating) {
      camera.position.lerp(cameraPositionRef.current, CAMERA_LERP_ALPHA);
      controls.target.lerp(cameraTargetRef.current, CAMERA_LERP_ALPHA);
      controls.update();

      const positionDelta = camera.position.distanceTo(cameraPositionRef.current);
      const targetDelta = controls.target.distanceTo(cameraTargetRef.current);
      if (positionDelta < CAMERA_EPSILON && targetDelta < CAMERA_EPSILON) {
        camera.position.copy(cameraPositionRef.current);
        controls.target.copy(cameraTargetRef.current);
        controls.update();
        completeCameraReset();
      }
    } else if (controls.enableDamping) {
      controls.update();
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[5, 6, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0002}
      />

      <CardRig />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.12}
        rotateSpeed={0.85}
        minPolarAngle={0.5}
        maxPolarAngle={1.35}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
      />
    </>
  );
};

export default CardScene;
