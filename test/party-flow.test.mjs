import assert from "node:assert/strict";
import test from "node:test";

import {
  createGameEntryCoordinator,
  formatPartyNames,
  getPartyContinueLabel,
  getPartyValidation,
  nextPartyPlayerIndex,
  shouldConfirmPartyEdit,
} from "../src/party-flow.js";

test("intercepts the first game and resumes it after creating a valid party", () => {
  let playerCount = 0;
  const opened = [];
  const coordinator = createGameEntryCoordinator({
    getPlayerCount: () => playerCount,
    openGame: (screen) => opened.push(`game:${screen}`),
    openParty: ({ screen }) => opened.push(`party:${screen}`),
  });

  assert.equal(
    coordinator.selectGame({ minimumPlayers: 3, screen: "impostorSetup" }),
    "party",
  );
  assert.deepEqual(opened, ["party:impostorSetup"]);

  playerCount = 3;
  assert.equal(coordinator.resumeGame(), true);
  assert.deepEqual(opened, ["party:impostorSetup", "game:impostorSetup"]);
});

test("opens a game directly when the session party already meets its minimum", () => {
  const opened = [];
  const coordinator = createGameEntryCoordinator({
    getPlayerCount: () => 5,
    openGame: (screen) => opened.push(screen),
    openParty: () => opened.push("party"),
  });

  assert.equal(
    coordinator.selectGame({ minimumPlayers: 5, screen: "citySetup" }),
    "game",
  );
  assert.deepEqual(opened, ["citySetup"]);
});

test("keeps the selected game pending while the party is still too small", () => {
  let playerCount = 2;
  let partyOpens = 0;
  const games = [];
  const coordinator = createGameEntryCoordinator({
    getPlayerCount: () => playerCount,
    openGame: (screen) => games.push(screen),
    openParty: () => {
      partyOpens += 1;
    },
  });

  coordinator.selectGame({ minimumPlayers: 3, screen: "policeSetup" });
  assert.equal(coordinator.resumeGame(), false);
  assert.equal(partyOpens, 2);
  assert.deepEqual(games, []);

  playerCount = 3;
  assert.equal(coordinator.resumeGame(), true);
  assert.deepEqual(games, ["policeSetup"]);
});

test("validates the minimum and adapts quantity language", () => {
  assert.deepEqual(getPartyValidation(2, 5), {
    count: 2,
    isValid: false,
    message: "Faltam 3 pessoas para começar este jogo.",
    minimum: 5,
    missing: 3,
  });
  assert.equal(getPartyValidation(3, 3).isValid, true);
  assert.equal(getPartyContinueLabel(1), "Continuar com 1 jogador");
  assert.equal(getPartyContinueLabel(4), "Continuar com 4 jogadores");
});

test("formats a compact named-party summary", () => {
  const players = ["André", "Matheus", "Júnior", "Keyla", "Bluk"].map(
    (name, index) => ({ id: String(index), name }),
  );

  assert.equal(
    formatPartyNames(players),
    "André, Matheus, Júnior, Keyla e Bluk",
  );
  assert.equal(
    formatPartyNames([...players, { id: "5", name: "Bia" }]),
    "André, Matheus, Júnior, Keyla e mais 2 pessoas",
  );
});

test("marks active round screens for discard confirmation", () => {
  assert.equal(shouldConfirmPartyEdit("impostorSetup"), false);
  assert.equal(shouldConfirmPartyEdit("turn"), true);
  assert.equal(shouldConfirmPartyEdit("end"), true);
  assert.equal(shouldConfirmPartyEdit("mimicaPlay"), true);
});

test("advances and wraps the current participant without changing party order", () => {
  assert.equal(nextPartyPlayerIndex(0, 3), 1);
  assert.equal(nextPartyPlayerIndex(2, 3), 0);
  assert.equal(nextPartyPlayerIndex(4, 0), 0);
});
