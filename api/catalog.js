const { loadCatalogSnapshot } = require("../server/catalog-snapshot.cjs");

module.exports = async function catalogHandler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const snapshot = await loadCatalogSnapshot();

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=86400",
    );

    if (request.method === "HEAD") {
      return response.status(200).end();
    }

    return response.status(200).json(snapshot);
  } catch (error) {
    console.error("Catalog API unavailable:", error.message);
    response.setHeader("Cache-Control", "no-store");
    return response.status(503).json({ error: "catalog_unavailable" });
  }
};

