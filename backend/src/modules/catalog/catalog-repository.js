export const CATALOG_TABLES = Object.freeze([
  "games",
  "game_tutorials",
  "tutorial_steps",
  "role_templates",
  "categories",
  "difficulties",
  "content_items",
]);

async function countRows(client, table) {
  const { count, error } = await client
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`Failed to count ${table}: ${error.message}`);
  }

  return [table, count ?? 0];
}

export async function getCatalogHealth(client) {
  const counts = await Promise.all(
    CATALOG_TABLES.map((table) => countRows(client, table)),
  );

  return Object.fromEntries(counts);
}

export async function listActiveGames(client) {
  const { data, error } = await client
    .from("games")
    .select("id, slug, name, min_players, max_players")
    .eq("is_active", true)
    .order("id");

  if (error) {
    throw new Error(`Failed to list active games: ${error.message}`);
  }

  return data;
}

