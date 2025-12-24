import { DEFAULT_CALLIBRATION_DATASET } from "./DEFAULT_CALLIBRATION_DATASET.ts";
import { HandPose } from "./HandPose.ts";
import { HandState } from "./HandStates.ts";

/** Calibration for pose-detection of a hand */
export type HandCallibration = {
  [k in FingerType]: FingerCallibration;
};

/** Calibration for pose-detection of a single finger */
export interface FingerCallibration {
  /** Typical angle (radians) of a user's finger (sum of angles between each segment) when extended/straight */
  straightAngle: number;
  /** Typical angle (radians) of a user's finger (sum of angles between each segment) when flexed/curled */
  curledAngle: number;
}

export type CallibrationDatasetEntry = [
  // [ thumb, indexFinger, middleFinger, ringFinger, pinkyFinger ]
  [number, number, number, number, number],
  [boolean, boolean, boolean, boolean, boolean],
]

export function createCalibrationDatasetEntry(handPose: HandPose, handState: HandState) {
  const angles = [
    handPose.fingerAngles.thumb,
    handPose.fingerAngles.indexFinger,
    handPose.fingerAngles.middleFinger,
    handPose.fingerAngles.ringFinger,
    handPose.fingerAngles.pinkyFinger,
  ];
  const extendednesses = [
    handState.fingerStates.thumb,
    handState.fingerStates.indexFinger,
    handState.fingerStates.middleFinger,
    handState.fingerStates.ringFinger,
    handState.fingerStates.pinkyFinger,
  ];
  return [angles, extendednesses];
}

export type CallibrationDataset = CallibrationDatasetEntry[];

type CalibrationDatasetFinger = [number, boolean][];

function getCalibrationDatasetFinger(
  dataset: CallibrationDataset,
  index: number,
): CalibrationDatasetFinger {
  return dataset.map((
    [angles, extensions],
  ) => [angles[index], extensions[index]]);
}

function callibrateFinger(
  finger: CalibrationDatasetFinger,
): FingerCallibration {
  const curledAngles = finger.filter(([, straight]) => !straight).map((
    [angle],
  ) => angle);
  const straightAngles = finger.filter(([, straight]) => straight).map((
    [angle],
  ) => angle);
  if (curledAngles.length === 0 || straightAngles.length === 0) {
    throw new Error(
      `Not enough datapoints. ${curledAngles.length} curled, ${straightAngles.length} straight`,
    );
  }
  const allAngles = [...straightAngles, ...curledAngles].toSorted();
  const borderlineStraightIndex = straightAngles.length - 1;
  const borderlineCurledIndex = straightAngles.length;

  return {
    // straight angles are less
    straightAngle: allAngles[borderlineStraightIndex],
    // curled angles are greater
    curledAngle: allAngles[borderlineCurledIndex],
  };
}

export function callibrateHand(
  dataset: CallibrationDataset,
): HandCallibration {
  return {
    thumb: callibrateFinger(getCalibrationDatasetFinger(dataset, 0)),
    indexFinger: callibrateFinger(getCalibrationDatasetFinger(dataset, 1)),
    middleFinger: callibrateFinger(getCalibrationDatasetFinger(dataset, 2)),
    ringFinger: callibrateFinger(getCalibrationDatasetFinger(dataset, 3)),
    pinkyFinger: callibrateFinger(getCalibrationDatasetFinger(dataset, 4)),
  };
}

export const DEFAULT_HAND_CALIBRATION: HandCallibration = callibrateHand(
  DEFAULT_CALLIBRATION_DATASET,
);
