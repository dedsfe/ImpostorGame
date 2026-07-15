import { getDifficultyLabel, shuffleArray } from "../shared/utils.js";

export function createImpostorGame({
  totalPlayers,
  impostorCount,
  requirePlayerNames,
  secretWord,
  category,
  difficulty,
}) {
  const safeImpostorCount = Math.min(Math.max(1, impostorCount), totalPlayers - 1);
  const roles = shuffleArray(
    Array.from({ length: totalPlayers }, (_, playerIndex) => {
      if (playerIndex < safeImpostorCount) {
        return {
          badge: "Impostor",
          title: "Você é o impostor",
          description:
            "Escute a conversa, tente entender a palavra e não entregue que você não a conhece.",
          hint: `Dica de categoria: ${category.toUpperCase()}`,
          value: "IMPOSTOR",
          tone: "impostor",
        };
      }

      return {
        badge: "Palavra secreta",
        title: "Você recebeu a palavra",
        description:
          "Guarde a palavra e use pistas discretas para identificar o impostor.",
        value: secretWord,
        tone: "word",
      };
    }),
  );

  return {
    type: "impostor",
    name: "Impostor",
    totalPlayers,
    impostorCount: safeImpostorCount,
    requirePlayerNames,
    roles,
    setupScreen: "impostorSetup",
    endLabel: "Rodada pronta",
    endTitle: "Todos já receberam seus papéis",
    endDescription:
      `Agora afastem o celular e comecem a conversa para descobrir quem ${
        safeImpostorCount > 1 ? "são os impostores" : "é o impostor"
      }.`,
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Impostores", value: String(safeImpostorCount) },
      { label: "Dificuldade", value: getDifficultyLabel(difficulty) },
    ],
    hero: {
      eyebrow: "Impostor",
      title: "Distribuição de papéis",
      copy: `Palavra definida em ${category} com dificuldade ${getDifficultyLabel(
        difficulty,
      ).toLowerCase()}.`,
    },
  };
}
