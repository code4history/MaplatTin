import { afterEach, expect } from "vitest";
import { toBeDeepCloseTo } from "jest-matcher-deep-close-to";

expect.extend({ toBeDeepCloseTo });

afterEach(() => {});
