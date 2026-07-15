import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_PARTY_PLAYERS,
  PARTY_SESSION_STORAGE_KEY,
  createPartySession,
} from "../src/party-session.js";
import { createInitialState } from "../src/state.js";

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

function createIdFactory(prefix = "player") {
  let nextId = 1;
  return () => `${prefix}-${nextId++}`;
}

function createSession(storage = createMemoryStorage(), prefix = "player") {
  return createPartySession({
    idFactory: createIdFactory(prefix),
    storage,
  });
}

test("creates, normalizes and restores a named party", () => {
  const storage = createMemoryStorage();
  const session = createSession(storage);

  session.saveParty({
    mode: "named",
    players: [{ name: "  André   Felipe " }, { name: " Bia " }],
  });

  const restored = createSession(storage, "unused").getParty();
  assert.deepEqual(restored, {
    mode: "named",
    players: [
      { id: "player-1", name: "André Felipe" },
      { id: "player-2", name: "Bia" },
    ],
  });
});

test("creates and persists a numbered party", () => {
  const storage = createMemoryStorage();
  const session = createSession(storage);

  assert.deepEqual(session.createNumberedParty(3), {
    mode: "numbered",
    players: [
      { id: "player-1", name: "Jogador 1" },
      { id: "player-2", name: "Jogador 2" },
      { id: "player-3", name: "Jogador 3" },
    ],
  });

  assert.deepEqual(JSON.parse(storage.getItem(PARTY_SESSION_STORAGE_KEY)), {
    version: 1,
    party: session.getParty(),
  });
});

test("recovers the same party after a new module instance", () => {
  const storage = createMemoryStorage();
  const firstSession = createSession(storage);
  const saved = firstSession.createNumberedParty(4);
  const secondSession = createSession(storage, "other");

  assert.deepEqual(secondSession.getParty(), saved);
  assert.equal(secondSession.getPlayerCount(), 4);
});

test("adds, edits and removes players without changing stable IDs", () => {
  const session = createSession();
  const firstParty = session.addPlayer("Ana");
  const anaId = firstParty.players[0].id;
  const withBia = session.addPlayer("Bia");
  const biaId = withBia.players[1].id;

  session.editPlayer(anaId, "Ana Maria");
  assert.deepEqual(session.getParty().players, [
    { id: anaId, name: "Ana Maria" },
    { id: biaId, name: "Bia" },
  ]);

  session.removePlayer(anaId);
  assert.deepEqual(session.getParty().players, [{ id: biaId, name: "Bia" }]);
});

test("accepts equal names while keeping different IDs", () => {
  const session = createSession();

  session.addPlayer("Alex");
  session.addPlayer("Alex");

  const [firstPlayer, secondPlayer] = session.getParty().players;
  assert.equal(firstPlayer.name, secondPlayer.name);
  assert.notEqual(firstPlayer.id, secondPlayer.id);
});

test("derives the player count from the party list", () => {
  const session = createSession();

  assert.equal(session.getPlayerCount(), 0);
  session.createNumberedParty(5);
  assert.equal(session.getPlayerCount(), 5);
  session.removePlayer("player-3");
  assert.equal(session.getPlayerCount(), 4);
});

test("recovers safely from invalid JSON and old schemas", () => {
  const storage = createMemoryStorage();
  storage.setItem(PARTY_SESSION_STORAGE_KEY, "{invalid-json");

  assert.equal(createSession(storage).getParty(), null);
  assert.equal(storage.getItem(PARTY_SESSION_STORAGE_KEY), null);

  storage.setItem(
    PARTY_SESSION_STORAGE_KEY,
    JSON.stringify({ version: 0, party: { mode: "named", players: [] } }),
  );
  assert.equal(createSession(storage).getParty(), null);
  assert.equal(storage.getItem(PARTY_SESSION_STORAGE_KEY), null);
});

test("creates an immutable round snapshot detached from later edits", () => {
  const session = createSession();
  const party = session.addPlayer("Ana");
  const snapshot = session.createRoundSnapshot();

  session.editPlayer(party.players[0].id, "Bea");

  assert.equal(snapshot.players[0].name, "Ana");
  assert.equal(session.getParty().players[0].name, "Bea");
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.players), true);
  assert.equal(Object.isFrozen(snapshot.players[0]), true);
  assert.throws(() => {
    snapshot.players[0].name = "Outra pessoa";
  }, TypeError);
});

test("persists only the party schema and never round secrets", () => {
  const storage = createMemoryStorage();
  const session = createSession(storage);

  session.saveParty({
    impostors: ["player-1"],
    mode: "named",
    players: [{ name: "Ana", role: "impostor" }],
    roles: ["impostor"],
    secretWord: "capivara",
  });

  const stored = storage.getItem(PARTY_SESSION_STORAGE_KEY);
  assert.deepEqual(JSON.parse(stored), {
    version: 1,
    party: {
      mode: "named",
      players: [{ id: "player-1", name: "Ana" }],
    },
  });
  assert.equal(stored.includes("capivara"), false);
  assert.equal(stored.includes("impostor"), false);
  assert.equal(stored.includes("role"), false);
});

test("rejects invalid names, duplicate IDs and groups above the app limit", () => {
  const session = createSession();

  assert.throws(() => session.addPlayer("   "), TypeError);
  assert.throws(() => session.addPlayer("a".repeat(31)), RangeError);
  assert.throws(
    () => session.createNumberedParty(MAX_PARTY_PLAYERS + 1),
    RangeError,
  );
  assert.throws(
    () =>
      session.saveParty({
        mode: "named",
        players: [
          { id: "same-id", name: "Ana" },
          { id: "same-id", name: "Bia" },
        ],
      }),
    TypeError,
  );
});

test("clears storage when the last player is removed", () => {
  const storage = createMemoryStorage();
  const session = createSession(storage);
  const party = session.addPlayer("Ana");

  assert.equal(session.removePlayer(party.players[0].id), null);
  assert.equal(session.getParty(), null);
  assert.equal(storage.getItem(PARTY_SESSION_STORAGE_KEY), null);
});

test("exposes the party session through shared app state without replacing old names", () => {
  const partySession = createSession();
  partySession.createNumberedParty(3);

  const state = createInitialState({ partySession });

  assert.equal(state.partySession, partySession);
  assert.equal(state.partySession.getPlayerCount(), 3);
  assert.deepEqual(state.playerNames, []);
});
