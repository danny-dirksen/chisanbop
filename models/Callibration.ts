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

const DEFAULT_CALLIBRATION_DATASET: CallibrationDataset = [
  [
    [1.33, 1.60, 2.11, 1.35, 2.04],
    [false, false, false, false, false],
  ],
  [
    [1.29, 1.79, 2.03, 1.54, 2.00],
    [false, false, false, false, false],
  ],
  [
    [1.70, 0.85, 1.80, 1.49, 1.93],
    [false, true, false, false, false],
  ],
  [
    [1.27, 0.65, 1.48, 1.27, 2.03],
    [false, true, false, false, false],
  ],
  [
    [1.24, 0.50, 0.35, 1.24, 1.83],
    [false, true, true, false, false],
  ],
  [
    [1.22, 0.73, 0.60, 1.16, 1.75],
    [false, true, true, false, false],
  ],
  [
    [1.34, 1.12, 0.73, 0.60, 1.95],
    [false, true, true, true, false],
  ],
  [
    [1.25, 0.98, 0.76, 0.55, 2.07],
    [false, true, true, true, false],
  ],
  [
    [1.14, 0.79, 0.69, 0.69, 0.58],
    [false, true, true, true, true],
  ],
  [
    [1.13, 0.81, 0.75, 0.69, 0.62],
    [false, true, true, true, true],
  ],
  [
    [0.86, 1.29, 1.61, 1.59, 2.12],
    [true, false, false, false, false],
  ],
  [
    [0.98, 1.29, 1.53, 1.40, 1.83],
    [true, false, false, false, false],
  ],
  [
    [0.80, 0.73, 1.48, 1.38, 1.90],
    [true, true, false, false, false],
  ],
  [
    [0.64, 0.45, 1.32, 1.30, 2.00],
    [true, true, false, false, false],
  ],
  [
    [0.69, 0.36, 0.24, 1.36, 1.88],
    [true, true, true, false, false],
  ],
  [
    [0.56, 0.36, 0.27, 1.42, 1.93],
    [true, true, true, false, false],
  ],
  [
    [0.86, 0.66, 0.66, 0.50, 2.05],
    [true, true, true, true, false],
  ],
  [
    [0.78, 0.58, 0.60, 0.48, 2.09],
    [true, true, true, true, false],
  ],
  [
    [0.74, 0.50, 0.58, 0.68, 0.72],
    [true, true, true, true, true],
  ],
  [
    [0.84, 0.50, 0.59, 0.66, 0.66],
    [true, true, true, true, true],
  ],
];

export const DEFAULT_HAND_CALIBRATION: HandCallibration = callibrateHand(
  DEFAULT_CALLIBRATION_DATASET,
);
