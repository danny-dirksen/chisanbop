import { Signal, useSignalEffect } from "@preact/signals";
import { HTMLAttributes } from "preact";

interface ActiveCanvasProps extends HTMLAttributes<HTMLCanvasElement> {
  canvasRef: SignalRefObject<HTMLCanvasElement | null>;
  width: Signal<number | undefined>;
  height: Signal<number | undefined>;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export function ActiveCanvas(
  { canvasRef, width, height, render, ...props }: ActiveCanvasProps,
) {
  useSignalEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d") ?? null;
    if (!ctx) throw new Error("Failed to get 2d context");
    let handle: number | undefined = undefined;

    const eachFrame = () => {
      render(ctx);
      handle = requestAnimationFrame(eachFrame);
    };
    eachFrame();
    return () => {
      if (handle != undefined) cancelAnimationFrame(handle);
    };
  });
  return (
    <canvas
      {...props}
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
}
