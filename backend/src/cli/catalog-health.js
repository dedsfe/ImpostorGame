import { getCatalogHealth, listActiveGames } from "../modules/catalog/catalog-repository.js";
import { getSupabaseAdminClient } from "../shared/supabase/admin-client.js";

const client = getSupabaseAdminClient();
const [tables, games] = await Promise.all([
  getCatalogHealth(client),
  listActiveGames(client),
]);

console.log(
  JSON.stringify(
    {
      status: "ok",
      tables,
      games,
    },
    null,
    2,
  ),
);

