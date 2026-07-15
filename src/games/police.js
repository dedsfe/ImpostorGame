import { clampRoleCount, pluralize, shuffleArray } from "../shared/utils.js";

export function normalizePoliceSetup(
  currentCounts,
  { preferredRole = "victim", nextValue = null } = {},
) {
  const counts = {
    police: clampRoleCount(currentCounts.police),
    thief: clampRoleCount(currentCounts.thief),
    victim: clampRoleCount(currentCounts.victim),
  };

  if (preferredRole in counts && nextValue !== null) {
    counts[preferredRole] = clampRoleCount(nextValue);
  }

  let overflow = counts.police + counts.thief + counts.victim - 20;
  const roleOrder = [
    preferredRole,
    ...["police", "thief", "victim"].filter((role) => role !== preferredRole),
  ];

  roleOrder.forEach((role) => {
    if (overflow <= 0) {
      return;
    }

    const reduction = Math.min(counts[role] - 1, overflow);

    if (reduction > 0) {
      counts[role] -= reduction;
      overflow -= reduction;
    }
  });

  return {
    ...counts,
    totalPlayers: counts.police + counts.thief + counts.victim,
  };
}

export function createPoliceGame({ totalPlayers, policeCount, thiefCount, victimCount }) {
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

export function createPoliceController({ elements, openHub, openRoleSetup, startRoleGame }) {
  function updateFeedback(message = "") {
    elements.feedback.textContent = message;
  }

  function syncSetup(preferredRole = "victim", nextValue = null) {
    const counts = normalizePoliceSetup(
      {
        police: elements.policeCount.value,
        thief: elements.thiefCount.value,
        victim: elements.victimCount.value,
      },
      { preferredRole, nextValue },
    );

    elements.policeCount.value = counts.police;
    elements.thiefCount.value = counts.thief;
    elements.victimCount.value = counts.victim;
    elements.roleSummary.textContent = `Total: ${counts.totalPlayers} ${pluralize(
      counts.totalPlayers,
      "jogador",
      "jogadores",
    )}. Serão ${counts.police} ${pluralize(
      counts.police,
      "policial",
      "policiais",
    )}, ${counts.thief} ${pluralize(
      counts.thief,
      "ladrão",
      "ladrões",
    )} e ${counts.victim} ${pluralize(counts.victim, "vítima", "vítimas")}.`;

    return counts;
  }

  function openSetup() {
    openRoleSetup("policeSetup");
    updateFeedback("");
    syncSetup();
  }

  function start() {
    const counts = syncSetup();
    updateFeedback("");
    startRoleGame(
      createPoliceGame({
        totalPlayers: counts.totalPlayers,
        policeCount: counts.police,
        thiefCount: counts.thief,
        victimCount: counts.victim,
      }),
    );
  }

  function bind() {
    elements.decreaseCount.addEventListener("click", () => {
      syncSetup("police", Number(elements.policeCount.value) - 1);
    });
    elements.increaseCount.addEventListener("click", () => {
      syncSetup("police", Number(elements.policeCount.value) + 1);
    });
    elements.policeCount.addEventListener("change", (event) => {
      syncSetup("police", event.target.value);
    });
    elements.decreaseThieves.addEventListener("click", () => {
      syncSetup("thief", Number(elements.thiefCount.value) - 1);
    });
    elements.increaseThieves.addEventListener("click", () => {
      syncSetup("thief", Number(elements.thiefCount.value) + 1);
    });
    elements.thiefCount.addEventListener("change", (event) => {
      syncSetup("thief", event.target.value);
    });
    elements.decreaseVictims.addEventListener("click", () => {
      syncSetup("victim", Number(elements.victimCount.value) - 1);
    });
    elements.increaseVictims.addEventListener("click", () => {
      syncSetup("victim", Number(elements.victimCount.value) + 1);
    });
    elements.victimCount.addEventListener("change", (event) => {
      syncSetup("victim", event.target.value);
    });
    elements.form.addEventListener("submit", (event) => {
      event.preventDefault();
      start();
    });
    elements.goHub.addEventListener("click", openHub);
  }

  return {
    id: "police",
    setupScreen: "policeSetup",
    bind,
    initialize: syncSetup,
    openSetup,
  };
}
