import { Signal } from "@preact/signals";
import { HandState, HandStates } from "../models/HandStates.ts";

interface HandStateDisplayProps {
  handStates: Signal<HandStates>;
}

export function HandStateDisplay(
  { handStates }: HandStateDisplayProps,
) {
  return (
    <div class="flex flex-row gap-4 w-fit h-fit text-white bg-black/50 p-4 rounded-2xl">
      <div class="flex flex-col items-start">
        {/* <div class="font-bold">L</div> */}
        <HandStateDisplayHand
          handState={handStates.value.left}
          handedness="left"
        />
      </div>
      <div class="flex flex-col items-end">
        {/* <div class="font-bold">R</div> */}
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
    <div class={`flex ${flexDirection} w-20 h-20 items-stretch gap-1`}>
      {fingerStates.map(([fingerType, isExtended]) => (
        <div key={fingerType} class="flex-1 flex flex-col justify-end items-center gap-px">
          {/* Height depends on finger type, either outlined or filled based on extended state */}
          <div class="flex-1 w-full flex items-stretch flex-col justify-end">
            <div
              class={`relative rounded-full ${isExtended ? "bg-white" : "border border-white"} `}
              style={{
                height: `${fingerProperties[fingerType].length}%`,
                bottom: `${fingerProperties[fingerType].elevation}%`,
              }}
            />
          </div>
          {/* <div class="text-center text-sm overflow-visible">
            {fingerProperties[fingerType].label}
          </div> */}
        </div>
      ))}
    </div>
  );
}

const fingerProperties: { [k in FingerType]: { label: string; length: number; elevation: number } } = {
  thumb: { label: "T", length: 40, elevation: 0 },
  indexFinger: { label: "I", length: 60, elevation: 35 },
  middleFinger: { label: "M", length: 70, elevation: 30 },
  ringFinger: { label: "R", length: 70, elevation: 25 },
  pinkyFinger: { label: "P", length: 65, elevation: 20 },
};