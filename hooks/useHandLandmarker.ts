import { Signal, useSignal } from "@preact/signals";
import { loadHandLandmarker } from "../util/getHandLandmarker.ts";
import { useEffect } from "preact/hooks";
import { HandLandmarker } from "@mediapipe/tasks-vision";

function useSignalAsync<T>(
  factory: () => Promise<T>,
  deps: unknown[],
): Signal<T | undefined> {
  const result = useSignal<T | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    factory().then((v) => {
      if (isMounted) result.value = v;
    });
    return () => {
      isMounted = false;
    };
  }, deps);

  return result;
}

export function useHandLandmarker(): Signal<
  HandLandmarker | Error | undefined
> {
  return useSignalAsync<HandLandmarker | Error>(loadHandLandmarker, []);
}
