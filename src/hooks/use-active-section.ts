import * as React from "react";

/** Tracks which section id is currently in view, for nav highlighting.
 * Pass a stable (module-scope) array to avoid re-subscribing each render. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0] ?? "");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
