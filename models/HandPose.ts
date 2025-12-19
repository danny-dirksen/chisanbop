// @ts-types="npm:@types/three"
import { Vector2, Vector3, Vector3Like } from "@3d/three";
import { Landmark } from "@mediapipe/tasks-vision";
import { FINGER_SEQUENCES } from "../util/hand.ts";

/** Detailed, mutable, continuous pose data for a single hand. Can update every frame */
export class HandPose {
  public boundingBox: Rectangle;
  public fingerAngles: {
    [k in FingerType]: number;
  };

  constructor(public hand: Landmark[], public handedness: Handedness) {
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

  public update(hand: Landmark[]): void {
    this.hand = hand;

    
    if (hand.length !== 21) {
      throw new Error(`keypoints length should be 21, is ${hand.length}`);
    }

    // Update the boundingbox
    const { boundingBoxMin, boundingBoxMax } = helpers;
    boundingBoxMin.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    boundingBoxMax.set(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
    for (const kp of hand) {
      boundingBoxMin.min(kp);
      boundingBoxMax.max(kp);
    }
    this.boundingBox.start.copy(boundingBoxMin);
    this.boundingBox.size.subVectors(boundingBoxMax, boundingBoxMin);

    // Update the curl curl angles
    this.fingerAngles.thumb = getCurl(
      hand,
      FINGER_SEQUENCES.thumb,
    );
    this.fingerAngles.indexFinger = getCurl(
      hand,
      FINGER_SEQUENCES.indexFinger,
    );
    this.fingerAngles.middleFinger = getCurl(
      hand,
      FINGER_SEQUENCES.middleFinger,
    );
    this.fingerAngles.ringFinger = getCurl(
      hand,
      FINGER_SEQUENCES.ringFinger,
    );
    this.fingerAngles.pinkyFinger = getCurl(
      hand,
      FINGER_SEQUENCES.pinkyFinger,
    );
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
  segment3: new Vector3(),
  boundingBoxMin: new Vector3(),
  boundingBoxMax: new Vector3(),
};

/** Get the total amount of curl for a finger, measured in radians */
function getCurl(
  keypoints: Vector3Like[],
  fingerIndices: [number, number, number, number, number],
): number {
  const kp0 = keypoints[fingerIndices[0]];
  const kp1 = keypoints[fingerIndices[1]];
  const kp2 = keypoints[fingerIndices[2]];
  const kp3 = keypoints[fingerIndices[3]];
  const kp4 = keypoints[fingerIndices[4]];

  const { segment0, segment1, segment2, segment3 } = helpers;
  segment0.subVectors(kp1, kp0);
  segment1.subVectors(kp2, kp1);
  segment2.subVectors(kp3, kp2);
  segment3.subVectors(kp4, kp3);

  const angle0 = segment0.angleTo(segment1);
  const angle1 = segment1.angleTo(segment2);
  const angle2 = segment2.angleTo(segment3);
  return angle0 + angle1 + angle2;
}

