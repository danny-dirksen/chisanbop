// @ts-types="npm:@types/three"
import { Vector3Like } from "@3d/three";
import { HandPose } from "../models/HandPose.ts";
import { HandPoses } from "../models/HandPoses.ts";
import { FINGER_SEQUENCES } from "../util/hand.ts";

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
  // const averageX = points.reduce((a, b) => a + b.x, 0) / points.length;
  // const averageY = points.reduce((a, b) => a + b.y, 0) / points.length;
  // console.log(handPose.boundingBox.start.x, handPose.boundingBox.start.y);
  ctx.strokeStyle = "#ffffff";
  ctx.strokeRect(
    handPose.boundingBox.start.x * ctx.canvas.width,
    handPose.boundingBox.start.y * ctx.canvas.height,
    handPose.boundingBox.size.x * ctx.canvas.width,
    handPose.boundingBox.size.y * ctx.canvas.height,
  );

  ctx.fillStyle = "#00ff00";
  const radius = 4;
  for (const point of handPose.hand) {
    ctx.fillRect(
      point.x * ctx.canvas.width - radius,
      point.y * ctx.canvas.height - radius,
      radius * 2,
      radius * 2,
    );
  }

  ctx.fillStyle = "#ffff00";
  ctx.font = "12px sans"
  ctx.fillText(
    handPose.handedness,
    ctx.canvas.width * (handPose.boundingBox.start.x + handPose.boundingBox.size.x * 0.5),
    ctx.canvas.height * (handPose.boundingBox.start.y + handPose.boundingBox.size.y * 0.5),
  );

  drawFinger(ctx, handPose, FINGER_SEQUENCES.thumb);
  drawFinger(ctx, handPose, FINGER_SEQUENCES.indexFinger);
  drawFinger(ctx, handPose, FINGER_SEQUENCES.middleFinger);
  drawFinger(ctx, handPose, FINGER_SEQUENCES.ringFinger);
  drawFinger(ctx, handPose, FINGER_SEQUENCES.pinkyFinger);
}

function drawFinger(ctx: CanvasRenderingContext2D, handPose: HandPose, joints: number[]): void {
  const FINGER_WIDTH_PER_LENGTH = 0.25;
  const fingerLengthWorld = getFingerLength(handPose, joints);
  // Still in world coordinates, must scale to canvas size.
  const fingerWidthWorld = fingerLengthWorld / FINGER_WIDTH_PER_LENGTH;
  ctx.beginPath();
  ctx.strokeStyle = "#0000ff";
  ctx.lineWidth = fingerWidthWorld * handPose.boundingBox.size.x;
  ctx.lineCap = "round";
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

function getFingerLength(handPose: HandPose, joints: number[]): number {
  let length = 0;
  for (let i = 0; i < joints.length - 1; i ++) {
    const segmentStart = handPose.hand[joints[i]];
    const segmentEnd = handPose.hand[joints[i + 1]];
    length += distance(segmentStart, segmentEnd);
  }
  return length;
}

function distance(from: Vector3Like, to: Vector3Like): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
