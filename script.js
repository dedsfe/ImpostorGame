const wordPools = {
  geral: {
    facil: ["bola", "casa", "pao", "sol", "carro", "flor", "mesa", "praia"],
    medio: [
      "astronauta",
      "abacaxi",
      "castelo",
      "violino",
      "pirata",
      "labirinto",
      "sorvete",
      "lanterna",
    ],
    dificil: [
      "constelacao",
      "metamorfose",
      "helicoptero",
      "criptografia",
      "ampulheta",
      "termodinamica",
      "paralelepipedo",
      "caleidoscopio",
    ],
  },
  animais: {
    facil: ["gato", "cachorro", "pato", "vaca", "leao", "urso", "coelho", "cobra"],
    medio: [
      "girafa",
      "tartaruga",
      "golfinho",
      "capivara",
      "pinguim",
      "leopardo",
      "jacare",
      "coruja",
    ],
    dificil: [
      "ornitorrinco",
      "suricata",
      "pangolim",
      "narval",
      "tamandua-bandeira",
      "axolote",
      "caracal",
      "alce",
    ],
  },
  comidas: {
    facil: ["pizza", "bolo", "arroz", "feijao", "pao", "queijo", "suco", "uva"],
    medio: [
      "lasanha",
      "brigadeiro",
      "hamburguer",
      "coxinha",
      "panqueca",
      "pipoca",
      "sushi",
      "taco",
    ],
    dificil: [
      "ratatouille",
      "croissant",
      "bruschetta",
      "ceviche",
      "yakisoba",
      "gnocchi",
      "bouillabaisse",
      "carbonara",
    ],
  },
  objetos: {
    facil: ["lapis", "copo", "chave", "cadeira", "livro", "bola", "prato", "toalha"],
    medio: [
      "mochila",
      "guarda-chuva",
      "controle",
      "tesoura",
      "espelho",
      "lanterna",
      "violao",
      "caderno",
    ],
    dificil: [
      "microscopio",
      "estetoscopio",
      "cronometro",
      "termostato",
      "binoculo",
      "bumerangue",
      "amplificador",
      "retroprojetor",
    ],
  },
  lugares: {
    facil: ["praia", "escola", "parque", "casa", "loja", "cinema", "igreja", "ponte"],
    medio: [
      "museu",
      "biblioteca",
      "aeroporto",
      "acampamento",
      "restaurante",
      "estadio",
      "aquario",
      "mercado",
    ],
    dificil: [
      "observatorio",
      "planetario",
      "anfiteatro",
      "mausoleu",
      "catedral",
      "embaixada",
      "laboratorio",
      "arquipelago",
    ],
  },
};

const heroContent = {
  hub: {
    eyebrow: "Jogos locais",
    title: "Hub de Jogos",
    copy:
      "Escolha um jogo, monte a rodada e distribua os papéis passando o celular de jogador para jogador.",
  },
  impostorSetup: {
    eyebrow: "Impostor",
    title: "Monte a rodada",
    copy:
      "Escolha categoria, dificuldade e distribua uma palavra secreta enquanto um jogador vira o impostor.",
  },
  policeSetup: {
    eyebrow: "Polícia e Ladrão",
    title: "Distribua os papéis",
    copy:
      "Escolha quantos serão policiais, ladrões e vítimas e deixe o app embaralhar os papéis.",
  },
};

const state = {
  currentScreen: "hub",
  currentPlayer: 0,
  currentGame: null,
};

const elements = {
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroCopy: document.getElementById("hero-copy"),
  screens: {
    hub: document.getElementById("hub-screen"),
    impostorSetup: document.getElementById("impostor-setup-screen"),
    policeSetup: document.getElementById("police-setup-screen"),
    turn: document.getElementById("turn-screen"),
    end: document.getElementById("end-screen"),
  },
  openImpostorGame: document.getElementById("open-impostor-game"),
  openPoliceGame: document.getElementById("open-police-game"),
  impostor: {
    form: document.getElementById("impostor-setup-form"),
    playerCount: document.getElementById("impostor-player-count"),
    decreasePlayers: document.getElementById("impostor-decrease-players"),
    increasePlayers: document.getElementById("impostor-increase-players"),
    wordCategory: document.getElementById("impostor-word-category"),
    wordDifficulty: document.getElementById("impostor-word-difficulty"),
    secretWord: document.getElementById("impostor-secret-word"),
    toggleVisibility: document.getElementById("impostor-toggle-word-visibility"),
    toggleLabel: document.getElementById("impostor-toggle-word-label"),
    randomWord: document.getElementById("impostor-random-word"),
    feedback: document.getElementById("impostor-setup-feedback"),
    goHub: document.getElementById("go-hub-from-impostor"),
  },
  police: {
    form: document.getElementById("police-setup-form"),
    policeCount: document.getElementById("police-count"),
    decreaseCount: document.getElementById("police-decrease-count"),
    increaseCount: document.getElementById("police-increase-count"),
    thiefCount: document.getElementById("thief-count"),
    decreaseThieves: document.getElementById("thief-decrease-count"),
    increaseThieves: document.getElementById("thief-increase-count"),
    victimCount: document.getElementById("victim-count"),
    decreaseVictims: document.getElementById("victim-decrease-count"),
    increaseVictims: document.getElementById("victim-increase-count"),
    roleSummary: document.getElementById("police-role-summary"),
    feedback: document.getElementById("police-setup-feedback"),
    goHub: document.getElementById("go-hub-from-police"),
  },
  turn: {
    panel: document.getElementById("turn-panel"),
    gameLabel: document.getElementById("turn-game-label"),
    progress: document.getElementById("turn-progress"),
    prepView: document.getElementById("prep-view"),
    revealView: document.getElementById("reveal-view"),
    prepTitle: document.getElementById("prep-title"),
    prepDescription: document.getElementById("prep-description"),
    revealRole: document.getElementById("reveal-role"),
    roleBadge: document.getElementById("role-badge"),
    roleTitle: document.getElementById("role-title"),
    roleDescription: document.getElementById("role-description"),
    wordCard: document.getElementById("word-card"),
    nextPlayer: document.getElementById("next-player"),
    restart: document.getElementById("restart-turn"),
    goHub: document.getElementById("go-hub-turn"),
  },
  end: {
    label: document.getElementById("end-label"),
    title: document.getElementById("end-title"),
    description: document.getElementById("end-description"),
    summaryGrid: document.getElementById("end-summary-grid"),
    playAgain: document.getElementById("play-again"),
    goHub: document.getElementById("go-hub-end"),
  },
};

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

function clampRoleCount(value) {
  return clampInteger(value, 1, 20, 1);
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

function setActiveScreen(screen) {
  state.currentScreen = screen;
  Object.entries(elements.screens).forEach(([key, element]) => {
    element.classList.toggle("is-active", key === screen);
  });

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

function buildImpostorGame(totalPlayers, secretWord, category, difficulty) {
  const impostorIndex = randomIndex(totalPlayers);
  const roles = Array.from({ length: totalPlayers }, (_, playerIndex) => {
    if (playerIndex === impostorIndex) {
      return {
        badge: "Impostor",
        title: "Você é o impostor",
        description:
          "Escute a conversa, tente entender a palavra e não entregue que você não a conhece.",
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
  });

  return {
    type: "impostor",
    name: "Impostor",
    totalPlayers,
    roles,
    setupScreen: "impostorSetup",
    endLabel: "Rodada pronta",
    endTitle: "Todos já receberam seus papéis",
    endDescription:
      "Agora afastem o celular e comecem a conversa para descobrir quem é o impostor.",
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Impostores", value: "1" },
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

function buildPoliceGame(totalPlayers, policeCount, thiefCount, victimCount) {
  const roles = shuffleArray([
    ...Array.from({ length: policeCount }, () => ({
      badge: "Polícia",
      title: "Você é a polícia",
      description:
        "Observe a rodada com cuidado e tente identificar quem está agindo como ladrão.",
      value: "POLÍCIA",
      tone: "police",
    })),
    ...Array.from({ length: thiefCount }, () => ({
      badge: "Ladrão",
      title: "Você é o ladrão",
      description:
        "Tente disfarçar seu papel e escapar da atenção dos policiais durante a rodada.",
      value: "LADRÃO",
      tone: "thief",
    })),
    ...Array.from({ length: victimCount }, () => ({
      badge: "Vítima",
      title: "Você é a vítima",
      description:
        "Observe os outros jogadores e tente perceber quem pode estar do seu lado ou contra você.",
      value: "VÍTIMA",
      tone: "victim",
    })),
  ]);

  return {
    type: "police",
    name: "Polícia e Ladrão",
    totalPlayers,
    roles,
    setupScreen: "policeSetup",
    endLabel: "Papéis distribuídos",
    endTitle: "Todo mundo já sabe seu papel",
    endDescription:
      "Agora vocês podem começar a rodada sabendo quem é polícia, ladrão ou vítima.",
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Policiais", value: String(policeCount) },
      { label: "Ladrões", value: String(thiefCount) },
      { label: "Vítimas", value: String(victimCount) },
    ],
    hero: {
      eyebrow: "Polícia e Ladrão",
      title: "Distribuição de papéis",
      copy: `${policeCount} ${pluralize(
        policeCount,
        "policial",
        "policiais",
      )}, ${thiefCount} ${pluralize(
        thiefCount,
        "ladrão",
        "ladrões",
      )} e ${victimCount} ${pluralize(victimCount, "vítima", "vítimas")} na rodada.`,
    },
  };
}

function openHub() {
  state.currentGame = null;
  state.currentPlayer = 0;
  clearRoleTone();
  setTurnPhase("prep");
  updateImpostorFeedback("");
  updatePoliceFeedback("");
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

elements.openImpostorGame.addEventListener("click", openImpostorSetup);
elements.openPoliceGame.addEventListener("click", openPoliceSetup);

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
setActiveScreen("hub");
