import { useRef } from "react";

/** Pointer-tracking CSS-3D tilt (no WebGL). No-op on touch / no-hover devices.
 * Spread the returned handlers on the element and apply `ref` to it. */
export function useTilt(strength = 5) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return { ref, onMove, onLeave };
}
