import { Signal } from "@preact/signals";
import { HandState, HandStates } from "../models/HandStates.ts";

interface HandStateDisplayProps {
  handStates: Signal<HandStates>;
}

export function HandStateDisplay(
  { handStates }: HandStateDisplayProps,
) {
  return (
    <div class="flex flex-row gap-4 w-fit h-fit text-white">
      <div class="flex flex-col items-center">
        <div class="font-bold mb-2">L</div>
        <HandStateDisplayHand
          handState={handStates.value.left}
          handedness="left"
        />
      </div>
      <div class="flex flex-col items-center">
        <div class="font-bold mb-2">R</div>
        <HandStateDisplayHand
          handState={handStates.value.right}
          handedness="right"
        />
      </div>
    </div>
  );
}

interface HandStateDisplayHandProps {
  handState: HandState | null;
  handedness: Handedness;
}

function HandStateDisplayHand(
  { handState, handedness }: HandStateDisplayHandProps,
) {
  const flexDirection = handedness === "right" ? "flex-row" : "flex-row-reverse";
  const fingerStates: [FingerType, boolean][] = [
    ["thumb", handState?.fingerStates.thumb ?? false],
    ["indexFinger", handState?.fingerStates.indexFinger ?? false],
    ["middleFinger", handState?.fingerStates.middleFinger ?? false],
    ["ringFinger", handState?.fingerStates.ringFinger ?? false],
    ["pinkyFinger", handState?.fingerStates.pinkyFinger ?? false],
  ]
  return (
    <div class={`flex ${flexDirection} w-20 h-30 items-stretch gap-1`}>
      {fingerStates.map(([fingerType, isExtended]) => (
        <div key={fingerType} class="flex-1 flex flex-col justify-end items-center gap-px">
          {/* Height depends on finger type, either outlined or filled based on extended state */}
          <div class="flex-1 w-full flex items-stretch flex-col justify-end">
            <div
              class={`relative rounded-full ${isExtended ? "bg-white" : "border border-white"} `}
              style={{
                height: `${fingerLengths[fingerType]}%`,
              }}
            />
          </div>
          <div class="text-center text-sm overflow-visible">
            {fingerLabels[fingerType]}
          </div>
        </div>
      ))}
    </div>
  );
}

const fingerLabels: { [k in FingerType]: string } = {
  thumb: "T",
  indexFinger: "I",
  middleFinger: "M",
  ringFinger: "R",
  pinkyFinger: "P",
};

const fingerLengths: { [k in FingerType]: number } = {
  thumb: 50,
  indexFinger: 90,
  middleFinger: 100,
  ringFinger: 90,
  pinkyFinger: 80,
};