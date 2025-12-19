import { Signal, useSignal } from "@preact/signals";
import { HandPose } from "../models/HandPose.ts";
import { CallibrationDataset, CallibrationDatasetEntry } from "../models/Callibration.ts";
import { CountingMethod } from "../util/countingMethods/CountingMethod.ts";

export interface UseCallibratorParams {
  countingMethod: Signal<CountingMethod>;
}

export function useCallibrator({
  countingMethod,
}: UseCallibratorParams) {
  const callibrationDataset = useSignal<CallibrationDataset>([]);

  function addEntry(handPose: HandPose, digit: number) {
    const handStates = countingMethod.peek().valueToHandStates(digit);
    if (!handStates) return;
    const handState = handStates[handPose.handedness];
    if (!handState) return;

    const newEntry: CallibrationDatasetEntry = [
      [
        handPose.fingerAngles.thumb,
        handPose.fingerAngles.indexFinger,
        handPose.fingerAngles.middleFinger,
        handPose.fingerAngles.ringFinger,
        handPose.fingerAngles.pinkyFinger,
      ],
      [
        handState.fingerStates.thumb,
        handState.fingerStates.indexFinger,
        handState.fingerStates.middleFinger,
        handState.fingerStates.ringFinger,
        handState.fingerStates.pinkyFinger,
      ],
    ];
    callibrationDataset.value = [
      ...(callibrationDataset.value),
      newEntry,
    ];
    (globalThis as {[k in string]: unknown}).callibrationDataset = callibrationDataset.value;
  }
  return {
    callibrationDataset,
    addEntry,
  }
}