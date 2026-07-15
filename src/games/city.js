import { pluralize, shuffleArray } from "../shared/utils.js";

export function createCityGame({ totalPlayers, assassinCount, detectiveCount }) {
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
