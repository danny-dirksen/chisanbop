import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { HandPose } from "./HandPose.ts";

/** Detailed, mutable, continuous pose data for hands, updates every frame */
export class HandPoses {
  public left: HandPose | null = null;
  public right: HandPose | null = null;

  /**
   * Warning: In-place operation.
   * @param hands 
   */
  public update(hands: HandLandmarkerResult, flipped: boolean): typeof this {

    // Flip all x-coordinates if flipped is true
    if (flipped) {
      hands.landmarks.forEach(landmarkList => {
        landmarkList.forEach(landmark => {
          landmark.x = 1 - landmark.x;
        });
      });
      hands.handedness.forEach(handednessList => {
        handednessList.forEach(handedness => {
          if (handedness.categoryName === "Left") {
            handedness.categoryName = "Right";
            handedness.displayName = "Right";
          } else if (handedness.categoryName === "Right") {
            handedness.categoryName = "Left";
            handedness.displayName = "Left";
          }
        });
      });
    }

    // Update left side.
    const leftHandIndex = hands.handedness.findIndex(h => h.some(h => h.categoryName === "Left"));
    const leftHand = leftHandIndex === -1
      ? null
      : hands.landmarks[leftHandIndex] ?? null;
    if (leftHand) {
      if (!this.left) this.left = new HandPose(leftHand, "left");
      this.left.update(leftHand);
    } else {
      this.left = null;
    }

    // Update right side
    const rightHandIndex = hands.handedness.findIndex(h => h.some(h => h.categoryName === "Right"));
    const rightHand = rightHandIndex === -1
      ? null
      : hands.landmarks[rightHandIndex] ?? null;
    if (rightHand) {
      if (!this.right) this.right = new HandPose(rightHand, "right");
      this.right.update(rightHand);
    } else {
      this.right = null;
    }
    return this;
  }
}
