function requireValue(environment, name) {
  const value = environment[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseSupabaseUrl(value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error("SUPABASE_URL must be a valid absolute URL");
  }

  if (url.protocol !== "https:" && url.hostname !== "127.0.0.1" && url.hostname !== "localhost") {
    throw new Error("SUPABASE_URL must use HTTPS outside local development");
  }

  return url.toString().replace(/\/$/, "");
}

function parseSecretKey(value) {
  if (value.startsWith("sb_publishable_")) {
    throw new Error("SUPABASE_SECRET_KEY cannot contain a publishable browser key");
  }

  return value;
}

export function getBackendEnv(environment = process.env) {
  return Object.freeze({
    supabaseUrl: parseSupabaseUrl(requireValue(environment, "SUPABASE_URL")),
    supabaseSecretKey: parseSecretKey(
      requireValue(environment, "SUPABASE_SECRET_KEY"),
    ),
  });
}

