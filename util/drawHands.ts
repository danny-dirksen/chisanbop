import { HandPose } from "../models/HandPose.ts";
import { HandPoses } from "../models/HandPoses.ts";

export function drawHands(ctx: CanvasRenderingContext2D, handPoses: HandPoses) {
  // ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
  // // ctx.translate(-0.5, -0.5);
  // // ctx.translate(0.5, 0.5);
  // ctx.scale(ctx.canvas.width, ctx.canvas.height);
  if (handPoses.left) drawHand(ctx, handPoses.left);
  if (handPoses.right) drawHand(ctx, handPoses.right);
  ctx.resetTransform();
}

function drawHand(ctx: CanvasRenderingContext2D, handPose: HandPose) {
  const points = handPose.hand.keypoints3D;
  if (points === undefined) throw ("handPose.hand.keypoints3D is undefined");
  ctx.fillStyle = "#ffffff";
  // const averageX = points.reduce((a, b) => a + b.x, 0) / points.length;
  // const averageY = points.reduce((a, b) => a + b.y, 0) / points.length;
  // ctx.strokeRect(
  //   handPose.boundingBox.start.x,
  //   handPose.boundingBox.start.y,
  //   handPose.boundingBox.size.x,
  //   handPose.boundingBox.size.y,
  // );
  console.log(handPose.boundingBox.start.x, handPose.boundingBox.start.y);
  for (const point of points) {
    ctx.fillRect(
      point.x, 
      point.y, 
      15,
      15,
    );
  }
}