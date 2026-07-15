// Google AdSense — DESLIGADO por padrão.
//
// Nada de anúncio aparece e nada é carregado enquanto ADSENSE_CLIENT estiver
// vazio. Quando o Google aprovar sua conta, cole aqui o seu publisher ID
// (formato "ca-pub-XXXXXXXXXXXXXXXX") e faça o deploy. É a única mudança de
// código necessária pra ligar — o resto (posições, formatos) você controla no
// painel do AdSense com "Auto ads".
//
// Passos pra ligar, quando chegar a hora:
//   1. Preencher ADSENSE_CLIENT abaixo com o seu ca-pub-...
//   2. Criar um arquivo /ads.txt na raiz com a linha que o AdSense te der
//      (ex: "google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0")
//   3. Deploy. O Google leva algumas horas pra começar a exibir.

const ADSENSE_CLIENT = "ca-pub-1447277482375079";

const SCRIPT_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

// Carrega o AdSense só quando faz sentido. Nunca lança.
export function initAds() {
  try {
    if (!ADSENSE_CLIENT) {
      return; // desligado: nenhum publisher ID configurado
    }

    const host = location.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "" ||
      host.endsWith(".local");
    if (isLocal) {
      return; // não carrega anúncios em ambiente local
    }

    if (document.querySelector("script[data-adsense]")) {
      return; // já carregado
    }

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `${SCRIPT_SRC}?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
    script.setAttribute("data-adsense", "");
    document.head.appendChild(script);
  } catch {
    // Silencioso de propósito: falha de anúncio não afeta o jogo.
  }
}
