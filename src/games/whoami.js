import {
  buildShuffledDeck,
  getWhoAmIEntryKey,
  randomIndex,
} from "../shared/utils.js";

export function drawWhoAmICharacter({
  pool,
  remainingCharacters = [],
  currentCharacter = "",
}) {
  const remaining =
    remainingCharacters.length > 0
      ? [...remainingCharacters]
      : buildShuffledDeck(pool, currentCharacter, getWhoAmIEntryKey);
  const character = remaining.pop() ?? pool[randomIndex(pool.length)];

  return {
    character,
    remainingCharacters: remaining,
  };
}
