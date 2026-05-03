export function createInitialState() {
  return {
    currentScreen: "hub",
    currentPlayer: 0,
    currentGame: null,
    playerNames: [],
    hubModalOpen: false,
    hubModalGameId: null,
    rulesModalOpen: false,
    rulesModalGameId: null,
    turnRevealVisible: false,
    whoami: {
      category: "geral",
      currentCharacter: "",
      remainingCharacters: [],
    },
    mimica: {
      category: "geral",
      difficulty: "dificil",
      timePerRound: 45,
      currentWord: "",
      deckKey: "geral:dificil",
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
