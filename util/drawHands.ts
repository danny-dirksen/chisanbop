// @ts-types="npm:@types/three"
import { Vector3Like } from "@3d/three";
import { HandPose } from "../models/HandPose.ts";
import { HandPoses } from "../models/HandPoses.ts";
import { FINGER_SEQUENCES, KP_INDICES } from "../util/hand.ts";

export function drawHands(ctx: CanvasRenderingContext2D, handPoses: HandPoses) {
  // ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
  // // ctx.translate(-0.5, -0.5);
  // // ctx.translate(0.5, 0.5);
  // ctx.scale(ctx.canvas.width, ctx.canvas.height);
  if (handPoses.left) drawHand(ctx, handPoses.left);
  if (handPoses.right) drawHand(ctx, handPoses.right);
  // ctx.resetTransform();
}

function drawHand(ctx: CanvasRenderingContext2D, handPose: HandPose) {
  // // Bounding box
  // ctx.strokeStyle = "#ffffff";
  // ctx.lineWidth = 5;
  // ctx.strokeRect(
  //   handPose.boundingBox.start.x * ctx.canvas.width,
  //   handPose.boundingBox.start.y * ctx.canvas.height,
  //   handPose.boundingBox.size.x * ctx.canvas.width,
  //   handPose.boundingBox.size.y * ctx.canvas.height,
  // );

  // // Joints
  // ctx.fillStyle = "#00ff00";
  // const radius = 4;
  // for (const point of handPose.hand) {
  //   ctx.fillRect(
  //     point.x * ctx.canvas.width - radius,
  //     point.y * ctx.canvas.height - radius,
  //     radius * 2,
  //     radius * 2,
  //   );
  // }

  ctx.fillStyle = "#ffff00";
  ctx.font = "12px sans"
  ctx.fillText(
    handPose.handedness,
    ctx.canvas.width * (handPose.boundingBox.start.x + handPose.boundingBox.size.x * 0.5),
    ctx.canvas.height * (handPose.boundingBox.start.y + handPose.boundingBox.size.y * 0.5),
  );

  const fingerThickness = pathLengthInPixels(ctx, handPose, KNUCKES) * 0.333333;

  drawFinger(ctx, handPose, FINGER_SEQUENCES_NO_WRIST.thumb, fingerThickness);
  drawFinger(ctx, handPose, FINGER_SEQUENCES_NO_WRIST.indexFinger, fingerThickness);
  drawFinger(ctx, handPose, FINGER_SEQUENCES_NO_WRIST.middleFinger, fingerThickness);
  drawFinger(ctx, handPose, FINGER_SEQUENCES_NO_WRIST.ringFinger, fingerThickness);
  drawFinger(ctx, handPose, FINGER_SEQUENCES_NO_WRIST.pinkyFinger, fingerThickness);
}

const FINGER_SEQUENCES_NO_WRIST = {
  thumb: FINGER_SEQUENCES.thumb.slice(1),
  indexFinger: FINGER_SEQUENCES.indexFinger.slice(1),
  middleFinger: FINGER_SEQUENCES.middleFinger.slice(1),
  ringFinger: FINGER_SEQUENCES.ringFinger.slice(1),
  pinkyFinger: FINGER_SEQUENCES.pinkyFinger.slice(1),
};

const KNUCKES = [
  KP_INDICES.index_finger_mcp,
  KP_INDICES.middle_finger_mcp,
  KP_INDICES.ring_finger_mcp,
  KP_INDICES.pinky_finger_mcp,
];

function drawFinger(ctx: CanvasRenderingContext2D, handPose: HandPose, joints: number[], fingerThickness: number): void {
  
  ctx.beginPath();
  ctx.strokeStyle = "#ffffff40";
  ctx.lineWidth = fingerThickness;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.moveTo(
    handPose.hand[joints[0]].x * ctx.canvas.width,
    handPose.hand[joints[0]].y * ctx.canvas.height,
  );
  for (let i = 1; i < joints.length; i ++) {
    ctx.lineTo(
      handPose.hand[joints[i]].x * ctx.canvas.width,
      handPose.hand[joints[i]].y * ctx.canvas.height,
    );
  }
  ctx.stroke();
}

function pathLengthInPixels(ctx: CanvasRenderingContext2D, handPose: HandPose, joints: number[]): number {
  let length = 0;
  for (let i = 0; i < joints.length - 1; i ++) {
    const segmentStart = handPose.hand[joints[i]];
    const segmentEnd = handPose.hand[joints[i + 1]];
    length += distanceInPixels(ctx, segmentStart, segmentEnd);
  }
  return length;
}

function distanceInPixels(ctx: CanvasRenderingContext2D, from: Vector3Like, to: Vector3Like): number {
  const dx = (to.x - from.x) * ctx.canvas.width;
  const dy = (to.y - from.y) * ctx.canvas.height;
  const dz = 0.3 * (to.z - from.z) * Math.min(ctx.canvas.width, ctx.canvas.height);
  return Math.sqrt(dx * dx + dy * dy + dz * dz * 50);
}
