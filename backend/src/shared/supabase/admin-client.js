import { createClient } from "@supabase/supabase-js";

import { getBackendEnv } from "../../config/env.js";

let adminClient;

export function getSupabaseAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  const { supabaseUrl, supabaseSecretKey } = getBackendEnv();

  adminClient = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    db: {
      schema: "public",
    },
  });

  return adminClient;
}

