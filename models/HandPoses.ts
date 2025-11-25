import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { HandPose } from "./HandPose.ts";

/** Detailed, mutable, continuous pose data for hands, updates every frame */
export class HandPoses {
  public left: HandPose | null = null;
  public right: HandPose | null = null;

  public update(hands: HandLandmarkerResult) {
    // Update left side
    const leftHandIndex = hands.handedness.findIndex(h => h.some(h => h.categoryName === "Left"));
    const leftHand = leftHandIndex === -1
      ? null
      : hands.landmarks[leftHandIndex] ?? null;
    if (leftHand) {
      if (!this.left) this.left = new HandPose(leftHand, "Left");
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
      if (!this.right) this.right = new HandPose(rightHand, "Right");
      this.right.update(rightHand);
    } else {
      this.right = null;
    }
  }
}
