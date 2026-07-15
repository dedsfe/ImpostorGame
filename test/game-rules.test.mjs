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
import { createCityGame, normalizeCitySetup } from "../src/games/city.js";
import {
  createImpostorGame,
  normalizeImpostorSetup,
} from "../src/games/impostor.js";
import {
  normalizeMimicaDifficulty,
  normalizeMimicaTime,
  pickMimicaWord,
} from "../src/games/mimica.js";
import {
  createPoliceGame,
  normalizePolicePartySetup,
  normalizePoliceSetup,
} from "../src/games/police.js";
import { drawWhoAmICharacter } from "../src/games/whoami.js";

function createParty(playerCount) {
  return Object.freeze({
    mode: "named",
    players: Object.freeze(
      Array.from({ length: playerCount }, (_, index) =>
        Object.freeze({ id: `player-${index + 1}`, name: `Pessoa ${index + 1}` }),
      ),
    ),
  });
}

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
  const impostorParty = createParty(8);
  const policeParty = createParty(7);
  const cityParty = createParty(9);
  const impostor = createImpostorGame({
    party: impostorParty,
    totalPlayers: 8,
    impostorCount: 2,
    requirePlayerNames: true,
    secretWord: "bola",
    category: "geral",
    difficulty: "facil",
  });
  const police = createPoliceGame({
    party: policeParty,
    totalPlayers: 7,
    policeCount: 2,
    thiefCount: 2,
    victimCount: 3,
  });
  const city = createCityGame({
    party: cityParty,
    totalPlayers: 9,
    assassinCount: 2,
    detectiveCount: 1,
  });

  assert.equal(impostor.roles.length, 8);
  assert.equal(impostor.party, impostorParty);
  assert.equal(impostor.roles.filter((role) => role.value === "IMPOSTOR").length, 2);
  assert.deepEqual(impostor.instructions, [
    "Cada pessoa dá uma pista curta.",
    "Conversem sobre quem parece suspeito.",
    "Escolham 2 suspeitos.",
  ]);
  assert.equal(impostor.secretWord, "bola");
  assert.equal(
    impostor.summary.some((item) => item.value === impostor.secretWord),
    false,
  );
  assert.equal(police.roles.length, 7);
  assert.equal(police.party, policeParty);
  assert.equal(city.roles.length, 9);
  assert.equal(city.party, cityParty);
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

test("normalizes every role setup before creating a round", () => {
  assert.deepEqual(normalizeImpostorSetup({ totalPlayers: 3, impostorCount: 9 }), {
    totalPlayers: 3,
    impostorCount: 2,
    maxImpostors: 2,
  });

  const police = normalizePoliceSetup(
    { police: 12, thief: 12, victim: 12 },
    { preferredRole: "victim", nextValue: 12 },
  );
  assert.equal(police.totalPlayers, 20);
  assert.ok(police.police >= 1 && police.thief >= 1 && police.victim >= 1);

  assert.deepEqual(
    normalizePolicePartySetup(
      { police: 2, thief: 2 },
      5,
      { preferredRole: "thief", nextValue: 2 },
    ),
    { police: 2, thief: 2, totalPlayers: 5, victim: 1 },
  );

  const city = normalizeCitySetup(
    { players: 5, assassins: 10, detectives: 10 },
    { preferredField: "detectives", nextValue: 10 },
  );
  assert.equal(city.players, 5);
  assert.equal(city.citizens, 1);
  assert.ok(city.assassins >= 1 && city.detectives >= 0);
});

test("selects content without immediately repeating the current item", () => {
  assert.equal(pickMimicaWord(["avião", "navio"], "avião"), "navio");

  const draw = drawWhoAmICharacter({
    pool: ["Neo", "Trinity"],
    currentCharacter: "Neo",
  });
  assert.equal(draw.character, "Trinity");
  assert.deepEqual(draw.remainingCharacters, []);
});

test("normalizes Mímica options", () => {
  assert.equal(normalizeMimicaDifficulty("dificil"), "dificil");
  assert.equal(normalizeMimicaDifficulty("unknown"), "medio");
  assert.equal(normalizeMimicaTime("45"), 45);
  assert.equal(normalizeMimicaTime("none"), null);
});
