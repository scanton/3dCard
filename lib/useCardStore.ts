"use client";

import { create } from "zustand";

export type CardState =
  | "closed-front"
  | "opening"
  | "open"
  | "closing-to-front"
  | "closing-to-back"
  | "closed-back";

type Vec3 = [number, number, number];

type CardStore = {
  cardState: CardState;
  animationGoal: CardState | null;
  leafTargets: {
    left: number;
    right: number;
  };
  cameraPosition: Vec3;
  cameraTarget: Vec3;
  cameraAnimating: boolean;
  openFromFront: () => void;
  openFromBack: () => void;
  closeToFront: () => void;
  closeToBack: () => void;
  resetView: () => void;
  completeGoal: () => void;
  completeCameraReset: () => void;
};

export const DEFAULT_CAMERA_POSITION: Vec3 = [0, 1.25, 3.6];
export const DEFAULT_CAMERA_TARGET: Vec3 = [0, 0.7, 0];

const closedFrontRotations = () => ({ left: 0, right: 0 });
const openRotations = () => ({ left: 0, right: -Math.PI });
const closedBackRotations = () => ({ left: Math.PI, right: -Math.PI });

export const useCardStore = create<CardStore>((set, get) => ({
  cardState: "closed-front",
  animationGoal: null,
  leafTargets: closedFrontRotations(),
  cameraPosition: [...DEFAULT_CAMERA_POSITION],
  cameraTarget: [...DEFAULT_CAMERA_TARGET],
  cameraAnimating: false,

  // Each action moves the card through the finite state machine described in the brief.
  // animationGoal records the settled state we should reach once the tween finishes.
  openFromFront: () => {
    if (get().cardState !== "closed-front") return;
    set({
      cardState: "opening",
      animationGoal: "open",
      leafTargets: openRotations(),
    });
  },

  openFromBack: () => {
    if (get().cardState !== "closed-back") return;
    set({
      cardState: "opening",
      animationGoal: "open",
      leafTargets: openRotations(),
    });
  },

  closeToFront: () => {
    if (get().cardState !== "open") return;
    set({
      cardState: "closing-to-front",
      animationGoal: "closed-front",
      leafTargets: closedFrontRotations(),
    });
  },

  closeToBack: () => {
    if (get().cardState !== "open") return;
    set({
      cardState: "closing-to-back",
      animationGoal: "closed-back",
      leafTargets: closedBackRotations(),
    });
  },

  // Resets both camera and card back to the front-closed resting pose.
  resetView: () => {
    const nextState =
      get().cardState === "closed-front" ? "closed-front" : "closing-to-front";
    set({
      cardState: nextState,
      animationGoal: "closed-front",
      leafTargets: closedFrontRotations(),
      cameraPosition: [...DEFAULT_CAMERA_POSITION],
      cameraTarget: [...DEFAULT_CAMERA_TARGET],
      cameraAnimating: true,
    });
  },

  completeGoal: () => {
    const goal = get().animationGoal;
    if (!goal) return;
    set({
      cardState: goal,
      animationGoal: null,
    });
  },

  completeCameraReset: () => {
    if (!get().cameraAnimating) return;
    set({ cameraAnimating: false });
  },
}));
