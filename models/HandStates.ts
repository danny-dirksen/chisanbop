import { HandCallibration } from "./Callibration.ts";
import { areHandStatesEqual, getHandState, getHandStateDiff, HandStateDiff } from "./HandState.ts";
import { HandPoses } from "./HandPoses.ts";

/** High-level, immutible discrete state of hands suitable for reactivity, which does not change as often as HandPoses */
export interface HandStates {
  right: HandState | null;
  left: HandState | null;
}

/** High-level, immutible discrete state of hand suitable for reactivity, which does not change as often as HandPos */
export interface HandState {
  /** Thumb, Index, Middle, Ring, Pinky. True if straight, false if curled. */
  fingerStates: {
    [k in FingerType]: boolean;
  };
}

export function areHandStatePairsEqual(handStates1: HandStates, handStates2: HandStates) {
  return (
    areHandStatesEqual(handStates1.left, handStates2.left) &&
    areHandStatesEqual(handStates1.right, handStates2.right)
  )
}

/** Infers hand states based on hand poses. Reuses the `prevState` object only if completely unchanged. */
export function getHandStates(
  handsPos: HandPoses,
  cal: HandCallibration,
  prevState?: HandStates,
): HandStates {
  const left = handsPos.left
    ? getHandState(handsPos.left, cal, prevState?.left ?? undefined)
    : null;
  const right = handsPos.right
    ? getHandState(handsPos.right, cal, prevState?.right ?? undefined)
    : null;
  if (
    prevState?.left && prevState.left === left ||
    prevState?.right && prevState.right === right
  ) {
    return prevState;
  } else {
    return { left, right };
  }
}

interface HandStatePairDiff {
  right: HandStateDiff,
  left: HandStateDiff,
}

export function handStatePairDiff(from: HandStates, to: HandStates): HandStatePairDiff {
  return {
    right: getHandStateDiff(from.right, to.right),
    left: getHandStateDiff(from.left, to.left),
  }
}