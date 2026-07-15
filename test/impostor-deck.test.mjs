import assert from "node:assert/strict";
import test from "node:test";

import {
  createImpostorWordDeck,
  mergeImpostorThemes,
  resolveImpostorWord,
} from "../src/games/impostor-deck.js";

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

const pools = {
  geral: {
    facil: ["bola", "casa"],
    medio: ["Casa", "avião"],
    dificil: ["labirinto"],
  },
  animais: {
    facil: ["gato", "cachorro"],
    medio: ["gato", "capivara"],
    dificil: ["ornitorrinco"],
  },
  comidas: {
    facil: ["pizza", "sushi"],
    medio: [],
    dificil: [],
  },
};

test("merges difficulties and removes duplicate words inside each theme", () => {
  const themes = mergeImpostorThemes(pools);

  assert.deepEqual(themes.animais, [
    "gato",
    "cachorro",
    "capivara",
    "ornitorrinco",
  ]);
  assert.equal(themes.misturado.length, 10);
  assert.equal(Object.hasOwn(themes, "geral"), false);
});

test("draws every word in a theme before repeating", () => {
  const deck = createImpostorWordDeck({
    pools,
    random: () => 0,
    storage: createMemoryStorage(),
  });
  const total = mergeImpostorThemes(pools).animais.length;
  const draws = Array.from({ length: total }, () => deck.draw("animais"));

  assert.equal(new Set(draws).size, total);
  assert.deepEqual(deck.getProgress("animais"), {
    remaining: 0,
    theme: "animais",
    total,
    used: total,
  });
});

test("starts a new cycle without repeating at the cycle boundary", () => {
  const deck = createImpostorWordDeck({
    pools,
    random: () => 0,
    storage: createMemoryStorage(),
  });
  const total = mergeImpostorThemes(pools).comidas.length;
  const firstCycle = Array.from({ length: total }, () => deck.draw("comidas"));
  const firstOfNextCycle = deck.draw("comidas");

  assert.ok(mergeImpostorThemes(pools).comidas.includes(firstOfNextCycle));
  assert.notEqual(firstOfNextCycle, firstCycle.at(-1));
  assert.equal(deck.getProgress("comidas").used, 1);
});

test("switching themes preserves each independent queue", () => {
  const deck = createImpostorWordDeck({
    pools,
    random: () => 0,
    storage: createMemoryStorage(),
  });

  deck.draw("animais");
  const animalProgress = deck.getProgress("animais");
  deck.draw("comidas");

  assert.deepEqual(deck.getProgress("animais"), animalProgress);
  assert.equal(deck.getProgress("comidas").used, 1);
});

test("reloading preserves the current session queues", () => {
  const storage = createMemoryStorage();
  const firstDeck = createImpostorWordDeck({
    pools,
    random: () => 0,
    storage,
  });
  const firstWord = firstDeck.draw("animais");
  const progressBeforeReload = firstDeck.getProgress("animais");
  const reloadedDeck = createImpostorWordDeck({
    pools,
    random: () => 0,
    storage,
  });
  const secondWord = reloadedDeck.draw("animais");

  assert.notEqual(secondWord, firstWord);
  assert.equal(reloadedDeck.getProgress("animais").used, 2);
  assert.equal(progressBeforeReload.used, 1);
});

test("a custom word does not consume the random deck", () => {
  const storage = createMemoryStorage();
  const deck = createImpostorWordDeck({
    pools,
    random: () => 0,
    storage,
  });
  const progressBefore = deck.getProgress("animais");
  const selection = resolveImpostorWord({
    customWord: "  Minha palavra  ",
    deck,
    theme: "animais",
  });

  assert.deepEqual(selection, { source: "custom", word: "Minha palavra" });
  assert.deepEqual(deck.getProgress("animais"), progressBefore);
});

test("resetting one theme does not erase the others", () => {
  const deck = createImpostorWordDeck({
    pools,
    random: () => 0,
    storage: createMemoryStorage(),
  });

  deck.draw("animais");
  deck.draw("comidas");
  deck.reset("animais");

  assert.equal(deck.getProgress("animais").used, 0);
  assert.equal(deck.getProgress("comidas").used, 1);
});
