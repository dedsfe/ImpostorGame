import {
  clampInteger,
  clampPlayers,
  getDifficultyLabel,
  normalizeWord,
  randomIndex,
  shuffleArray,
} from "../shared/utils.js";

export function normalizeImpostorSetup({ totalPlayers, impostorCount }) {
  const safeTotalPlayers = clampPlayers(totalPlayers);
  const maxImpostors = Math.max(1, safeTotalPlayers - 1);

  return {
    totalPlayers: safeTotalPlayers,
    impostorCount: clampInteger(impostorCount, 1, maxImpostors, 1),
    maxImpostors,
  };
}

export function pickImpostorWord(pools, category, difficulty) {
  const categoryPool = pools[category] ?? pools.geral;
  const words = categoryPool[difficulty] ?? pools.geral.medio;
  return words[randomIndex(words.length)];
}

export function createImpostorGame({
  totalPlayers,
  impostorCount,
  requirePlayerNames,
  secretWord,
  category,
  difficulty,
}) {
  const safeImpostorCount = Math.min(Math.max(1, impostorCount), totalPlayers - 1);
  const roles = shuffleArray(
    Array.from({ length: totalPlayers }, (_, playerIndex) => {
      if (playerIndex < safeImpostorCount) {
        return {
          badge: "Impostor",
          title: "Você é o impostor",
          description:
            "Escute a conversa, tente entender a palavra e não entregue que você não a conhece.",
          hint: `Dica de categoria: ${category.toUpperCase()}`,
          value: "IMPOSTOR",
          tone: "impostor",
        };
      }

      return {
        badge: "Palavra secreta",
        title: "Você recebeu a palavra",
        description:
          "Guarde a palavra e use pistas discretas para identificar o impostor.",
        value: secretWord,
        tone: "word",
      };
    }),
  );

  return {
    type: "impostor",
    name: "Impostor",
    totalPlayers,
    impostorCount: safeImpostorCount,
    requirePlayerNames,
    roles,
    setupScreen: "impostorSetup",
    endLabel: "Rodada pronta",
    endTitle: "Todos já receberam seus papéis",
    endDescription:
      `Agora afastem o celular e comecem a conversa para descobrir quem ${
        safeImpostorCount > 1 ? "são os impostores" : "é o impostor"
      }.`,
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Impostores", value: String(safeImpostorCount) },
      { label: "Dificuldade", value: getDifficultyLabel(difficulty) },
    ],
    hero: {
      eyebrow: "Impostor",
      title: "Distribuição de papéis",
      copy: `Palavra definida em ${category} com dificuldade ${getDifficultyLabel(
        difficulty,
      ).toLowerCase()}.`,
    },
  };
}

export function createImpostorController({
  elements,
  openHub,
  openRoleSetup,
  pools,
  startRoleGame,
}) {
  function setWordVisibility(isVisible) {
    elements.secretWord.type = isVisible ? "text" : "password";
    elements.toggleVisibility.setAttribute("aria-pressed", String(isVisible));
    elements.toggleVisibility.setAttribute(
      "aria-label",
      isVisible ? "Esconder palavra secreta" : "Mostrar palavra secreta",
    );
    elements.toggleVisibility.classList.toggle("is-visible", isVisible);
    elements.toggleLabel.textContent = isVisible ? "Ocultar" : "Mostrar";
  }

  function updateFeedback(message = "") {
    elements.feedback.textContent = message;
  }

  function syncPlayers(nextValue) {
    const setup = normalizeImpostorSetup({
      totalPlayers: nextValue,
      impostorCount: elements.impostorCount.value,
    });

    elements.playerCount.value = setup.totalPlayers;
    elements.impostorCount.max = setup.maxImpostors;
    elements.impostorCount.value = setup.impostorCount;
    return setup.totalPlayers;
  }

  function syncImpostors(nextValue) {
    const setup = normalizeImpostorSetup({
      totalPlayers: elements.playerCount.value,
      impostorCount: nextValue,
    });

    elements.playerCount.value = setup.totalPlayers;
    elements.impostorCount.max = setup.maxImpostors;
    elements.impostorCount.value = setup.impostorCount;
    return setup.impostorCount;
  }

  function syncCategory(nextValue) {
    const category = Object.prototype.hasOwnProperty.call(pools, nextValue)
      ? nextValue
      : "geral";
    elements.wordCategory.value = category;
    return category;
  }

  function syncDifficulty(nextValue) {
    const difficulty =
      nextValue === "facil" || nextValue === "medio" || nextValue === "dificil"
        ? nextValue
        : "dificil";
    elements.wordDifficulty.value = difficulty;
    return difficulty;
  }

  function chooseRandomWord() {
    const category = syncCategory(elements.wordCategory.value);
    const difficulty = syncDifficulty(elements.wordDifficulty.value);
    elements.secretWord.value = pickImpostorWord(pools, category, difficulty);
    setWordVisibility(false);
    updateFeedback("");
  }

  function openSetup() {
    openRoleSetup("impostorSetup");
    setWordVisibility(false);
    updateFeedback("");
  }

  function start() {
    const totalPlayers = syncPlayers(elements.playerCount.value);
    const impostorCount = syncImpostors(elements.impostorCount.value);
    const requirePlayerNames = elements.requireNames.value !== "optional";
    const category = syncCategory(elements.wordCategory.value);
    const difficulty = syncDifficulty(elements.wordDifficulty.value);
    let secretWord = normalizeWord(elements.secretWord.value);

    if (!secretWord) {
      secretWord = pickImpostorWord(pools, category, difficulty);
      elements.secretWord.value = secretWord;
      setWordVisibility(false);
    }

    updateFeedback("");
    startRoleGame(
      createImpostorGame({
        totalPlayers,
        impostorCount,
        requirePlayerNames,
        secretWord,
        category,
        difficulty,
      }),
    );
  }

  function bind() {
    elements.decreasePlayers.addEventListener("click", () => {
      syncPlayers(Number(elements.playerCount.value) - 1);
    });
    elements.increasePlayers.addEventListener("click", () => {
      syncPlayers(Number(elements.playerCount.value) + 1);
    });
    elements.playerCount.addEventListener("change", (event) => {
      syncPlayers(event.target.value);
    });
    elements.decreaseImpostors.addEventListener("click", () => {
      syncImpostors(Number(elements.impostorCount.value) - 1);
    });
    elements.increaseImpostors.addEventListener("click", () => {
      syncImpostors(Number(elements.impostorCount.value) + 1);
    });
    elements.impostorCount.addEventListener("change", (event) => {
      syncImpostors(event.target.value);
    });
    elements.wordCategory.addEventListener("change", (event) => {
      syncCategory(event.target.value);
    });
    elements.wordDifficulty.addEventListener("change", (event) => {
      syncDifficulty(event.target.value);
    });
    elements.randomWord.addEventListener("click", chooseRandomWord);
    elements.toggleVisibility.addEventListener("click", () => {
      const isVisible =
        elements.toggleVisibility.getAttribute("aria-pressed") === "true";
      setWordVisibility(!isVisible);
    });
    elements.form.addEventListener("submit", (event) => {
      event.preventDefault();
      start();
    });
    elements.goHub.addEventListener("click", openHub);
  }

  function initialize() {
    syncPlayers(elements.playerCount.value);
    syncImpostors(elements.impostorCount.value);
    syncCategory(elements.wordCategory.value);
    syncDifficulty(elements.wordDifficulty.value);
    setWordVisibility(false);
  }

  return {
    id: "impostor",
    setupScreen: "impostorSetup",
    bind,
    initialize,
    openSetup,
  };
}
