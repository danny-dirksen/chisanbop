import { FingerCallibration, HandCallibration } from "./Callibration.ts";
import { HandPose } from "./HandPose.ts";
import { HandPoses } from "./HandPoses.ts";

/** High-level, immutible discrete state of hands suitable for reactivity, which does not change as often as HandPoses */
export interface HandStates {
  readonly right: HandState | null;
  readonly left: HandState | null;
}

/** High-level, immutible discrete state of hand suitable for reactivity, which does not change as often as HandPos */
export interface HandState {
  /** Thumb, Index, Middle, Ring, Pinky. True if straight, false if curled. */
  readonly fingerStates: {
    readonly [k in FingerType]: boolean;
  };
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

/** Infers hand state based on hand pos. Reuses the `prevState` object only if completely unchanged. */
function getHandState(
  handPos: HandPose,
  cal: HandCallibration,
  prevState?: HandState,
): HandState {
  const thumb = getFingerState(handPos.fingerAngles.thumb, cal.thumb);
  const indexFinger = getFingerState(
    handPos.fingerAngles.indexFinger,
    cal.indexFinger,
  );
  const middleFinger = getFingerState(
    handPos.fingerAngles.middleFinger,
    cal.middleFinger,
  );
  const ringFinger = getFingerState(
    handPos.fingerAngles.ringFinger,
    cal.ringFinger,
  );
  const pinkyFinger = getFingerState(
    handPos.fingerAngles.pinkyFinger,
    cal.pinkyFinger,
  );
  if (
    prevState && (
      thumb === prevState.fingerStates.thumb &&
      indexFinger === prevState.fingerStates.indexFinger &&
      middleFinger === prevState.fingerStates.middleFinger &&
      ringFinger === prevState.fingerStates.ringFinger &&
      pinkyFinger === prevState.fingerStates.pinkyFinger
    )
  ) {
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
