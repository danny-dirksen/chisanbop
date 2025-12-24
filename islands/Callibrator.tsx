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
  const {
    digit,
    digitHandState,
    addEntry,
    callibrationDataset,
  } = useCallibrator({ countingMethod });

  // Handpose getter, keeps up-to-date every frame
  const handPose = useSignal<HandPose | null>(null);
  useEveryFrame(() => handPose.value = handPoses.value.right);
  const addEntryButton = useComputed(() => {
    const handPoseValue = handPose.value;
    return <button
      className="disabled:opacity-30 !disabled:cursor-pointer"
      type="button"
      onClick={handPoseValue ? (() => addEntry(handPoseValue)) : undefined}
      disabled={handPoseValue === null}
    >Add entry</button>;
  });

  const stringifiedHandState = useComputed(() => JSON.stringify(digitHandState.value, null, 2));
  // Content to copy
  const stringifiedDataset = useComputed(() => JSON.stringify(callibrationDataset.value, null, 2));

  return (
    <div className="h-full w-80 mr-auto p-4 gap-4 bg-black/80 text-white overflow-hidden flex flex-col">
      <input type="number" name="" id="" value={digit} onChange={e => digit.value = Number(e.currentTarget.value)} />
      <div>{useComputed(() => callibrationDataset.value.length)} Entries</div>
      {addEntryButton}

      <h2 className="mt-4 mb-2 font-bold">Current Hand State:</h2>
      <code className="flex-1 overflow-auto text-sm whitespace-pre">
        {stringifiedHandState}
      </code>

      <h2 className="mt-4 mb-2 font-bold">Dataset (click to copy):</h2>
      <code
        className="flex-1 overflow-auto cursor-copy text-sm whitespace-pre"
        onClick={() => navigator.clipboard.writeText(stringifiedDataset.value)}
      >
        {stringifiedDataset}
      </code>
    </div>
  );
}