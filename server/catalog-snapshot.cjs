const DEFAULT_PAGE_SIZE = 1000;
const MAX_CONTENT_PAGES = 20;

function requireEnvironment(environment) {
  const supabaseUrl = environment.SUPABASE_URL?.trim().replace(/\/$/, "");
  const publishableKey = environment.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Supabase public environment is not configured");
  }

  return { supabaseUrl, publishableKey };
}

function buildRestUrl(supabaseUrl, table, parameters = {}) {
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);

  Object.entries(parameters).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(name, value);
    }
  });

  return url;
}

async function fetchRows({
  fetchImpl,
  supabaseUrl,
  publishableKey,
  table,
  select,
  filters,
  order = "id.asc",
  range,
}) {
  const url = buildRestUrl(supabaseUrl, table, {
    select,
    ...filters,
    order,
  });
  const headers = {
    apikey: publishableKey,
    Accept: "application/json",
  };

  if (range) {
    headers.Range = `${range.from}-${range.to}`;
  }

  const response = await fetchImpl(url, { headers });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Supabase ${table} request failed (${response.status}): ${detail}`);
  }

  const rows = await response.json();

  if (!Array.isArray(rows)) {
    throw new Error(`Supabase ${table} response is not an array`);
  }

  return rows;
}

async function fetchContentItems(config, pageSize = DEFAULT_PAGE_SIZE) {
  const rows = [];

  for (let page = 0; page < MAX_CONTENT_PAGES; page += 1) {
    const from = page * pageSize;
    const batch = await fetchRows({
      ...config,
      table: "content_items",
      select:
        "id,game_id,category_id,difficulty_id,content_kind,label,source_title,source_studio,sort_order",
      filters: { is_active: "eq.true" },
      range: { from, to: from + pageSize - 1 },
    });

    rows.push(...batch);

    if (batch.length < pageSize) {
      return rows;
    }
  }

  throw new Error(`Supabase content exceeded ${MAX_CONTENT_PAGES * pageSize} rows`);
}

function makePoolEntry(item) {
  const source = item.source_title || item.source_studio;

  if (!source) {
    return item.label;
  }

  return {
    name: item.label,
    source,
  };
}

function ensureDifficultyPool(target, categorySlug, difficultySlug) {
  target[categorySlug] ??= {};
  target[categorySlug][difficultySlug] ??= [];
  return target[categorySlug][difficultySlug];
}

function buildRulesContent(gamesById, tutorials, tutorialSteps) {
  const stepsByTutorial = new Map();

  tutorialSteps.forEach((step) => {
    const steps = stepsByTutorial.get(step.tutorial_id) ?? [];
    steps.push({
      order: step.step_order,
      title: step.title,
      copy: step.copy,
    });
    stepsByTutorial.set(step.tutorial_id, steps);
  });

  return Object.fromEntries(
    tutorials.flatMap((tutorial) => {
      const game = gamesById.get(tutorial.game_id);

      if (!game) {
        return [];
      }

      const steps = (stepsByTutorial.get(tutorial.id) ?? [])
        .sort((left, right) => left.order - right.order)
        .map(({ title, copy }) => ({ title, copy }));

      return [
        [
          game.slug,
          {
            title: tutorial.title,
            copy: tutorial.copy,
            steps,
          },
        ],
      ];
    }),
  );
}

function buildCatalogSnapshot({
  games,
  tutorials,
  tutorialSteps,
  categories,
  difficulties,
  contentItems,
}) {
  if (games.length === 0 || contentItems.length === 0) {
    throw new Error("Supabase catalog is empty; run the catalog seed migration");
  }

  const gamesById = new Map(games.map((game) => [game.id, game]));
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const difficultiesById = new Map(
    difficulties.map((difficulty) => [difficulty.id, difficulty]),
  );
  const wordPools = {};
  const whoAmIPools = {};
  const mimicaPools = {};

  contentItems.forEach((item) => {
    const game = gamesById.get(item.game_id);
    const category = categoriesById.get(item.category_id);

    if (!game || !category) {
      return;
    }

    if (game.slug === "whoami") {
      whoAmIPools[category.slug] ??= [];
      whoAmIPools[category.slug].push(makePoolEntry(item));
      return;
    }

    const difficulty = difficultiesById.get(item.difficulty_id);

    if (!difficulty) {
      return;
    }

    if (game.slug === "impostor") {
      ensureDifficultyPool(wordPools, category.slug, difficulty.slug).push(item.label);
      return;
    }

    if (game.slug === "mimica") {
      ensureDifficultyPool(mimicaPools, category.slug, difficulty.slug).push(
        makePoolEntry(item),
      );
    }
  });

  const rulesContent = buildRulesContent(gamesById, tutorials, tutorialSteps);

  return {
    version: 1,
    source: "supabase",
    counts: {
      games: games.length,
      tutorials: tutorials.length,
      tutorialSteps: tutorialSteps.length,
      categories: categories.length,
      difficulties: difficulties.length,
      contentItems: contentItems.length,
    },
    wordPools,
    whoAmIPools,
    mimicaPools,
    rulesContent,
  };
}

async function loadCatalogSnapshot({
  environment = process.env,
  fetchImpl = globalThis.fetch,
  pageSize = DEFAULT_PAGE_SIZE,
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new Error("A fetch implementation is required");
  }

  const publicEnvironment = requireEnvironment(environment);
  const config = { ...publicEnvironment, fetchImpl };
  const [games, tutorials, tutorialSteps, categories, difficulties, contentItems] =
    await Promise.all([
      fetchRows({
        ...config,
        table: "games",
        select: "id,slug,name",
        filters: { is_active: "eq.true" },
      }),
      fetchRows({
        ...config,
        table: "game_tutorials",
        select: "id,game_id,title,copy",
      }),
      fetchRows({
        ...config,
        table: "tutorial_steps",
        select: "id,tutorial_id,step_order,title,copy",
        order: "tutorial_id.asc,step_order.asc",
      }),
      fetchRows({
        ...config,
        table: "categories",
        select: "id,game_id,slug,name,content_kind,sort_order",
        filters: { is_active: "eq.true" },
        order: "game_id.asc,sort_order.asc",
      }),
      fetchRows({
        ...config,
        table: "difficulties",
        select: "id,game_id,slug,name,sort_order",
        filters: { is_active: "eq.true" },
        order: "game_id.asc,sort_order.asc",
      }),
      fetchContentItems(config, pageSize),
    ]);

  return buildCatalogSnapshot({
    games,
    tutorials,
    tutorialSteps,
    categories,
    difficulties,
    contentItems,
  });
}

module.exports = {
  buildCatalogSnapshot,
  fetchContentItems,
  loadCatalogSnapshot,
  requireEnvironment,
};

