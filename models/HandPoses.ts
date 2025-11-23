import { type Hand } from "@tensorflow-models/hand-pose-detection";
import { HandPose } from "./HandPose.ts";

/** Detailed, mutable, continuous pose data for hands, updates every frame */
export class HandPoses {
  public left: HandPose | null = null;
  public right: HandPose | null = null;

  public update(hands: Hand[]) {
    // Update left side
    const leftHand = hands.find((h) => h.handedness === "Left");
    if (leftHand) {
      if (!this.left) this.left = new HandPose(leftHand);
      this.left.update(leftHand);
    } else {
      this.left = null;
    }

    // Update right side
    const rightHand = hands.find((h) => h.handedness === "Right");
    if (rightHand) {
      if (!this.right) this.right = new HandPose(rightHand);
      this.right.update(rightHand);
    } else {
      this.right = null;
    }
  }
}
