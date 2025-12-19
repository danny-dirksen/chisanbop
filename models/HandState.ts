import { HandCallibration, FingerCallibration } from "./Callibration.ts";
import { HandPose } from "./HandPose.ts";
import { HandState } from "./HandStates.ts";

/** Infers hand state based on hand pos. Reuses the `prevState` object only if completely unchanged. */

export function getHandState(
  handPos: HandPose,
  cal: HandCallibration,
  prevState?: HandState
): HandState {
  const thumb = getFingerState(handPos.fingerAngles.thumb, cal.thumb);
  const indexFinger = getFingerState(
    handPos.fingerAngles.indexFinger,
    cal.indexFinger
  );
  const middleFinger = getFingerState(
    handPos.fingerAngles.middleFinger,
    cal.middleFinger
  );
  const ringFinger = getFingerState(
    handPos.fingerAngles.ringFinger,
    cal.ringFinger
  );
  const pinkyFinger = getFingerState(
    handPos.fingerAngles.pinkyFinger,
    cal.pinkyFinger
  );
  if (prevState && (
    thumb === prevState.fingerStates.thumb &&
    indexFinger === prevState.fingerStates.indexFinger &&
    middleFinger === prevState.fingerStates.middleFinger &&
    ringFinger === prevState.fingerStates.ringFinger &&
    pinkyFinger === prevState.fingerStates.pinkyFinger
  )) {
    return prevState;
  } else {
    return {
      fingerStates: {
        thumb,
        indexFinger,
        middleFinger,
        ringFinger,
        pinkyFinger,
      },
    };
  }
}

function getFingerState(fingerAngle: number, cal: FingerCallibration) {
  const threshold = (cal.straightAngle + cal.curledAngle) / 2;
  return fingerAngle < threshold;
}

export function areHandStatesEqual(handState1: HandState | null, handState2: HandState | null) {
  // If they are not both defined, simple equality is sufficient
  if (handState1 === null || handState2 === null) {
    return handState1 === handState2;
  }
  // Otherwise, compare fingers individually.
  else {
    return (
      handState1.fingerStates.thumb === handState2.fingerStates.thumb &&
      handState1.fingerStates.indexFinger === handState2.fingerStates.indexFinger &&
      handState1.fingerStates.middleFinger === handState2.fingerStates.middleFinger &&
      handState1.fingerStates.ringFinger === handState2.fingerStates.ringFinger &&
      handState1.fingerStates.pinkyFinger === handState2.fingerStates.pinkyFinger
    );
  }
}

export interface HandStateDiff {
  hand?: "raise" | "lower";
  fingerStates?: {
    [k in FingerType]?: FingerStateDiff;
  };
}

export type FingerStateDiff = "extend" | "retract";

export function getHandStateDiff(from: HandState | null, to: HandState | null): HandStateDiff {
  if (from === null && to === null) return {};
  if (from === null) return { hand: "raise" };
  if (to === null) return { hand: "lower" };

  const diff: HandStateDiff = {
    fingerStates: {
      thumb: getFingerStateDiff(
        from.fingerStates.thumb,
        to.fingerStates.thumb,
      ),
      indexFinger: getFingerStateDiff(
        from.fingerStates.indexFinger,
        to.fingerStates.indexFinger,
      ),
      middleFinger: getFingerStateDiff(
        from.fingerStates.middleFinger,
        to.fingerStates.middleFinger,
      ),
      ringFinger: getFingerStateDiff(
        from.fingerStates.ringFinger,
        to.fingerStates.ringFinger,
      ),
      pinkyFinger: getFingerStateDiff(
        from.fingerStates.pinkyFinger,
        to.fingerStates.pinkyFinger,
      ),
    }
  }

  const isDifferent = diff.fingerStates && Object.values(diff.fingerStates).some(v => v !== undefined);
  return isDifferent ? diff : {};
}

export function getFingerStateDiff(from: boolean, to: boolean): FingerStateDiff | undefined {
  return from === to
    ? undefined
    : to
      ? "extend"
      : "retract";
}