import assert from "node:assert/strict";
import test from "node:test";

import {
  buildShuffledDeck,
  clampCityPlayers,
  clampInteger,
  clampOptionalRoleCount,
  clampPlayers,
  clampRoleCount,
  getMimicaEntryKey,
  getWhoAmIEntryKey,
  normalizeMimicaEntry,
  normalizeWhoAmIEntry,
  normalizeWord,
  pluralize,
  randomIndex,
  shuffleArray,
} from "../src/shared/utils.js";
import { createCityGame } from "../src/games/city.js";
import { createImpostorGame } from "../src/games/impostor.js";
import { createPoliceGame } from "../src/games/police.js";

test("normalizes setup values with the game limits", () => {
  assert.equal(clampInteger("x", 1, 10, 4), 4);
  assert.equal(clampPlayers(99), 20);
  assert.equal(clampCityPlayers(2), 5);
  assert.equal(clampRoleCount(0), 1);
  assert.equal(clampOptionalRoleCount(-1), 0);
  assert.equal(normalizeWord("  palavra   secreta "), "palavra secreta");
  assert.equal(pluralize(1, "jogador", "jogadores"), "jogador");
});

test("keeps catalog entry formats predictable", () => {
  const entry = { name: "Neo", source: "Matrix" };

  assert.equal(getWhoAmIEntryKey(entry), "Matrix::Neo");
  assert.equal(getMimicaEntryKey(entry), "Matrix::Neo");
  assert.deepEqual(normalizeWhoAmIEntry("Neo"), { name: "Neo", source: "" });
  assert.deepEqual(normalizeMimicaEntry(entry), entry);
});

test("builds shuffled collections without mutating their input", () => {
  const items = ["a", "b", "c"];
  const shuffled = shuffleArray(items);
  const deck = buildShuffledDeck(items, "a");

  assert.deepEqual(items, ["a", "b", "c"]);
  assert.deepEqual([...shuffled].sort(), items);
  assert.deepEqual([...deck].sort(), ["b", "c"]);
  assert.ok(randomIndex(items.length) >= 0);
  assert.ok(randomIndex(items.length) < items.length);
});

test("creates the requested number of roles for every role game", () => {
  const impostor = createImpostorGame({
    totalPlayers: 8,
    impostorCount: 2,
    requirePlayerNames: true,
    secretWord: "bola",
    category: "geral",
    difficulty: "facil",
  });
  const police = createPoliceGame({
    totalPlayers: 7,
    policeCount: 2,
    thiefCount: 2,
    victimCount: 3,
  });
  const city = createCityGame({
    totalPlayers: 9,
    assassinCount: 2,
    detectiveCount: 1,
  });

  assert.equal(impostor.roles.length, 8);
  assert.equal(impostor.roles.filter((role) => role.value === "IMPOSTOR").length, 2);
  assert.equal(police.roles.length, 7);
  assert.equal(city.roles.length, 9);
});

test("prevents an impostor-only round", () => {
  const game = createImpostorGame({
    totalPlayers: 3,
    impostorCount: 10,
    requirePlayerNames: false,
    secretWord: "bola",
    category: "geral",
    difficulty: "medio",
  });

  assert.equal(game.impostorCount, 2);
  assert.equal(game.roles.filter((role) => role.value === "IMPOSTOR").length, 2);
});
