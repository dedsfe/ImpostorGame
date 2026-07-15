import {
  getMimicaEntryKey,
  normalizeMimicaEntry,
  randomIndex,
} from "../shared/utils.js";

export function normalizeMimicaDifficulty(value) {
  return value === "facil" || value === "medio" || value === "dificil"
    ? value
    : "medio";
}

export function normalizeMimicaTime(value) {
  return value === "30" || value === "45" || value === "60" ? Number(value) : null;
}

export function pickMimicaWord(pool, currentWord = "") {
  const currentKey = currentWord === "" ? "" : getMimicaEntryKey(currentWord);
  const candidates =
    pool.length > 1
      ? pool.filter((word) => getMimicaEntryKey(word) !== currentKey)
      : pool;

  return candidates[randomIndex(candidates.length)];
}

export function createMimicaController({
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

  function getSelectedPool() {
    const categoryPool = pools[state.mimica.category] ?? pools.geral;
    return categoryPool[state.mimica.difficulty] ?? pools.geral.medio;
  }

  function updatePoolInfo() {
    const words = getSelectedPool();
    const label = words.length === 1 ? "palavra" : "palavras";
    elements.poolInfo.textContent = `${words.length.toLocaleString(
      "pt-BR",
    )} ${label} disponíveis nesta seleção.`;
  }

  function syncCategory(nextValue) {
    const category = Object.prototype.hasOwnProperty.call(pools, nextValue)
      ? nextValue
      : "geral";

    if (state.mimica.category !== category) {
      state.mimica.remainingWords = [];
      state.mimica.currentWord = "";
      state.mimica.deckKey = `${category}:${state.mimica.difficulty}`;
    }

    state.mimica.category = category;
    elements.category.value = category;
    updatePoolInfo();
    return category;
  }

  function syncDifficulty(nextValue) {
    const difficulty = normalizeMimicaDifficulty(nextValue);

    if (state.mimica.difficulty !== difficulty) {
      state.mimica.remainingWords = [];
      state.mimica.currentWord = "";
      state.mimica.deckKey = `${state.mimica.category}:${difficulty}`;
    }

    state.mimica.difficulty = difficulty;
    elements.difficulty.value = difficulty;
    updatePoolInfo();
    return difficulty;
  }

  function syncTime(nextValue) {
    const time = normalizeMimicaTime(nextValue);
    state.mimica.timePerRound = time;
    elements.time.value = time === null ? "none" : String(time);
    return time;
  }

  function clearTimer() {
    if (state.mimica.timerId !== null) {
      clearInterval(state.mimica.timerId);
      state.mimica.timerId = null;
    }
  }

  function resetRound() {
    clearTimer();
    state.mimica.timeRemaining = state.mimica.timePerRound ?? 0;
    state.mimica.currentDuration = state.mimica.timePerRound ?? 0;
    state.mimica.timedOut = false;
    state.mimica.solved = false;
  }

  function renderTimer() {
    const hasTimer = state.mimica.timePerRound !== null;
    const duration = state.mimica.currentDuration || 1;
    const ratio = hasTimer ? Math.max(0, state.mimica.timeRemaining / duration) : 1;

    elements.timerWrap.hidden = !hasTimer;
    elements.progressFill.style.width = `${Math.max(0, ratio * 100)}%`;

    if (hasTimer) {
      elements.timer.textContent = `${state.mimica.timeRemaining}s`;
    }
  }

  function updateVisualState() {
    elements.play.classList.remove("is-timed-out", "is-success");

    if (state.mimica.solved) {
      elements.play.classList.add("is-success");
      elements.status.textContent = "Acertaram!";
      return;
    }

    if (state.mimica.timedOut) {
      elements.play.classList.add("is-timed-out");
      elements.status.textContent = "Tempo esgotado!";
      return;
    }

    elements.status.textContent =
      state.mimica.timePerRound === null ? "Valendo!" : "Tempo correndo";
  }

  function startTimer() {
    clearTimer();

    if (state.mimica.timePerRound === null) {
      renderTimer();
      updateVisualState();
      return;
    }

    state.mimica.timeRemaining = state.mimica.timePerRound;
    state.mimica.currentDuration = state.mimica.timePerRound;
    renderTimer();
    updateVisualState();

    state.mimica.timerId = setInterval(() => {
      if (state.mimica.timeRemaining <= 1) {
        state.mimica.timeRemaining = 0;
        clearTimer();
        state.mimica.timedOut = true;
        renderTimer();
        updateVisualState();
        return;
      }

      state.mimica.timeRemaining -= 1;
      renderTimer();
    }, 1000);
  }

  function openSetup() {
    state.currentGame = {
      type: "mimica",
      name: "Mímica Rápida",
    };
    state.currentPlayer = 0;
    clearTimer();
    state.mimica.remainingWords = [];
    state.mimica.currentWord = "";
    state.mimica.deckKey = "";
    syncCategory(elements.category.value);
    syncDifficulty(elements.difficulty.value);
    syncTime(elements.time.value);
    state.mimica.prepMode = "start";
    state.mimica.solved = false;
    state.mimica.timedOut = false;
    updateFeedback("");
    showScreen("mimicaSetup");
  }

  function renderPreparation() {
    const isNextPlayer = state.mimica.prepMode === "next-player";
    elements.prepTitle.textContent = isNextPlayer
      ? "Passe o celular para o próximo mímico"
      : "Passe o celular para quem vai fazer a mímica";
    elements.prepDescription.textContent = isNextPlayer
      ? "Toque em mostrar quando a próxima pessoa estiver pronta para ver a palavra."
      : "Toque em mostrar apenas quando a pessoa estiver pronta para ver a palavra.";
    clearTimer();
    showScreen("mimicaPrep");
  }

  function renderWord() {
    syncCategory(elements.category.value);
    syncDifficulty(elements.difficulty.value);
    const nextWord = pickMimicaWord(getSelectedPool(), state.mimica.currentWord);
    const word = normalizeMimicaEntry(nextWord);

    state.mimica.currentWord = nextWord;
    resetRound();
    elements.word.textContent = word.name;
    elements.wordSource.textContent = word.source;
    elements.wordSource.hidden = word.source === "";
    renderTimer();
    updateVisualState();
    showScreen("mimicaPlay");
    startTimer();
    enterFullscreen();
  }

  function markSuccess() {
    state.mimica.solved = true;
    state.mimica.timedOut = false;
    clearTimer();
    updateVisualState();
  }

  function start() {
    syncCategory(elements.category.value);
    syncDifficulty(elements.difficulty.value);
    syncTime(elements.time.value);
    state.mimica.prepMode = "start";
    updateFeedback("");
    renderPreparation();
  }

  function bind() {
    elements.category.addEventListener("change", (event) => {
      syncCategory(event.target.value);
    });
    elements.difficulty.addEventListener("change", (event) => {
      syncDifficulty(event.target.value);
    });
    elements.time.addEventListener("change", (event) => {
      syncTime(event.target.value);
    });
    elements.form.addEventListener("submit", (event) => {
      event.preventDefault();
      start();
    });
    elements.showWord.addEventListener("click", renderWord);
    elements.success.addEventListener("click", markSuccess);
    elements.nextWord.addEventListener("click", renderWord);
    elements.nextPlayer.addEventListener("click", () => {
      state.mimica.prepMode = "next-player";
      renderPreparation();
    });
    elements.close.addEventListener("click", openSetup);
    elements.goHub.addEventListener("click", openHub);
    elements.goHubPrep.addEventListener("click", openHub);
    elements.goSetupPrep.addEventListener("click", openSetup);
  }

  function initialize() {
    syncCategory(elements.category.value);
    syncDifficulty(elements.difficulty.value);
    syncTime(elements.time.value);
  }

  function cleanup() {
    clearTimer();
    updateFeedback("");
  }

  return {
    id: "mimica",
    setupScreen: "mimicaSetup",
    bind,
    cleanup,
    initialize,
    openSetup,
  };
}
