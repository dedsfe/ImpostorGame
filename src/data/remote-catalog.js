import { applyRemoteCatalogs } from "./catalogs.js";
import { applyRemoteRulesContent } from "./tutorials.js";

const DEFAULT_TIMEOUT_MS = 5000;

function validateSnapshot(snapshot) {
  if (
    !snapshot ||
    snapshot.source !== "supabase" ||
    !Number.isInteger(snapshot.counts?.contentItems) ||
    snapshot.counts.contentItems <= 0
  ) {
    throw new Error("Remote catalog snapshot is empty or invalid");
  }

  return snapshot;
}

export async function hydrateCatalogFromApi({
  endpoint = "/api/catalog",
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  if (typeof fetchImpl !== "function") {
    return { source: "local", reason: "fetch_unavailable" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(endpoint, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Catalog API returned ${response.status}`);
    }

    const snapshot = validateSnapshot(await response.json());
    applyRemoteCatalogs(snapshot);
    applyRemoteRulesContent(snapshot.rulesContent);

    return {
      source: "supabase",
      counts: snapshot.counts,
    };
  } catch (error) {
    console.warn("Using bundled catalog fallback:", error.message);
    return {
      source: "local",
      reason: error.name === "AbortError" ? "timeout" : "api_unavailable",
    };
  } finally {
    clearTimeout(timeout);
  }
}

