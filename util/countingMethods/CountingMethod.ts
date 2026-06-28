import { ComponentChildren } from "preact";
import { HandStates } from "../../models/HandStates.ts";

export interface CountingMethodRenderingContext {
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly handStates: HandStates;
  readonly value: number;
  readonly maxPossibleValue: number;
}

export interface FingerAnnotation {
  readonly handedness: Handedness;
  readonly fingerType: FingerType;
  readonly content: ComponentChildren;
}

export interface CountingMethod {
  // Display properties
  readonly displayName: string;
  readonly description: string;
  readonly getFingerAnnotations: (handStates: HandStates) => FingerAnnotation[];
  readonly render: (context: CountingMethodRenderingContext) => ComponentChildren;

  // Functional properties
  readonly issues: (handStates: HandStates) => string[];
  readonly value: (handStates: HandStates) => number;
  readonly canonicalForm: (value: number) => HandStates;
}