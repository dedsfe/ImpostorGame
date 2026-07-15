import {
  buildImpostorResult,
  buildRevealResultPrompt,
} from "./games/impostor-ux.js";
import { animateElement } from "./motion.js";

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

  function resetPlayers() {
    state.currentPlayer = 0;
    state.playerNames = [];
    state.turnRoleViewed = false;
    clearTurnSecret();
  }

  function currentPlayerName() {
    return state.playerNames[state.currentPlayer] ?? "";
  }

  function currentPlayerLabel() {
    return currentPlayerName() || `Jogador ${state.currentPlayer + 1}`;
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
    void animateElement(
      end.resultDialog.querySelector(".result-confirm-content"),
      [
        { transform: "translateY(6px)" },
        { transform: "translateY(0)" },
      ],
      { duration: 170 },
    );
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

    turn.roleBadge.textContent = `${currentPlayerLabel()}, veja seu papel`;
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
    state.currentGame = null;
    resetPlayers();
    clearTone();
    setPhase("prep");
    showScreen(screen);
  }

  function startGame(game) {
    closeResultDialog({ restoreFocus: false });
    const players = game.party?.players ?? [];

    if (players.length !== game.totalPlayers) {
      throw new Error("O snapshot do grupo não corresponde à rodada.");
    }

    state.currentGame = game;
    resetPlayers();
    state.playerNames = players.map((player) => player.name);
    end.roleRevealList.replaceChildren();
    end.roleRevealPanel.hidden = true;
    renderPreparation();
  }

  function renderPreparation() {
    const playerNumber = state.currentPlayer + 1;
    const simpleReveal = state.currentGame.simpleReveal === true;
    const playerName = currentPlayerLabel();

    setHero({
      eyebrow: state.currentGame.name,
      title: `Passe para ${playerName}`,
      copy: `Só ${playerName} deve olhar a próxima tela.`,
    });
    state.turnRoleViewed = false;
    clearTurnSecret();
    turn.panel.dataset.game = state.currentGame.type;
    turn.gameLabel.textContent = state.currentGame.name;
    turn.progress.textContent = `${playerName} · ${playerNumber} de ${state.currentGame.totalPlayers}`;
    turn.prepTitle.textContent = `Passe para ${playerName}`;
    turn.prepDescription.textContent = `Só ${playerName} deve tocar para ver o papel.`;
    turn.revealRole.textContent = "Ver meu papel";
    turn.revealRole.disabled = false;
    turn.toggleVisibility.hidden = simpleReveal;

    clearTone();
    setPhase("prep");
    showScreen("turn");
    void animateElement(
      turn.prepView,
      [
        { transform: "translateX(-6px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 170 },
    );
    queueMicrotask(() => turn.revealRole.focus());
  }

  function renderReveal() {
    const playerNumber = state.currentPlayer + 1;
    const role = state.currentGame.roles[state.currentPlayer];
    const simpleReveal = state.currentGame.simpleReveal === true;
    const isLastPlayer =
      state.currentPlayer === state.currentGame.totalPlayers - 1;

    setHero({
      eyebrow: state.currentGame.name,
      title: `${currentPlayerLabel()}, veja seu papel`,
      copy: "Leia em silêncio, oculte a tela e passe o aparelho.",
    });
    state.turnRoleViewed = true;
    state.turnRevealVisible = simpleReveal;
    turn.panel.dataset.game = state.currentGame.type;
    turn.gameLabel.textContent = state.currentGame.name;
    turn.progress.textContent = `${currentPlayerLabel()} (${playerNumber} de ${state.currentGame.totalPlayers})`;
    turn.toggleVisibility.hidden = simpleReveal;
    turn.nextPlayer.textContent = simpleReveal
      ? isLastPlayer
        ? "Ocultar e começar"
        : `Ocultar e passar para ${
            state.playerNames[state.currentPlayer + 1] ??
            `Jogador ${state.currentPlayer + 2}`
          }`
      : isLastPlayer
        ? "Finalizar distribuição"
        : "Próximo jogador";

    applyTone(role.tone);
    renderSecret(role);
    setPhase("reveal");
    showScreen("turn");
    void animateElement(
      turn.revealView,
      [
        { transform: "translateX(6px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 180 },
    );
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
    void animateElement(
      end.panel,
      [
        { transform: "translateY(6px)" },
        { transform: "translateY(0)" },
      ],
      { duration: 180 },
    );
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
    void animateElement(
      end.panel,
      [
        { transform: "translateY(6px)" },
        { transform: "translateY(0)" },
      ],
      { duration: 180 },
    );
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
    turn.revealRole.addEventListener("click", () => {
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
