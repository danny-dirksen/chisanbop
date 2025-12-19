import { expect } from "@std/expect";
import { CHISANBOP_COUNTING_METHOD } from "./CountingMethod.ts";
import { HandStates } from "../../models/HandStates.ts";
import "../../models/index.d.ts";

function createHandStates({
  left,
  right,
}: {
  left: boolean[],
  right: boolean[],
}): HandStates {
  return {
    left: {
      fingerStates: {
        thumb: left[0],
        indexFinger: left[1],
        middleFinger: left[2],
        ringFinger: left[3],
        pinkyFinger: left[4],
      }
    },
    right: {
      fingerStates: {
        thumb: right[0],
        indexFinger: right[1],
        middleFinger: right[2],
        ringFinger: right[3],
        pinkyFinger: right[4],
      }
    },
  };
}

// Chisenbop rules:
// Right hand:
//   Thumb: 5
//   Each finger: 1
// Left hand:
//   Thumb: 50
//   Each finger: 10

Deno.test("CHISANBOP_COUNTING_METHOD", async (t) => {
  await t.step("handStatesToValue", () => {
    const method = CHISANBOP_COUNTING_METHOD;

    expect(
      method.handStatesToValue(
        createHandStates({
          left: [false, false, false, false, false],
          right: [false, false, false, false, false],
        }),
      )
    ).toBe(0);

    expect(
      method.handStatesToValue(
        createHandStates({
          left: [true, true, false, false, false],
          right: [true, false, false, false, false],
        }),
      )
    ).toBe(50 + 10 + 5);

    expect(
      method.handStatesToValue(
        createHandStates({
          left: [true, true, true, true, true],
          right: [true, true, true, true, true],
        }),
      )
    ).toBe(50 + 10 + 10 + 10 + 10 + 5 + 1 + 1 + 1 + 1);
  });

  await t.step("valueToHandStates", () => {
    const method = CHISANBOP_COUNTING_METHOD;

    expect(
      method.valueToHandStates(0)
    ).toMatchObject(createHandStates({
      left: [false, false, false, false, false],
      right: [false, false, false, false, false],
    }) as unknown as {[k: string]: unknown});

    expect(
      method.valueToHandStates(65)
    ).toMatchObject(createHandStates({
      left: [true, true, false, false, false],
      right: [true, false, false, false, false],
    }) as unknown as {[k: string]: unknown});

    expect(
      method.valueToHandStates(99)
    ).toMatchObject(createHandStates({
      left: [true, true, true, true, true],
      right: [true, true, true, true, true],
    }) as unknown as {[k: string]: unknown});
    
    expect(
      method.valueToHandStates(100)
    ).toBeUndefined();

    expect(
      method.valueToHandStates(-1)
    ).toBeUndefined();
  });
});