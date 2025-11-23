
import { Webcam } from "./Webcam.tsx";
import { useSignalRef } from '@preact/signals/utils';
import { GameOverlay } from "./GameOverlay.tsx";
import { useGame } from "../hooks/useGame.ts";

export function Game() {
  const videoRef = useSignalRef<HTMLVideoElement | null>(null);
  const canvasRef = useSignalRef<HTMLCanvasElement | null>(null);
  const gameApi = useGame({ videoRef, canvasRef });
  
  return (
    <div class="relative">
      <Webcam videoRef={videoRef} />
      <GameOverlay gameApi={gameApi} />
    </div>
  );

  // const handStatesDisplay = useComputed(() => JSON.stringify(handStates, null, 2));

  // // const videoSize = useMediaSize(videoRef);
  // const videoFrameSize = useMeasure(videoRef);
  // const videoFrameSizeDisplay = useComputed(() => videoFrameSize.value?.blockSize + " " + videoFrameSize.value?.inlineSize);


  // return (
  //   <div className="w-screen h-screen relative bg-black text-white">
  //     <UserVideo ref={videoRef} />
  //     <code className="absolute top-0 right-0 w-full h-full overflow-auto font-mono whitespace-pre-wrap text-left">
  //       {handStatesDisplay}
  //       <br />
  //       {videoFrameSizeDisplay}
  //     </code>
  //   </div>
  // );
}

// function useMediaSize(el: Signal<HTMLVideoElement | HTMLImageElement | undefined>) {
//   // const mediaSize = useSignal<
//   useSignalEffect(() => {
//     if (el.value instanceof HTMLVideoElement) {
//       el.value.video
//     }
//   });
// }