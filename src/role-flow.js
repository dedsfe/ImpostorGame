import { normalizeWord } from "./shared/utils.js";
import {
  buildImpostorResult,
  buildRevealResultPrompt,
  fitSessionPlayerNames,
} from "./games/impostor-ux.js";

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
  let resultDialogTrigger = null;

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

  function clearTurnSecret() {
    state.turnRevealVisible = false;
    turn.roleBadge.textContent = "";
    turn.roleTitle.textContent = "";
    turn.roleDescription.textContent = "";
    turn.wordCard.textContent = "";
    turn.impostorHint.textContent = "";
    turn.impostorHint.hidden = true;
  }

  function resetPlayers({ preserveNames = false, totalPlayers = 0 } = {}) {
    state.currentPlayer = 0;
    state.playerNames = fitSessionPlayerNames(
      state.playerNames,
      totalPlayers,
      { preserve: preserveNames },
    );
    state.turnRoleViewed = false;
    clearTurnSecret();
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

  function closeResultDialog({ restoreFocus = true } = {}) {
    const returnTarget = resultDialogTrigger;
    resultDialogTrigger = null;

    if (end.resultDialog.open) {
      end.resultDialog.close();
    }

    if (restoreFocus && returnTarget?.isConnected) {
      queueMicrotask(() => returnTarget.focus());
    }
  }

  function openResultDialog() {
    const prompt = buildRevealResultPrompt(state.currentGame.impostorCount);

    end.resultDialogTitle.textContent = prompt.title;
    end.resultDialogCopy.textContent = prompt.copy;
    resultDialogTrigger = document.activeElement;
    end.resultDialog.showModal();
    queueMicrotask(() => end.continuePlaying.focus());
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
    closeResultDialog({ restoreFocus: false });
    state.currentGame = null;
    resetPlayers();
    clearTone();
    setPhase("prep");
    onOpenHub();
  }

  function openSetup(screen) {
    closeResultDialog({ restoreFocus: false });
    const previousGame = state.currentGame;
    const preserveNames = previousGame?.type === "impostor";

    state.currentGame = null;
    resetPlayers({
      preserveNames,
      totalPlayers: previousGame?.totalPlayers ?? state.playerNames.length,
    });
    clearTone();
    setPhase("prep");
    showScreen(screen);
  }

  function startGame(game) {
    closeResultDialog({ restoreFocus: false });
    const preserveNames =
      game.type === "impostor" && game.requirePlayerNames === true;

    state.currentGame = game;
    resetPlayers({ preserveNames, totalPlayers: game.totalPlayers });
    end.roleRevealList.replaceChildren();
    end.roleRevealPanel.hidden = true;
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
    state.turnRoleViewed = false;
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
    state.turnRoleViewed = true;
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
    const isImpostor = state.currentGame.type === "impostor";

    clearTurnSecret();
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

    if (isImpostor) {
      const starterIndex = Number.isInteger(state.currentGame.starterIndex)
        ? state.currentGame.starterIndex
        : Math.floor(Math.random() * state.currentGame.totalPlayers);
      state.currentGame.starterIndex = starterIndex;
      const starterName =
        state.playerNames[starterIndex] || `Jogador ${starterIndex + 1}`;
      description = `${starterName} começa dando uma pista.`;
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
      ? "Jogar outra"
      : `Nova partida de ${state.currentGame.name}`;
    end.summaryGrid.hidden = false;
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
    end.roleRevealList.replaceChildren();
    setRoleListVisible(false);
    end.showRoleReveal.hidden = false;
    end.showRoleReveal.textContent = deferRoleReveal
      ? "A votação terminou"
      : "Mostrar quem é quem";
    end.playAgain.hidden = deferRoleReveal;
    end.changeSettings.hidden = true;
    end.goHub.hidden = deferRoleReveal;
    end.goHub.textContent = "Noite de jogos";
    showScreen("end");
  }

  function renderResult() {
    if (!state.currentGame?.deferRoleReveal) {
      return;
    }

    const result = buildImpostorResult({
      playerNames: state.playerNames,
      roles: state.currentGame.roles,
      secretWord: state.currentGame.secretWord,
    });

    state.currentGame.roundEnded = true;
    setHero({
      eyebrow: state.currentGame.name,
      title: "Resultado",
      copy: "A rodada acabou. Agora vocês podem conferir todos os papéis.",
    });
    end.label.textContent = "Resultado";
    end.title.textContent = result.title;
    end.description.textContent = result.secret;
    end.instructions.hidden = true;
    end.summaryGrid.hidden = true;
    renderRoleList();
    setRoleListVisible(true);
    end.showRoleReveal.hidden = true;
    end.playAgain.hidden = false;
    end.playAgain.textContent = "Jogar outra";
    end.changeSettings.hidden = false;
    end.goHub.hidden = false;
    end.goHub.textContent = "Sair do jogo";
  }

  function revealConfirmedResult() {
    closeResultDialog({ restoreFocus: false });
    renderResult();
    queueMicrotask(() => end.playAgain.focus());
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
      state.turnRoleViewed ||= state.turnRevealVisible;
      renderSecret(state.currentGame.roles[state.currentPlayer]);
    });
    turn.nextPlayer.addEventListener("click", () => {
      if (state.currentGame?.type === "impostor" && !state.turnRoleViewed) {
        return;
      }

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
        openResultDialog();
        return;
      }
      setRoleListVisible(end.roleRevealPanel.hidden);
    });
    end.continuePlaying.addEventListener("click", () => {
      closeResultDialog();
    });
    end.confirmResult.addEventListener("click", () => {
      revealConfirmedResult();
    });
    end.resultDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeResultDialog();
    });
    end.resultDialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeResultDialog();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        const actions = [end.continuePlaying, end.confirmResult];
        const currentIndex = actions.indexOf(document.activeElement);
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex = (currentIndex + direction + actions.length) % actions.length;
        actions[nextIndex].focus();
        return;
      }

      if (event.key === "Enter") {
        if (document.activeElement === end.continuePlaying) {
          event.preventDefault();
          closeResultDialog();
        } else if (document.activeElement === end.confirmResult) {
          event.preventDefault();
          revealConfirmedResult();
        }
      }
    });
    end.playAgain.addEventListener("click", playAgain);
    end.changeSettings.addEventListener("click", restartGame);
    end.goHub.addEventListener("click", openHub);
  }

  return { bind, openHub, openSetup, startGame };
}
