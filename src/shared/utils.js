export function clampInteger(value, min, max, fallback = min) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

export function clampPlayers(value) {
  return clampInteger(value, 3, 20, 3);
}

export function clampCityPlayers(value) {
  return clampInteger(value, 5, 20, 5);
}

export function clampRoleCount(value) {
  return clampInteger(value, 1, 20, 1);
}

export function clampOptionalRoleCount(value) {
  return clampInteger(value, 0, 20, 0);
}

export function normalizeWord(value) {
  return value.replace(/\s+/g, " ").trim();
}

export function getDifficultyLabel(difficulty) {
  if (difficulty === "facil") {
    return "Fácil";
  }

  if (difficulty === "dificil") {
    return "Difícil";
  }

  return "Média";
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

export function getCryptoRandomUint32() {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return values[0];
  }

  return Math.floor(Math.random() * 4294967296);
}

export function randomIndex(max) {
  if (max <= 1) {
    return 0;
  }

  const maxUint32 = 4294967296;
  const safeLimit = maxUint32 - (maxUint32 % max);
  let randomValue = getCryptoRandomUint32();

  while (randomValue >= safeLimit) {
    randomValue = getCryptoRandomUint32();
  }

  return randomValue % max;
}

export function shuffleArray(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = randomIndex(index + 1);
    [shuffled[index], shuffled[targetIndex]] = [
      shuffled[targetIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function buildShuffledDeck(items, currentItem = "", getKey = (item) => item) {
  const currentKey = currentItem === "" || currentItem === null ? "" : getKey(currentItem);
  const nextItems = items.filter((item) => getKey(item) !== currentKey);
  return shuffleArray(nextItems.length > 0 ? nextItems : items);
}

export function getWhoAmIEntryKey(entry) {
  if (entry && typeof entry === "object") {
    return `${entry.source ?? ""}::${entry.name ?? ""}`;
  }

  return String(entry ?? "");
}

export function normalizeWhoAmIEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      name: entry.name ?? "",
      source: entry.source ?? "",
    };
  }

  return {
    name: String(entry ?? ""),
    source: "",
  };
}

export function getMimicaEntryKey(entry) {
  if (entry && typeof entry === "object") {
    return `${entry.source ?? ""}::${entry.name ?? ""}`;
  }

  return String(entry ?? "");
}

export function normalizeMimicaEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      name: entry.name ?? "",
      source: entry.source ?? "",
    };
  }

  return {
    name: String(entry ?? ""),
    source: "",
  };
}
