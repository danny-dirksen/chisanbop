import type { createDetector, SupportedModels } from "@tensorflow-models/hand-pose-detection";

type HandPoseDetection = typeof import("@tensorflow-models/hand-pose-detection");
interface HandPoseDetectionExports {
  createDetector: typeof createDetector;
  SupportedModels: typeof SupportedModels;
}

declare global {
  var handPoseDetection: HandPoseDetection | undefined;
}

export async function loadHandPoseDetection(): Promise<HandPoseDetectionExports>  {
  // Import tf core and unwrap a possible default export from CDN shims.
  const _tfCoreMod = await import(
    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"
    // "@tensorflow/tfjs-core"
  );
  // const tf = (tfCoreMod as unknown as { default?: unknown }).default ??
  //   (tfCoreMod as unknown);

  // // Minimal runtime shape for the TF module methods we call.
  // type TfLike = {
  //   setBackend?: (name: string) => Promise<boolean> | boolean;
  //   ready?: () => Promise<void>;
  // };
  // const tfLike = tf as TfLike;

  // Load webgl backend (side-effecting) and attempt to select it.
  await import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl");
  // if (typeof tfLike.setBackend === "function") {
  //   try {
  //     await tfLike.setBackend("webgl");
  //   } catch (err) {
  //     // Not all environments support webgl; warn but continue.
  //     // eslint-disable-next-line no-console
  //     console.warn("tf.setBackend('webgl') failed:", err);
  //   }
  // }
  // if (typeof tfLike.ready === "function") {
  //   try {
  //     await tfLike.ready();
  //   } catch {
  //     // ignore
  //   }
  // }

  // Load mediapipe runtime (side-effect only)
  await import("https://cdn.jsdelivr.net/npm/@mediapipe/hands");

  await import(
    "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"
    // "@tensorflow-models/hand-pose-detection"
  );

  if (handPoseDetection === undefined) {
    throw new Error("Failed to load @tensorflow-models/hand-pose-detection");
  }

  return handPoseDetection;
}
