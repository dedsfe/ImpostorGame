import assert from "node:assert/strict";
import test from "node:test";

import { validateSnapshot } from "../src/data/remote-catalog.js";

function createSnapshot(overrides = {}) {
  return {
    counts: { contentItems: 3 },
    mimicaPools: { geral: { medio: ["pedalar"] } },
    source: "supabase",
    whoAmIPools: { geral: [{ name: "Neo", source: "Matrix" }] },
    wordPools: { geral: { facil: ["bola"] } },
    ...overrides,
  };
}

test("rejects a partial remote catalog", () => {
  assert.throws(
    () => validateSnapshot(createSnapshot({ mimicaPools: undefined })),
    /incomplete|invalid/i,
  );
});

test("rejects remote catalogs with empty pools", () => {
  assert.throws(
    () => validateSnapshot(createSnapshot({ wordPools: {} })),
    /empty|invalid/i,
  );
  assert.throws(
    () => validateSnapshot(createSnapshot({ whoAmIPools: { geral: [] } })),
    /empty|invalid/i,
  );
});
