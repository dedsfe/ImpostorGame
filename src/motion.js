const DEFAULT_DURATION = 180;
const DEFAULT_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const activeAnimations = new WeakMap();

export function prefersReducedMotion(matchMedia = globalThis.matchMedia) {
  if (typeof matchMedia !== "function") {
    return false;
  }

  try {
    return matchMedia("(prefers-reduced-motion: reduce)").matches === true;
  } catch {
    return false;
  }
}

export function normalizeMotionOptions({
  duration = DEFAULT_DURATION,
  easing = DEFAULT_EASING,
} = {}) {
  const safeDuration = Number.isFinite(Number(duration))
    ? Math.min(240, Math.max(140, Number(duration)))
    : DEFAULT_DURATION;

  return {
    duration: safeDuration,
    easing: typeof easing === "string" && easing.trim() ? easing : DEFAULT_EASING,
    fill: "none",
  };
}

export function animateElement(
  element,
  keyframes,
  { matchMedia = globalThis.matchMedia, ...options } = {},
) {
  if (
    !element ||
    typeof element.animate !== "function" ||
    prefersReducedMotion(matchMedia)
  ) {
    return Promise.resolve(false);
  }

  activeAnimations.get(element)?.cancel();

  let animation;
  try {
    animation = element.animate(keyframes, normalizeMotionOptions(options));
  } catch {
    return Promise.resolve(false);
  }

  activeAnimations.set(element, animation);

  return Promise.resolve(animation.finished)
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      if (activeAnimations.get(element) === animation) {
        activeAnimations.delete(element);
      }
    });
}
