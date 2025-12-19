import { useCallibrator } from "../hooks/useCallibrator.ts";
import { useEveryFrame } from "../hooks/useEveryframe.ts";
import { HandPose } from "../models/HandPose.ts";
import { HandPoses } from "../models/HandPoses.ts";
import { CHISANBOP_COUNTING_METHOD } from "../util/countingMethods/CountingMethod.ts";
import { Signal, useComputed, useSignal } from "@preact/signals";

export function Callibrator({
  handPoses,
}: {
  handPoses: Signal<HandPoses>,
}) {
  // State
  const countingMethod = useSignal(CHISANBOP_COUNTING_METHOD);
  const digit = useSignal(0);
  const {
    addEntry,
    callibrationDataset,
  } = useCallibrator({ countingMethod });

  // Handpose getter, keeps up-to-date every frame
  const handPose = useSignal<HandPose | null>(null);
  useEveryFrame(() => handPose.value = handPoses.value.left);
  const addEntryButton = useComputed(() => {
    const handPoseValue = handPose.value;
    return <button
      className="disabled:opacity-30 !disabled:cursor-pointer"
      type="button"
      onClick={handPoseValue ? (() => addEntry(handPoseValue, digit.value)) : undefined}
      disabled={handPoseValue === null}
    >Add entry</button>;
  });

  // Content to copy
  const stringifiedDataset = useComputed(() => JSON.stringify(callibrationDataset.value, null, 2));

  return (
    <div className="h-full w-80 mr-auto p-4 gap-4 bg-black/80 text-white overflow-hidden flex flex-col">
      <input type="number" name="" id="" value={digit} />
      <div>{useComputed(() => callibrationDataset.value.length)} Entries</div>
      {addEntryButton}
      <code
        className="flex-1 overflow-auto cursor-copy text-sm whitespace-pre"
        onClick={() => navigator.clipboard.writeText(stringifiedDataset.value)}
      >
        {stringifiedDataset}
      </code>
    </div>
  );
}