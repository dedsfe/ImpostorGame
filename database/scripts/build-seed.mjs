import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  hubGames,
  mimicaPools,
  whoAmIPools,
  wordPools,
} from "../../src/data/catalogs.js";
import { rulesContent } from "../../src/data/tutorials.js";

const NOW = "2026-03-11T00:00:00Z";
const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../migrations/001_catalog_seed.sql");

const gameConfig = {
  impostor: {
    minPlayers: 3,
    maxPlayers: 20,
    supportsCategories: 1,
    supportsDifficulties: 1,
    supportsTimer: 0,
  },
  police: {
    minPlayers: 3,
    maxPlayers: 20,
    supportsCategories: 0,
    supportsDifficulties: 0,
    supportsTimer: 0,
  },
  city: {
    minPlayers: 5,
    maxPlayers: 20,
    supportsCategories: 0,
    supportsDifficulties: 0,
    supportsTimer: 0,
  },
  whoami: {
    minPlayers: 2,
    maxPlayers: null,
    supportsCategories: 1,
    supportsDifficulties: 0,
    supportsTimer: 0,
  },
  mimica: {
    minPlayers: 2,
    maxPlayers: null,
    supportsCategories: 1,
    supportsDifficulties: 1,
    supportsTimer: 1,
  },
};

const roleTemplates = {
  impostor: [
    {
      slug: "impostor",
      name: "Impostor",
      badge: "Impostor",
      title: "Você é o impostor",
      description:
        "Escute a conversa, tente entender a palavra e não entregue que você não a conhece.",
      tone: "impostor",
    },
    {
      slug: "word-holder",
      name: "Palavra secreta",
      badge: "Palavra secreta",
      title: "Você recebeu a palavra",
      description:
        "Guarde a palavra e use pistas discretas para identificar o impostor.",
      tone: "word",
    },
  ],
  police: [
    {
      slug: "police",
      name: "Polícia",
      badge: "Polícia",
      title: "Você é a polícia",
      description:
        "Observe a rodada com cuidado e tente identificar quem está agindo como ladrão.",
      tone: "police",
    },
    {
      slug: "thief",
      name: "Ladrão",
      badge: "Ladrão",
      title: "Você é o ladrão",
      description:
        "Tente disfarçar seu papel e escapar da atenção dos policiais durante a rodada.",
      tone: "thief",
    },
    {
      slug: "victim",
      name: "Vítima",
      badge: "Vítima",
      title: "Você é a vítima",
      description:
        "Observe os outros jogadores e tente perceber quem pode estar do seu lado ou contra você.",
      tone: "victim",
    },
  ],
  city: [
    {
      slug: "assassin",
      name: "Assassino",
      badge: "Assassino",
      title: "Você é o assassino",
      description:
        "Durante a noite, escolha alguém para eliminar em silêncio e tente não levantar suspeitas durante o dia.",
      tone: "thief",
    },
    {
      slug: "detective",
      name: "Detetive",
      badge: "Detetive",
      title: "Você é o detetive",
      description:
        "Durante a noite, investigue alguém com a ajuda do narrador e tente revelar os assassinos.",
      tone: "police",
    },
    {
      slug: "citizen",
      name: "Cidadão",
      badge: "Cidadão",
      title: "Você é cidadão",
      description:
        "Discuta, observe e vote em quem você acha que está mentindo para proteger a cidade.",
      tone: "victim",
    },
  ],
};

const categoryCatalog = {
  impostor: {
    contentKind: "secret_word",
    names: {
      geral: "Geral",
      animais: "Animais",
      comidas: "Comidas",
      objetos: "Objetos",
      lugares: "Lugares",
    },
  },
  mimica: {
    contentKind: "mimica_word",
    names: {
      geral: "Geral",
      animais: "Animais",
      objetos: "Objetos",
      "filmes-series": "Filmes e séries",
      "estudios-animacao": "Disney, Pixar, DreamWorks e estúdios",
      profissoes: "Profissões",
      games: "Games",
    },
  },
  whoami: {
    contentKind: "character",
    names: {
      geral: "Geral",
      "filmes-series": "Filmes e séries",
      "desenhos-animes": "Desenhos e animes",
      "estudios-animacao": "Disney, Pixar, DreamWorks e estúdios",
      "super-herois": "Super-heróis",
      famosos: "Famosos",
      games: "Games",
    },
  },
};

const difficultyCatalog = {
  impostor: [
    { slug: "facil", name: "Fácil" },
    { slug: "medio", name: "Média" },
    { slug: "dificil", name: "Difícil" },
  ],
  mimica: [
    { slug: "facil", name: "Fácil" },
    { slug: "medio", name: "Média" },
    { slug: "dificil", name: "Difícil" },
  ],
};

function sqlValue(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "null";
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

function toSqlInsert(tableName, columns, rows, batchSize = 250) {
  if (rows.length === 0) {
    return "";
  }

  const statements = [];

  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    const values = batch
      .map((row) => `  (${row.map((value) => sqlValue(value)).join(", ")})`)
      .join(",\n");

    statements.push(
      `insert into ${tableName} (${columns.join(", ")}) values\n${values};`,
    );
  }

  return statements.join("\n\n");
}

function normalizeLabel(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeEntry(entry) {
  if (typeof entry === "string") {
    return {
      label: entry,
      sourceTitle: null,
      sourceStudio: null,
      metadataJson: null,
    };
  }

  return {
    label: entry.name ?? entry.label ?? "",
    sourceTitle: entry.source ?? null,
    sourceStudio: entry.studio ?? null,
    metadataJson: JSON.stringify(entry),
  };
}

function buildRows() {
  let gameId = 1;
  let tutorialId = 1;
  let tutorialStepId = 1;
  let roleTemplateId = 1;
  let categoryId = 1;
  let difficultyId = 1;
  let contentItemId = 1;

  const gamesRows = [];
  const tutorialsRows = [];
  const tutorialStepsRows = [];
  const roleTemplateRows = [];
  const categoryRows = [];
  const difficultyRows = [];
  const contentItemRows = [];

  const gameIds = new Map();
  const categoryIds = new Map();
  const difficultyIds = new Map();

  for (const game of hubGames) {
    const config = gameConfig[game.id];
    gameIds.set(game.id, gameId);
    gamesRows.push([
      gameId,
      game.id,
      game.title,
      game.description,
      game.openScreen,
      game.cardImage,
      game.modalImage ?? null,
      config?.minPlayers ?? null,
      config?.maxPlayers ?? null,
      config?.supportsCategories ?? 0,
      config?.supportsDifficulties ?? 0,
      config?.supportsTimer ?? 0,
      1,
      NOW,
      NOW,
    ]);

    const tutorial = rulesContent[game.id];
    if (tutorial) {
      tutorialsRows.push([tutorialId, gameId, tutorial.title, tutorial.copy, NOW, NOW]);
      tutorial.steps.forEach((step, index) => {
        tutorialStepsRows.push([
          tutorialStepId,
          tutorialId,
          index + 1,
          step.title,
          step.copy,
          NOW,
          NOW,
        ]);
        tutorialStepId += 1;
      });
      tutorialId += 1;
    }

    (roleTemplates[game.id] ?? []).forEach((role, index) => {
      roleTemplateRows.push([
        roleTemplateId,
        gameId,
        role.slug,
        role.name,
        role.badge,
        role.title,
        role.description,
        role.tone,
        index + 1,
        1,
        NOW,
        NOW,
      ]);
      roleTemplateId += 1;
    });

    const categories = categoryCatalog[game.id];
    if (categories) {
      Object.entries(categories.names).forEach(([slug, name], index) => {
        categoryIds.set(`${game.id}:${slug}`, categoryId);
        categoryRows.push([
          categoryId,
          gameId,
          slug,
          name,
          categories.contentKind,
          index + 1,
          1,
          NOW,
          NOW,
        ]);
        categoryId += 1;
      });
    }

    (difficultyCatalog[game.id] ?? []).forEach((difficulty, index) => {
      difficultyIds.set(`${game.id}:${difficulty.slug}`, difficultyId);
      difficultyRows.push([
        difficultyId,
        gameId,
        difficulty.slug,
        difficulty.name,
        index + 1,
        1,
        NOW,
        NOW,
      ]);
      difficultyId += 1;
    });

    gameId += 1;
  }

  const contentPools = [
    {
      gameId: "impostor",
      contentKind: "secret_word",
      withDifficulty: true,
      pools: wordPools,
    },
    {
      gameId: "mimica",
      contentKind: "mimica_word",
      withDifficulty: true,
      pools: mimicaPools,
    },
    {
      gameId: "whoami",
      contentKind: "character",
      withDifficulty: false,
      pools: whoAmIPools,
    },
  ];

  contentPools.forEach(({ gameId: gameSlug, contentKind, withDifficulty, pools }) => {
    const dbGameId = gameIds.get(gameSlug);

    Object.entries(pools).forEach(([categorySlug, categoryPool]) => {
      const dbCategoryId = categoryIds.get(`${gameSlug}:${categorySlug}`) ?? null;

      if (withDifficulty) {
        Object.entries(categoryPool).forEach(([difficultySlug, entries]) => {
          const dbDifficultyId =
            difficultyIds.get(`${gameSlug}:${difficultySlug}`) ?? null;

          entries.forEach((entry, index) => {
            const normalized = normalizeEntry(entry);
            contentItemRows.push([
              contentItemId,
              dbGameId,
              dbCategoryId,
              dbDifficultyId,
              contentKind,
              normalized.label,
              normalizeLabel(normalized.label),
              normalized.sourceTitle,
              normalized.sourceStudio,
              normalized.metadataJson,
              index + 1,
              1,
              NOW,
              NOW,
            ]);
            contentItemId += 1;
          });
        });

        return;
      }

      categoryPool.forEach((entry, index) => {
        const normalized = normalizeEntry(entry);
        contentItemRows.push([
          contentItemId,
          dbGameId,
          dbCategoryId,
          null,
          contentKind,
          normalized.label,
          normalizeLabel(normalized.label),
          normalized.sourceTitle,
          normalized.sourceStudio,
          normalized.metadataJson,
          index + 1,
          1,
          NOW,
          NOW,
        ]);
        contentItemId += 1;
      });
    });
  });

  return {
    gamesRows,
    tutorialsRows,
    tutorialStepsRows,
    roleTemplateRows,
    categoryRows,
    difficultyRows,
    contentItemRows,
  };
}

function buildSeedSql() {
  const rows = buildRows();
  const sections = [
    "-- Seed inicial gerada automaticamente a partir dos catálogos do frontend",
    "-- Arquivo gerado por database/scripts/build-seed.mjs",
    "begin transaction;",
    toSqlInsert(
      "games",
      [
        "id",
        "slug",
        "name",
        "short_description",
        "setup_screen",
        "card_image_path",
        "modal_image_path",
        "min_players",
        "max_players",
        "supports_categories",
        "supports_difficulties",
        "supports_timer",
        "is_active",
        "created_at",
        "updated_at",
      ],
      rows.gamesRows,
    ),
    toSqlInsert(
      "game_tutorials",
      ["id", "game_id", "title", "copy", "created_at", "updated_at"],
      rows.tutorialsRows,
    ),
    toSqlInsert(
      "tutorial_steps",
      ["id", "tutorial_id", "step_order", "title", "copy", "created_at", "updated_at"],
      rows.tutorialStepsRows,
    ),
    toSqlInsert(
      "role_templates",
      [
        "id",
        "game_id",
        "slug",
        "name",
        "badge",
        "title",
        "description",
        "tone",
        "sort_order",
        "is_active",
        "created_at",
        "updated_at",
      ],
      rows.roleTemplateRows,
    ),
    toSqlInsert(
      "categories",
      [
        "id",
        "game_id",
        "slug",
        "name",
        "content_kind",
        "sort_order",
        "is_active",
        "created_at",
        "updated_at",
      ],
      rows.categoryRows,
    ),
    toSqlInsert(
      "difficulties",
      ["id", "game_id", "slug", "name", "sort_order", "is_active", "created_at", "updated_at"],
      rows.difficultyRows,
    ),
    toSqlInsert(
      "content_items",
      [
        "id",
        "game_id",
        "category_id",
        "difficulty_id",
        "content_kind",
        "label",
        "normalized_label",
        "source_title",
        "source_studio",
        "metadata_json",
        "sort_order",
        "is_active",
        "created_at",
        "updated_at",
      ],
      rows.contentItemRows,
      150,
    ),
    "commit;",
    "",
  ];

  return {
    sql: sections.filter(Boolean).join("\n\n"),
    stats: {
      games: rows.gamesRows.length,
      tutorials: rows.tutorialsRows.length,
      tutorialSteps: rows.tutorialStepsRows.length,
      roleTemplates: rows.roleTemplateRows.length,
      categories: rows.categoryRows.length,
      difficulties: rows.difficultyRows.length,
      contentItems: rows.contentItemRows.length,
    },
  };
}

function main() {
  mkdirSync(resolve(__dirname, "../migrations"), { recursive: true });

  const { sql, stats } = buildSeedSql();
  writeFileSync(outputPath, sql, "utf8");

  console.log(
    JSON.stringify(
      {
        outputPath,
        ...stats,
      },
      null,
      2,
    ),
  );
}

main();
