/** DOM spinner shown while the 3D bundle chunk downloads (outside the canvas). */
export function ModelLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <span className="size-8 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground/70 motion-reduce:animate-none" />
    </div>
  );
}
