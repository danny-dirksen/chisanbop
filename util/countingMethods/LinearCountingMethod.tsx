import { HandStates } from "../../models/HandStates.ts";
import { CountingMethod, CountingMethodRenderingContext, FingerAnnotation } from "./CountingMethod.ts";

interface LinearCountingMethodProps {
  readonly displayName: string;
  readonly description: string;
  /**
   * Order matters, and is the order in which we attempt to fit fingers when targeting a certain number.
   * Typically highest-value fingers, and fingers closer to thumb are attempted first.
   */
  readonly orderedFingerValues: FingerValueEntry[];
}

/** Which hand, which finger, the value of the finger, the packing style (block or inline), and color */
type FingerValueEntry = [Handedness, FingerType, number, FingerPackingStyle, string];

type FingerPackingStyle = "block" | "inline";

export function createLinearCountingMethod({
  displayName,
  description,
  orderedFingerValues: fingerValues,
}: LinearCountingMethodProps): CountingMethod {

  // Throw if finger values are invalid.
  validateFingerValues(fingerValues);

  const maxPossibleValue = fingerValues.reduce((acc, [, , fingerValue]) => acc + fingerValue, 0);

  return {
    displayName,
    description,
    getFingerAnnotations: (handStates) => {
      const annotations: FingerAnnotation[] = [];
      for (const [handedness, fingerType, fingerValue] of fingerValues) {
        const isExtended = handStates[handedness]?.fingerStates[fingerType] ?? false;
        annotations.push({
          handedness: handedness,
          fingerType,
          content: isExtended ? <LinearFingerAnnotation fingerValue={fingerValue} max={maxPossibleValue} /> : undefined,
        });
      }
      return annotations;
    },
    render: (context) => <TreeMap context={context} maxPossibleValue={maxPossibleValue} fingerValues={fingerValues} />,
    issues: (_handStates) => {
      return []; // In linear counting method, all finger combos are valid.
    },
    value: (handStates) => {
      // Sum the values of each extended finger
      return fingerValues.reduce((acc, [handedness, fingerType, fingerValue]) => {
        const isExtended = handStates[handedness]?.fingerStates[fingerType] ?? false;
        return acc + (isExtended ? fingerValue : 0);
      }, 0);
    },
    canonicalForm: (value) => {
      // Iniitialize to all fingers being curled (false)
      const accState = {
        left: createEmptyHand(),
        right: createEmptyHand(),
      } satisfies HandStates;
      let accValue: number = 0;


      for (const [handedness, fingerType, fingerValue] of fingerValues) {
        // If target value has been reached, stop attempting to fit more fingers
        if (accValue >= value) {
          break;
        }

        // if fingerValue won't fit, skip this finger
        if (accValue + fingerValue > value) {
          continue;
        }

        // Otherwise, extend it and add its value to the accumulated value
        accState[handedness].fingerStates[fingerType] = true;
        accValue += fingerValue;
      }
      return accState;
    },
  }
}

function LinearFingerAnnotation({ fingerValue }: { fingerValue: number; max: number }) {
  return <span>{fingerValue}</span>;
}

function TreeMap({
  context,
  fingerValues,
}: {
  context: CountingMethodRenderingContext,
  maxPossibleValue: number,
  fingerValues: FingerValueEntry[],
}) {
  const { handStates } = context;

  const fingerData = fingerValues.map(([handedness, fingerType, fingerValue, style, color]) => {
    const isExtended = handStates[handedness]?.fingerStates[fingerType] ?? false;
    return {
      key: `${handedness}.${fingerType}`,
      value: isExtended ? fingerValue : 0,
      style,
      color, 
      isExtended,
    };
  });
  const fingerBlockData = fingerData.filter(f => f.style === "block");
  const fingerInlineData = fingerData.filter(f => f.style === "inline");

  const blockFingers = fingerBlockData.map(({ key, value, color, isExtended }) => {
    return (
      <div key={key} className="rounded-sm w-full" style={{ 
        opacity: isExtended ? 1 : 0.3,
        backgroundColor: color,
        flex: value,
      }}>
        {isExtended ? value : ''}
      </div>
    );
  });
  const inlineFingers = fingerInlineData.map(({ key, value, color, isExtended }) => {
    return (
      <div key={key} className="rounded-sm" style={{ 
        opacity: isExtended ? 1 : 0.3,
        backgroundColor: color,
        flex: value,
      }}>
        {isExtended ? value : ''}
      </div>
    );
  });
  const maxInlineValue = fingerInlineData.reduce((max, { value }) => Math.max(max, value), 0);

  return (
    <div className="flex flex-col w-full">
      {blockFingers}
      <div className="flex flex-row w-full" style={{
        flex: maxInlineValue,
      }}>
        {inlineFingers}
      </div>
    </div>
  );
};

const createEmptyHand = () => ({
  fingerStates: {
    thumb: false,
    indexFinger: false,
    middleFinger: false,
    ringFinger: false,
    pinkyFinger: false,
  }
});

/**
 * Checks:
 * 1. Each finger must be unique in the counting order.
 * 2. Finger values must be positive.
 * 3. Finger values must be in non-increasing order.
 * 
 * Not all ten fingers are required.
 * 
 * @param fingerValues 
 */
function validateFingerValues(fingerValues: FingerValueEntry[]): void {
  // 1. Each finger must be unique in the counting order.
  const numUnique = new Set(fingerValues.map(([handedness, fingerType]) => `${handedness}.${fingerType}`)).size;
  if (numUnique !== fingerValues.length) {
    throw new Error("Each finger must be unique in the counting order.");
  }

  // 2. Finger values must be positive.
  const hasNegativeValues = fingerValues.some(([,, value]) => value <= 0);
  if (hasNegativeValues) {
    throw new Error("Finger values must be positive.");
  }

  // 3. Finger values must be in non-increasing order.
  for (let i = 1; i < fingerValues.length; i++) {
    const latterValue = fingerValues[i][2]; 
    const formerValue = fingerValues[i - 1][2];
    if (latterValue > formerValue) {
      throw new Error("Finger values must be in non-increasing order.");
    }
  }
}