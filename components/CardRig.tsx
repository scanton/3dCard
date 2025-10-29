"use client";

import { a, useSpring } from "@react-spring/three";
import { useMemo, useState, useEffect, useRef } from "react";
import { useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import GreetingCard from "./GreetingCard";
import { useCardStore } from "@/lib/useCardStore";
import { CARD_HEIGHT } from "@/lib/cardConstants";
import type { CardState } from "@/lib/useCardStore";

type HoverTarget = "front" | "inside-left" | "inside-right" | "back" | null;

const isInteriorVisible = (state: CardState) =>
  state === "open" ||
  state === "opening" ||
  state === "closing-to-front" ||
  state === "closing-to-back";

const CardRig = () => {
  const leafTargets = useCardStore((state) => state.leafTargets);
  const cardState = useCardStore((state) => state.cardState);
  const openFromFront = useCardStore((state) => state.openFromFront);
  const openFromBack = useCardStore((state) => state.openFromBack);
  const closeToFront = useCardStore((state) => state.closeToFront);
  const closeToBack = useCardStore((state) => state.closeToBack);
  const completeGoal = useCardStore((state) => state.completeGoal);

  const springConfig = useMemo(() => ({ mass: 1, tension: 190, friction: 24 }), []);

  const [{ leftRotation, rightRotation }, api] = useSpring(() => ({
    leftRotation: leafTargets.left,
    rightRotation: leafTargets.right,
    config: springConfig,
  }));

  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      api.set({
        leftRotation: leafTargets.left,
        rightRotation: leafTargets.right,
      });
      hasMounted.current = true;
      return;
    }

    api.start({
      leftRotation: leafTargets.left,
      rightRotation: leafTargets.right,
      config: springConfig,
      onRest: completeGoal,
    });
  }, [leafTargets.left, leafTargets.right, api, springConfig, completeGoal]);

  const [hoverTarget, setHoverTarget] = useState<HoverTarget>(null);
  useCursor(Boolean(hoverTarget), "pointer");

  const frontEnabled = cardState === "closed-front";
  const backEnabled = cardState === "closed-back";
  const insideEnabled = cardState === "open";
  const interiorVisible = isInteriorVisible(cardState);

  useEffect(() => {
    setHoverTarget((current) => {
      if (!frontEnabled && current === "front") return null;
      if (!backEnabled && current === "back") return null;
      if (!insideEnabled && (current === "inside-left" || current === "inside-right")) {
        return null;
      }
      return current;
    });
  }, [frontEnabled, insideEnabled, backEnabled]);

  const handleFrontClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (frontEnabled) {
      openFromFront();
    }
  };

  const handleBackClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (backEnabled) {
      openFromBack();
    }
  };

  const handleInsideLeftClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (insideEnabled) {
      closeToFront();
    }
  };

  const handleInsideRightClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (insideEnabled) {
      closeToBack();
    }
  };

  const makePointerOverHandler = (target: HoverTarget, enabled: boolean) => () => {
    if (enabled) {
      setHoverTarget(target);
    }
  };

  const handlePointerOut = (target: HoverTarget) => () => {
    setHoverTarget((current) => (current === target ? null : current));
  };

  return (
    <a.group position-y={CARD_HEIGHT / 2}>
      <GreetingCard
        interiorVisible={interiorVisible}
        leftRotation={leftRotation}
        rightRotation={rightRotation}
        interactions={{
          front: {
            enabled: frontEnabled,
            onClick: handleFrontClick,
            onPointerOver: makePointerOverHandler("front", frontEnabled),
            onPointerOut: handlePointerOut("front"),
          },
          back: {
            enabled: backEnabled,
            onClick: handleBackClick,
            onPointerOver: makePointerOverHandler("back", backEnabled),
            onPointerOut: handlePointerOut("back"),
          },
          insideLeft: {
            enabled: insideEnabled,
            onClick: handleInsideLeftClick,
            onPointerOver: makePointerOverHandler("inside-left", insideEnabled),
            onPointerOut: handlePointerOut("inside-left"),
          },
          insideRight: {
            enabled: insideEnabled,
            onClick: handleInsideRightClick,
            onPointerOver: makePointerOverHandler("inside-right", insideEnabled),
            onPointerOut: handlePointerOut("inside-right"),
          },
        }}
      />
    </a.group>
  );
};

export default CardRig;
