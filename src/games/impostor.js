import {
  clampInteger,
  clampPlayers,
  normalizeWord,
  shuffleArray,
} from "../shared/utils.js";
import {
  createImpostorWordDeck,
  mergeImpostorThemes,
  resolveImpostorWord,
} from "./impostor-deck.js";

const THEME_LABELS = {
  animais: "Animais",
  comidas: "Comidas",
  lugares: "Lugares",
  misturado: "Misturado",
  objetos: "Objetos",
};

export function getImpostorThemeLabel(theme) {
  if (THEME_LABELS[theme]) {
    return THEME_LABELS[theme];
  }

  const label = String(theme ?? "")
    .replaceAll("-", " ")
    .trim();
  return label ? `${label[0].toUpperCase()}${label.slice(1)}` : "Misturado";
}

export function normalizeImpostorSetup({ totalPlayers, impostorCount }) {
  const safeTotalPlayers = clampPlayers(totalPlayers);
  const maxImpostors = Math.max(1, safeTotalPlayers - 1);

  return {
    totalPlayers: safeTotalPlayers,
    impostorCount: clampInteger(impostorCount, 1, maxImpostors, 1),
    maxImpostors,
  };
}

export function createImpostorGame({
  totalPlayers,
  impostorCount,
  requirePlayerNames,
  secretWord,
  theme,
  category,
  wordSource = "deck",
}) {
  const selectedTheme = theme ?? category ?? "misturado";
  const themeLabel = getImpostorThemeLabel(selectedTheme);
  const safeImpostorCount = Math.min(Math.max(1, impostorCount), totalPlayers - 1);
  const roles = shuffleArray(
    Array.from({ length: totalPlayers }, (_, playerIndex) => {
      if (playerIndex < safeImpostorCount) {
        return {
          badge: "Impostor",
          title: "Você é o impostor",
          description:
            "Escute a conversa, tente entender a palavra e não entregue que você não a conhece.",
          hint: `Dica de tema: ${themeLabel}`,
          value: "IMPOSTOR",
          tone: "impostor",
        };
      }

      return {
        badge: "Palavra secreta",
        title: "Sua palavra é",
        description: "Guarde a palavra e pense em uma pista que não seja óbvia.",
        value: secretWord,
        tone: "word",
      };
    }),
  );

  return {
    deferRoleReveal: true,
    endDescription: `Conversem para descobrir quem ${
      safeImpostorCount > 1 ? "são os impostores" : "é o impostor"
    }.`,
    endLabel: "Rodada em andamento",
    endTitle: "Valendo!",
    hero: {
      copy: `Tema ${themeLabel}. Veja seu papel e passe o aparelho.`,
      eyebrow: "Impostor",
      title: "Distribuição de papéis",
    },
    impostorCount: safeImpostorCount,
    name: "Impostor",
    requirePlayerNames,
    roles,
    setupScreen: "impostorSetup",
    simpleReveal: true,
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Impostores", value: String(safeImpostorCount) },
      { label: "Tema", value: themeLabel },
    ],
    theme: selectedTheme,
    totalPlayers,
    type: "impostor",
    wordSource,
  };
}

export function createImpostorController({
  elements,
  openHub,
  openRoleSetup,
  pools,
  startRoleGame,
}) {
  const wordDeck = createImpostorWordDeck({ pools });

  function setWordVisibility(isVisible) {
    elements.secretWord.type = isVisible ? "text" : "password";
    elements.toggleVisibility.setAttribute("aria-pressed", String(isVisible));
    elements.toggleVisibility.setAttribute(
      "aria-label",
      isVisible ? "Esconder palavra personalizada" : "Mostrar palavra personalizada",
    );
    elements.toggleVisibility.classList.toggle("is-visible", isVisible);
    elements.toggleLabel.textContent = isVisible ? "Ocultar" : "Mostrar";
  }

  function updateFeedback(message = "") {
    elements.feedback.textContent = message;
  }

  function syncPlayers(nextValue) {
    const setup = normalizeImpostorSetup({
      impostorCount: elements.impostorCount.value,
      totalPlayers: nextValue,
    });

    elements.playerCount.value = setup.totalPlayers;
    elements.impostorCount.max = setup.maxImpostors;
    elements.impostorCount.value = setup.impostorCount;
    return setup.totalPlayers;
  }

  function syncImpostors(nextValue) {
    const setup = normalizeImpostorSetup({
      impostorCount: nextValue,
      totalPlayers: elements.playerCount.value,
    });

    elements.playerCount.value = setup.totalPlayers;
    elements.impostorCount.max = setup.maxImpostors;
    elements.impostorCount.value = setup.impostorCount;
    return setup.impostorCount;
  }

  function syncTheme(nextValue) {
    const themes = mergeImpostorThemes(pools);
    const theme = Object.hasOwn(themes, nextValue) ? nextValue : "misturado";
    elements.wordCategory.value = theme;
    renderDeckProgress(theme);
    return theme;
  }

  function refreshThemes() {
    const currentTheme = elements.wordCategory.value || "misturado";
    const options = Object.entries(mergeImpostorThemes(pools))
      .filter(([, words]) => words.length > 0)
      .map(([theme]) => {
        const option = document.createElement("option");
        option.value = theme;
        option.textContent = getImpostorThemeLabel(theme);
        return option;
      });

    elements.wordCategory.replaceChildren(...options);
    return syncTheme(currentTheme);
  }

  function syncWordMode(nextValue) {
    const mode = nextValue === "custom" ? "custom" : "deck";
    elements.wordMode.value = mode;
    elements.customWordGroup.hidden = mode !== "custom";
    setWordVisibility(false);
    return mode;
  }

  function renderDeckProgress(theme = elements.wordCategory.value) {
    const progress = wordDeck.getProgress(theme);
    elements.deckProgress.textContent = `${getImpostorThemeLabel(
      progress.theme,
    )} — ${progress.used} de ${progress.total} palavras vistas`;
  }

  function resetHistory() {
    const theme = syncTheme(elements.wordCategory.value);
    wordDeck.reset(theme);
    renderDeckProgress(theme);
    updateFeedback(`Histórico de ${getImpostorThemeLabel(theme)} reiniciado.`);
  }

  function openSetup() {
    openRoleSetup("impostorSetup");
    syncWordMode(elements.wordMode.value);
    renderDeckProgress();
    updateFeedback("");
  }

  function start() {
    const totalPlayers = syncPlayers(elements.playerCount.value);
    const impostorCount = syncImpostors(elements.impostorCount.value);
    const requirePlayerNames = elements.requireNames.value !== "optional";
    const theme = syncTheme(elements.wordCategory.value);
    const wordMode = syncWordMode(elements.wordMode.value);
    const customWord =
      wordMode === "custom" ? normalizeWord(elements.secretWord.value) : "";

    if (wordMode === "custom" && !customWord) {
      elements.moreOptions.open = true;
      elements.customWordGroup.hidden = false;
      updateFeedback("Digite a palavra personalizada para começar.");
      elements.secretWord.focus();
      return false;
    }

    const selection = resolveImpostorWord({ customWord, deck: wordDeck, theme });
    renderDeckProgress(theme);
    updateFeedback("");
    startRoleGame(
      createImpostorGame({
        impostorCount,
        requirePlayerNames,
        secretWord: selection.word,
        theme,
        totalPlayers,
        wordSource: selection.source,
      }),
    );
    return true;
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
      syncTheme(event.target.value);
      updateFeedback("");
    });
    elements.wordMode.addEventListener("change", (event) => {
      syncWordMode(event.target.value);
      updateFeedback("");
    });
    elements.resetHistory.addEventListener("click", resetHistory);
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
    refreshThemes();
    syncWordMode(elements.wordMode.value);
    setWordVisibility(false);
  }

  return {
    bind,
    id: "impostor",
    initialize,
    openSetup,
    playAgain: start,
    setupScreen: "impostorSetup",
  };
}
