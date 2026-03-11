import {
  getDifficultyLabel,
  pluralize,
  randomIndex,
  shuffleArray,
} from "../shared/utils.js";

export function buildImpostorGame(totalPlayers, secretWord, category, difficulty) {
  const impostorIndex = randomIndex(totalPlayers);
  const roles = Array.from({ length: totalPlayers }, (_, playerIndex) => {
    if (playerIndex === impostorIndex) {
      return {
        badge: "Impostor",
        title: "Você é o impostor",
        description:
          "Escute a conversa, tente entender a palavra e não entregue que você não a conhece.",
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
  });

  return {
    type: "impostor",
    name: "Impostor",
    totalPlayers,
    roles,
    setupScreen: "impostorSetup",
    endLabel: "Rodada pronta",
    endTitle: "Todos já receberam seus papéis",
    endDescription:
      "Agora afastem o celular e comecem a conversa para descobrir quem é o impostor.",
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Impostores", value: "1" },
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

export function buildPoliceGame(totalPlayers, policeCount, thiefCount, victimCount) {
  const roles = shuffleArray([
    ...Array.from({ length: policeCount }, () => ({
      badge: "Polícia",
      title: "Você é a polícia",
      description:
        "Observe a rodada com cuidado e tente identificar quem está agindo como ladrão.",
      value: "POLÍCIA",
      tone: "police",
    })),
    ...Array.from({ length: thiefCount }, () => ({
      badge: "Ladrão",
      title: "Você é o ladrão",
      description:
        "Tente disfarçar seu papel e escapar da atenção dos policiais durante a rodada.",
      value: "LADRÃO",
      tone: "thief",
    })),
    ...Array.from({ length: victimCount }, () => ({
      badge: "Vítima",
      title: "Você é a vítima",
      description:
        "Observe os outros jogadores e tente perceber quem pode estar do seu lado ou contra você.",
      value: "VÍTIMA",
      tone: "victim",
    })),
  ]);

  return {
    type: "police",
    name: "Polícia e Ladrão",
    totalPlayers,
    roles,
    setupScreen: "policeSetup",
    endLabel: "Papéis distribuídos",
    endTitle: "Todo mundo já sabe seu papel",
    endDescription:
      "Agora vocês podem começar a rodada sabendo quem é polícia, ladrão ou vítima.",
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Policiais", value: String(policeCount) },
      { label: "Ladrões", value: String(thiefCount) },
      { label: "Vítimas", value: String(victimCount) },
    ],
    hero: {
      eyebrow: "Polícia e Ladrão",
      title: "Distribuição de papéis",
      copy: `${policeCount} ${pluralize(
        policeCount,
        "policial",
        "policiais",
      )}, ${thiefCount} ${pluralize(
        thiefCount,
        "ladrão",
        "ladrões",
      )} e ${victimCount} ${pluralize(victimCount, "vítima", "vítimas")} na rodada.`,
    },
  };
}

export function buildCityGame(totalPlayers, assassinCount, detectiveCount) {
  const citizenCount = totalPlayers - assassinCount - detectiveCount;
  const roles = shuffleArray([
    ...Array.from({ length: assassinCount }, () => ({
      badge: "Assassino",
      title: "Você é o assassino",
      description:
        "Durante a noite, escolha alguém para eliminar em silêncio e tente não levantar suspeitas durante o dia.",
      value: "ASSASSINO",
      tone: "thief",
    })),
    ...Array.from({ length: detectiveCount }, () => ({
      badge: "Detetive",
      title: "Você é o detetive",
      description:
        "Durante a noite, investigue alguém com a ajuda do narrador e tente revelar os assassinos.",
      value: "DETETIVE",
      tone: "police",
    })),
    ...Array.from({ length: citizenCount }, () => ({
      badge: "Cidadão",
      title: "Você é cidadão",
      description:
        "Discuta, observe e vote em quem você acha que está mentindo para proteger a cidade.",
      value: "CIDADÃO",
      tone: "victim",
    })),
  ]);

  return {
    type: "city",
    name: "Cidade Dorme",
    totalPlayers,
    roles,
    setupScreen: "citySetup",
    endLabel: "Rodada pronta",
    endTitle: "Todos já receberam seus papéis",
    endDescription:
      "Agora afastem o celular e deixem o narrador conduzir a rodada em voz alta.",
    instructions: [
      "Cidade dorme: todos fecham os olhos.",
      "Assassinos acordam, escolhem uma vítima e voltam a dormir.",
      "Detetive acorda e aponta alguém para investigar.",
      "Cidade acorda: anuncie quem foi eliminado.",
      "Todos discutem e votam em alguém para eliminar.",
    ],
    summary: [
      { label: "Jogadores", value: String(totalPlayers) },
      { label: "Assassinos", value: String(assassinCount) },
      { label: "Detetives", value: String(detectiveCount) },
      { label: "Cidadãos", value: String(citizenCount) },
    ],
    hero: {
      eyebrow: "Cidade Dorme",
      title: "Distribuição de papéis",
      copy: `${assassinCount} ${pluralize(
        assassinCount,
        "assassino",
        "assassinos",
      )}, ${detectiveCount} ${pluralize(
        detectiveCount,
        "detetive",
        "detetives",
      )} e ${citizenCount} ${pluralize(citizenCount, "cidadão", "cidadãos")} na rodada.`,
    },
  };
}
