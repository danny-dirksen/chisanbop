import { useSignal } from "@preact/signals";
import { DEFAULT_HAND_CALIBRATION } from "../models/Callibration.ts";
import { useHands } from "./useHands.ts";
import { useHandLandmarker } from "./useHandLandmarker.ts";

export function useGame({
  videoRef,
  canvasRef,
}: {
  videoRef: SignalRefObject<HTMLVideoElement | null>;
  canvasRef: SignalRefObject<HTMLCanvasElement | null>;
}) {
  const handLandmarker = useHandLandmarker();
  const calibration = useSignal(DEFAULT_HAND_CALIBRATION);
  const { handPoses, handStates } = useHands({
    handLandmarker,
    calibration,
    videoRef,
  });

  const dispatch = {};

  return {
    videoRef,
    canvasRef,
    handPoses,
    handStates,
    calibration,
    dispatch,
  };
}

export type GameApi = ReturnType<typeof useGame>;
