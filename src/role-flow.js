import { normalizeWord } from "./shared/utils.js";

const ROLE_TONE_CLASSES = [
  "is-impostor",
  "is-police",
  "is-thief",
  "is-victim",
];

export function createRoleFlow({
  elements,
  onOpenHub,
  openGameSetup,
  setHero,
  showScreen,
  state,
}) {
  const { end, turn } = elements;

  function clearTone() {
    ROLE_TONE_CLASSES.forEach((className) => {
      turn.panel.classList.remove(className);
      turn.wordCard.classList.remove(className);
    });
  }

  function applyTone(tone) {
    clearTone();

    const className = `is-${tone}`;
    if (ROLE_TONE_CLASSES.includes(className)) {
      turn.panel.classList.add(className);
      turn.wordCard.classList.add(className);
    }
  }

  function setPhase(phase) {
    const isPreparation = phase === "prep";
    turn.prepView.classList.toggle("is-active", isPreparation);
    turn.revealView.classList.toggle("is-active", !isPreparation);
    turn.panel.classList.toggle("is-prep", isPreparation);
    turn.panel.classList.toggle("is-reveal", !isPreparation);
  }

  function resetPlayers() {
    state.currentPlayer = 0;
    state.playerNames = [];
    turn.playerName.value = "";
    turn.revealRole.disabled = true;
  }

  function requiresPlayerNames() {
    return state.currentGame?.requirePlayerNames !== false;
  }

  function currentPlayerName() {
    return state.playerNames[state.currentPlayer] ?? "";
  }

  function currentPlayerLabel() {
    return currentPlayerName() || `Jogador ${state.currentPlayer + 1}`;
  }

  function syncPlayerName() {
    if (!requiresPlayerNames()) {
      turn.revealRole.disabled = false;
      return "";
    }

    const playerName = normalizeWord(turn.playerName.value);
    state.playerNames[state.currentPlayer] = playerName;
    turn.revealRole.disabled = playerName.length === 0;
    return playerName;
  }

  function publicRoleLabel(role) {
    return role.tone === "impostor"
      ? "Impostor"
      : role.value || role.badge || role.title;
  }

  function renderRoleList() {
    const roles = state.currentGame?.roles ?? [];

    end.roleRevealList.replaceChildren(
      ...roles.map((role, playerIndex) => {
        const item = document.createElement("article");
        const name = document.createElement("strong");
        const roleLabel = document.createElement("span");

        item.className = "role-reveal-item";
        item.classList.toggle("is-impostor", role.tone === "impostor");
        name.textContent =
          state.playerNames[playerIndex] || `Jogador ${playerIndex + 1}`;
        roleLabel.textContent = publicRoleLabel(role);
        item.append(name, roleLabel);
        return item;
      }),
    );
  }

  function setRoleListVisible(isVisible) {
    end.roleRevealPanel.hidden = !isVisible;
    end.showRoleReveal.textContent = isVisible
      ? "Ocultar quem é quem"
      : "Mostrar quem é quem";
  }

  function renderSecret(role) {
    const isVisible = state.turnRevealVisible;
    const showImpostorHint = isVisible && role.tone === "impostor";

    turn.toggleVisibility.setAttribute("aria-pressed", String(isVisible));
    turn.toggleVisibility.setAttribute(
      "aria-label",
      isVisible ? "Esconder papel" : "Ver papel",
    );
    turn.toggleVisibility.classList.toggle("is-visible", isVisible);
    turn.toggleVisibilityLabel.textContent = isVisible
      ? "Esconder papel"
      : "Ver papel";
    turn.wordCard.classList.toggle("is-concealed", !isVisible);
    turn.impostorHint.hidden = !showImpostorHint;
    turn.impostorHint.textContent = showImpostorHint ? role.hint : "";

    if (!isVisible) {
      turn.roleBadge.textContent = "Papel oculto";
      turn.roleTitle.textContent = "Toque para ver seu papel";
      turn.roleDescription.textContent =
        "Use o botão de olho para revelar somente quando a tela estiver protegida.";
      turn.wordCard.textContent = "••••";
      return;
    }

    turn.roleBadge.textContent = role.badge;
    turn.roleTitle.textContent = role.title;
    turn.roleDescription.textContent = role.description;
    turn.wordCard.textContent = role.value;
  }

  function openHub() {
    state.currentGame = null;
    resetPlayers();
    clearTone();
    setPhase("prep");
    onOpenHub();
  }

  function openSetup(screen) {
    state.currentGame = null;
    resetPlayers();
    clearTone();
    setPhase("prep");
    showScreen(screen);
  }

  function startGame(game) {
    state.currentGame = game;
    resetPlayers();
    renderPreparation();
  }

  function renderPreparation() {
    const playerNumber = state.currentPlayer + 1;
    const requireNames = requiresPlayerNames();
    const simpleReveal = state.currentGame.simpleReveal === true;

    setHero({
      eyebrow: state.currentGame.name,
      title: "Passe para o próximo jogador",
      copy:
        "Mantenha a tela coberta e revele o papel somente quando a pessoa certa estiver pronta.",
    });
    state.turnRevealVisible = false;
    turn.panel.dataset.game = state.currentGame.type;
    turn.gameLabel.textContent = state.currentGame.name;
    turn.progress.textContent = `Jogador ${playerNumber} de ${state.currentGame.totalPlayers}`;
    turn.prepTitle.textContent = `Prepare o Jogador ${playerNumber}`;
    turn.prepDescription.textContent = requireNames
      ? "Digite o nome antes de revelar. Só a pessoa com esse nome deve tocar para ver o papel."
      : "Passe o celular com a tela coberta e toque em mostrar apenas quando a pessoa estiver pronta.";
    turn.revealRole.textContent = simpleReveal ? "Ver meu papel" : "Mostrar papel";
    turn.toggleVisibility.hidden = simpleReveal;
    turn.playerName.closest(".turn-name-field").hidden = !requireNames;
    turn.playerName.value = currentPlayerName();
    syncPlayerName();

    clearTone();
    setPhase("prep");
    showScreen("turn");
    if (requireNames) {
      turn.playerName.focus();
    }
  }

  function renderReveal() {
    const playerNumber = state.currentPlayer + 1;
    const role = state.currentGame.roles[state.currentPlayer];
    const simpleReveal = state.currentGame.simpleReveal === true;
    const isLastPlayer =
      state.currentPlayer === state.currentGame.totalPlayers - 1;

    setHero(state.currentGame.hero);
    state.turnRevealVisible = simpleReveal;
    turn.panel.dataset.game = state.currentGame.type;
    turn.gameLabel.textContent = state.currentGame.name;
    turn.progress.textContent = `${currentPlayerLabel()} (${playerNumber} de ${state.currentGame.totalPlayers})`;
    turn.toggleVisibility.hidden = simpleReveal;
    turn.nextPlayer.textContent = simpleReveal
      ? isLastPlayer
        ? "Ocultar e começar"
        : "Ocultar e passar"
      : isLastPlayer
        ? "Finalizar distribuição"
        : "Próximo jogador";

    applyTone(role.tone);
    renderSecret(role);
    setPhase("reveal");
    showScreen("turn");
  }

  function renderEndScreen() {
    const deferRoleReveal = state.currentGame.deferRoleReveal === true;

    state.currentGame.roundEnded = false;
    setHero(
      deferRoleReveal
        ? {
            eyebrow: state.currentGame.name,
            title: "Valendo!",
            copy: "O celular pode sair da roda enquanto vocês jogam.",
          }
        : {
            eyebrow: state.currentGame.name,
            title: "Rodada pronta",
            copy: "Todos os papéis foram entregues. Agora o jogo começa fora da tela.",
          },
    );

    end.panel.dataset.game = state.currentGame.type;
    end.label.textContent = state.currentGame.endLabel;
    end.title.textContent = state.currentGame.endTitle;
    let description = state.currentGame.endDescription;

    if (state.currentGame.type === "impostor") {
      const starterIndex = Math.floor(
        Math.random() * state.currentGame.totalPlayers,
      );
      const starterName =
        state.playerNames[starterIndex] || `Jogador ${starterIndex + 1}`;
      description += ` Sorteio: quem começa perguntando é ${starterName}!`;
    }

    end.description.textContent = description;
    const instructions = state.currentGame.instructions ?? [];
    end.instructions.hidden = instructions.length === 0;
    end.instructions.replaceChildren(
      ...instructions.map((instruction) => {
        const item = document.createElement("li");
        item.textContent = instruction;
        return item;
      }),
    );
    end.playAgain.textContent = deferRoleReveal
      ? "Jogar novamente"
      : `Nova partida de ${state.currentGame.name}`;
    end.summaryGrid.replaceChildren(
      ...state.currentGame.summary.map((summary) => {
        const card = document.createElement("article");
        const label = document.createElement("span");
        const value = document.createElement("strong");

        card.className = "summary-card";
        label.className = "summary-label";
        label.textContent = summary.label;
        value.textContent = summary.value;
        card.append(label, value);
        return card;
      }),
    );
    renderRoleList();
    setRoleListVisible(false);
    end.showRoleReveal.hidden = false;
    end.showRoleReveal.textContent = deferRoleReveal
      ? "Encerrar rodada"
      : "Mostrar quem é quem";
    end.playAgain.hidden = deferRoleReveal;
    showScreen("end");
  }

  function renderResult() {
    if (!state.currentGame?.deferRoleReveal) {
      return;
    }

    state.currentGame.roundEnded = true;
    setHero({
      eyebrow: state.currentGame.name,
      title: "Resultado",
      copy: "A rodada acabou. Agora vocês podem conferir todos os papéis.",
    });
    end.label.textContent = "Resultado";
    end.title.textContent = "Quem era quem?";
    end.description.textContent = "Confiram os papéis e decidam se o impostor escapou.";
    setRoleListVisible(true);
    end.showRoleReveal.hidden = true;
    end.playAgain.hidden = false;
  }

  function restartGame() {
    if (state.currentGame && openGameSetup(state.currentGame.type)) {
      return;
    }

    openHub();
  }

  function playAgain() {
    if (
      state.currentGame &&
      openGameSetup(state.currentGame.type, { playAgain: true })
    ) {
      return;
    }

    openHub();
  }

  function bind() {
    turn.playerName.addEventListener("input", syncPlayerName);
    turn.playerName.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!turn.revealRole.disabled) {
          renderReveal();
        }
      }
    });
    turn.revealRole.addEventListener("click", () => {
      if (requiresPlayerNames() && !syncPlayerName()) {
        turn.playerName.focus();
        return;
      }
      renderReveal();
    });
    turn.toggleVisibility.addEventListener("click", () => {
      if (!state.currentGame || !turn.revealView.classList.contains("is-active")) {
        return;
      }
      state.turnRevealVisible = !state.turnRevealVisible;
      renderSecret(state.currentGame.roles[state.currentPlayer]);
    });
    turn.nextPlayer.addEventListener("click", () => {
      const isLastPlayer =
        state.currentPlayer === state.currentGame.totalPlayers - 1;
      if (isLastPlayer) {
        renderEndScreen();
        return;
      }
      state.currentPlayer += 1;
      renderPreparation();
    });
    turn.restart.addEventListener("click", restartGame);
    turn.goHub.addEventListener("click", openHub);
    end.showRoleReveal.addEventListener("click", () => {
      if (state.currentGame?.deferRoleReveal && !state.currentGame.roundEnded) {
        renderResult();
        return;
      }
      setRoleListVisible(end.roleRevealPanel.hidden);
    });
    end.playAgain.addEventListener("click", playAgain);
    end.goHub.addEventListener("click", openHub);
  }

  return { bind, openHub, openSetup, startGame };
}
