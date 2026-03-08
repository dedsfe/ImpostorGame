const wordPools = {
  geral: [
    "astronauta",
    "abacaxi",
    "castelo",
    "violino",
    "pirata",
    "tempestade",
    "labirinto",
    "sorvete",
    "vulcao",
    "lanterna",
  ],
  animais: [
    "girafa",
    "tartaruga",
    "golfinho",
    "capivara",
    "pinguim",
    "leopardo",
    "jacare",
    "coruja",
  ],
  comidas: [
    "lasanha",
    "brigadeiro",
    "hamburguer",
    "coxinha",
    "panqueca",
    "pipoca",
    "sushi",
    "taco",
  ],
  objetos: [
    "mochila",
    "guarda-chuva",
    "controle",
    "tesoura",
    "espelho",
    "lanterna",
    "violao",
    "caderno",
  ],
  lugares: [
    "praia",
    "museu",
    "biblioteca",
    "aeroporto",
    "acampamento",
    "restaurante",
    "cinema",
    "estadio",
  ],
};

const state = {
  totalPlayers: 4,
  secretWord: "",
  selectedCategory: "geral",
  impostorIndex: null,
  currentPlayer: 0,
  phase: "setup",
};

const elements = {
  screens: {
    setup: document.getElementById("setup-screen"),
    turn: document.getElementById("turn-screen"),
    end: document.getElementById("end-screen"),
  },
  setupForm: document.getElementById("setup-form"),
  playerCount: document.getElementById("player-count"),
  secretWord: document.getElementById("secret-word"),
  wordCategory: document.getElementById("word-category"),
  toggleWordVisibility: document.getElementById("toggle-word-visibility"),
  toggleWordLabel: document.getElementById("toggle-word-label"),
  setupFeedback: document.getElementById("setup-feedback"),
  decreasePlayers: document.getElementById("decrease-players"),
  increasePlayers: document.getElementById("increase-players"),
  randomWord: document.getElementById("random-word"),
  prepView: document.getElementById("prep-view"),
  revealView: document.getElementById("reveal-view"),
  turnPanel: document.getElementById("turn-panel"),
  turnProgress: document.getElementById("turn-progress"),
  prepTitle: document.getElementById("prep-title"),
  prepDescription: document.getElementById("prep-description"),
  revealRole: document.getElementById("reveal-role"),
  roleBadge: document.getElementById("role-badge"),
  roleTitle: document.getElementById("role-title"),
  roleDescription: document.getElementById("role-description"),
  wordCard: document.getElementById("word-card"),
  nextPlayer: document.getElementById("next-player"),
  restartTurn: document.getElementById("restart-turn"),
  endPlayers: document.getElementById("end-players"),
  playAgain: document.getElementById("play-again"),
};

function clampPlayers(value) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return 3;
  }

  return Math.min(20, Math.max(3, parsed));
}

function normalizeWord(value) {
  return value.replace(/\s+/g, " ").trim();
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

function setActiveScreen(screen) {
  Object.entries(elements.screens).forEach(([key, element]) => {
    element.classList.toggle("is-active", key === screen);
  });
}

function setTurnPhase(phase) {
  const isPrep = phase === "prep";
  elements.prepView.classList.toggle("is-active", isPrep);
  elements.revealView.classList.toggle("is-active", !isPrep);
  elements.turnPanel.classList.toggle("is-prep", isPrep);
  elements.turnPanel.classList.toggle("is-reveal", !isPrep);
}

function updateSetupFeedback(message = "") {
  elements.setupFeedback.textContent = message;
}

function setWordVisibility(isVisible) {
  elements.secretWord.type = isVisible ? "text" : "password";
  elements.toggleWordVisibility.setAttribute("aria-pressed", String(isVisible));
  elements.toggleWordVisibility.setAttribute(
    "aria-label",
    isVisible ? "Esconder palavra secreta" : "Mostrar palavra secreta",
  );
  elements.toggleWordVisibility.classList.toggle("is-visible", isVisible);
  elements.toggleWordLabel.textContent = isVisible ? "Ocultar" : "Mostrar";
}

function syncPlayerInput(nextValue) {
  const safeValue = clampPlayers(nextValue);
  state.totalPlayers = safeValue;
  elements.playerCount.value = safeValue;
  return safeValue;
}

function syncCategoryInput(nextValue) {
  const safeCategory = Object.prototype.hasOwnProperty.call(wordPools, nextValue)
    ? nextValue
    : "geral";
  state.selectedCategory = safeCategory;
  elements.wordCategory.value = safeCategory;
  return safeCategory;
}

function getWordFromCategory(category) {
  const words = wordPools[category] ?? wordPools.geral;
  return words[randomIndex(words.length)];
}

function renderPreparation() {
  const playerNumber = state.currentPlayer + 1;
  elements.turnProgress.textContent = `Jogador ${playerNumber} de ${state.totalPlayers}`;
  elements.prepTitle.textContent = `Prepare o Jogador ${playerNumber}`;
  elements.prepDescription.textContent =
    "Passe o celular com a tela coberta e toque em mostrar apenas quando o jogador estiver pronto.";
  elements.turnPanel.classList.remove("is-impostor");
  setTurnPhase("prep");
  setActiveScreen("turn");
}

function renderReveal() {
  const isImpostor = state.currentPlayer === state.impostorIndex;
  const playerNumber = state.currentPlayer + 1;
  const isLastPlayer = state.currentPlayer === state.totalPlayers - 1;

  elements.turnProgress.textContent = `Jogador ${playerNumber} de ${state.totalPlayers}`;
  elements.roleBadge.textContent = isImpostor ? "Impostor" : "Palavra secreta";
  elements.roleTitle.textContent = isImpostor
    ? "Você é o impostor"
    : "Você recebeu a palavra";
  elements.roleDescription.textContent = isImpostor
    ? "Tente descobrir a palavra ouvindo a conversa sem entregar que você não sabe dela."
    : "Guarde a palavra e ajude a identificar o impostor durante a rodada.";
  elements.wordCard.textContent = isImpostor ? "IMPOSTOR" : state.secretWord;
  elements.wordCard.classList.toggle("is-impostor", isImpostor);
  elements.turnPanel.classList.toggle("is-impostor", isImpostor);
  elements.nextPlayer.textContent = isLastPlayer
    ? "Finalizar distribuição"
    : "Próximo jogador";

  setTurnPhase("reveal");
  setActiveScreen("turn");
}

function renderEndScreen() {
  elements.endPlayers.textContent = String(state.totalPlayers);
  setActiveScreen("end");
}

function resetToSetup(clearWord = false) {
  state.currentPlayer = 0;
  state.impostorIndex = null;
  state.phase = "setup";
  syncPlayerInput(elements.playerCount.value);
  syncCategoryInput(elements.wordCategory.value);
  if (clearWord) {
    state.secretWord = "";
    elements.secretWord.value = "";
  }
  setWordVisibility(false);
  updateSetupFeedback("");
  setActiveScreen("setup");
}

function startGame() {
  const players = syncPlayerInput(elements.playerCount.value);
  const selectedCategory = syncCategoryInput(elements.wordCategory.value);
  let secretWord = normalizeWord(elements.secretWord.value);

  if (!secretWord) {
    secretWord = getWordFromCategory(selectedCategory);
    elements.secretWord.value = secretWord;
    setWordVisibility(false);
  }

  state.totalPlayers = players;
  state.secretWord = secretWord;
  state.selectedCategory = selectedCategory;
  state.impostorIndex = randomIndex(players);
  state.currentPlayer = 0;
  state.phase = "prep";

  updateSetupFeedback("");
  renderPreparation();
}

elements.decreasePlayers.addEventListener("click", () => {
  syncPlayerInput(state.totalPlayers - 1);
});

elements.increasePlayers.addEventListener("click", () => {
  syncPlayerInput(state.totalPlayers + 1);
});

elements.playerCount.addEventListener("change", (event) => {
  syncPlayerInput(event.target.value);
});

elements.wordCategory.addEventListener("change", (event) => {
  syncCategoryInput(event.target.value);
});

elements.randomWord.addEventListener("click", () => {
  const selectedCategory = syncCategoryInput(elements.wordCategory.value);
  const nextWord = getWordFromCategory(selectedCategory);
  elements.secretWord.value = nextWord;
  setWordVisibility(false);
  updateSetupFeedback("");
});

elements.toggleWordVisibility.addEventListener("click", () => {
  const isVisible =
    elements.toggleWordVisibility.getAttribute("aria-pressed") === "true";
  setWordVisibility(!isVisible);
});

elements.setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startGame();
});

elements.revealRole.addEventListener("click", () => {
  state.phase = "reveal";
  renderReveal();
});

elements.nextPlayer.addEventListener("click", () => {
  const isLastPlayer = state.currentPlayer === state.totalPlayers - 1;

  if (isLastPlayer) {
    state.phase = "end";
    renderEndScreen();
    return;
  }

  state.currentPlayer += 1;
  state.phase = "prep";
  renderPreparation();
});

elements.restartTurn.addEventListener("click", () => {
  resetToSetup(false);
});

elements.playAgain.addEventListener("click", () => {
  resetToSetup(true);
});

syncPlayerInput(elements.playerCount.value);
syncCategoryInput(elements.wordCategory.value);
setWordVisibility(false);
