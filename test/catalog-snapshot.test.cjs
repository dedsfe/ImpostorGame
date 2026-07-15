const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildCatalogSnapshot,
  requireEnvironment,
} = require("../server/catalog-snapshot.cjs");

test("builds browser-compatible pools from relational catalog rows", () => {
  const snapshot = buildCatalogSnapshot({
    games: [
      { id: 1, slug: "impostor", name: "Impostor" },
      { id: 4, slug: "whoami", name: "Quem sou eu?" },
      { id: 5, slug: "mimica", name: "Mímica Rápida" },
    ],
    tutorials: [{ id: 1, game_id: 1, title: "Como jogar", copy: "Teste" }],
    tutorialSteps: [
      { id: 1, tutorial_id: 1, step_order: 2, title: "Segundo", copy: "B" },
      { id: 2, tutorial_id: 1, step_order: 1, title: "Primeiro", copy: "A" },
    ],
    categories: [
      { id: 1, game_id: 1, slug: "geral" },
      { id: 2, game_id: 4, slug: "filmes-series" },
      { id: 3, game_id: 5, slug: "geral" },
    ],
    difficulties: [
      { id: 1, game_id: 1, slug: "facil" },
      { id: 2, game_id: 5, slug: "medio" },
    ],
    contentItems: [
      {
        id: 1,
        game_id: 1,
        category_id: 1,
        difficulty_id: 1,
        label: "bola",
      },
      {
        id: 2,
        game_id: 4,
        category_id: 2,
        difficulty_id: null,
        label: "Neo",
        source_title: "Matrix",
      },
      {
        id: 3,
        game_id: 5,
        category_id: 3,
        difficulty_id: 2,
        label: "andar de bicicleta",
      },
    ],
  });

  assert.deepEqual(snapshot.wordPools.geral.facil, ["bola"]);
  assert.deepEqual(snapshot.whoAmIPools["filmes-series"], [
    { name: "Neo", source: "Matrix" },
  ]);
  assert.deepEqual(snapshot.mimicaPools.geral.medio, ["andar de bicicleta"]);
  assert.deepEqual(
    snapshot.rulesContent.impostor.steps.map((step) => step.title),
    ["Primeiro", "Segundo"],
  );
});

test("rejects missing public Supabase configuration", () => {
  assert.throws(() => requireEnvironment({}), /not configured/);
});

test("rejects an empty remote catalog so the frontend can use its fallback", () => {
  assert.throws(
    () =>
      buildCatalogSnapshot({
        games: [],
        tutorials: [],
        tutorialSteps: [],
        categories: [],
        difficulties: [],
        contentItems: [],
      }),
    /catalog is empty/,
  );
});

