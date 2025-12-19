import { areHandStatePairsEqual, HandStates } from "../../models/HandStates.ts";

export class CountingMethod {
  constructor(
    public displayName: string,
    public description: string,
    /**
     * Order matters, and is the order in which we attempt to fit fingers when targeting a certain number.
     * Typically highest-value fingers, and fingers closer to thumb are attempted first.
     */
    public fingerValues: ["left" | "right", FingerType, number][],
  ) {
    // TODO: refactor to only use fingerValues list form
    const numUnique = new Set(fingerValues.map(([handedness, fingerType]) => handedness + fingerType)).size;
    if (numUnique !== fingerValues.length) {
      throw new Error("All fingers in the counting order must be unique.");
    }
    if (fingerValues.length !== 10) {
      throw new Error("All fingers must be included in the counting order.");
    }
    const withNegativeValues = fingerValues.filter(([,, value]) => value < 0);
    if (withNegativeValues.length > 0) {
      throw new Error("Negative finger values not yet supported", { cause: withNegativeValues });
    }
  }

  /**
   * Ensures that the state is the "right" way to represent the number represented.
   * @param handStates 
   */
  validateHandState(handStates: HandStates): HandStateValidationResult {
    const value = this.handStatesToValue(handStates);
    const validVersion = this.valueToHandStates(value);
    if (!validVersion) {
      return {
        valid: false,
        message: `${this.displayName} method can't represent ${value}.`,
        corrected: null,
      }
    }
    const eq = areHandStatePairsEqual(handStates, validVersion);

    return eq ? ({
      valid: true,
    }) : ({
      valid: false,
      message: `Not conventional.`,
      corrected: validVersion,
    });
  }
  
  handStatesToValue(handStates: HandStates): number {
    return this.fingerValues.reduce((sum, [hand, finger, value]) => {
      const isExtended = handStates[hand]?.fingerStates[finger] ?? false;
      return sum + (isExtended ? value : 0);
    }, 0);
  }

  /**
   * @param value the number to attempt to represent
   * @return A finger configuration with that value, or undefined if not possible.
   */
  valueToHandStates(value: number): HandStates | undefined {
    // Negative numbers can't be represented
    if (value < 0) return undefined;
    const handStates: HandStates = {
      left: {
        fingerStates: {
          thumb: false,
          indexFinger: false,
          middleFinger: false,
          ringFinger: false,
          pinkyFinger: false,
        }
      },
      right: {
        fingerStates: {
          thumb: false,
          indexFinger: false,
          middleFinger: false,
          ringFinger: false,
          pinkyFinger: false,
        }
      },
    };
    let handsValue = 0;
    // In the defined counting order, keep extending finger adding the values of each finger until we meet or exceed
    for (const [handedness, fingerType, fingerValue] of this.fingerValues) {
      // Landed on correct value -> return it
      if (handsValue === value) break;

      // Overshot -> return null
      if (value < 0) throw new Error("Overshot intended number somehow.");

      // If there's room for this finger, extend it.
      if (handsValue + fingerValue <= value) {
        handStates[handedness]!.fingerStates[fingerType] = true;
        handsValue += fingerValue;
      }
    }

    // Ran out of fingers. Return the hand state if it's value is correct.
    return (handsValue === value) ? handStates : undefined;
  }
}

type HandStateValidationResult =
    | { valid: true }
    | { valid: false, message: string, corrected: HandStates | null }

export const CHISANBOP_COUNTING_METHOD = new CountingMethod(
  "Chisanbop",
  "Great for instant arithmetic on 2-digit numbers.",
  [
    ["left", "thumb", 50],
    ["left", "indexFinger", 10],
    ["left", "middleFinger", 10],
    ["left", "ringFinger", 10],
    ["left", "pinkyFinger", 10],
    ["right", "thumb", 5],
    ["right", "indexFinger", 1],
    ["right", "middleFinger", 1],
    ["right", "ringFinger", 1],
    ["right", "pinkyFinger", 1],
  ],
);

export const BINARY_COUNTING_METHOD = new CountingMethod(
  "Binary", 
  "Used by computers to represent numbers. Higher range of possible numbers than Chisanbop. Great for binary math, but less practical for base-10 mental arithmetic.",
  [
    ["left", "thumb", 512],
    ["left", "indexFinger", 256],
    ["left", "middleFinger", 128],
    ["left", "ringFinger", 64],
    ["left", "pinkyFinger", 32],
    ["right", "pinkyFinger", 16],
    ["right", "ringFinger", 8],
    ["right", "middleFinger", 4],
    ["right", "indexFinger", 2],
    ["right", "thumb", 1],
  ],
);
