function safeImpostorCount(value) {
  const count = Number.parseInt(value, 10);
  return Number.isFinite(count) && count > 0 ? count : 1;
}

function joinNames(names) {
  if (names.length < 2) {
    return names[0] ?? "";
  }

  if (names.length === 2) {
    return `${names[0]} e ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")} e ${names.at(-1)}`;
}

export function isNameIdentificationEnabled(value) {
  return value === "required";
}

export function fitSessionPlayerNames(
  currentNames,
  totalPlayers,
  { preserve = false } = {},
) {
  if (!preserve) {
    return [];
  }

  return Array.from(
    { length: Math.max(0, Number(totalPlayers) || 0) },
    (_, index) => currentNames[index] ?? "",
  );
}

export function buildImpostorRoundInstructions(impostorCount) {
  const count = safeImpostorCount(impostorCount);

  return [
    "Cada pessoa dá uma pista curta.",
    "Conversem sobre quem parece suspeito.",
    count === 1
      ? "Votem juntos em uma pessoa."
      : `Escolham ${count} suspeitos.`,
  ];
}

export function buildRevealResultPrompt(impostorCount) {
  const count = safeImpostorCount(impostorCount);
  const choice = count === 1 ? "um suspeito" : `${count} suspeitos`;

  return {
    title: "Revelar o resultado?",
    copy: `Vocês já escolheram ${choice}? A próxima tela mostrará a palavra secreta e todos os papéis.`,
  };
}

export function buildImpostorResult({ playerNames, roles, secretWord }) {
  const impostorNames = roles.flatMap((role, index) =>
    role.tone === "impostor"
      ? [playerNames[index] || `Jogador ${index + 1}`]
      : [],
  );
  const names = joinNames(impostorNames);

  return {
    title:
      impostorNames.length === 1
        ? `${names} era a pessoa impostora`
        : `${names} eram os impostores`,
    secret: `Palavra secreta: ${secretWord}`,
  };
}
