import {
  clampCityPlayers,
  clampOptionalRoleCount,
  clampRoleCount,
  pluralize,
  shuffleArray,
} from "../shared/utils.js";

export function normalizeCitySetup(
  currentCounts,
  { preferredField = "players", nextValue = null } = {},
) {
  const counts = {
    players: clampCityPlayers(currentCounts.players),
    assassins: clampRoleCount(currentCounts.assassins),
    detectives: clampOptionalRoleCount(currentCounts.detectives),
  };

  if (preferredField in counts && nextValue !== null) {
    const normalizers = {
      players: clampCityPlayers,
      assassins: clampRoleCount,
      detectives: clampOptionalRoleCount,
    };
    counts[preferredField] = normalizers[preferredField](nextValue);
  }

  counts.assassins = Math.min(counts.assassins, counts.players - 1);
  counts.detectives = Math.min(counts.detectives, counts.players - 1);

  let citizens = counts.players - counts.assassins - counts.detectives;

  if (citizens < 1) {
    let overflow = 1 - citizens;
    const roleOrder =
      preferredField === "detectives"
        ? ["assassins", "detectives"]
        : ["detectives", "assassins"];

    roleOrder.forEach((role) => {
      if (overflow <= 0) {
        return;
      }

      const minimum = role === "assassins" ? 1 : 0;
      const reduction = Math.min(counts[role] - minimum, overflow);

      if (reduction > 0) {
        counts[role] -= reduction;
        overflow -= reduction;
      }
    });
  }

  citizens = counts.players - counts.assassins - counts.detectives;

  return { ...counts, citizens };
}

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
