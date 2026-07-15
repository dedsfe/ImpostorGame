import assert from "node:assert/strict";
import test from "node:test";

import {
  animateElement,
  normalizeMotionOptions,
  prefersReducedMotion,
} from "../src/motion.js";

test("normalizes motion to the short product range", () => {
  assert.deepEqual(normalizeMotionOptions({ duration: 20 }), {
    duration: 140,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "none",
  });
  assert.equal(normalizeMotionOptions({ duration: 900 }).duration, 240);
});

test("detects reduced motion without requiring a browser", () => {
  assert.equal(prefersReducedMotion(undefined), false);
  assert.equal(
    prefersReducedMotion(() => ({ matches: true })),
    true,
  );
});

test("keeps the UI functional when animation is unavailable or reduced", async () => {
  assert.equal(await animateElement(null, []), false);

  let calls = 0;
  const element = {
    animate() {
      calls += 1;
      return { finished: Promise.resolve() };
    },
  };

  assert.equal(
    await animateElement(element, [], {
      matchMedia: () => ({ matches: true }),
    }),
    false,
  );
  assert.equal(calls, 0);
});

test("cancels an older animation before starting a new state change", async () => {
  let cancelled = 0;
  const element = {
    animate() {
      return {
        cancel() {
          cancelled += 1;
        },
        finished: Promise.resolve(),
      };
    },
  };

  const first = animateElement(element, [{ transform: "none" }], {
    matchMedia: () => ({ matches: false }),
  });
  const second = animateElement(element, [{ transform: "none" }], {
    matchMedia: () => ({ matches: false }),
  });

  await Promise.all([first, second]);
  assert.equal(cancelled, 1);
});
