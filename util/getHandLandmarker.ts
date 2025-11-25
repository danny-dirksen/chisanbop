import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

type HandPoseDetectionStatus =
  | { type: "init" }
  | { type: "loadingFilesetResolver" }
  | { type: "loadingHandLandmarker" }
  | { type: "loaded"; handLandmarker: HandLandmarker }
  | { type: "failed"; error: Error };

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
export async function loadHandLandmarker(
  onStatusChange?: (status: HandPoseDetectionStatus) => void,
): Promise<HandLandmarker | Error> {
  try {
    // Get fileset resolver.
    onStatusChange?.({ type: "loadingFilesetResolver" });
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
    );

    // Get landmarker.
    onStatusChange?.({ type: "loadingHandLandmarker" });
    const handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        // delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
      canvas: document.createElement("canvas"),
    });

    // Return it.
    onStatusChange?.({ type: "loaded", handLandmarker });
    return handLandmarker;
  } catch (e: unknown) {
    // If an error occurs, notify any listeners.
    const error = new Error("Failed to load hand landmarker.", { cause: e });
    onStatusChange?.({ type: "failed", error });
    return error;
  }
}
