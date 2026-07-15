import {
  buildShuffledDeck,
  getWhoAmIEntryKey,
  normalizeWhoAmIEntry,
  randomIndex,
} from "../shared/utils.js";

export function drawWhoAmICharacter({
  pool,
  remainingCharacters = [],
  currentCharacter = "",
}) {
  const remaining =
    remainingCharacters.length > 0
      ? [...remainingCharacters]
      : buildShuffledDeck(pool, currentCharacter, getWhoAmIEntryKey);
  const character = remaining.pop() ?? pool[randomIndex(pool.length)];

  return {
    character,
    remainingCharacters: remaining,
  };
}

export function createWhoAmIController({
  elements,
  enterFullscreen,
  openHub,
  pools,
  showScreen,
  state,
}) {
  function updateFeedback(message = "") {
    elements.feedback.textContent = message;
  }

  function syncCategory(nextValue) {
    const category = Object.prototype.hasOwnProperty.call(pools, nextValue)
      ? nextValue
      : "geral";

    if (state.whoami.category !== category) {
      state.whoami.remainingCharacters = [];
      state.whoami.currentCharacter = "";
    }

    state.whoami.category = category;
    elements.category.value = category;
    return category;
  }

  function revealCharacter() {
    const category = syncCategory(elements.category.value);
    const pool = pools[category] ?? pools.geral;
    const draw = drawWhoAmICharacter({
      pool,
      remainingCharacters: state.whoami.remainingCharacters,
      currentCharacter: state.whoami.currentCharacter,
    });
    const character = normalizeWhoAmIEntry(draw.character);

    state.whoami.remainingCharacters = draw.remainingCharacters;
    state.whoami.currentCharacter = draw.character;
    elements.characterName.textContent = character.name;
    elements.characterSource.textContent = character.source;
    elements.characterSource.hidden = character.source === "";
    updateFeedback("");
    showScreen("whoamiReveal");
    enterFullscreen();
  }

  function openSetup() {
    state.currentGame = {
      type: "whoami",
      name: "Quem sou eu?",
      setupScreen: "whoamiSetup",
    };
    state.currentPlayer = 0;
    syncCategory(elements.category.value);
    updateFeedback("");
    showScreen("whoamiSetup");
  }

  function bind() {
    elements.category.addEventListener("change", (event) => {
      syncCategory(event.target.value);
    });
    elements.form.addEventListener("submit", (event) => {
      event.preventDefault();
      revealCharacter();
    });
    elements.reroll.addEventListener("click", revealCharacter);
    elements.close.addEventListener("click", openSetup);
    elements.goHub.addEventListener("click", openHub);
  }

  return {
    id: "whoami",
    setupScreen: "whoamiSetup",
    bind,
    initialize: () => syncCategory(elements.category.value),
    minimumPlayers: 1,
    openSetup,
  };
}
