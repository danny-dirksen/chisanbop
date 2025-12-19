import { useEffect } from "preact/hooks";

/**
 * Calls `fn` on every frame
 * @param fn callback to run every animation frame
 * @param deps effect dependency array
 */
export function useEveryFrame(fn: () => void, deps?: unknown[]) {
  useEffect(() => {
    let id: number;
    const everyFrame = () => {
      fn();
      id = requestAnimationFrame(everyFrame);
    }
    everyFrame();
    return () => cancelAnimationFrame(id);
  }, deps);
}