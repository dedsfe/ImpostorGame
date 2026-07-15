import { normalizeWord } from "../shared/utils.js";

const STORAGE_KEY = "impostor-word-decks-v1";
const STORAGE_VERSION = 1;

function wordKey(word) {
  return normalizeWord(word).toLocaleLowerCase("pt-BR");
}

function uniqueWords(words) {
  const seen = new Set();

  return words.reduce((result, word) => {
    const normalized = normalizeWord(word);
    const key = wordKey(normalized);

    if (normalized && !seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }

    return result;
  }, []);
}

function collectWords(pool) {
  if (Array.isArray(pool)) {
    return pool;
  }

  if (!pool || typeof pool !== "object") {
    return [];
  }

  return Object.values(pool).flatMap((words) =>
    Array.isArray(words) ? words : [],
  );
}

function shuffle(words, random) {
  const shuffled = [...words];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function getSessionStorage() {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

function readState(storage) {
  if (!storage) {
    return { themes: {}, version: STORAGE_VERSION };
  }

  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY));
    if (
      parsed?.version === STORAGE_VERSION &&
      parsed.themes &&
      typeof parsed.themes === "object" &&
      !Array.isArray(parsed.themes)
    ) {
      return parsed;
    }
  } catch {}

  return { themes: {}, version: STORAGE_VERSION };
}

function writeState(storage, state) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function mergeImpostorThemes(pools) {
  const entries = Object.entries(pools ?? {});
  const themes = {
    misturado: uniqueWords(entries.flatMap(([, pool]) => collectWords(pool))),
  };

  entries.forEach(([theme, pool]) => {
    if (theme !== "geral") {
      themes[theme] = uniqueWords(collectWords(pool));
    }
  });

  return themes;
}

export function createImpostorWordDeck({
  pools,
  random = Math.random,
  storage = getSessionStorage(),
} = {}) {
  const state = readState(storage);

  function getTheme(theme) {
    const themes = mergeImpostorThemes(pools);
    return Object.hasOwn(themes, theme) && themes[theme].length > 0
      ? theme
      : "misturado";
  }

  function reconcile(theme) {
    const selectedTheme = getTheme(theme);
    const words = mergeImpostorThemes(pools)[selectedTheme] ?? [];
    const wordsByKey = new Map(words.map((word) => [wordKey(word), word]));
    const stored = state.themes[selectedTheme];

    if (!stored || !Array.isArray(stored.remaining) || !Array.isArray(stored.used)) {
      state.themes[selectedTheme] = {
        remaining: shuffle(words, random),
        used: [],
      };
      writeState(storage, state);
      return { selectedTheme, words, queue: state.themes[selectedTheme] };
    }

    const seen = new Set();
    const reconcileQueue = (queue) =>
      queue.reduce((result, storedWord) => {
        const key = wordKey(storedWord);
        const currentWord = wordsByKey.get(key);
        if (currentWord && !seen.has(key)) {
          seen.add(key);
          result.push(currentWord);
        }
        return result;
      }, []);

    const used = reconcileQueue(stored.used);
    const remaining = reconcileQueue(stored.remaining);
    const newWords = words.filter((word) => !seen.has(wordKey(word)));

    state.themes[selectedTheme] = {
      remaining: [...remaining, ...shuffle(newWords, random)],
      used,
    };
    writeState(storage, state);
    return { selectedTheme, words, queue: state.themes[selectedTheme] };
  }

  function draw(theme = "misturado") {
    const { queue, selectedTheme, words } = reconcile(theme);

    if (words.length === 0) {
      throw new Error(`Theme ${selectedTheme} has no Impostor words`);
    }

    if (queue.remaining.length === 0) {
      const lastWord = queue.used.at(-1);
      queue.remaining = shuffle(queue.used, random);
      queue.used = [];

      if (queue.remaining.length > 1 && wordKey(queue.remaining[0]) === wordKey(lastWord)) {
        const swapIndex = queue.remaining.findIndex(
          (word) => wordKey(word) !== wordKey(lastWord),
        );
        [queue.remaining[0], queue.remaining[swapIndex]] = [
          queue.remaining[swapIndex],
          queue.remaining[0],
        ];
      }
    }

    const word = queue.remaining.shift();
    queue.used.push(word);
    writeState(storage, state);
    return word;
  }

  function getProgress(theme = "misturado") {
    const { queue, selectedTheme, words } = reconcile(theme);
    return {
      remaining: queue.remaining.length,
      theme: selectedTheme,
      total: words.length,
      used: queue.used.length,
    };
  }

  function reset(theme = "misturado") {
    const selectedTheme = getTheme(theme);
    delete state.themes[selectedTheme];
    writeState(storage, state);
  }

  return { draw, getProgress, reset };
}

export function resolveImpostorWord({ customWord, deck, theme }) {
  const normalizedCustomWord = normalizeWord(customWord);
  if (normalizedCustomWord) {
    return { source: "custom", word: normalizedCustomWord };
  }

  return { source: "deck", word: deck.draw(theme) };
}
