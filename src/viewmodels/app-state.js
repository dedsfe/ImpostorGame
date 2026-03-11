export function createInitialState() {
  return {
    currentScreen: "hub",
    currentPlayer: 0,
    currentGame: null,
    hubModalOpen: false,
    hubModalGameId: null,
    whoami: {
      category: "geral",
      currentCharacter: "",
      remainingCharacters: [],
    },
    mimica: {
      category: "geral",
      difficulty: "medio",
      timePerRound: 45,
      currentWord: "",
      deckKey: "geral:medio",
      remainingWords: [],
      timerId: null,
      timeRemaining: 45,
      currentDuration: 45,
      timedOut: false,
      solved: false,
      prepMode: "start",
    },
  };
}
