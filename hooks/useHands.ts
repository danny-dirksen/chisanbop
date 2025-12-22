import { RefObject } from "preact";
import { HandCallibration } from "../models/Callibration.ts";
import { getHandStates, HandStates } from "../models/HandStates.ts";
import { HandPoses } from "../models/HandPoses.ts";
import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { HandLandmarker } from "@mediapipe/tasks-vision";
import { useSignalRef } from "@preact/signals/utils";

interface UseHandsProps {
  handLandmarker: Signal<HandLandmarker | Error | undefined>;
  videoRef: RefObject<HTMLVideoElement | null>;
  calibration: Signal<HandCallibration>;
}

interface UseHandsOutput {
  /** Mutable, non-reactive(Caution!) */
  readonly handPoses: SignalRefObject<HandPoses>;
  /** Immutable, reactive */
  readonly handStates: Signal<HandStates>;
}

export function useHands(
  { handLandmarker, videoRef, calibration }: UseHandsProps,
): UseHandsOutput {
  const handPoses = useSignalRef<HandPoses>(new HandPoses());
  const handStates = useSignal<HandStates>({
    right: null,
    left: null,
  });

  useSignalEffect(() => {
    const video = videoRef.current;
    const landmarker = handLandmarker.value;
    if (!video || !landmarker || landmarker instanceof Error) return;
    let callbackNumber: number;
    const everyframe = (timestamp: number) => {
      const hands = landmarker.detectForVideo(video, timestamp);
      // in-place operation. Assignment is used to update signal.
      handPoses.value.update(hands, true);
      const newHandStates = getHandStates(
        handPoses.value,
        calibration.value,
        handStates.value,
      );
      if (newHandStates !== handStates.value) {
        handStates.value = newHandStates;
      }
      callbackNumber = video.requestVideoFrameCallback(everyframe);
    };
    callbackNumber = video.requestVideoFrameCallback(everyframe);

    return () => video.cancelVideoFrameCallback(callbackNumber);
  });

  return {
    handPoses,
    handStates,
  };
}