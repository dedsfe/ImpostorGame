import {
  heroContent,
  hubGames,
  mimicaPools,
  whoAmIPools,
  wordPools,
} from "./data/catalogs.js";
import { rulesContent } from "./data/tutorials.js";
import { hydrateCatalogFromApi } from "./data/remote-catalog.js";
import { createInitialState } from "./viewmodels/app-state.js";
import { getElements } from "./views/elements.js";
import { createCityController } from "./games/city.js";
import { createImpostorController } from "./games/impostor.js";
import { createMimicaController } from "./games/mimica.js";
import { createPoliceController } from "./games/police.js";
import { createWhoAmIController } from "./games/whoami.js";
import { normalizeWord } from "./shared/utils.js";

document.documentElement.dataset.catalogSource = "local";
const catalogRuntimePromise = hydrateCatalogFromApi();

const state = createInitialState();
const APP_VERSION = "v39";

const elements = getElements();
const hubGamesById = new Map(hubGames.map((game) => [game.id, game]));
const hubHoverMediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
let lastHubModalTrigger = null;
let lastRulesModalTrigger = null;

function normalizePlayerName(value) {
  return normalizeWord(String(value ?? ""));
}

function setHero(content) {
  elements.heroEyebrow.textContent = content.eyebrow;
  elements.heroTitle.textContent = content.title;
  elements.heroCopy.textContent = content.copy;
}

function getHubGame(gameId) {
  return hubGamesById.get(gameId) ?? null;
}

function createHubCard(game) {
  const article = document.createElement("article");
  const media = document.createElement("div");
  const image = document.createElement("img");
  const video = game.hoverVideo ? document.createElement("video") : null;
  const scrim = document.createElement("div");
  const content = document.createElement("div");
  const label = document.createElement("p");
  const title = document.createElement("h2");
  const action = document.createElement("button");

  article.className = "hub-card";
  article.dataset.gameId = game.id;
  article.tabIndex = 0;
  article.setAttribute("role", "button");
  article.setAttribute("aria-haspopup", "dialog");
  article.setAttribute("aria-label", `Ver jogo ${game.title}`);

  media.className = "hub-card-media has-image";
  image.className = "hub-card-media-image";
  image.src = game.cardImage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  image.loading = "lazy";
  image.decoding = "async";

  if (video) {
    article.dataset.hoverVideo = "true";
    media.classList.add("has-hover-video");
    video.className = "hub-card-media-video";
    video.src = game.hoverVideo;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.poster = game.cardImage;
    video.setAttribute("aria-hidden", "true");
    video.tabIndex = -1;
  }

  scrim.className = "hub-card-scrim";

  content.className = "hub-card-content";
  label.className = "hub-card-label";
  label.textContent = game.label;
  title.className = "hub-card-title";
  title.textContent = game.title;

  action.className = "hub-card-action";
  action.type = "button";
  action.textContent = "Ver jogo";
  action.setAttribute("aria-label", `Ver jogo ${game.title}`);

  content.append(label, title, action);
  if (video) {
    media.append(image, video, scrim, content);
  } else {
    media.append(image, scrim, content);
  }
  article.append(media);

  if (video) {
    article.addEventListener("mouseenter", () => {
      playHubCardVideo(article);
    });
    article.addEventListener("mouseleave", () => {
      stopHubCardVideo(article);
    });
  }

  return article;
}

function renderHubCards() {
  elements.hub.grid.replaceChildren(...hubGames.map((game) => createHubCard(game)));
}

function renderHubModal() {
  const game = getHubGame(state.hubModalGameId);
  const isOpen = state.hubModalOpen && Boolean(game);

  elements.hub.modal.hidden = !isOpen;
  document.body.classList.toggle("is-hub-modal-open", isOpen);

  if (!isOpen || !game) {
    elements.hub.modalImage.removeAttribute("src");
    elements.hub.modalImage.alt = "";
    elements.hub.modal.removeAttribute("data-media-fit");
    elements.hub.modalLabel.textContent = "";
    elements.hub.modalTitle.textContent = "";
    elements.hub.modalDescription.textContent = "";
    elements.hub.modalStart.dataset.gameId = "";
    return;
  }

  const imageSrc = game.modalImage ?? game.cardImage;
  const mediaFit = game.modalImage ? "cover" : "contain";

  elements.hub.modal.dataset.mediaFit = mediaFit;
  elements.hub.modalImage.src = imageSrc;
  elements.hub.modalImage.alt = game.title;
  elements.hub.modalLabel.textContent = game.label;
  elements.hub.modalTitle.textContent = game.title;
  elements.hub.modalDescription.textContent = game.description;
  elements.hub.modalStart.dataset.gameId = game.id;
  queueMicrotask(() => {
    if (state.hubModalOpen && state.hubModalGameId === game.id) {
      elements.hub.modalStart.focus();
    }
  });
}

function getHubModalFocusableElements() {
  return [
    elements.hub.modalClose,
    elements.hub.modalStart,
  ].filter((element) => element && !element.hidden && !element.disabled);
}

function renderRulesModal() {
  const content = rulesContent[state.rulesModalGameId] ?? null;
  const isOpen = state.rulesModalOpen && Boolean(content);
  elements.rules.modal.hidden = !isOpen;
  document.body.classList.toggle("is-rules-modal-open", isOpen);

  if (!isOpen || !content) {
    elements.rules.label.textContent = "Como jogar";
    elements.rules.title.textContent = "";
    elements.rules.copy.textContent = "";
    elements.rules.steps.replaceChildren();
    return;
  }

  const items = content.steps.map((step) => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const copy = document.createElement("span");

    item.className = "rules-step";
    title.textContent = step.title;
    copy.textContent = step.copy;
    item.append(title, copy);
    return item;
  });

  elements.rules.label.textContent = "Como jogar";
  elements.rules.title.textContent = content.title;
  elements.rules.copy.textContent = content.copy;
  elements.rules.steps.replaceChildren(...items);

  queueMicrotask(() => {
    if (state.rulesModalOpen) {
      elements.rules.confirm.focus();
    }
  });
}

function getRulesModalFocusableElements() {
  return [
    elements.rules.close,
    elements.rules.confirm,
  ].filter((element) => element && !element.hidden && !element.disabled);
}

function preloadHubImages() {
  const imageSources = new Set();

  hubGames.forEach((game) => {
    imageSources.add(game.cardImage);
    imageSources.add(game.modalImage ?? game.cardImage);
  });

  imageSources.forEach((src) => {
    if (!src) {
      return;
    }

    const image = new Image();
    image.src = src;
  });
}

function stopHubCardVideo(card, { reset = true } = {}) {
  if (!(card instanceof HTMLElement)) {
    return;
  }

  const video = card.querySelector(".hub-card-media-video");

  if (!(video instanceof HTMLVideoElement)) {
    return;
  }

  card.classList.remove("is-video-active");
  video.pause();

  if (reset) {
    try {
      video.currentTime = 0;
    } catch {}
  }
}

function stopHubCardVideos({ reset = true } = {}) {
  document.querySelectorAll(".hub-card[data-hover-video='true']").forEach((card) => {
    stopHubCardVideo(card, { reset });
  });
}

function playHubCardVideo(card) {
  if (
    !hubHoverMediaQuery.matches ||
    !(card instanceof HTMLElement) ||
    state.currentScreen !== "hub" ||
    state.hubModalOpen
  ) {
    return;
  }

  const video = card.querySelector(".hub-card-media-video");

  if (!(video instanceof HTMLVideoElement)) {
    return;
  }

  stopHubCardVideos({ reset: true });
  card.classList.add("is-video-active");

  const playAttempt = video.play();

  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {
      stopHubCardVideo(card);
    });
  }
}

function openHubModal(gameId, trigger = null) {
  if (!getHubGame(gameId)) {
    return;
  }

  stopHubCardVideos();
  lastHubModalTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
  state.hubModalGameId = gameId;
  state.hubModalOpen = true;
  renderHubModal();
}

function closeHubModal() {
  if (!state.hubModalOpen && state.hubModalGameId === null) {
    return;
  }

  state.hubModalOpen = false;
  state.hubModalGameId = null;
  renderHubModal();

  queueMicrotask(() => {
    if (lastHubModalTrigger instanceof HTMLElement && lastHubModalTrigger.isConnected) {
      lastHubModalTrigger.focus();
    }
    lastHubModalTrigger = null;
  });
}

function openRulesModal(gameId, trigger = null) {
  if (!rulesContent[gameId]) {
    return;
  }

  lastRulesModalTrigger =
    trigger instanceof HTMLElement ? trigger : document.activeElement;
  state.rulesModalGameId = gameId;
  state.rulesModalOpen = true;
  renderRulesModal();
}

function closeRulesModal({ restoreFocus = true } = {}) {
  if (!state.rulesModalOpen) {
    lastRulesModalTrigger = restoreFocus ? lastRulesModalTrigger : null;
    return;
  }

  state.rulesModalOpen = false;
  state.rulesModalGameId = null;
  renderRulesModal();

  if (!restoreFocus) {
    lastRulesModalTrigger = null;
    return;
  }

  queueMicrotask(() => {
    if (
      lastRulesModalTrigger instanceof HTMLElement &&
      lastRulesModalTrigger.isConnected
    ) {
      lastRulesModalTrigger.focus();
    }

    lastRulesModalTrigger = null;
  });
}

function openGameFromHubScreen(screen) {
  const controller = gameControllersByScreen.get(screen);

  if (controller) {
    controller.openSetup();
    return;
  }

}

function startHubModalGame() {
  const game = getHubGame(state.hubModalGameId);

  if (!game) {
    closeHubModal();
    return;
  }

  closeHubModal();
  openGameFromHubScreen(game.openScreen);
}

function getFullscreenElement() {
  return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
}

async function enterFullscreenFor(target) {

  if (getFullscreenElement() === target || getFullscreenElement()) {
    return;
  }

  try {
    if (target.requestFullscreen) {
      await target.requestFullscreen();
      return;
    }

    if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    }
  } catch {}
}

async function enterWhoAmIFullscreen() {
  await enterFullscreenFor(elements.screens.whoamiReveal);
}

async function enterMimicaFullscreen() {
  await enterFullscreenFor(elements.screens.mimicaPlay);
}

async function exitFullscreenIfNeeded() {
  try {
    if (document.exitFullscreen && document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    }
  } catch {}
}

function setActiveScreen(screen) {
  state.currentScreen = screen;
  document.body.classList.toggle("is-whoami-reveal", screen === "whoamiReveal");
  document.body.classList.toggle("is-mimica-play", screen === "mimicaPlay");

  if (screen !== "hub") {
    stopHubCardVideos();
  }

  if (
    !["impostorSetup", "policeSetup", "citySetup", "whoamiSetup", "mimicaSetup"].includes(
      screen,
    ) &&
    state.rulesModalOpen
  ) {
    closeRulesModal({ restoreFocus: false });
  }

  if (screen !== "hub") {
    closeHubModal();
  }

  Object.entries(elements.screens).forEach(([key, element]) => {
    element.classList.toggle("is-active", key === screen);
  });

  if (screen !== "whoamiReveal" && screen !== "mimicaPlay") {
    exitFullscreenIfNeeded();
  }

  if (screen === "hub") {
    setHero(heroContent.hub);
    return;
  }

  if (screen === "impostorSetup") {
    setHero(heroContent.impostorSetup);
    return;
  }

  if (screen === "policeSetup") {
    setHero(heroContent.policeSetup);
    return;
  }

  if (screen === "citySetup") {
    setHero(heroContent.citySetup);
    return;
  }

  if (screen === "mimicaSetup" || screen === "mimicaPrep") {
    setHero(heroContent.mimicaSetup);
    return;
  }

  if (screen === "whoamiSetup") {
    setHero(heroContent.whoamiSetup);
  }
}

function clearRoleTone() {
  const toneClasses = ["is-impostor", "is-police", "is-thief", "is-victim"];
  toneClasses.forEach((className) => {
    elements.turn.panel.classList.remove(className);
    elements.turn.wordCard.classList.remove(className);
  });
}

function setTurnPhase(phase) {
  const isPrep = phase === "prep";
  elements.turn.prepView.classList.toggle("is-active", isPrep);
  elements.turn.revealView.classList.toggle("is-active", !isPrep);
  elements.turn.panel.classList.toggle("is-prep", isPrep);
  elements.turn.panel.classList.toggle("is-reveal", !isPrep);
}

function resetTurnPlayers() {
  state.currentPlayer = 0;
  state.playerNames = [];
  elements.turn.playerName.value = "";
  elements.turn.revealRole.disabled = true;
}

function shouldRequirePlayerNames() {
  return state.currentGame?.requirePlayerNames !== false;
}

function getCurrentPlayerName() {
  return state.playerNames[state.currentPlayer] ?? "";
}

function getCurrentPlayerLabel() {
  return getCurrentPlayerName() || `Jogador ${state.currentPlayer + 1}`;
}

function syncCurrentPlayerName() {
  if (!shouldRequirePlayerNames()) {
    elements.turn.revealRole.disabled = false;
    return "";
  }

  const playerName = normalizePlayerName(elements.turn.playerName.value);
  state.playerNames[state.currentPlayer] = playerName;
  elements.turn.revealRole.disabled = playerName.length === 0;
  return playerName;
}

function getPublicRoleLabel(role) {
  if (role.tone === "impostor") {
    return "Impostor";
  }

  return role.value || role.badge || role.title;
}

function renderRoleRevealList() {
  const roles = state.currentGame?.roles ?? [];

  elements.end.roleRevealList.replaceChildren(
    ...roles.map((role, playerIndex) => {
      const item = document.createElement("article");
      const name = document.createElement("strong");
      const roleLabel = document.createElement("span");
      const fallbackName = `Jogador ${playerIndex + 1}`;

      item.className = "role-reveal-item";
      item.classList.toggle("is-impostor", role.tone === "impostor");
      name.textContent = state.playerNames[playerIndex] || fallbackName;
      roleLabel.textContent = getPublicRoleLabel(role);
      item.append(name, roleLabel);

      return item;
    }),
  );
}

function setRoleRevealVisible(isVisible) {
  elements.end.roleRevealPanel.hidden = !isVisible;
  elements.end.showRoleReveal.textContent = isVisible
    ? "Ocultar quem é quem"
    : "Mostrar quem é quem";
}

function renderAppVersion() {
  elements.appVersion.textContent = APP_VERSION;
}

function renderTurnSecret(role) {
  const isVisible = state.turnRevealVisible;
  const shouldShowImpostorHint = isVisible && role.tone === "impostor";

  elements.turn.toggleVisibility.setAttribute("aria-pressed", String(isVisible));
  elements.turn.toggleVisibility.setAttribute(
    "aria-label",
    isVisible ? "Esconder papel" : "Ver papel",
  );
  elements.turn.toggleVisibility.classList.toggle("is-visible", isVisible);
  elements.turn.toggleVisibilityLabel.textContent = isVisible
    ? "Esconder papel"
    : "Ver papel";
  elements.turn.wordCard.classList.toggle("is-concealed", !isVisible);
  elements.turn.impostorHint.hidden = !shouldShowImpostorHint;
  elements.turn.impostorHint.textContent = shouldShowImpostorHint ? role.hint : "";

  if (!isVisible) {
    elements.turn.roleBadge.textContent = "Papel oculto";
    elements.turn.roleTitle.textContent = "Toque para ver seu papel";
    elements.turn.roleDescription.textContent =
      "Use o botão de olho para revelar somente quando a tela estiver protegida.";
    elements.turn.wordCard.textContent = "••••";
    return;
  }

  elements.turn.roleBadge.textContent = role.badge;
  elements.turn.roleTitle.textContent = role.title;
  elements.turn.roleDescription.textContent = role.description;
  elements.turn.wordCard.textContent = role.value;
}

function openHub() {
  state.currentGame = null;
  resetTurnPlayers();
  closeHubModal();
  clearRoleTone();
  setTurnPhase("prep");
  gameControllers.forEach((controller) => controller.cleanup?.());
  setActiveScreen("hub");
}

function openRoleSetup(screen) {
  state.currentGame = null;
  resetTurnPlayers();
  clearRoleTone();
  setTurnPhase("prep");
  setActiveScreen(screen);
}

function startRoleGame(game) {
  state.currentGame = game;
  resetTurnPlayers();
  renderPreparation();
}

function renderPreparation() {
  const playerNumber = state.currentPlayer + 1;
  const playerName = getCurrentPlayerName();
  const requirePlayerNames = shouldRequirePlayerNames();

  setHero({
    eyebrow: state.currentGame.name,
    title: "Passe para o próximo jogador",
    copy:
      "Mantenha a tela coberta e revele o papel somente quando a pessoa certa estiver pronta.",
  });
  state.turnRevealVisible = false;
  elements.turn.panel.dataset.game = state.currentGame.type;
  elements.turn.gameLabel.textContent = state.currentGame.name;
  elements.turn.progress.textContent = `Jogador ${playerNumber} de ${state.currentGame.totalPlayers}`;
  elements.turn.prepTitle.textContent = `Prepare o Jogador ${playerNumber}`;
  elements.turn.prepDescription.textContent =
    requirePlayerNames
      ? "Digite o nome antes de revelar. Só a pessoa com esse nome deve tocar para ver o papel."
      : "Passe o celular com a tela coberta e toque em mostrar apenas quando a pessoa estiver pronta.";
  elements.turn.playerName.closest(".turn-name-field").hidden = !requirePlayerNames;
  elements.turn.playerName.value = playerName;
  syncCurrentPlayerName();

  clearRoleTone();
  setTurnPhase("prep");
  setActiveScreen("turn");
  if (requirePlayerNames) {
    elements.turn.playerName.focus();
  }
}

function renderReveal() {
  const playerNumber = state.currentPlayer + 1;
  const isLastPlayer = state.currentPlayer === state.currentGame.totalPlayers - 1;
  const role = state.currentGame.roles[state.currentPlayer];
  const playerLabel = getCurrentPlayerLabel();

  setHero(state.currentGame.hero);
  state.turnRevealVisible = false;
  elements.turn.panel.dataset.game = state.currentGame.type;
  elements.turn.gameLabel.textContent = state.currentGame.name;
  elements.turn.progress.textContent = `${playerLabel} (${playerNumber} de ${state.currentGame.totalPlayers})`;
  elements.turn.nextPlayer.textContent = isLastPlayer
    ? "Finalizar distribuição"
    : "Próximo jogador";

  clearRoleTone();
  if (role.tone === "impostor") {
    elements.turn.panel.classList.add("is-impostor");
    elements.turn.wordCard.classList.add("is-impostor");
  }
  if (role.tone === "police") {
    elements.turn.panel.classList.add("is-police");
    elements.turn.wordCard.classList.add("is-police");
  }
  if (role.tone === "thief") {
    elements.turn.panel.classList.add("is-thief");
    elements.turn.wordCard.classList.add("is-thief");
  }
  if (role.tone === "victim") {
    elements.turn.panel.classList.add("is-victim");
    elements.turn.wordCard.classList.add("is-victim");
  }

  renderTurnSecret(role);
  setTurnPhase("reveal");
  setActiveScreen("turn");
}

function renderEndScreen() {
  setHero({
    eyebrow: state.currentGame.name,
    title: "Rodada pronta",
    copy: "Todos os papéis foram entregues. Agora o jogo começa fora da tela.",
  });

  elements.end.panel.dataset.game = state.currentGame.type;
  elements.end.label.textContent = state.currentGame.endLabel;
  elements.end.title.textContent = state.currentGame.endTitle;
  let descriptionText = state.currentGame.endDescription;

  if (state.currentGame.type === "impostor") {
    const starterIndex = Math.floor(Math.random() * state.currentGame.totalPlayers);
    const starterName = state.playerNames[starterIndex] || `Jogador ${starterIndex + 1}`;
    descriptionText += ` Sorteio: quem começa perguntando é ${starterName}!`;
  }

  elements.end.description.textContent = descriptionText;
  const instructions = state.currentGame.instructions ?? [];
  elements.end.instructions.hidden = instructions.length === 0;
  elements.end.instructions.replaceChildren(
    ...instructions.map((instruction) => {
      const item = document.createElement("li");
      item.textContent = instruction;
      return item;
    }),
  );
  elements.end.playAgain.textContent = `Nova partida de ${state.currentGame.name}`;
  elements.end.summaryGrid.replaceChildren(
    ...state.currentGame.summary.map((item) => {
      const card = document.createElement("article");
      const label = document.createElement("span");
      const value = document.createElement("strong");

      card.className = "summary-card";
      label.className = "summary-label";
      label.textContent = item.label;
      value.textContent = item.value;
      card.append(label, value);

      return card;
    }),
  );
  renderRoleRevealList();
  setRoleRevealVisible(false);

  setActiveScreen("end");
}

function restartCurrentGame() {
  if (!state.currentGame) {
    openHub();
    return;
  }

  const controller = gameControllersById.get(state.currentGame.type);

  if (controller) {
    controller.openSetup();
    return;
  }

  openHub();
}

const gameControllers = [
  createImpostorController({
    elements: elements.impostor,
    openHub,
    openRoleSetup,
    pools: wordPools,
    startRoleGame,
  }),
  createPoliceController({
    elements: elements.police,
    openHub,
    openRoleSetup,
    startRoleGame,
  }),
  createCityController({
    elements: elements.city,
    openHub,
    openRoleSetup,
    startRoleGame,
  }),
  createMimicaController({
    elements: elements.mimica,
    enterFullscreen: enterMimicaFullscreen,
    openHub,
    pools: mimicaPools,
    showScreen: setActiveScreen,
    state,
  }),
  createWhoAmIController({
    elements: elements.whoami,
    enterFullscreen: enterWhoAmIFullscreen,
    openHub,
    pools: whoAmIPools,
    showScreen: setActiveScreen,
    state,
  }),
];
const gameControllersById = new Map(
  gameControllers.map((controller) => [controller.id, controller]),
);
const gameControllersByScreen = new Map(
  gameControllers.map((controller) => [controller.setupScreen, controller]),
);

gameControllers.forEach((controller) => {
  controller.bind();
  controller.initialize();
});

elements.hub.grid.addEventListener("click", (event) => {
  const card = event.target.closest(".hub-card[data-game-id]");

  if (!card) {
    return;
  }

  const trigger = event.target.closest(".hub-card-action") ?? card;
  openHubModal(card.dataset.gameId, trigger);
});

elements.hub.grid.addEventListener("keydown", (event) => {
  const card = event.target.closest(".hub-card[data-game-id]");

  if (!card || event.target !== card || (event.key !== "Enter" && event.key !== " ")) {
    return;
  }

  event.preventDefault();
  openHubModal(card.dataset.gameId, card);
});

hubHoverMediaQuery.addEventListener("change", (event) => {
  if (!event.matches) {
    stopHubCardVideos();
  }
});

elements.hub.modal.addEventListener("click", (event) => {
  if (event.target === elements.hub.modal) {
    closeHubModal();
  }
});

elements.hub.modalClose.addEventListener("click", closeHubModal);
elements.hub.modalStart.addEventListener("click", startHubModalGame);

elements.navHome.addEventListener("click", openHub);
elements.rules.buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    openRulesModal(button.dataset.rulesGame, event.currentTarget);
  });
});
elements.rules.modal.addEventListener("click", (event) => {
  if (event.target === elements.rules.modal) {
    closeRulesModal();
  }
});
elements.rules.close.addEventListener("click", () => {
  closeRulesModal();
});
elements.rules.confirm.addEventListener("click", () => {
  closeRulesModal();
});

elements.turn.playerName.addEventListener("input", syncCurrentPlayerName);
elements.turn.playerName.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();

  if (!elements.turn.revealRole.disabled) {
    renderReveal();
  }
});

elements.turn.revealRole.addEventListener("click", () => {
  if (shouldRequirePlayerNames() && !syncCurrentPlayerName()) {
    elements.turn.playerName.focus();
    return;
  }

  renderReveal();
});
elements.turn.toggleVisibility.addEventListener("click", () => {
  if (
    !state.currentGame ||
    !elements.turn.revealView.classList.contains("is-active")
  ) {
    return;
  }

  state.turnRevealVisible = !state.turnRevealVisible;
  renderTurnSecret(state.currentGame.roles[state.currentPlayer]);
});

elements.turn.nextPlayer.addEventListener("click", () => {
  const isLastPlayer = state.currentPlayer === state.currentGame.totalPlayers - 1;

  if (isLastPlayer) {
    renderEndScreen();
    return;
  }

  state.currentPlayer += 1;
  renderPreparation();
});

elements.turn.restart.addEventListener("click", restartCurrentGame);
elements.turn.goHub.addEventListener("click", openHub);
elements.end.showRoleReveal.addEventListener("click", () => {
  setRoleRevealVisible(elements.end.roleRevealPanel.hidden);
});
elements.end.playAgain.addEventListener("click", restartCurrentGame);
elements.end.goHub.addEventListener("click", openHub);

document.addEventListener("keydown", (event) => {
  if (state.rulesModalOpen) {
    if (event.key === "Escape") {
      closeRulesModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = getRulesModalFocusableElements();

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }

    return;
  }

  if (!state.hubModalOpen) {
    return;
  }

  if (event.key === "Escape") {
    closeHubModal();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusable = getHubModalFocusableElements();

  if (focusable.length === 0) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

preloadHubImages();
renderAppVersion();
renderHubCards();
renderHubModal();
renderRulesModal();
setActiveScreen("hub");

void catalogRuntimePromise.then((catalogRuntime) => {
  document.documentElement.dataset.catalogSource = catalogRuntime.source;
  renderRulesModal();
  gameControllers.forEach((controller) => controller.initialize());
});
