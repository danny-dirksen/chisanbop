import type {
  HandDetector,
  MediaPipeHandsMediaPipeModelConfig,
  MediaPipeHandsModelType,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";
import { useSignal, Signal } from '@preact/signals';
import { loadHandPoseDetection } from "../util/loadHandPoseDetection.ts";
import { useEffect } from "preact/hooks";

export type DetectorConfig = {
  modelType: MediaPipeHandsModelType;
};

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

export function useDetector(config: DetectorConfig): Signal<HandDetector | undefined> {
  return useSignalAsync<HandDetector>(
    async () => {
      // Delegate the CDN dynamic-import and runtime initialization logic to
      // `getCreateDetector`, so bundling behavior is centralized and easier to
      // reason about.
      const { createDetector } = await loadHandPoseDetection();

      const detectorConfig: MediaPipeHandsMediaPipeModelConfig = {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
        modelType: config.modelType,
        maxHands: 2,
      };
      // loaded successfully
      return await createDetector(
        "MediaPipeHands" as SupportedModels,
        detectorConfig,
      );
    },
    [config.modelType],
  );
}
