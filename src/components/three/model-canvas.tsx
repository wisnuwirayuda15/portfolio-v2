"use client";

import { MODELS } from "@/lib/constants";
import {
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { CanvasLoader } from "./canvas-loader";
import { GltfModel } from "./gltf-model";

/** Warm the drei/three chunk + GLB cache so models appear fast on scroll. */
export function preloadModels() {
  for (const m of Object.values(MODELS)) useGLTF.preload(m);
}

/** Frames the model by its bounding SPHERE (not box), so it never crops at any
 * rotation angle — and recenters it. `margin` adds breathing room (1 = tight). */
function FitToSphere({
  margin,
  children,
}: {
  margin: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  // Fit ONCE per mount + on resize/margin change only. Must NOT run on every
  // render, or scrolling (which re-renders the canvas) snaps the camera back
  // and resets the orbit rotation.
  useLayoutEffect(() => {
    const obj = ref.current;
    if (!obj) return;
    // reset first so re-running (e.g. resize) doesn't accumulate offsets
    obj.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(obj);
    if (box.isEmpty()) return;
    const sphere = box.getBoundingSphere(new THREE.Sphere());

    // recenter so the model sits at the origin (orbit pivots cleanly)
    obj.position.sub(sphere.center);

    // distance so the bounding sphere fits both axes (handles non-square canvas)
    const vFov = (camera.fov * Math.PI) / 180;
    const aspect = size.width / size.height;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const dist = (sphere.radius * margin) / Math.sin(Math.min(vFov, hFov) / 2);

    camera.position.set(0, 0, dist);
    camera.near = Math.max(0.01, dist - sphere.radius * 2);
    camera.far = dist + sphere.radius * 3;
    camera.updateProjectionMatrix();
  }, [camera, margin, size.width, size.height]);

  return <group ref={ref}>{children}</group>;
}

interface ModelCanvasProps {
  url: string;
  monochrome?: string;
  /** idle camera-orbit speed; manual drag always works and resumes after */
  autoRotateSpeed?: number;
  /** framing padding: 1 = tight, higher = more space around the model */
  margin?: number;
}

/** Generic R3F canvas for one .glb. Bounding-sphere framing keeps the whole
 * model in view at every rotation; OrbitControls gives manual drag + idle spin. */
export function ModelCanvas({
  url,
  monochrome,
  autoRotateSpeed = 0.6,
  margin = 1.15,
}: ModelCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, toneMappingExposure: 1.15 }}
    >
      {/* soft base fill + a single key light; the Environment does the heavy
          lifting for realistic reflections */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />

      {/* in-memory studio IBL (no network) — gives PBR materials real reflections */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer
            intensity={3}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
          <Lightformer
            intensity={1.2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={[10, 2, 1]}
          />
          <Lightformer
            intensity={1.2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={[20, 2, 1]}
          />
          <Lightformer
            intensity={2}
            color="#aab4ff"
            position={[0, 3, 5]}
            scale={[10, 5, 1]}
          />
        </group>
      </Environment>

      <Suspense fallback={<CanvasLoader />}>
        <FitToSphere margin={margin}>
          <GltfModel url={url} monochrome={monochrome} />
        </FitToSphere>
      </Suspense>
      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        enableDamping
        autoRotate
        autoRotateSpeed={autoRotateSpeed}
      />
    </Canvas>
  );
}
