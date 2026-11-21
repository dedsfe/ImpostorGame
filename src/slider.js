// Tela inicial: carrossel de capas. Arrasta pro lado, toca na capa do meio (ou em "Jogar") e o jogo abre.
// Substitui a sala com a TV e o controle remoto (intro.js), que ficou complicada demais.

const CAPA = (game) => `./assets/capas/${capaId(game)}.webp`;
const FUNDO = (game) => `./assets/capas/${capaId(game)}-fundo.webp`;

function capaId(game) {
  // nome do arquivo da capa vertical, sem pasta e sem extensão (ex.: "./assets/impostor.png" -> "impostor")
  return game.cardImage.split("/").pop().replace(/\.[a-z]+$/i, "");
}

export function createSlider({ root, games, shell, onPick }) {
  const track = root.querySelector("[data-slider-track]");
  const dots = root.querySelector("[data-slider-dots]");
  const label = root.querySelector("[data-slider-label]");
  const title = root.querySelector("[data-slider-title]");
  const copy = root.querySelector("[data-slider-copy]");
  const play = root.querySelector("[data-slider-play]");
  const fundoA = root.querySelector("[data-slider-bg='a']");
  const fundoB = root.querySelector("[data-slider-bg='b']");
  const prev = root.querySelector("[data-slider-prev]");
  const next = root.querySelector("[data-slider-next]");
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)");

  let atual = -1;
  let fundoVez = false;
  let raf = 0;
  let alvo = null; // pra onde as setas mandaram (clique rápido não pula nem trava)

  track.innerHTML = games
    .map(
      (game, i) => `
      <button class="slide" type="button" data-i="${i}" aria-label="${game.title}">
        <span class="slide-arte"><img src="${CAPA(game)}" alt="" width="720" height="1080" ${i > 1 ? 'loading="lazy"' : ""} decoding="async" draggable="false"></span>
      </button>`,
    )
    .join("");
  dots.innerHTML = games.map((_, i) => `<i data-i="${i}"></i>`).join("");
  const slides = [...track.querySelectorAll(".slide")];
  const pontos = [...dots.querySelectorAll("i")];
  const artes = slides.map((s) => s.querySelector("img"));
  let tocou = false; // só vibra depois que a pessoa mexeu (nada de vibrar ao abrir)

  function mostra(i) {
    if (i === atual) return;
    // o nome do jogo entra vindo do lado pra onde a pessoa arrastou
    root.style.setProperty("--dir", atual < 0 || i > atual ? "1" : "-1");
    if (tocou && atual >= 0 && navigator.vibrate) navigator.vibrate(6);
    atual = i;
    const game = games[i];
    label.textContent = game.label;
    title.textContent = game.title;
    copy.textContent = game.description;
    play.textContent = `Jogar ${game.title}`;
    pontos.forEach((p, k) => p.classList.toggle("on", k === i));
    slides.forEach((s, k) => s.setAttribute("aria-current", k === i ? "true" : "false"));
    prev.disabled = i === 0;
    next.disabled = i === games.length - 1;
    // texto entra de novo a cada troca
    root.classList.remove("trocou");
    void root.offsetWidth;
    root.classList.add("trocou");
    // fundo desfocado da capa: alterna entre 2 camadas pra fazer o cross-fade
    const vai = fundoVez ? fundoA : fundoB;
    const sai = fundoVez ? fundoB : fundoA;
    vai.style.backgroundImage = `url("${FUNDO(game)}")`;
    vai.classList.add("on");
    sai.classList.remove("on");
    fundoVez = !fundoVez;
  }

  // escala e brilho de cada capa conforme a distância do centro (só transform/opacity)
  function pinta() {
    raf = 0;
    const meio = track.scrollLeft + track.clientWidth / 2;
    let perto = 0;
    let menor = Infinity;
    slides.forEach((s, i) => {
      const centro = s.offsetLeft + s.offsetWidth / 2;
      const d = (centro - meio) / s.offsetWidth; // 0 no meio, ±1 na vizinha
      const a = Math.min(Math.abs(d), 1.5);
      if (Math.abs(d) < menor) {
        menor = Math.abs(d);
        perto = i;
      }
      const dc = Math.max(-1.5, Math.min(1.5, d));
      if (!reduz.matches) {
        // profundidade: a vizinha gira pra dentro, encolhe e chega mais perto do meio
        s.style.transform = `translateX(${-dc * 9}%) rotateY(${-dc * 24}deg) scale(${1 - a * 0.13})`;
        // paralaxe: a arte anda um pouco ao contrário, dá sensação de janela
        artes[i].style.transform = `translateX(${-dc * 7}%) scale(1.16)`;
      }
      s.style.opacity = String(1 - a * 0.38);
      s.style.zIndex = String(10 - Math.round(a * 4));
    });
    mostra(perto);
  }
  const agenda = () => {
    if (!raf) raf = requestAnimationFrame(pinta);
  };

  function vaiPara(i, suave = true) {
    i = Math.max(0, Math.min(games.length - 1, i));
    alvo = i;
    const s = slides[i];
    // scrollIntoView respeita o scroll-snap; o scrollTo suave era cancelado pelo snap e a seta "não andava"
    s.scrollIntoView({ behavior: suave && !reduz.matches ? "smooth" : "auto", inline: "center", block: "nearest" });
  }

  function escolhe(i) {
    if (i !== atual) return vaiPara(i);
    if (root.classList.contains("saindo")) return;
    if (navigator.vibrate) navigator.vibrate(12);
    // 1) a capa cresce e o resto apaga, mas o FUNDO continua opaco (antes ficava transparente e vazava a tela velha)
    root.classList.add("saindo");
    setTimeout(() => {
      // 2) com o carrossel ainda cobrindo tudo, o jogo abre por trás
      liberaApp();
      onPick(games[i]);
      // 3) só depois que a tela do jogo já está montada, o carrossel some em fade
      requestAnimationFrame(() => requestAnimationFrame(() => {
        root.classList.add("some");
        setTimeout(hide, reduz.matches ? 0 : 280);
      }));
    }, reduz.matches ? 0 : 300);
  }

  function liberaApp() {
    shell.inert = false;
    shell.removeAttribute("aria-hidden");
    document.body.classList.remove("is-slider-active");
  }

  function show() {
    if (!root.hidden && !root.classList.contains("some")) return; // já está na tela: não reinicia a animação
    // tudo no mesmo quadro: aparece já com a animação de entrada ligada (antes piscava pronto e depois a animação recomeçava = o "corte")
    root.classList.remove("entrou", "saindo", "some");
    root.hidden = false;
    shell.inert = true;
    shell.setAttribute("aria-hidden", "true");
    document.body.classList.add("is-slider-active");
    vaiPara(atual < 0 ? 0 : atual, false);
    pinta();
    void root.offsetWidth;
    root.classList.add("entrou");
  }

  function hide() {
    root.hidden = true;
    root.classList.remove("entrou", "saindo", "some");
    liberaApp();
  }

  function bind() {
    track.addEventListener("scroll", agenda, { passive: true });
    // iPhone (Safari): o scroll-snap às vezes deixa a capa parada no meio do caminho e o Safari não tem "scrollend".
    // Então, quando a rolagem para e o dedo já saiu, o próprio código centraliza a capa mais perto.
    let dedo = false;
    let parou = 0;
    const fimDaRolagem = () => {
      if (dedo || root.hidden) return;
      alvo = null;
      const meio = track.scrollLeft + track.clientWidth / 2;
      let perto = 0;
      let menor = Infinity;
      slides.forEach((sl, k) => {
        const dist = Math.abs(sl.offsetLeft + sl.offsetWidth / 2 - meio);
        if (dist < menor) { menor = dist; perto = k; }
      });
      if (menor > 3) vaiPara(perto);
      agenda();
    };
    track.addEventListener("scroll", () => { clearTimeout(parou); parou = setTimeout(fimDaRolagem, 140); }, { passive: true });
    track.addEventListener("touchstart", () => { dedo = true; clearTimeout(parou); }, { passive: true });
    const soltou = () => { dedo = false; clearTimeout(parou); parou = setTimeout(fimDaRolagem, 140); };
    track.addEventListener("touchend", soltou, { passive: true });
    track.addEventListener("touchcancel", soltou, { passive: true });
    ["pointerdown", "touchstart", "wheel", "keydown"].forEach((n) => root.addEventListener(n, () => { tocou = true; }, { passive: true }));
    window.addEventListener("resize", () => {
      if (!root.hidden) {
        vaiPara(atual, false);
        agenda();
      }
    });
    track.addEventListener("click", (e) => {
      const s = e.target.closest(".slide");
      if (s) escolhe(+s.dataset.i);
    });
    dots.addEventListener("click", (e) => {
      const p = e.target.closest("i");
      if (p) vaiPara(+p.dataset.i);
    });
    play.addEventListener("click", () => escolhe(atual));
    const base = () => (alvo ?? atual);
    // clique de mouse nas setas não pega foco: o foco rolava a tela e cancelava a rolagem suave do carrossel
    [prev, next, play].forEach((b) => b.addEventListener("mousedown", (e) => e.preventDefault()));
    prev.addEventListener("click", () => vaiPara(base() - 1));
    next.addEventListener("click", () => vaiPara(base() + 1));
    track.addEventListener("scrollend", () => { alvo = null; agenda(); });
    track.addEventListener("pointerdown", () => { alvo = null; });
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") vaiPara((alvo ?? atual) + 1);
      if (e.key === "ArrowLeft") vaiPara((alvo ?? atual) - 1);
    });
    // no computador: arrastar com o mouse também troca
    let x0 = null;
    let s0 = 0;
    let arrastou = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      x0 = e.clientX;
      s0 = track.scrollLeft;
      arrastou = false;
      track.classList.add("arrastando");
    });
    window.addEventListener("pointermove", (e) => {
      if (x0 === null) return;
      if (Math.abs(e.clientX - x0) > 5) arrastou = true;
      track.scrollLeft = s0 - (e.clientX - x0);
    });
    window.addEventListener("pointerup", () => {
      if (x0 === null) return;
      x0 = null;
      track.classList.remove("arrastando");
      agenda();
    });
    track.addEventListener(
      "click",
      (e) => {
        if (arrastou) {
          e.stopPropagation();
          arrastou = false;
        }
      },
      true,
    );
  }

  return { bind, show, hide, isVisible: () => !root.hidden };
}
