import { MAX_PARTY_PLAYERS } from "./party-session.js";
import { animateElement } from "./motion.js";

function joinNames(names) {
  if (names.length < 2) {
    return names[0] ?? "";
  }

  if (names.length === 2) {
    return `${names[0]} e ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")} e ${names.at(-1)}`;
}

export function formatPartyNames(players, visibleLimit = 5) {
  const names = (players ?? []).map((player) => player.name);

  if (names.length <= visibleLimit) {
    return joinNames(names);
  }

  const visibleNames = names.slice(0, Math.max(1, visibleLimit - 1));
  const remaining = names.length - visibleNames.length;
  return `${visibleNames.join(", ")} e mais ${remaining} ${
    remaining === 1 ? "pessoa" : "pessoas"
  }`;
}

export function getPartyValidation(playerCount, minimumPlayers) {
  const count = Math.max(0, Number(playerCount) || 0);
  const minimum = Math.max(1, Number(minimumPlayers) || 1);
  const missing = Math.max(0, minimum - count);

  return {
    count,
    isValid: missing === 0,
    message:
      missing === 0
        ? ""
        : `${missing === 1 ? "Falta" : "Faltam"} ${missing} ${
            missing === 1 ? "pessoa" : "pessoas"
          } para começar este jogo.`,
    minimum,
    missing,
  };
}

export function getPartyContinueLabel(playerCount) {
  const count = Math.max(0, Number(playerCount) || 0);
  return `Continuar com ${count} ${count === 1 ? "jogador" : "jogadores"}`;
}

export function shouldConfirmPartyEdit(screen) {
  return ["turn", "end", "mimicaPrep", "mimicaPlay", "whoamiReveal"].includes(
    screen,
  );
}

export function nextPartyPlayerIndex(currentIndex, playerCount) {
  const count = Math.max(0, Number(playerCount) || 0);
  return count === 0 ? 0 : (Math.max(0, currentIndex) + 1) % count;
}

export function createGameEntryCoordinator({
  getPlayerCount,
  openGame,
  openParty,
}) {
  let pendingGame = null;

  function needsParty(game) {
    return getPlayerCount() < game.minimumPlayers;
  }

  function selectGame(game) {
    const request = { ...game, editing: false };

    if (needsParty(request)) {
      pendingGame = request;
      openParty(request);
      return "party";
    }

    pendingGame = null;
    openGame(request.screen);
    return "game";
  }

  function editGame(game) {
    pendingGame = { ...game, editing: true };
    openParty(pendingGame);
  }

  function resumeGame() {
    if (!pendingGame) {
      return false;
    }

    if (needsParty(pendingGame)) {
      openParty(pendingGame);
      return false;
    }

    const { screen } = pendingGame;
    pendingGame = null;
    openGame(screen);
    return true;
  }

  function cancel() {
    const cancelledGame = pendingGame;
    pendingGame = null;
    return cancelledGame;
  }

  return { cancel, editGame, resumeGame, selectGame };
}

export function createPartyFlow({
  elements,
  onCancel,
  onChange,
  onContinue,
  partySession,
  setHero,
  showScreen,
}) {
  let currentRequest = null;
  let editingPlayerId = null;
  let previousPlayerIds = new Set();

  function updateFeedback(message = "") {
    elements.feedback.textContent = message;
  }

  function resetNameEditor() {
    editingPlayerId = null;
    elements.name.value = "";
    elements.add.textContent = "Adicionar";
  }

  function showNameMode() {
    elements.nameMode.hidden = false;
    elements.numberMode.hidden = true;
    queueMicrotask(() => elements.name.focus());
  }

  function showNumberMode() {
    const count = partySession.getPlayerCount();
    elements.numberCount.value = String(
      Math.min(
        MAX_PARTY_PLAYERS,
        Math.max(currentRequest?.minimumPlayers ?? 1, count || 1),
      ),
    );
    elements.nameMode.hidden = true;
    elements.numberMode.hidden = false;
    queueMicrotask(() => elements.numberCount.focus());
  }

  function renderPlayers() {
    const party = partySession.getParty();
    const players = party?.players ?? [];

    const rows = players.map((player) => {
      const row = document.createElement("div");
      const name = document.createElement("span");
      const actions = document.createElement("div");
      const edit = document.createElement("button");
      const remove = document.createElement("button");

      row.className = "party-player-row";
      row.setAttribute("role", "listitem");
      row.dataset.playerId = player.id;
      name.className = "party-player-name";
      name.textContent = player.name;
      actions.className = "party-player-actions";
      edit.className = "party-row-action";
      edit.type = "button";
      edit.dataset.action = "edit";
      edit.dataset.playerId = player.id;
      edit.setAttribute("aria-label", `Editar ${player.name}`);
      edit.textContent = "Editar";
      remove.className = "party-row-action party-row-action--remove";
      remove.type = "button";
      remove.dataset.action = "remove";
      remove.dataset.playerId = player.id;
      remove.setAttribute("aria-label", `Remover ${player.name}`);
      remove.textContent = "Remover";
      actions.append(edit, remove);
      row.append(name, actions);
      return row;
    });

    elements.players.replaceChildren(...rows);
    rows.forEach((row) => {
      if (!previousPlayerIds.has(row.dataset.playerId)) {
        void animateElement(
          row,
          [
            { transform: "translateY(6px)" },
            { transform: "translateY(0)" },
          ],
          { duration: 160 },
        );
      }
    });
    previousPlayerIds = new Set(players.map((player) => player.id));

    elements.empty.hidden = players.length > 0;
    const validation = getPartyValidation(
      players.length,
      currentRequest?.minimumPlayers ?? 1,
    );
    elements.continue.textContent = getPartyContinueLabel(players.length);
    elements.continue.disabled = !validation.isValid;
    updateFeedback(validation.message);
    onChange(party);
  }

  function continueToGame() {
    const validation = getPartyValidation(
      partySession.getPlayerCount(),
      currentRequest?.minimumPlayers ?? 1,
    );

    if (!validation.isValid) {
      updateFeedback(validation.message);
      elements.name.focus();
      return false;
    }

    resetNameEditor();
    return onContinue();
  }

  function open(request) {
    currentRequest = request;
    resetNameEditor();
    previousPlayerIds = new Set(
      partySession.getParty()?.players.map((player) => player.id) ?? [],
    );
    setHero({
      eyebrow: "Grupo da sessão",
      title: "Quem vai jogar?",
      copy: "Monte o grupo uma vez e use as mesmas pessoas em todos os jogos.",
    });
    elements.cancel.textContent = request.editing ? "Cancelar" : "Voltar aos jogos";
    showNameMode();
    renderPlayers();
    showScreen("partySetup");
    queueMicrotask(() => elements.name.focus());
  }

  function bind() {
    elements.name.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        elements.nameForm.requestSubmit();
      }
    });

    elements.nameForm.addEventListener("submit", (event) => {
      event.preventDefault();

      try {
        if (editingPlayerId) {
          partySession.editPlayer(editingPlayerId, elements.name.value);
        } else {
          partySession.addPlayer(elements.name.value);
        }

        resetNameEditor();
        renderPlayers();
        elements.name.focus();
      } catch (error) {
        updateFeedback(error.message);
        elements.name.focus();
      }
    });

    elements.players.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");

      if (!button || !elements.players.contains(button)) {
        return;
      }

      const playerId = button.dataset.playerId;
      const player = partySession
        .getParty()
        ?.players.find((candidate) => candidate.id === playerId);

      if (!player) {
        return;
      }

      if (button.dataset.action === "edit") {
        editingPlayerId = player.id;
        elements.name.value = player.name;
        elements.add.textContent = "Salvar";
        elements.name.focus();
        elements.name.select();
        return;
      }

      const row = button.closest(".party-player-row");
      row?.querySelectorAll("button").forEach((action) => {
        action.disabled = true;
      });

      void animateElement(
        row,
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
        ],
        { duration: 160 },
      ).then(() => {
        partySession.removePlayer(player.id);
        if (editingPlayerId === player.id) {
          resetNameEditor();
        }
        renderPlayers();
        elements.name.focus();
      });
    });

    elements.continue.addEventListener("click", continueToGame);
    elements.useNumbers.addEventListener("click", showNumberMode);
    elements.useNames.addEventListener("click", showNameMode);
    elements.numberForm.addEventListener("submit", (event) => {
      event.preventDefault();

      try {
        partySession.createNumberedParty(elements.numberCount.value);
        renderPlayers();
        continueToGame();
      } catch (error) {
        updateFeedback(error.message);
        elements.numberCount.focus();
      }
    });
    elements.cancel.addEventListener("click", () => {
      resetNameEditor();
      onCancel(currentRequest);
    });
  }

  return { bind, open, renderPlayers };
}
