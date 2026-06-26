"use client";

import { useEffect, useRef } from "react";
import { Center, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

interface GltfModelProps {
  url: string;
  /** override all materials with a matte monochrome standard material */
  monochrome?: string;
}

/** Loads a .glb, centers it, plays any embedded animations, and optionally
 * recolors it monochrome. Sizing/framing is handled by <Bounds> in ModelCanvas. */
export function GltfModel({ url, monochrome }: GltfModelProps) {
  const rig = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, rig);

  // play every embedded clip
  useEffect(() => {
    for (const action of Object.values(actions)) action?.reset().play();
  }, [actions]);

  // material pass: monochrome override gets a glossy PBR look; original
  // materials get their reflections boosted to read off the Environment.
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (monochrome) {
        mesh.material = new THREE.MeshStandardMaterial({
          color: monochrome,
          roughness: 0.3,
          metalness: 0.6,
          envMapIntensity: 1.3,
        });
      } else {
        for (const mat of Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]) {
          if (mat && "envMapIntensity" in mat) {
            (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.2;
          }
        }
      }
    });
  }, [scene, monochrome]);

  return (
    <group ref={rig}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}
