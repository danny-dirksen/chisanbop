import {
  Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { ActiveCanvas } from "./ActiveCanvas.tsx";
import { GameApi } from "../hooks/useGame.ts";
import { drawHands } from "../util/drawHands.ts";
import { Callibrator } from "./Callibrator.tsx";

interface GameOverlayProps {
  gameApi: GameApi;
}

export function GameOverlay(
  { gameApi: { videoRef, canvasRef, handPoses } }: GameOverlayProps,
) {
  const videoFrameSize = useMeasure(videoRef);
  const videoInnerSize = useContentSize(videoRef);
  const canvasSize = useComputed<Measure>(() => {
    const frameSize = videoFrameSize.value;
    const innerSize = videoInnerSize.value;
    if (!frameSize || frameSize.width === 0 || frameSize.height === 0) {
      return { width: 0, height: 0 };
    }
    if (!innerSize || innerSize.width === 0 || innerSize.height === 0) {
      return frameSize ?? { width: 0, height: 0 };
    }

    return fitInside(innerSize, frameSize);
  });
  const width = useComputed(() => canvasSize.value.width);
  const height = useComputed(() => canvasSize.value.height);

  // Preact, so no need to memoize!
  const render = (ctx: CanvasRenderingContext2D) => {
    ctx.reset();
    ctx.strokeStyle = "#ff0000";
    ctx.strokeRect(0, 0, width.peek() ?? 2, height.peek() ?? 2);
    if (handPoses?.current) drawHands(ctx, handPoses.current);
  };

  return (
    <>
      <div class="absolute left-0 top-0 w-full h-full flex items-center justify-center">
        <ActiveCanvas
          canvasRef={canvasRef}
          width={width}
          height={height}
          render={render}
        />
      </div>
      <div class="absolute left-0 top-0 w-full h-full flex items-center justify-center">
        <Callibrator handPoses={handPoses} />
      </div>
    </>
  );
}

export interface Measure {
  width: number;
  height: number;
}

function fitInside(inner: Measure, outer: Measure): Measure {
  const scale = Math.min(
    outer.width / inner.width,
    outer.height / inner.height,
  );
  return {
    width: inner.width * scale,
    height: inner.height * scale,
  };
}

export function useMeasure(
  el: Signal<HTMLElement | null>,
): Signal<Measure | undefined> {
  // Get an initial size
  const size = useSignal<Measure>();
  // const boundingClientRect = useComputed(() => el.value?.getBoundingClientRect());

  useSignalEffect(() => {
    const boundingClientRect = el.value?.getBoundingClientRect();
    size.value = boundingClientRect;
    if (!el.value) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries.find((e) => e.target === el.value);
      if (!entry) {
        throw new TypeError("Why did this even get called?", {
          cause: entries,
        });
      }
      if (entry.borderBoxSize.length !== 1) {
        throw new Error("borderBoxSize.length !== 1>", {
          cause: entry.borderBoxSize,
        });
      }
      const observerSize = entry.borderBoxSize[0];
      size.value = {
        width: observerSize.inlineSize,
        height: observerSize.blockSize,
      };
    });
    observer.observe(el.value);
    return () => observer.disconnect();
  });

  return size;
}

function useContentSize(videoRef: Signal<HTMLVideoElement | null>) {
  const size = useSignal<Measure | undefined>();

  useSignalEffect(() => {
    if (!videoRef.value) {
      size.value = undefined;
      return;
    }

    const video = videoRef.value;
    const updateSize = () => {
      if (video.videoWidth && video.videoHeight) {
        size.value = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
      }
    };

    video.addEventListener("loadedmetadata", updateSize);
    updateSize();

    return () => video.removeEventListener("loadedmetadata", updateSize);
  });

  return size;
}
