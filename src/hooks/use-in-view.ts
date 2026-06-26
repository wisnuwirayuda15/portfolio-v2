import * as React from "react";

interface Options {
  rootMargin?: string;
  /** stay "in view" after first intersection (for one-shot reveals) */
  once?: boolean;
}

/** Returns [ref, inView]. Reliable IntersectionObserver gate for mounting
 * heavy content (WebGL) and driving scroll reveals. */
export function useInView<T extends Element = HTMLDivElement>(
  options: string | Options = {},
): [React.RefObject<T | null>, boolean] {
  const opts = typeof options === "string" ? { rootMargin: options } : options;
  const { rootMargin = "0px", once = false } = opts;
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fail open: if IO is unavailable, reveal immediately (never hide content).
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    // Above-the-fold content reveals synchronously — never wait on IO for what's
    // already visible at mount (robust even if IO callbacks are delayed/throttled).
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true);
      if (once) return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
