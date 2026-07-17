import { prefersReducedMotion } from "./motion.js";

const FRAME_FINISH_DELAY = 1900;
const RETURN_FINISH_DELAY = 2420;
const REDUCED_DELAY = 90;
const REMOTE_CORNER_EXIT_DELAY = 460;
const REMOTE_ENTRANCE_FINISH_DELAY = 840;

export function createIntroController({ elements }) {
  const { root, enter, remote, remoteDirections } = elements.intro;
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

  function setRemoteVisible(isVisible) {
    remote.classList.toggle("is-visible", isVisible);
    remote.toggleAttribute("inert", !isVisible);
    remote.setAttribute("aria-hidden", String(!isVisible));
  }

  function setRemoteCorner(isCorner) {
    remote.classList.toggle("is-corner", isCorner);
    remote.classList.remove("is-corner-leaving", "is-repositioning");

    if (isCorner) {
      setRemoteVisible(false);
    }
  }

  function finishRemoteEntrance() {
    isAnimating = false;
  }

  function showRemoteFromBottom() {
    remote.classList.add("is-repositioning");
    remote.classList.remove("is-corner", "is-corner-leaving");
    setRemoteVisible(false);
    void remote.offsetWidth;
    remote.classList.remove("is-repositioning");

    window.requestAnimationFrame(() => {
      setRemoteVisible(true);
      schedule(
        finishRemoteEntrance,
        prefersReducedMotion() ? REDUCED_DELAY : REMOTE_ENTRANCE_FINISH_DELAY,
      );
    });
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

  function revealRemote() {
    if (isAnimating || root.hidden || remote.classList.contains("is-visible")) {
      return false;
    }

    isAnimating = true;
    enter.disabled = true;

    if (prefersReducedMotion()) {
      showRemoteFromBottom();
      return true;
    }

    remote.classList.add("is-corner-leaving");
    schedule(showRemoteFromBottom, REMOTE_CORNER_EXIT_DELAY);
    return true;
  }

  function finishReturning() {
    root.classList.remove("is-returning");
    setRemoteCorner(true);
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
    remote.classList.remove("is-corner", "is-corner-leaving", "is-repositioning");
    setRemoteVisible(false);
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
    enter.addEventListener("click", revealRemote);
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
    setRemoteVisible(false);
    setRemoteCorner(true);
    remoteDirections.forEach((direction) => {
      direction.disabled = true;
    });
    delete root.dataset.remoteDirection;
    isAnimating = true;
    setAppInteractive(false);
    root.scrollTo(0, 0);
    void root.offsetWidth;
    startFraming();
  }

  return {
    bind,
    enterApp: revealRemote,
    initialize,
    isVisible: () => !root.hidden,
    returnToIntro,
  };
}
