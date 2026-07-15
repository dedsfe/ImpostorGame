import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { rulesContent } from "../src/data/tutorials.js";
import {
  buildImpostorResult,
  buildImpostorRoundInstructions,
  buildRevealResultPrompt,
} from "../src/games/impostor-ux.js";

test("uses the global party instead of Impostor-specific player controls", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.doesNotMatch(html, /id="impostor-player-count"/);
  assert.doesNotMatch(html, /id="impostor-require-names"/);
  assert.match(html, /data-party-screen="impostorSetup"/);
});

test("guides the live round with the right number of suspects", () => {
  assert.deepEqual(buildImpostorRoundInstructions(1), [
    "Cada pessoa dá uma pista curta.",
    "Conversem sobre quem parece suspeito.",
    "Votem juntos em uma pessoa.",
  ]);
  assert.deepEqual(buildImpostorRoundInstructions(2), [
    "Cada pessoa dá uma pista curta.",
    "Conversem sobre quem parece suspeito.",
    "Escolham 2 suspeitos.",
  ]);
});

test("requires an explicit confirmation before revealing the result", () => {
  assert.deepEqual(buildRevealResultPrompt(1), {
    title: "Revelar o resultado?",
    copy:
      "Vocês já escolheram um suspeito? A próxima tela mostrará a palavra secreta e todos os papéis.",
  });
  assert.deepEqual(buildRevealResultPrompt(3), {
    title: "Revelar o resultado?",
    copy:
      "Vocês já escolheram 3 suspeitos? A próxima tela mostrará a palavra secreta e todos os papéis.",
  });
});

test("puts impostors and the secret word first in the result", () => {
  const roles = [
    { tone: "impostor" },
    { tone: "word" },
    { tone: "impostor" },
  ];

  assert.deepEqual(
    buildImpostorResult({
      playerNames: ["Bia", "Ana", "Caio"],
      roles,
      secretWord: "Telecinese",
    }),
    {
      title: "Bia e Caio eram os impostores",
      secret: "Palavra secreta: Telecinese",
    },
  );

  assert.deepEqual(
    buildImpostorResult({
      playerNames: ["Bia", "Ana"],
      roles: roles.slice(0, 2),
      secretWord: "Telecinese",
    }),
    {
      title: "Bia era a pessoa impostora",
      secret: "Palavra secreta: Telecinese",
    },
  );
});

test("teaches the complete current Impostor rules without difficulty", () => {
  const tutorial = rulesContent.impostor;
  const tutorialText = [
    tutorial.copy,
    ...tutorial.steps.flatMap((step) => [step.title, step.copy]),
  ].join(" ");

  assert.equal(tutorial.steps.length, 6);
  assert.match(tutorialText, /jogadores e tema/i);
  assert.match(tutorialText, /jogadores comuns conhecem a palavra secreta/i);
  assert.match(tutorialText, /impostores conhecem apenas o tema/i);
  assert.match(tutorialText, /mesma quantidade de suspeitos/i);
  assert.match(tutorialText, /tentativa conjunta/i);
  assert.match(tutorialText, /roubam a vitória/i);
  assert.match(tutorialText, /passar despercebido/i);
  assert.doesNotMatch(tutorialText, /dificuldade/i);
});

test("uses the official clue language and keeps the secret out of Valendo", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const roleFlowSource = readFileSync(
    new URL("../src/role-flow.js", import.meta.url),
    "utf8",
  );
  const endScreenSource = roleFlowSource.slice(
    roleFlowSource.indexOf("function renderEndScreen"),
    roleFlowSource.indexOf("function renderResult"),
  );

  assert.doesNotMatch(roleFlowSource, /começa perguntando|quem começa perguntando/i);
  assert.doesNotMatch(html, /recebem a mesma pista/i);
  assert.match(roleFlowSource, /começa dando uma pista/);
  assert.match(roleFlowSource, /clearTurnSecret\(\);[\s\S]*setPhase\("prep"\)/);
  assert.doesNotMatch(endScreenSource, /renderRoleList\(\)/);
  assert.match(endScreenSource, /roleRevealList\.replaceChildren\(\)/);
});
