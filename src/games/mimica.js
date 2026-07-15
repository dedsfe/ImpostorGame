import { getMimicaEntryKey, randomIndex } from "../shared/utils.js";

export function normalizeMimicaDifficulty(value) {
  return value === "facil" || value === "medio" || value === "dificil"
    ? value
    : "medio";
}

export function normalizeMimicaTime(value) {
  return value === "30" || value === "45" || value === "60" ? Number(value) : null;
}

export function pickMimicaWord(pool, currentWord = "") {
  const currentKey = currentWord === "" ? "" : getMimicaEntryKey(currentWord);
  const candidates =
    pool.length > 1
      ? pool.filter((word) => getMimicaEntryKey(word) !== currentKey)
      : pool;

  return candidates[randomIndex(candidates.length)];
}
