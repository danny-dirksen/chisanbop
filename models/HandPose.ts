import { Keypoint } from "@tensorflow-models/hand-pose-detection";
import { Hand } from "@tensorflow-models/hand-pose-detection";
// @ts-types="npm:@types/three"
import { Vector2, Vector3, Vector3Like } from "@3d/three";

/** Detailed, mutable, continuous pose data for a single hand. Can update every frame */
export class HandPose {
  public boundingBox: Rectangle;
  public fingerAngles: {
    [k in FingerType]: number;
  };

  constructor(public hand: Hand) {
    this.boundingBox = {
      start: new Vector2(),
      size: new Vector2(),
    };
    this.fingerAngles = {
      indexFinger: 0,
      middleFinger: 0,
      pinkyFinger: 0,
      ringFinger: 0,
      thumb: 0,
    };
  }

  public update(hand: Hand): void {
    this.hand = hand;

    // Make sure we have all the necessary points and they are 3d
    const kps = hand.keypoints3D?.filter(is3d);
    if (kps === undefined) {
      throw new Error("keypoints is undefined");
    }
    const kpsArr = kps;
    if (kpsArr.length !== 21) {
      throw new Error(`keypoints length should be 21, is ${kpsArr.length}`);
    }

    // Update the boundingbox
    const { boundingBoxMin, boundingBoxMax } = helpers;
    boundingBoxMin.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    boundingBoxMax.set(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
    for (const kp of kpsArr) {
      boundingBoxMin.min(kp);
      boundingBoxMax.max(kp);
    }
    this.boundingBox.start.copy(boundingBoxMin);
    this.boundingBox.size.subVectors(boundingBoxMax, boundingBoxMin);

    // Update the curl curl angles
    this.fingerAngles.thumb = getCurl(
      kpsArr,
      FINGER_SEQUENCES.thumb
    );
    this.fingerAngles.indexFinger = getCurl(
      kpsArr,
      FINGER_SEQUENCES.indexFinger,
    );
    this.fingerAngles.middleFinger = getCurl(
      kpsArr,
      FINGER_SEQUENCES.middleFinger,
    );
    this.fingerAngles.ringFinger = getCurl(
      kpsArr, FINGER_SEQUENCES.ringFinger
    );
    this.fingerAngles.pinkyFinger = getCurl(
      kpsArr,
      FINGER_SEQUENCES.pinkyFinger,
    );

    // console.log(
    //   this.fingerAngles.thumb.toFixed(2),
    //   this.fingerAngles.indexFinger.toFixed(2),
    //   this.fingerAngles.middleFinger.toFixed(2),
    //   this.fingerAngles.ringFinger.toFixed(2),
    //   this.fingerAngles.pinkyFinger.toFixed(2),
    // );
  }
}

interface Rectangle {
  start: Vector2;
  size: Vector2;
}

// Helper vectors to reduce load on garbage collector.
const helpers = {
  segment0: new Vector3(),
  segment1: new Vector3(),
  segment2: new Vector3(),
  boundingBoxMin: new Vector3(),
  boundingBoxMax: new Vector3(),
};

/** Get the total amount of curl for a finger, measured in radians */
function getCurl(
  keypoints: Vector3Like[],
  fingerIndices: [number, number, number, number],
): number {
  const kp0 = keypoints[fingerIndices[0]];
  const kp1 = keypoints[fingerIndices[1]];
  const kp2 = keypoints[fingerIndices[2]];
  const kp3 = keypoints[fingerIndices[3]];
  if (!(is3d(kp0) && is3d(kp1) && is3d(kp2) && is3d(kp3))) {
    throw new Error("Keypoints must be 3d");
  }

  const { segment0, segment1, segment2 } = helpers;
  segment0.subVectors(kp1, kp0);
  segment1.subVectors(kp2, kp1);
  segment2.subVectors(kp3, kp2);

  const angle0 = segment0.angleTo(segment1);
  const angle1 = segment1.angleTo(segment2);
  return angle0 + angle1;
}

function is3d(kp: Keypoint): kp is Vector3Like {
  return typeof kp.z === "number";
}

// The indices of each keypoint, keyed by a more readable name.
const KP_INDICES = {
  wrist: 0,
  thumb_cmc: 1,
  thumb_mcp: 2,
  thumb_ip: 3,
  thumb_tip: 4,
  index_finger_mcp: 5,
  index_finger_pip: 6,
  index_finger_dip: 7,
  index_finger_tip: 8,
  middle_finger_mcp: 9,
  middle_finger_pip: 10,
  middle_finger_dip: 11,
  middle_finger_tip: 12,
  ring_finger_mcp: 13,
  ring_finger_pip: 14,
  ring_finger_dip: 15,
  ring_finger_tip: 16,
  pinky_finger_mcp: 17,
  pinky_finger_pip: 18,
  pinky_finger_dip: 19,
  pinky_finger_tip: 20,
};

// Sequences of keypoint indices for each finger.
const FINGER_SEQUENCES: {
  [k in FingerType]: [number, number, number, number];
} = {
  thumb: [
    KP_INDICES.thumb_cmc,
    KP_INDICES.thumb_mcp,
    KP_INDICES.thumb_ip,
    KP_INDICES.thumb_tip,
  ],
  indexFinger: [
    KP_INDICES.index_finger_mcp,
    KP_INDICES.index_finger_pip,
    KP_INDICES.index_finger_dip,
    KP_INDICES.index_finger_tip,
  ],
  middleFinger: [
    KP_INDICES.middle_finger_mcp,
    KP_INDICES.middle_finger_pip,
    KP_INDICES.middle_finger_dip,
    KP_INDICES.middle_finger_tip,
  ],
  ringFinger: [
    KP_INDICES.ring_finger_mcp,
    KP_INDICES.ring_finger_pip,
    KP_INDICES.ring_finger_dip,
    KP_INDICES.ring_finger_tip,
  ],
  pinkyFinger: [
    KP_INDICES.pinky_finger_mcp,
    KP_INDICES.pinky_finger_pip,
    KP_INDICES.pinky_finger_dip,
    KP_INDICES.pinky_finger_tip,
  ],
};
