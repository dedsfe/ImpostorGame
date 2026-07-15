export const PARTY_SESSION_STORAGE_KEY = "noite-de-jogos-party-v1";
export const PARTY_SESSION_VERSION = 1;
export const MAX_PARTY_PLAYERS = 20;
export const MAX_PLAYER_NAME_LENGTH = 30;

const PARTY_MODES = new Set(["named", "numbered"]);

function getSessionStorage() {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

let fallbackIdSequence = 0;

function createPlayerId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  fallbackIdSequence += 1;
  return `player-${Date.now().toString(36)}-${fallbackIdSequence.toString(36)}`;
}

function normalizeName(name) {
  if (typeof name !== "string") {
    throw new TypeError("O nome do jogador deve ser um texto.");
  }

  const normalized = name.replace(/\s+/g, " ").trim();

  if (!normalized) {
    throw new TypeError("O nome do jogador não pode ficar vazio.");
  }

  if (Array.from(normalized).length > MAX_PLAYER_NAME_LENGTH) {
    throw new RangeError(
      `O nome do jogador deve ter no máximo ${MAX_PLAYER_NAME_LENGTH} caracteres.`,
    );
  }

  return normalized;
}

function cloneParty(party) {
  if (!party) {
    return null;
  }

  return {
    mode: party.mode,
    players: party.players.map((player) => ({ ...player })),
  };
}

function freezeParty(party) {
  if (!party) {
    return null;
  }

  const players = party.players.map((player) => Object.freeze({ ...player }));
  return Object.freeze({
    mode: party.mode,
    players: Object.freeze(players),
  });
}

export function createPartySession({
  idFactory = createPlayerId,
  storage = getSessionStorage(),
} = {}) {
  function nextPlayerId(usedIds) {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const id = String(idFactory() ?? "").trim();

      if (id && !usedIds.has(id)) {
        return id;
      }
    }

    throw new Error("Não foi possível criar um ID único para o jogador.");
  }

  function normalizeParty(party, { requireIds = false } = {}) {
    if (!party || typeof party !== "object" || !PARTY_MODES.has(party.mode)) {
      throw new TypeError("O grupo da sessão é inválido.");
    }

    if (!Array.isArray(party.players) || party.players.length === 0) {
      throw new TypeError("O grupo precisa ter pelo menos um jogador.");
    }

    if (party.players.length > MAX_PARTY_PLAYERS) {
      throw new RangeError(
        `O grupo deve ter no máximo ${MAX_PARTY_PLAYERS} jogadores.`,
      );
    }

    const usedIds = new Set();
    const players = party.players.map((player) => {
      if (!player || typeof player !== "object") {
        throw new TypeError("O jogador é inválido.");
      }

      let id = typeof player.id === "string" ? player.id.trim() : "";

      if (!id && requireIds) {
        throw new TypeError("Todo jogador salvo precisa ter um ID.");
      }

      if (!id) {
        id = nextPlayerId(usedIds);
      }

      if (usedIds.has(id)) {
        throw new TypeError("Os IDs dos jogadores precisam ser únicos.");
      }

      usedIds.add(id);
      return { id, name: normalizeName(player.name) };
    });

    return { mode: party.mode, players };
  }

  function discardInvalidStorage() {
    try {
      storage?.removeItem(PARTY_SESSION_STORAGE_KEY);
    } catch {}
  }

  function restoreParty() {
    if (!storage) {
      return null;
    }

    try {
      const rawValue = storage.getItem(PARTY_SESSION_STORAGE_KEY);

      if (rawValue === null) {
        return null;
      }

      const stored = JSON.parse(rawValue);

      if (stored?.version !== PARTY_SESSION_VERSION) {
        discardInvalidStorage();
        return null;
      }

      return normalizeParty(stored.party, { requireIds: true });
    } catch {
      discardInvalidStorage();
      return null;
    }
  }

  let currentParty = restoreParty();

  function persistParty() {
    if (!storage || !currentParty) {
      return;
    }

    const stored = {
      version: PARTY_SESSION_VERSION,
      party: cloneParty(currentParty),
    };

    try {
      storage.setItem(PARTY_SESSION_STORAGE_KEY, JSON.stringify(stored));
    } catch {}
  }

  if (currentParty) {
    persistParty();
  }

  function getParty() {
    return cloneParty(currentParty);
  }

  function saveParty(party) {
    currentParty = normalizeParty(party);
    persistParty();
    return getParty();
  }

  function createNumberedParty(playerCount) {
    const count = Number(playerCount);

    if (!Number.isInteger(count) || count < 1 || count > MAX_PARTY_PLAYERS) {
      throw new RangeError(
        `O grupo deve ter entre 1 e ${MAX_PARTY_PLAYERS} jogadores.`,
      );
    }

    return saveParty({
      mode: "numbered",
      players: Array.from({ length: count }, (_, index) => ({
        name: `Jogador ${index + 1}`,
      })),
    });
  }

  function addPlayer(name) {
    const players = currentParty?.players ?? [];

    if (players.length >= MAX_PARTY_PLAYERS) {
      throw new RangeError(
        `O grupo deve ter no máximo ${MAX_PARTY_PLAYERS} jogadores.`,
      );
    }

    const usedIds = new Set(players.map((player) => player.id));
    currentParty = {
      mode: "named",
      players: [
        ...players,
        { id: nextPlayerId(usedIds), name: normalizeName(name) },
      ],
    };
    persistParty();
    return getParty();
  }

  function editPlayer(playerId, name) {
    const id = String(playerId ?? "").trim();
    const playerIndex = currentParty?.players.findIndex(
      (player) => player.id === id,
    );

    if (playerIndex === undefined || playerIndex < 0) {
      throw new RangeError("Jogador não encontrado.");
    }

    currentParty = {
      mode: "named",
      players: currentParty.players.map((player, index) =>
        index === playerIndex
          ? { id: player.id, name: normalizeName(name) }
          : player,
      ),
    };
    persistParty();
    return getParty();
  }

  function removePlayer(playerId) {
    const id = String(playerId ?? "").trim();
    const players = currentParty?.players ?? [];

    if (!players.some((player) => player.id === id)) {
      throw new RangeError("Jogador não encontrado.");
    }

    const remainingPlayers = players.filter((player) => player.id !== id);

    if (remainingPlayers.length === 0) {
      clearParty();
      return null;
    }

    currentParty = {
      mode: currentParty.mode,
      players: remainingPlayers,
    };
    persistParty();
    return getParty();
  }

  function clearParty() {
    currentParty = null;

    try {
      storage?.removeItem(PARTY_SESSION_STORAGE_KEY);
    } catch {}
  }

  function getPlayerCount() {
    return currentParty?.players.length ?? 0;
  }

  function createRoundSnapshot() {
    return freezeParty(currentParty);
  }

  return {
    addPlayer,
    clearParty,
    createNumberedParty,
    createRoundSnapshot,
    editPlayer,
    getParty,
    getPlayerCount,
    removePlayer,
    saveParty,
  };
}
