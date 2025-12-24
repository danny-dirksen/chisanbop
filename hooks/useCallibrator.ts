import { Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
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
  const digit = useSignal(0);
  const digitHandState = useComputed(() => {
    return countingMethod.value.valueToHandStates(digit.value)?.right ?? null;
  });
  useSignalEffect(() => console.log(digit.value, digitHandState.value));

  function addEntry(handPose: HandPose) {
    if (digitHandState.value === null) return;

    const newEntry: CallibrationDatasetEntry = [
      [
        handPose.fingerAngles.thumb,
        handPose.fingerAngles.indexFinger,
        handPose.fingerAngles.middleFinger,
        handPose.fingerAngles.ringFinger,
        handPose.fingerAngles.pinkyFinger,
      ],
      [
        digitHandState.value.fingerStates.thumb,
        digitHandState.value.fingerStates.indexFinger,
        digitHandState.value.fingerStates.middleFinger,
        digitHandState.value.fingerStates.ringFinger,
        digitHandState.value.fingerStates.pinkyFinger,
      ],
    ];
    callibrationDataset.value = [
      ...(callibrationDataset.value),
      newEntry,
    ];
    (globalThis as {[k in string]: unknown}).callibrationDataset = callibrationDataset.value;
  }
  return {
    digit,
    digitHandState,
    callibrationDataset,
    addEntry,
  }
}