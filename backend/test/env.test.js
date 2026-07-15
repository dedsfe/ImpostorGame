import assert from "node:assert/strict";
import test from "node:test";

import { getBackendEnv } from "../src/config/env.js";

test("loads a backend-only Supabase configuration", () => {
  const config = getBackendEnv({
    SUPABASE_URL: "https://example.supabase.co/",
    SUPABASE_SECRET_KEY: "sb_secret_example",
  });

  assert.deepEqual(config, {
    supabaseUrl: "https://example.supabase.co",
    supabaseSecretKey: "sb_secret_example",
  });
});

test("rejects a publishable key in the backend secret slot", () => {
  assert.throws(
    () =>
      getBackendEnv({
        SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SECRET_KEY: "sb_publishable_example",
      }),
    /cannot contain a publishable browser key/,
  );
});

test("requires every backend setting", () => {
  assert.throws(() => getBackendEnv({}), /SUPABASE_URL/);
});

