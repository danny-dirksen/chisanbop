import { useSignalEffect } from "@preact/signals";

interface WebcamProps {
  videoRef: SignalRefObject<HTMLVideoElement | null>;
}

export const Webcam = ({ videoRef }: WebcamProps) => {
  if (videoRef === undefined) throw new Error("ref is undefined!");
  useSignalEffect(() => {
    // Ensure that el exists
    const el = videoRef.current;
    if (el === null) return;
    if (!(el instanceof HTMLElement)) throw new Error("Not an HTMLElement!", { cause: el })
    if (!(el instanceof HTMLVideoElement)) throw new Error("Not an HTMLVideoElement!", { cause: el })

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        el.srcObject = stream;
      } catch (err) {
        console.error("Error accessing media devices.", err);
        alert(
          "Could not access the webcam. Please check your browser permissions.",
        );
      }
    };

    startCamera();

    return () => {
      el.srcObject = null;
    };
  });

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline className="w-screen h-screen" />
    </div>
  );
};
