import {} from ".";
import { Signal } from "@preact/signals";

declare global {
  type FingerType =
    | "thumb"
    | "indexFinger"
    | "middleFinger"
    | "ringFinger"
    | "pinkyFinger";

  interface SignalRefObject<T> extends Signal<T> {
    current: T;
  }
}