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
  public update(hands: HandLandmarkerResult, swapHands: boolean): typeof this {

    // Update left side.
    const leftHandName = swapHands ? "Right" : "Left";
    const leftHandIndex = hands.handedness.findIndex(h => h.some(h => h.categoryName === leftHandName));
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
    const rightHandName = swapHands ? "Left" : "Right";
    const rightHandIndex = hands.handedness.findIndex(h => h.some(h => h.categoryName === rightHandName));
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
