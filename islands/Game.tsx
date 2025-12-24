import { Webcam } from "./Webcam.tsx";
import { useSignalRef } from "@preact/signals/utils";
import { GameOverlay } from "./GameOverlay.tsx";
import { useGame } from "../hooks/useGame.ts";

export function Game() {
  const videoRef = useSignalRef<HTMLVideoElement | null>(null);
  const canvasRef = useSignalRef<HTMLCanvasElement | null>(null);
  const gameApi = useGame({ videoRef, canvasRef, flipped: true });

  return (
    <div class="relative">
      <Webcam videoRef={videoRef} flipped />
      <GameOverlay gameApi={gameApi} />
    </div>
  );
}