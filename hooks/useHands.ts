import { type HandDetector } from "@tensorflow-models/hand-pose-detection";
import { useRef } from "preact/hooks";
import { RefObject } from "preact";
import { HandCallibration } from "../models/Callibration.ts";
import { getHandStates, HandStates } from "../models/HandStates.ts";
import { HandPoses } from "../models/HandPoses.ts";
import { Signal, useSignal, useSignalEffect } from "@preact/signals";

interface UseHandsProps {
  detector: Signal<HandDetector | undefined>;
  videoRef: RefObject<HTMLVideoElement | null>;
  calibration: Signal<HandCallibration>;
}

interface UseHandsOutput {
  /** Mutable, non-reactive(Caution!) */
  readonly handPoses?: RefObject<HandPoses>;
  /** Immutable, reactive */
  readonly handStates?: Signal<HandStates>;
}

export function useHands(
  { detector, videoRef, calibration }: UseHandsProps,
): UseHandsOutput {
  const handPoses = useRef<HandPoses>(new HandPoses());
  const handStates = useSignal<HandStates>({
    right: null,
    left: null,
  });

  useSignalEffect(() => {
    let animationFrameId: number;
    async function detectHands() {
      if (detector.value !== undefined && videoRef.current !== null) {
        const video = videoRef.current;
        if (video.readyState === 4) {
          const hands = await detector.value.estimateHands(video);
          handPoses.current.update(hands);
          const newHandStates = getHandStates(
            handPoses.current,
            calibration.value,
            handStates.value,
          );
          if (newHandStates !== handStates.value) {
            handStates.value = newHandStates;
          }
        }
      }
      animationFrameId = requestAnimationFrame(detectHands);
    }
    detectHands();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  });

  return {
    handPoses,
    handStates,
  };
}
