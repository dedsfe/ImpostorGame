import { prefersReducedMotion } from "./motion.js";

const FRAME_FINISH_DELAY = 1900;
const RETURN_FINISH_DELAY = 2420;
const REDUCED_DELAY = 90;
const REMOTE_CORNER_EXIT_DELAY = 460;
const REMOTE_ENTRANCE_FINISH_DELAY = 840;

export function createIntroController({
  elements,
  games,
  onOpenSettings,
  onStartGame,
}) {
  const { root, enter, remote, remoteConfirm, remoteDirections } = elements.intro;
  const { shell } = elements;
  const titleKicker = root.querySelector(".intro-title-kicker");
  const titleMain = root.querySelector(".intro-title-main");
  const gameSubtitle = root.querySelector("#intro-game-subtitle");
  const gameMenu = root.querySelector("#intro-game-menu");
  const menuButtons = Array.from(
    gameMenu.querySelectorAll("[data-intro-game-action]"),
  );
  const startMenuItem = gameMenu.querySelector(
    '[data-intro-game-action="start"]',
  );
  const settingsMenuItem = gameMenu.querySelector(
    '[data-intro-game-action="settings"]',
  );
  const availableGames = games?.length
    ? games
    : [
        {
          description:
            "Descubra quem está blefando antes que o grupo seja enganado.",
          openScreen: "impostorSetup",
          title: "Impostor",
        },
      ];
  const pendingTimers = new Set();
  let currentGameIndex = 0;
  let isAnimating = false;
  let isGamePreview = false;

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

  function setMenuEnabled(isEnabled) {
    menuButtons.forEach((button) => {
      button.disabled = !isEnabled;
    });
  }

  function selectMenuItem(selectedButton) {
    menuButtons.forEach((button) => {
      button.classList.toggle("is-selected", button === selectedButton);
    });
  }

  function setRemoteMenuEnabled(isEnabled) {
    remoteDirections.forEach((button) => {
      const direction = button.dataset.remoteDirection;
      const canNavigateMenu =
        isEnabled && (direction === "up" || direction === "down");
      const canNavigateGames =
        isEnabled &&
        availableGames.length > 1 &&
        (direction === "left" || direction === "right");
      const canNavigate = canNavigateMenu || canNavigateGames;

      button.disabled = !canNavigate;

      if (direction === "up") {
        button.setAttribute(
          "aria-label",
          canNavigate
            ? "Selecionar opção anterior"
            : "Direção para cima indisponível",
        );
      }

      if (direction === "down") {
        button.setAttribute(
          "aria-label",
          canNavigate
            ? "Selecionar próxima opção"
            : "Direção para baixo indisponível",
        );
      }

      if (direction === "left") {
        button.setAttribute(
          "aria-label",
          canNavigate ? "Jogo anterior" : "Jogo anterior indisponível",
        );
      }

      if (direction === "right") {
        button.setAttribute(
          "aria-label",
          canNavigate ? "Próximo jogo" : "Próximo jogo indisponível",
        );
      }
    });

    remoteConfirm.disabled = !isEnabled;
    remoteConfirm.setAttribute(
      "aria-label",
      isEnabled ? "Confirmar opção selecionada" : "Confirmação indisponível",
    );
  }

  function moveMenuSelection(offset) {
    if (isAnimating || !isGamePreview) {
      return false;
    }

    const selectedIndex = menuButtons.findIndex((button) =>
      button.classList.contains("is-selected"),
    );
    const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;
    const nextIndex =
      (currentIndex + offset + menuButtons.length) % menuButtons.length;

    selectMenuItem(menuButtons[nextIndex]);
    return true;
  }

  function getCurrentGame() {
    return availableGames[currentGameIndex];
  }

  function renderCurrentGame() {
    const currentGame = getCurrentGame();

    const currentPosition = String(currentGameIndex + 1).padStart(2, "0");
    const totalGames = String(availableGames.length).padStart(2, "0");

    titleKicker.textContent = `${currentPosition} / ${totalGames}`;
    root.dataset.introGame = currentGame.id ?? "";
    titleMain.textContent = currentGame.title;
    gameSubtitle.textContent = currentGame.description;
  }

  function moveGameSelection(offset) {
    if (isAnimating || !isGamePreview || availableGames.length < 2) {
      return false;
    }

    currentGameIndex =
      (currentGameIndex + offset + availableGames.length) %
      availableGames.length;
    renderCurrentGame();
    return true;
  }

  function confirmMenuSelection() {
    if (isAnimating || !isGamePreview) {
      return false;
    }

    const selectedButton =
      menuButtons.find((button) => button.classList.contains("is-selected")) ??
      startMenuItem;

    selectedButton.click();
    return true;
  }

  function setRemoteVisible(isVisible) {
    remote.classList.toggle("is-visible", isVisible);
    if (!isVisible) {
      remote.classList.remove("is-settled");
    }
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
    remote.classList.add("is-settled");
    isAnimating = false;

    if (isGamePreview) {
      setMenuEnabled(true);
      setRemoteMenuEnabled(true);
      startMenuItem.focus({ preventScroll: true });
      return;
    }

    enter.disabled = false;
    enter.focus({ preventScroll: true });
  }

  function renderLanding() {
    currentGameIndex = 0;
    isGamePreview = false;
    delete root.dataset.introGame;
    root.classList.remove("is-game-preview");
    titleKicker.textContent = "Noite de";
    titleMain.textContent = "Jogos";
    gameSubtitle.hidden = true;
    gameSubtitle.textContent = "";
    gameMenu.hidden = true;
    setMenuEnabled(false);
    setRemoteMenuEnabled(false);
    selectMenuItem(startMenuItem);
    enter.hidden = false;
    enter.textContent = "Jogar";
    enter.setAttribute("aria-label", "Entrar em Noite de Jogos");
  }

  function renderGamePreview() {
    isGamePreview = true;
    root.classList.add("is-game-preview");
    renderCurrentGame();
    gameSubtitle.hidden = false;
    enter.hidden = true;
    enter.disabled = true;
    gameMenu.hidden = false;
    setMenuEnabled(false);
    setRemoteMenuEnabled(false);
    selectMenuItem(startMenuItem);
  }

  function showRemoteFromBottom() {
    remote.classList.add("is-repositioning");
    remote.classList.remove("is-corner", "is-corner-leaving", "is-settled");
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
    renderGamePreview();

    if (prefersReducedMotion()) {
      showRemoteFromBottom();
      return true;
    }

    remote.classList.add("is-corner-leaving");
    schedule(showRemoteFromBottom, REMOTE_CORNER_EXIT_DELAY);
    return true;
  }

  function leaveIntro(onLeave) {
    if (isAnimating || !isGamePreview) {
      return false;
    }

    const selectedGame = getCurrentGame();
    isAnimating = true;
    setMenuEnabled(false);
    setRemoteMenuEnabled(false);
    remote.classList.add("is-repositioning");
    setRemoteVisible(false);
    root.classList.add("is-leaving");

    schedule(() => {
      root.hidden = true;
      root.classList.remove("is-leaving");
      remote.classList.remove("is-repositioning");
      setAppInteractive(true);
      onLeave?.(selectedGame);
      isAnimating = false;
    }, prefersReducedMotion() ? REDUCED_DELAY : 220);

    return true;
  }

  function startSelectedGame() {
    return leaveIntro(onStartGame);
  }

  function openSettings() {
    return leaveIntro(onOpenSettings);
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
    renderLanding();
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
    startMenuItem.addEventListener("click", startSelectedGame);
    settingsMenuItem.addEventListener("click", openSettings);
    remoteConfirm.addEventListener("click", confirmMenuSelection);

    menuButtons.forEach((button) => {
      button.addEventListener("pointerenter", () => selectMenuItem(button));
      button.addEventListener("focus", () => selectMenuItem(button));
    });

    remoteDirections.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.remoteDirection === "up") {
          moveMenuSelection(-1);
        }

        if (button.dataset.remoteDirection === "down") {
          moveMenuSelection(1);
        }

        if (button.dataset.remoteDirection === "left") {
          moveGameSelection(-1);
        }

        if (button.dataset.remoteDirection === "right") {
          moveGameSelection(1);
        }
      });
    });

  }

  function initialize() {
    clearTimers();
    isAnimating = false;
    renderLanding();
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
    setRemoteMenuEnabled(false);
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
