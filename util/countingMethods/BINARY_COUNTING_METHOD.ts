import { createLinearCountingMethod } from "./LinearCountingMethod.tsx";


export const BINARY_COUNTING_METHOD = createLinearCountingMethod({
  displayName: "Binary",
  description: "Used by computers to represent numbers. Higher range of possible numbers than Chisanbop. Great for binary math, but less practical for base-10 mental arithmetic.",
  orderedFingerValues: [
    ["left", "thumb", 512, "block", "blue"],
    ["left", "indexFinger", 256, "block", "blue"],
    ["left", "middleFinger", 128, "block", "blue"],
    ["left", "ringFinger", 64, "block", "blue"],
    ["left", "pinkyFinger", 32, "block", "blue"],
    ["right", "pinkyFinger", 16, "inline", "red"],
    ["right", "ringFinger", 8, "inline", "red"],
    ["right", "middleFinger", 4, "inline", "red"],
    ["right", "indexFinger", 2, "inline", "red"],
    ["right", "thumb", 1, "inline", "red"],
  ],
});
