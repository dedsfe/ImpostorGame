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
import {
  buildCityGame,
  buildImpostorGame,
  buildPoliceGame,
} from "./viewmodels/game-factories.js";
import {
  buildShuffledDeck,
  clampCityPlayers,
  clampInteger,
  clampOptionalRoleCount,
  clampPlayers,
  clampRoleCount,
  getMimicaEntryKey,
  getWhoAmIEntryKey,
  normalizeMimicaEntry,
  normalizeWhoAmIEntry,
  normalizeWord,
  pluralize,
  randomIndex,
} from "./shared/utils.js";

const catalogRuntime = await hydrateCatalogFromApi();
document.documentElement.dataset.catalogSource = catalogRuntime.source;

const state = createInitialState();
const APP_VERSION = "v38";

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
  if (screen === "impostorSetup") {
    openImpostorSetup();
    return;
  }

  if (screen === "policeSetup") {
    openPoliceSetup();
    return;
  }

  if (screen === "citySetup") {
    openCitySetup();
    return;
  }

  if (screen === "mimicaSetup") {
    openMimicaSetup();
    return;
  }

  if (screen === "whoamiSetup") {
    openWhoAmISetup();
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

function setImpostorWordVisibility(isVisible) {
  elements.impostor.secretWord.type = isVisible ? "text" : "password";
  elements.impostor.toggleVisibility.setAttribute("aria-pressed", String(isVisible));
  elements.impostor.toggleVisibility.setAttribute(
    "aria-label",
    isVisible ? "Esconder palavra secreta" : "Mostrar palavra secreta",
  );
  elements.impostor.toggleVisibility.classList.toggle("is-visible", isVisible);
  elements.impostor.toggleLabel.textContent = isVisible ? "Ocultar" : "Mostrar";
}

function updateImpostorFeedback(message = "") {
  elements.impostor.feedback.textContent = message;
}

function updatePoliceFeedback(message = "") {
  elements.police.feedback.textContent = message;
}

function updateCityFeedback(message = "") {
  elements.city.feedback.textContent = message;
}

function updateWhoAmIFeedback(message = "") {
  elements.whoami.feedback.textContent = message;
}

function updateMimicaFeedback(message = "") {
  elements.mimica.feedback.textContent = message;
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

function syncImpostorPlayerInput(nextValue) {
  const safeValue = clampPlayers(nextValue);
  elements.impostor.playerCount.value = safeValue;
  syncImpostorCountInput(elements.impostor.impostorCount.value);
  return safeValue;
}

function syncImpostorCountInput(nextValue) {
  const totalPlayers = clampPlayers(elements.impostor.playerCount.value);
  const maxImpostors = Math.max(1, totalPlayers - 1);
  const safeValue = clampInteger(nextValue, 1, maxImpostors, 1);

  elements.impostor.impostorCount.max = maxImpostors;
  elements.impostor.impostorCount.value = safeValue;
  return safeValue;
}

function syncImpostorCategoryInput(nextValue) {
  const safeCategory = Object.prototype.hasOwnProperty.call(wordPools, nextValue)
    ? nextValue
    : "geral";
  elements.impostor.wordCategory.value = safeCategory;
  return safeCategory;
}

function syncImpostorDifficultyInput(nextValue) {
  const safeDifficulty =
    nextValue === "facil" || nextValue === "medio" || nextValue === "dificil"
      ? nextValue
      : "dificil";
  elements.impostor.wordDifficulty.value = safeDifficulty;
  return safeDifficulty;
}

function getWordFromCategory(category, difficulty) {
  const categoryPool = wordPools[category] ?? wordPools.geral;
  const words = categoryPool[difficulty] ?? wordPools.geral.medio;
  return words[randomIndex(words.length)];
}

function getMimicaWord(category, difficulty) {
  const categoryPool = mimicaPools[category] ?? mimicaPools.geral;
  const words = categoryPool[difficulty] ?? mimicaPools.geral.medio;
  const currentKey =
    state.mimica.currentWord === "" ? "" : getMimicaEntryKey(state.mimica.currentWord);
  const candidateWords =
    words.length > 1
      ? words.filter((word) => getMimicaEntryKey(word) !== currentKey)
      : words;
  const nextWord = candidateWords[randomIndex(candidateWords.length)];

  state.mimica.currentWord = nextWord;
  return nextWord;
}

function updateMimicaPoolInfo() {
  const categoryPool = mimicaPools[state.mimica.category] ?? mimicaPools.geral;
  const words = categoryPool[state.mimica.difficulty] ?? mimicaPools.geral.medio;
  const wordLabel = words.length === 1 ? "palavra" : "palavras";

  elements.mimica.poolInfo.textContent = `${words.length.toLocaleString("pt-BR")} ${wordLabel} disponíveis nesta seleção.`;
}

function syncMimicaCategoryInput(nextValue) {
  const safeCategory = Object.prototype.hasOwnProperty.call(mimicaPools, nextValue)
    ? nextValue
    : "geral";

  if (state.mimica.category !== safeCategory) {
    state.mimica.remainingWords = [];
    state.mimica.currentWord = "";
    state.mimica.deckKey = `${safeCategory}:${state.mimica.difficulty}`;
  }

  state.mimica.category = safeCategory;
  elements.mimica.category.value = safeCategory;
  updateMimicaPoolInfo();
  return safeCategory;
}

function syncMimicaDifficultyInput(nextValue) {
  const safeDifficulty =
    nextValue === "facil" || nextValue === "medio" || nextValue === "dificil"
      ? nextValue
      : "medio";

  if (state.mimica.difficulty !== safeDifficulty) {
    state.mimica.remainingWords = [];
    state.mimica.currentWord = "";
    state.mimica.deckKey = `${state.mimica.category}:${safeDifficulty}`;
  }

  state.mimica.difficulty = safeDifficulty;
  elements.mimica.difficulty.value = safeDifficulty;
  updateMimicaPoolInfo();
  return safeDifficulty;
}

function syncMimicaTimeInput(nextValue) {
  const safeTime =
    nextValue === "30" || nextValue === "45" || nextValue === "60"
      ? Number(nextValue)
      : null;

  state.mimica.timePerRound = safeTime;
  elements.mimica.time.value = safeTime === null ? "none" : String(safeTime);
  return safeTime;
}

function clearMimicaTimer() {
  if (state.mimica.timerId !== null) {
    clearInterval(state.mimica.timerId);
    state.mimica.timerId = null;
  }
}

function resetMimicaRoundState() {
  clearMimicaTimer();
  state.mimica.timeRemaining = state.mimica.timePerRound ?? 0;
  state.mimica.currentDuration = state.mimica.timePerRound ?? 0;
  state.mimica.timedOut = false;
  state.mimica.solved = false;
}

function renderMimicaTimer() {
  const hasTimer = state.mimica.timePerRound !== null;
  const duration = state.mimica.currentDuration || 1;
  const ratio = hasTimer ? Math.max(0, state.mimica.timeRemaining / duration) : 1;

  elements.mimica.timerWrap.hidden = !hasTimer;
  if (hasTimer) {
    elements.mimica.timer.textContent = `${state.mimica.timeRemaining}s`;
    elements.mimica.progressFill.style.width = `${Math.max(0, ratio * 100)}%`;
  } else {
    elements.mimica.progressFill.style.width = "100%";
  }
}

function updateMimicaVisualState() {
  elements.mimica.play.classList.remove("is-timed-out", "is-success");

  if (state.mimica.solved) {
    elements.mimica.play.classList.add("is-success");
    elements.mimica.status.textContent = "Acertaram!";
    return;
  }

  if (state.mimica.timedOut) {
    elements.mimica.play.classList.add("is-timed-out");
    elements.mimica.status.textContent = "Tempo esgotado!";
    return;
  }

  elements.mimica.status.textContent =
    state.mimica.timePerRound === null ? "Valendo!" : "Tempo correndo";
}

function startMimicaTimer() {
  clearMimicaTimer();

  if (state.mimica.timePerRound === null) {
    renderMimicaTimer();
    updateMimicaVisualState();
    return;
  }

  state.mimica.timeRemaining = state.mimica.timePerRound;
  state.mimica.currentDuration = state.mimica.timePerRound;
  renderMimicaTimer();
  updateMimicaVisualState();

  state.mimica.timerId = setInterval(() => {
    if (state.mimica.timeRemaining <= 1) {
      state.mimica.timeRemaining = 0;
      clearMimicaTimer();
      state.mimica.timedOut = true;
      renderMimicaTimer();
      updateMimicaVisualState();
      return;
    }

    state.mimica.timeRemaining -= 1;
    renderMimicaTimer();
  }, 1000);
}

function syncWhoAmICategoryInput(nextValue) {
  const safeCategory = Object.prototype.hasOwnProperty.call(whoAmIPools, nextValue)
    ? nextValue
    : "geral";

  if (state.whoami.category !== safeCategory) {
    state.whoami.remainingCharacters = [];
    state.whoami.currentCharacter = "";
  }

  state.whoami.category = safeCategory;
  elements.whoami.category.value = safeCategory;
  return safeCategory;
}

function getWhoAmICharacter(category) {
  const pool = whoAmIPools[category] ?? whoAmIPools.geral;

  if (state.whoami.remainingCharacters.length === 0) {
    state.whoami.remainingCharacters = buildShuffledDeck(
      pool,
      state.whoami.currentCharacter,
      getWhoAmIEntryKey,
    );
  }

  const nextCharacter =
    state.whoami.remainingCharacters.pop() ?? pool[randomIndex(pool.length)];

  state.whoami.currentCharacter = nextCharacter;
  return nextCharacter;
}

function syncPoliceRoleInputs(preferredRole = "victim", nextValue = null) {
  const counts = {
    police: clampRoleCount(elements.police.policeCount.value),
    thief: clampRoleCount(elements.police.thiefCount.value),
    victim: clampRoleCount(elements.police.victimCount.value),
  };

  if (preferredRole in counts && nextValue !== null) {
    counts[preferredRole] = clampRoleCount(nextValue);
  }

  const totalPlayers = counts.police + counts.thief + counts.victim;
  let overflow = totalPlayers - 20;
  const roleOrder = [
    preferredRole,
    ...["police", "thief", "victim"].filter((role) => role !== preferredRole),
  ];

  roleOrder.forEach((role) => {
    if (overflow <= 0) {
      return;
    }

    const reducible = counts[role] - 1;

    if (reducible <= 0) {
      return;
    }

    const reduction = Math.min(reducible, overflow);
    counts[role] -= reduction;
    overflow -= reduction;
  });

  const safeTotalPlayers = counts.police + counts.thief + counts.victim;

  elements.police.policeCount.value = counts.police;
  elements.police.thiefCount.value = counts.thief;
  elements.police.victimCount.value = counts.victim;
  elements.police.roleSummary.textContent = `Total: ${safeTotalPlayers} ${pluralize(
    safeTotalPlayers,
    "jogador",
    "jogadores",
  )}. Serão ${counts.police} ${pluralize(
    counts.police,
    "policial",
    "policiais",
  )}, ${counts.thief} ${pluralize(
    counts.thief,
    "ladrão",
    "ladrões",
  )} e ${counts.victim} ${pluralize(counts.victim, "vítima", "vítimas")}.`;

  return {
    ...counts,
    totalPlayers: safeTotalPlayers,
  };
}

function syncCityRoleInputs(preferredField = "players", nextValue = null) {
  const counts = {
    players: clampCityPlayers(elements.city.playerCount.value),
    assassins: clampRoleCount(elements.city.assassinCount.value),
    detectives: clampOptionalRoleCount(elements.city.detectiveCount.value),
  };

  if (preferredField in counts && nextValue !== null) {
    if (preferredField === "players") {
      counts.players = clampCityPlayers(nextValue);
    }
    if (preferredField === "assassins") {
      counts.assassins = clampRoleCount(nextValue);
    }
    if (preferredField === "detectives") {
      counts.detectives = clampOptionalRoleCount(nextValue);
    }
  }

  counts.assassins = Math.min(counts.assassins, counts.players - 1);
  counts.detectives = Math.min(counts.detectives, counts.players - 1);

  let citizens = counts.players - counts.assassins - counts.detectives;

  if (citizens < 1) {
    let overflow = 1 - citizens;
    const roleOrder =
      preferredField === "detectives"
        ? ["assassins", "detectives"]
        : ["detectives", "assassins"];

    roleOrder.forEach((role) => {
      if (overflow <= 0) {
        return;
      }

      const minValue = role === "assassins" ? 1 : 0;
      const reducible = counts[role] - minValue;

      if (reducible <= 0) {
        return;
      }

      const reduction = Math.min(reducible, overflow);
      counts[role] -= reduction;
      overflow -= reduction;
    });
  }

  citizens = counts.players - counts.assassins - counts.detectives;

  elements.city.playerCount.value = counts.players;
  elements.city.assassinCount.value = counts.assassins;
  elements.city.detectiveCount.value = counts.detectives;
  elements.city.roleSummary.textContent = `Total: ${counts.players} ${pluralize(
    counts.players,
    "jogador",
    "jogadores",
  )}. Serão ${counts.assassins} ${pluralize(
    counts.assassins,
    "assassino",
    "assassinos",
  )}, ${counts.detectives} ${pluralize(
    counts.detectives,
    "detetive",
    "detetives",
  )} e ${citizens} ${pluralize(citizens, "cidadão", "cidadãos")}.`;

  return {
    ...counts,
    citizens,
  };
}

function openHub() {
  state.currentGame = null;
  resetTurnPlayers();
  closeHubModal();
  clearRoleTone();
  setTurnPhase("prep");
  clearMimicaTimer();
  updateImpostorFeedback("");
  updatePoliceFeedback("");
  updateCityFeedback("");
  updateMimicaFeedback("");
  setActiveScreen("hub");
}

function openImpostorSetup() {
  state.currentGame = null;
  resetTurnPlayers();
  clearRoleTone();
  setTurnPhase("prep");
  setImpostorWordVisibility(false);
  updateImpostorFeedback("");
  setActiveScreen("impostorSetup");
}

function openPoliceSetup() {
  state.currentGame = null;
  resetTurnPlayers();
  clearRoleTone();
  setTurnPhase("prep");
  updatePoliceFeedback("");
  syncPoliceRoleInputs();
  setActiveScreen("policeSetup");
}

function openCitySetup() {
  state.currentGame = null;
  resetTurnPlayers();
  clearRoleTone();
  setTurnPhase("prep");
  updateCityFeedback("");
  syncCityRoleInputs();
  setActiveScreen("citySetup");
}

function openMimicaSetup() {
  state.currentGame = {
    type: "mimica",
    name: "Mímica Rápida",
  };
  state.currentPlayer = 0;
  clearMimicaTimer();
  state.mimica.remainingWords = [];
  state.mimica.currentWord = "";
  state.mimica.deckKey = "";
  syncMimicaCategoryInput(elements.mimica.category.value);
  syncMimicaDifficultyInput(elements.mimica.difficulty.value);
  syncMimicaTimeInput(elements.mimica.time.value);
  state.mimica.prepMode = "start";
  state.mimica.solved = false;
  state.mimica.timedOut = false;
  updateMimicaFeedback("");
  setActiveScreen("mimicaSetup");
}

function renderMimicaPreparation() {
  const isNextPlayer = state.mimica.prepMode === "next-player";

  elements.mimica.prepTitle.textContent = isNextPlayer
    ? "Passe o celular para o próximo mímico"
    : "Passe o celular para quem vai fazer a mímica";
  elements.mimica.prepDescription.textContent = isNextPlayer
    ? "Toque em mostrar quando a próxima pessoa estiver pronta para ver a palavra."
    : "Toque em mostrar apenas quando a pessoa estiver pronta para ver a palavra.";

  clearMimicaTimer();
  setActiveScreen("mimicaPrep");
}

function renderMimicaWord() {
  const category = syncMimicaCategoryInput(elements.mimica.category.value);
  const difficulty = syncMimicaDifficultyInput(elements.mimica.difficulty.value);
  const nextWord = getMimicaWord(category, difficulty);
  const wordData = normalizeMimicaEntry(nextWord);

  resetMimicaRoundState();
  elements.mimica.word.textContent = wordData.name;
  elements.mimica.wordSource.textContent = wordData.source;
  elements.mimica.wordSource.hidden = wordData.source === "";
  renderMimicaTimer();
  updateMimicaVisualState();
  setActiveScreen("mimicaPlay");
  startMimicaTimer();
  enterMimicaFullscreen();
}

function markMimicaSuccess() {
  state.mimica.solved = true;
  state.mimica.timedOut = false;
  clearMimicaTimer();
  updateMimicaVisualState();
}

function openWhoAmISetup() {
  state.currentGame = {
    type: "whoami",
    name: "Quem sou eu?",
  };
  state.currentPlayer = 0;
  syncWhoAmICategoryInput(elements.whoami.category.value);
  updateWhoAmIFeedback("");
  setActiveScreen("whoamiSetup");
}

function renderWhoAmICharacter() {
  const category = syncWhoAmICategoryInput(elements.whoami.category.value);
  const character = getWhoAmICharacter(category);
  const characterData = normalizeWhoAmIEntry(character);

  elements.whoami.characterName.textContent = characterData.name;
  elements.whoami.characterSource.textContent = characterData.source;
  elements.whoami.characterSource.hidden = characterData.source === "";
  updateWhoAmIFeedback("");
  setActiveScreen("whoamiReveal");
  enterWhoAmIFullscreen();
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

  if (state.currentGame.type === "impostor") {
    openImpostorSetup();
    return;
  }

  if (state.currentGame.type === "city") {
    openCitySetup();
    return;
  }

  if (state.currentGame.type === "mimica") {
    openMimicaSetup();
    return;
  }

  if (state.currentGame.type === "whoami") {
    openWhoAmISetup();
    return;
  }

  openPoliceSetup();
}

function startImpostorGame() {
  const totalPlayers = syncImpostorPlayerInput(elements.impostor.playerCount.value);
  const impostorCount = syncImpostorCountInput(elements.impostor.impostorCount.value);
  const requirePlayerNames = elements.impostor.requireNames.value !== "optional";
  const category = syncImpostorCategoryInput(elements.impostor.wordCategory.value);
  const difficulty = syncImpostorDifficultyInput(elements.impostor.wordDifficulty.value);
  let secretWord = normalizeWord(elements.impostor.secretWord.value);

  if (!secretWord) {
    secretWord = getWordFromCategory(category, difficulty);
    elements.impostor.secretWord.value = secretWord;
    setImpostorWordVisibility(false);
  }

  updateImpostorFeedback("");
  state.currentGame = buildImpostorGame(
    totalPlayers,
    impostorCount,
    requirePlayerNames,
    secretWord,
    category,
    difficulty,
  );
  resetTurnPlayers();
  renderPreparation();
}

function startPoliceGame() {
  const counts = syncPoliceRoleInputs();

  updatePoliceFeedback("");
  state.currentGame = buildPoliceGame(
    counts.totalPlayers,
    counts.police,
    counts.thief,
    counts.victim,
  );
  resetTurnPlayers();
  renderPreparation();
}

function startCityGame() {
  const counts = syncCityRoleInputs();

  if (counts.citizens < 1) {
    updateCityFeedback("A rodada precisa ter pelo menos 1 cidadão.");
    return;
  }

  updateCityFeedback("");
  state.currentGame = buildCityGame(
    counts.players,
    counts.assassins,
    counts.detectives,
  );
  resetTurnPlayers();
  renderPreparation();
}

function startMimicaGame() {
  syncMimicaCategoryInput(elements.mimica.category.value);
  syncMimicaDifficultyInput(elements.mimica.difficulty.value);
  syncMimicaTimeInput(elements.mimica.time.value);
  state.mimica.prepMode = "start";
  updateMimicaFeedback("");
  renderMimicaPreparation();
}

function startWhoAmIGame() {
  syncWhoAmICategoryInput(elements.whoami.category.value);
  renderWhoAmICharacter();
}

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

elements.impostor.decreasePlayers.addEventListener("click", () => {
  syncImpostorPlayerInput(Number(elements.impostor.playerCount.value) - 1);
});

elements.impostor.increasePlayers.addEventListener("click", () => {
  syncImpostorPlayerInput(Number(elements.impostor.playerCount.value) + 1);
});

elements.impostor.playerCount.addEventListener("change", (event) => {
  syncImpostorPlayerInput(event.target.value);
});

elements.impostor.decreaseImpostors.addEventListener("click", () => {
  syncImpostorCountInput(Number(elements.impostor.impostorCount.value) - 1);
});

elements.impostor.increaseImpostors.addEventListener("click", () => {
  syncImpostorCountInput(Number(elements.impostor.impostorCount.value) + 1);
});

elements.impostor.impostorCount.addEventListener("change", (event) => {
  syncImpostorCountInput(event.target.value);
});

elements.impostor.wordCategory.addEventListener("change", (event) => {
  syncImpostorCategoryInput(event.target.value);
});

elements.impostor.wordDifficulty.addEventListener("change", (event) => {
  syncImpostorDifficultyInput(event.target.value);
});

elements.impostor.randomWord.addEventListener("click", () => {
  const category = syncImpostorCategoryInput(elements.impostor.wordCategory.value);
  const difficulty = syncImpostorDifficultyInput(elements.impostor.wordDifficulty.value);
  elements.impostor.secretWord.value = getWordFromCategory(category, difficulty);
  setImpostorWordVisibility(false);
  updateImpostorFeedback("");
});

elements.impostor.toggleVisibility.addEventListener("click", () => {
  const isVisible =
    elements.impostor.toggleVisibility.getAttribute("aria-pressed") === "true";
  setImpostorWordVisibility(!isVisible);
});

elements.impostor.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startImpostorGame();
});

elements.impostor.goHub.addEventListener("click", openHub);
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

elements.police.decreaseCount.addEventListener("click", () => {
  syncPoliceRoleInputs("police", Number(elements.police.policeCount.value) - 1);
});

elements.police.increaseCount.addEventListener("click", () => {
  syncPoliceRoleInputs("police", Number(elements.police.policeCount.value) + 1);
});

elements.police.policeCount.addEventListener("change", (event) => {
  syncPoliceRoleInputs("police", event.target.value);
});

elements.police.decreaseThieves.addEventListener("click", () => {
  syncPoliceRoleInputs("thief", Number(elements.police.thiefCount.value) - 1);
});

elements.police.increaseThieves.addEventListener("click", () => {
  syncPoliceRoleInputs("thief", Number(elements.police.thiefCount.value) + 1);
});

elements.police.thiefCount.addEventListener("change", (event) => {
  syncPoliceRoleInputs("thief", event.target.value);
});

elements.police.decreaseVictims.addEventListener("click", () => {
  syncPoliceRoleInputs("victim", Number(elements.police.victimCount.value) - 1);
});

elements.police.increaseVictims.addEventListener("click", () => {
  syncPoliceRoleInputs("victim", Number(elements.police.victimCount.value) + 1);
});

elements.police.victimCount.addEventListener("change", (event) => {
  syncPoliceRoleInputs("victim", event.target.value);
});

elements.police.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startPoliceGame();
});

elements.police.goHub.addEventListener("click", openHub);

elements.city.decreasePlayers.addEventListener("click", () => {
  syncCityRoleInputs("players", Number(elements.city.playerCount.value) - 1);
});

elements.city.increasePlayers.addEventListener("click", () => {
  syncCityRoleInputs("players", Number(elements.city.playerCount.value) + 1);
});

elements.city.playerCount.addEventListener("change", (event) => {
  syncCityRoleInputs("players", event.target.value);
});

elements.city.decreaseAssassins.addEventListener("click", () => {
  syncCityRoleInputs("assassins", Number(elements.city.assassinCount.value) - 1);
});

elements.city.increaseAssassins.addEventListener("click", () => {
  syncCityRoleInputs("assassins", Number(elements.city.assassinCount.value) + 1);
});

elements.city.assassinCount.addEventListener("change", (event) => {
  syncCityRoleInputs("assassins", event.target.value);
});

elements.city.decreaseDetectives.addEventListener("click", () => {
  syncCityRoleInputs("detectives", Number(elements.city.detectiveCount.value) - 1);
});

elements.city.increaseDetectives.addEventListener("click", () => {
  syncCityRoleInputs("detectives", Number(elements.city.detectiveCount.value) + 1);
});

elements.city.detectiveCount.addEventListener("change", (event) => {
  syncCityRoleInputs("detectives", event.target.value);
});

elements.city.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startCityGame();
});

elements.city.goHub.addEventListener("click", openHub);

elements.mimica.category.addEventListener("change", (event) => {
  syncMimicaCategoryInput(event.target.value);
});

elements.mimica.difficulty.addEventListener("change", (event) => {
  syncMimicaDifficultyInput(event.target.value);
});

elements.mimica.time.addEventListener("change", (event) => {
  syncMimicaTimeInput(event.target.value);
});

elements.mimica.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startMimicaGame();
});

elements.mimica.showWord.addEventListener("click", renderMimicaWord);
elements.mimica.success.addEventListener("click", markMimicaSuccess);
elements.mimica.nextWord.addEventListener("click", renderMimicaWord);
elements.mimica.nextPlayer.addEventListener("click", () => {
  state.mimica.prepMode = "next-player";
  renderMimicaPreparation();
});
elements.mimica.close.addEventListener("click", openMimicaSetup);
elements.mimica.goHub.addEventListener("click", openHub);
elements.mimica.goHubPrep.addEventListener("click", openHub);
elements.mimica.goSetupPrep.addEventListener("click", openMimicaSetup);

elements.whoami.category.addEventListener("change", (event) => {
  syncWhoAmICategoryInput(event.target.value);
});

elements.whoami.form.addEventListener("submit", (event) => {
  event.preventDefault();
  startWhoAmIGame();
});

elements.whoami.reroll.addEventListener("click", renderWhoAmICharacter);
elements.whoami.close.addEventListener("click", openWhoAmISetup);
elements.whoami.goHub.addEventListener("click", openHub);

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
syncImpostorPlayerInput(elements.impostor.playerCount.value);
syncImpostorCountInput(elements.impostor.impostorCount.value);
syncImpostorCategoryInput(elements.impostor.wordCategory.value);
syncImpostorDifficultyInput(elements.impostor.wordDifficulty.value);
setImpostorWordVisibility(false);
syncPoliceRoleInputs();
syncCityRoleInputs();
syncMimicaCategoryInput(elements.mimica.category.value);
syncMimicaDifficultyInput(elements.mimica.difficulty.value);
syncMimicaTimeInput(elements.mimica.time.value);
syncWhoAmICategoryInput(elements.whoami.category.value);
setActiveScreen("hub");
