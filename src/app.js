import { heroContent, mimicaPools, whoAmIPools, wordPools } from "./data/catalogs.js";
import { createInitialState } from "./viewmodels/app-state.js";
import { getElements } from "./views/elements.js";
import {
  buildCityGame,
  buildImpostorGame,
  buildPoliceGame,
} from "./viewmodels/game-factories.js";
const state = createInitialState();

const elements = getElements();

function clampInteger(value, min, max, fallback = min) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

function clampPlayers(value) {
  return clampInteger(value, 3, 20, 3);
}

function clampCityPlayers(value) {
  return clampInteger(value, 5, 20, 5);
}

function clampRoleCount(value) {
  return clampInteger(value, 1, 20, 1);
}

function clampOptionalRoleCount(value) {
  return clampInteger(value, 0, 20, 0);
}

function normalizeWord(value) {
  return value.replace(/\s+/g, " ").trim();
}

function getDifficultyLabel(difficulty) {
  if (difficulty === "facil") {
    return "Fácil";
  }

  if (difficulty === "dificil") {
    return "Difícil";
  }

  return "Média";
}

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

function setHero(content) {
  elements.heroEyebrow.textContent = content.eyebrow;
  elements.heroTitle.textContent = content.title;
  elements.heroCopy.textContent = content.copy;
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

function getCryptoRandomUint32() {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return values[0];
  }

  return Math.floor(Math.random() * 4294967296);
}

function randomIndex(max) {
  if (max <= 1) {
    return 0;
  }

  const maxUint32 = 4294967296;
  const safeLimit = maxUint32 - (maxUint32 % max);
  let randomValue = getCryptoRandomUint32();

  while (randomValue >= safeLimit) {
    randomValue = getCryptoRandomUint32();
  }

  return randomValue % max;
}

function shuffleArray(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = randomIndex(index + 1);
    [shuffled[index], shuffled[targetIndex]] = [
      shuffled[targetIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function buildShuffledDeck(items, currentItem = "", getKey = (item) => item) {
  const currentKey = currentItem === "" || currentItem === null ? "" : getKey(currentItem);
  const nextItems = items.filter((item) => getKey(item) !== currentKey);
  return shuffleArray(nextItems.length > 0 ? nextItems : items);
}

function getWhoAmIEntryKey(entry) {
  if (entry && typeof entry === "object") {
    return `${entry.source ?? ""}::${entry.name ?? ""}`;
  }

  return String(entry ?? "");
}

function normalizeWhoAmIEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      name: entry.name ?? "",
      source: entry.source ?? "",
    };
  }

  return {
    name: String(entry ?? ""),
    source: "",
  };
}

function getMimicaEntryKey(entry) {
  if (entry && typeof entry === "object") {
    return `${entry.source ?? ""}::${entry.name ?? ""}`;
  }

  return String(entry ?? "");
}

function normalizeMimicaEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      name: entry.name ?? "",
      source: entry.source ?? "",
    };
  }

  return {
    name: String(entry ?? ""),
    source: "",
  };
}

function setActiveScreen(screen) {
  state.currentScreen = screen;
  document.body.classList.toggle("is-whoami-reveal", screen === "whoamiReveal");
  document.body.classList.toggle("is-mimica-play", screen === "mimicaPlay");
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

function syncImpostorPlayerInput(nextValue) {
  const safeValue = clampPlayers(nextValue);
  elements.impostor.playerCount.value = safeValue;
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
      : "medio";
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
  const deckKey = `${category}:${difficulty}`;

  if (state.mimica.deckKey !== deckKey) {
    state.mimica.deckKey = deckKey;
    state.mimica.remainingWords = [];
    state.mimica.currentWord = "";
  }

  if (state.mimica.remainingWords.length === 0) {
    state.mimica.remainingWords = buildShuffledDeck(
      words,
      state.mimica.currentWord,
      getMimicaEntryKey,
    );
  }

  const nextWord = state.mimica.remainingWords.pop() ?? words[randomIndex(words.length)];

  state.mimica.currentWord = nextWord;
  return nextWord;
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
  state.currentPlayer = 0;
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
  state.currentPlayer = 0;
  clearRoleTone();
  setTurnPhase("prep");
  setImpostorWordVisibility(false);
  updateImpostorFeedback("");
  setActiveScreen("impostorSetup");
}

function openPoliceSetup() {
  state.currentGame = null;
  state.currentPlayer = 0;
  clearRoleTone();
  setTurnPhase("prep");
  updatePoliceFeedback("");
  syncPoliceRoleInputs();
  setActiveScreen("policeSetup");
}

function openCitySetup() {
  state.currentGame = null;
  state.currentPlayer = 0;
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

  setHero({
    eyebrow: state.currentGame.name,
    title: "Passe para o próximo jogador",
    copy:
      "Mantenha a tela coberta e revele o papel somente quando a pessoa certa estiver pronta.",
  });
  elements.turn.gameLabel.textContent = state.currentGame.name;
  elements.turn.progress.textContent = `Jogador ${playerNumber} de ${state.currentGame.totalPlayers}`;
  elements.turn.prepTitle.textContent = `Prepare o Jogador ${playerNumber}`;
  elements.turn.prepDescription.textContent =
    "Passe o celular com a tela coberta e toque em mostrar apenas quando o jogador estiver pronto.";

  clearRoleTone();
  setTurnPhase("prep");
  setActiveScreen("turn");
}

function renderReveal() {
  const playerNumber = state.currentPlayer + 1;
  const isLastPlayer = state.currentPlayer === state.currentGame.totalPlayers - 1;
  const role = state.currentGame.roles[state.currentPlayer];

  setHero(state.currentGame.hero);
  elements.turn.gameLabel.textContent = state.currentGame.name;
  elements.turn.progress.textContent = `Jogador ${playerNumber} de ${state.currentGame.totalPlayers}`;
  elements.turn.roleBadge.textContent = role.badge;
  elements.turn.roleTitle.textContent = role.title;
  elements.turn.roleDescription.textContent = role.description;
  elements.turn.wordCard.textContent = role.value;
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

  setTurnPhase("reveal");
  setActiveScreen("turn");
}

function renderEndScreen() {
  setHero({
    eyebrow: state.currentGame.name,
    title: "Rodada pronta",
    copy: "Todos os papéis foram entregues. Agora o jogo começa fora da tela.",
  });

  elements.end.label.textContent = state.currentGame.endLabel;
  elements.end.title.textContent = state.currentGame.endTitle;
  elements.end.description.textContent = state.currentGame.endDescription;
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
  const category = syncImpostorCategoryInput(elements.impostor.wordCategory.value);
  const difficulty = syncImpostorDifficultyInput(elements.impostor.wordDifficulty.value);
  let secretWord = normalizeWord(elements.impostor.secretWord.value);

  if (!secretWord) {
    secretWord = getWordFromCategory(category, difficulty);
    elements.impostor.secretWord.value = secretWord;
    setImpostorWordVisibility(false);
  }

  updateImpostorFeedback("");
  state.currentGame = buildImpostorGame(totalPlayers, secretWord, category, difficulty);
  state.currentPlayer = 0;
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
  state.currentPlayer = 0;
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
  state.currentPlayer = 0;
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

elements.openImpostorGame.addEventListener("click", openImpostorSetup);
elements.openPoliceGame.addEventListener("click", openPoliceSetup);
elements.openCityGame.addEventListener("click", openCitySetup);
elements.openMimicaGame.addEventListener("click", openMimicaSetup);
elements.openWhoAmIGame.addEventListener("click", openWhoAmISetup);

elements.impostor.decreasePlayers.addEventListener("click", () => {
  syncImpostorPlayerInput(Number(elements.impostor.playerCount.value) - 1);
});

elements.impostor.increasePlayers.addEventListener("click", () => {
  syncImpostorPlayerInput(Number(elements.impostor.playerCount.value) + 1);
});

elements.impostor.playerCount.addEventListener("change", (event) => {
  syncImpostorPlayerInput(event.target.value);
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

elements.turn.revealRole.addEventListener("click", renderReveal);

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
elements.end.playAgain.addEventListener("click", restartCurrentGame);
elements.end.goHub.addEventListener("click", openHub);

syncImpostorPlayerInput(elements.impostor.playerCount.value);
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
