import { usePerformanceMode } from "@/hooks/use-performance-mode";

interface ModelFallbackProps {
  image?: string;
  alt?: string;
}

/** Shared static fallback for every 3D scene — a black sphere matching the hero.
 * Shown before reveal, in Lite Mode, and during model load. Fills its container. */
export function ModelFallback({ image, alt = "Visual representation" }: ModelFallbackProps) {
  const { isLiteMode } = usePerformanceMode();

  if (isLiteMode && image) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div
        className="aspect-square w-[70%] max-w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, #4a4942 0%, #1c1b16 45%, #0c0b08 100%)",
          boxShadow: "0 40px 120px -30px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}
