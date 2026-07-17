import { prefersReducedMotion } from "./motion.js";

const ENTER_STATIC_DELAY = 1620;
const ENTER_FINISH_DELAY = 2050;
const FADE_DELAY = 230;
const FRAME_FINISH_DELAY = 1900;
const RETURN_FINISH_DELAY = 2420;
const REDUCED_DELAY = 90;

export function createIntroController({ elements }) {
  const { root, enter, remote } = elements.intro;
  const { shell } = elements;
  const pendingTimers = new Set();
  let isAnimating = false;

  function schedule(callback, delay) {
    const timer = window.setTimeout(() => {
      pendingTimers.delete(timer);
      callback();
    }, delay);

    pendingTimers.add(timer);
    return timer;
  }

  function clearTimers() {
    pendingTimers.forEach((timer) => window.clearTimeout(timer));
    pendingTimers.clear();
  }

  function setAppInteractive(isInteractive) {
    shell.inert = !isInteractive;
    document.body.classList.toggle("is-intro-active", !isInteractive);

    if (isInteractive) {
      shell.removeAttribute("aria-hidden");
      return;
    }

    shell.setAttribute("aria-hidden", "true");
  }

  function focusHub() {
    elements.hub.grid.querySelector("button")?.focus();
  }

  function finishFraming() {
    root.classList.remove("is-framing");
    enter.disabled = false;
    isAnimating = false;
    enter.focus({ preventScroll: true });
  }

  function startFraming() {
    root.classList.add("is-framing");

    if (prefersReducedMotion()) {
      root.classList.add("is-framed");
      schedule(finishFraming, REDUCED_DELAY);
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.classList.add("is-framed");
        schedule(finishFraming, FRAME_FINISH_DELAY);
      });
    });
  }

  function finishEntering() {
    root.classList.add("is-leaving");
    setAppInteractive(true);

    schedule(() => {
      root.hidden = true;
      root.classList.remove("is-leaving", "is-tuning", "is-returning");
      enter.disabled = false;
      isAnimating = false;
      focusHub();
    }, FADE_DELAY);
  }

  function enterApp() {
    if (isAnimating || root.hidden) {
      return false;
    }

    clearTimers();
    isAnimating = true;
    enter.disabled = true;
    root.classList.remove("is-leaving", "is-returning", "is-tuning");
    root.classList.add("is-zooming");
    remote.classList.add("is-visible");

    if (prefersReducedMotion()) {
      root.classList.add("is-tuning");
      schedule(finishEntering, REDUCED_DELAY);
      return true;
    }

    schedule(() => root.classList.add("is-tuning"), ENTER_STATIC_DELAY);
    schedule(finishEntering, ENTER_FINISH_DELAY);
    return true;
  }

  function finishReturning() {
    root.classList.remove("is-returning");
    enter.disabled = false;
    isAnimating = false;
    enter.focus({ preventScroll: true });
  }

  function returnToIntro() {
    if (isAnimating || !root.hidden) {
      return false;
    }

    clearTimers();
    isAnimating = true;
    enter.disabled = true;
    remote.classList.remove("is-visible");
    setAppInteractive(false);

    root.classList.add("is-resetting", "is-returning", "is-zooming", "is-tuning");
    root.classList.remove("is-leaving");
    root.hidden = false;
    root.scrollTo(0, 0);
    void root.offsetWidth;
    root.classList.remove("is-resetting");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.classList.remove("is-tuning", "is-zooming");
      });
    });

    schedule(
      finishReturning,
      prefersReducedMotion() ? REDUCED_DELAY : RETURN_FINISH_DELAY,
    );
    return true;
  }

  function bind() {
    enter.addEventListener("click", enterApp);
  }

  function initialize() {
    clearTimers();
    isAnimating = false;
    root.hidden = false;
    root.classList.remove(
      "is-framed",
      "is-framing",
      "is-leaving",
      "is-resetting",
      "is-returning",
      "is-tuning",
      "is-zooming",
    );
    enter.disabled = true;
    remote.classList.remove("is-visible");
    isAnimating = true;
    setAppInteractive(false);
    root.scrollTo(0, 0);
    void root.offsetWidth;
    startFraming();
  }

  return {
    bind,
    enterApp,
    initialize,
    isVisible: () => !root.hidden,
    returnToIntro,
  };
}
