// Camada fina de analytics sobre o PostHog.
//
// O snippet do PostHog é carregado no <head> do index.html e cria
// `window.posthog`. Aqui a gente só embrulha o `capture` de um jeito seguro:
// se o PostHog não carregou (rede, bloqueador, localhost), nada quebra —
// o app continua funcionando normalmente e os eventos são ignorados.

function getPostHog() {
  if (typeof window === "undefined") {
    return null;
  }

  const ph = window.posthog;
  if (!ph || typeof ph.capture !== "function") {
    return null;
  }

  return ph;
}

// Registra um evento custom. Nunca lança — analytics jamais deve derrubar o app.
export function track(event, properties) {
  try {
    const ph = getPostHog();
    if (ph) {
      ph.capture(event, properties);
    }
  } catch {
    // Silencioso de propósito: falha de analytics não afeta o jogo.
  }
}
