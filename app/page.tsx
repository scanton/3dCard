"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CardScene from "@/components/CardScene";
import UiOverlay from "@/components/UiOverlay";
import { DEFAULT_CAMERA_POSITION } from "@/lib/useCardStore";

export default function HomePage() {
  return (
    <>
      <div className="scene-background" />
      <main className="scene-container">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: DEFAULT_CAMERA_POSITION, fov: 45 }}
          gl={{ alpha: true }}
        >
          <Suspense fallback={null}>
            <CardScene />
          </Suspense>
        </Canvas>
        <UiOverlay />
      </main>
    </>
  );
}
