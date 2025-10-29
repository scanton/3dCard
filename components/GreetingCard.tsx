"use client";

import { SpringValue } from "@react-spring/core";
import { a } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  FrontSide,
  MeshPhysicalMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  Texture,
} from "three";
import {
  CARD_HEIGHT,
  CARD_THICKNESS,
  LEAF_WIDTH,
  SURFACE_OFFSET,
} from "@/lib/cardConstants";

type Interaction = {
  enabled: boolean;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
};

type GreetingCardProps = {
  interiorVisible: boolean;
  leftRotation: SpringValue<number>;
  rightRotation: SpringValue<number>;
  interactions: {
    front: Interaction;
    back: Interaction;
    insideLeft: Interaction;
    insideRight: Interaction;
  };
};

const configureTexture = (texture: Texture) => {
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = false;
  texture.anisotropy = 8;
  return texture;
};

const createCardMaterial = (texture: Texture) => {
  const material = new MeshPhysicalMaterial({
    map: texture,
    roughness: 0.8,
    metalness: 0,
    side: FrontSide,
    clearcoat: 0.05,
    clearcoatRoughness: 0.7,
    polygonOffset: true,
    polygonOffsetFactor: -0.2,
    polygonOffsetUnits: -0.2,
  });
  return material;
};

const GreetingCard = ({
  interiorVisible,
  leftRotation,
  rightRotation,
  interactions,
}: GreetingCardProps) => {
  const textures = useTexture({
    front: "/images/card-front.png",
    back: "/images/card-back.png",
    insideLeft: "/images/card-inside-left.png",
    insideRight: "/images/card-inside-right.png",
  });

  useEffect(() => {
    Object.values(textures).forEach(configureTexture);
  }, [textures]);

  const leafGeometry = useMemo(() => new PlaneGeometry(LEAF_WIDTH, CARD_HEIGHT), []);

  useEffect(() => () => leafGeometry.dispose(), [leafGeometry]);

  const frontMaterial = useMemo(
    () => createCardMaterial(textures.front),
    [textures.front]
  );
  const backMaterial = useMemo(() => createCardMaterial(textures.back), [textures.back]);
  const insideLeftMaterial = useMemo(
    () => createCardMaterial(textures.insideLeft),
    [textures.insideLeft]
  );
  const insideRightMaterial = useMemo(
    () => createCardMaterial(textures.insideRight),
    [textures.insideRight]
  );

  useEffect(() => {
    return () => {
      frontMaterial.dispose();
      backMaterial.dispose();
      insideLeftMaterial.dispose();
      insideRightMaterial.dispose();
    };
  }, [frontMaterial, backMaterial, insideLeftMaterial, insideRightMaterial]);

  const outsideZ = CARD_THICKNESS / 2 + SURFACE_OFFSET;
  const insideZ = -CARD_THICKNESS / 2 - SURFACE_OFFSET;
  const halfLeaf = LEAF_WIDTH / 2;

  const renderInteractionProps = (interaction: Interaction) =>
    interaction.enabled
      ? {
          onPointerOver: interaction.onPointerOver,
          onPointerOut: interaction.onPointerOut,
          onClick: interaction.onClick,
        }
      : {
          onPointerOver: interaction.onPointerOver,
          onPointerOut: interaction.onPointerOut,
          onClick: undefined,
        };

  return (
    <group>
      {/* Left leaf pivots around the spine at x = 0; geometry offset keeps the hinge stable. */}
      <a.group rotation-y={leftRotation}>
        <mesh
          name="back-cover"
          position={[-halfLeaf, 0, outsideZ]}
          rotation={[0, Math.PI, 0]}
          geometry={leafGeometry}
          material={backMaterial}
          castShadow
          receiveShadow
          {...renderInteractionProps(interactions.back)}
        />
        <mesh
          name="inside-left"
          position={[-halfLeaf, 0, insideZ]}
          geometry={leafGeometry}
          material={insideLeftMaterial}
          castShadow
          receiveShadow
          visible={interiorVisible}
          {...renderInteractionProps(interactions.insideLeft)}
        />
      </a.group>

      {/* Right leaf pivots around the same spine; positive rotations close, negative open. */}
      <a.group rotation-y={rightRotation}>
        <mesh
          name="front-cover"
          position={[halfLeaf, 0, outsideZ]}
          geometry={leafGeometry}
          material={frontMaterial}
          castShadow
          receiveShadow
          {...renderInteractionProps(interactions.front)}
        />
        <mesh
          name="inside-right"
          position={[halfLeaf, 0, insideZ]}
          rotation={[0, Math.PI, 0]}
          geometry={leafGeometry}
          material={insideRightMaterial}
          castShadow
          receiveShadow
          visible={interiorVisible}
          {...renderInteractionProps(interactions.insideRight)}
        />
      </a.group>
    </group>
  );
};

export default GreetingCard;
