import { createLinearCountingMethod } from "./LinearCountingMethod.tsx";


export const CHISANBOP_COUNTING_METHOD = createLinearCountingMethod({
  displayName: "Chisanbop",
  description: "Great for instant arithmetic on 2-digit numbers.",
  orderedFingerValues: [
    ["left", "thumb", 50, "block", "blue"],
    ["left", "indexFinger", 10, "block", "blue"],
    ["left", "middleFinger", 10, "block", "blue"],
    ["left", "ringFinger", 10, "block", "blue"],
    ["left", "pinkyFinger", 10, "block", "blue"],
    ["right", "thumb", 5, "inline", "red"],
    ["right", "indexFinger", 1, "inline", "red"],
    ["right", "middleFinger", 1, "inline", "red"],
    ["right", "ringFinger", 1, "inline", "red"],
    ["right", "pinkyFinger", 1, "inline", "red"],
  ],
});
