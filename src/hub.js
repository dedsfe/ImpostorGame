function getFocusableElements(elements) {
  return elements.filter(
    (element) => element && !element.hidden && !element.disabled,
  );
}

function trapFocus(event, elements) {
  if (event.key !== "Tab") {
    return;
  }

  const focusable = getFocusableElements(elements);

  if (focusable.length === 0) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function createHubController({ elements, games, openGame, rulesContent, state }) {
  const gamesById = new Map(games.map((game) => [game.id, game]));
  const hoverMediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  let lastHubModalTrigger = null;
  let lastRulesModalTrigger = null;

  function getGame(gameId) {
    return gamesById.get(gameId) ?? null;
  }

  function stopVideo(card, { reset = true } = {}) {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    const video = card.querySelector(".hub-card-media-video");

    if (!(video instanceof HTMLVideoElement)) {
      return;
    }

    card.classList.remove("is-video-active");
    video.pause();

    if (reset) {
      try {
        video.currentTime = 0;
      } catch {}
    }
  }

  function stopVideos({ reset = true } = {}) {
    elements.hub.grid
      .querySelectorAll(".hub-card[data-hover-video='true']")
      .forEach((card) => stopVideo(card, { reset }));
  }

  function playVideo(card) {
    if (
      !hoverMediaQuery.matches ||
      !(card instanceof HTMLElement) ||
      state.currentScreen !== "hub" ||
      state.hubModalOpen
    ) {
      return;
    }

    const video = card.querySelector(".hub-card-media-video");

    if (!(video instanceof HTMLVideoElement)) {
      return;
    }

    stopVideos();
    card.classList.add("is-video-active");
    const playAttempt = video.play();

    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => stopVideo(card));
    }
  }

  function createCard(game) {
    const article = document.createElement("article");
    const media = document.createElement("div");
    const image = document.createElement("img");
    const video = game.hoverVideo ? document.createElement("video") : null;
    const scrim = document.createElement("div");
    const content = document.createElement("div");
    const label = document.createElement("p");
    const title = document.createElement("h2");
    const action = document.createElement("button");

    article.className = "hub-card";
    article.dataset.gameId = game.id;

    media.className = "hub-card-media has-image";
    image.className = "hub-card-media-image";
    image.src = game.cardImage;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.loading = "lazy";
    image.decoding = "async";

    if (video) {
      article.dataset.hoverVideo = "true";
      media.classList.add("has-hover-video");
      video.className = "hub-card-media-video";
      video.src = game.hoverVideo;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.poster = game.cardImage;
      video.setAttribute("aria-hidden", "true");
      video.tabIndex = -1;
    }

    scrim.className = "hub-card-scrim";
    content.className = "hub-card-content";
    label.className = "hub-card-label";
    label.textContent = game.label;
    title.className = "hub-card-title";
    title.textContent = game.title;
    action.className = "hub-card-action";
    action.type = "button";
    action.textContent = "Ver jogo";
    action.setAttribute("aria-haspopup", "dialog");
    action.setAttribute("aria-label", `Ver jogo ${game.title}`);

    content.append(label, title, action);
    media.append(image, ...(video ? [video] : []), scrim, content);
    article.append(media);

    if (video) {
      article.addEventListener("mouseenter", () => playVideo(article));
      article.addEventListener("mouseleave", () => stopVideo(article));
    }

    return article;
  }

  function renderCards() {
    elements.hub.grid.replaceChildren(...games.map((game) => createCard(game)));
  }

  function renderHubModal() {
    const game = getGame(state.hubModalGameId);
    const isOpen = state.hubModalOpen && Boolean(game);

    elements.hub.modal.hidden = !isOpen;
    document.body.classList.toggle("is-hub-modal-open", isOpen);

    if (!isOpen || !game) {
      elements.hub.modalImage.removeAttribute("src");
      elements.hub.modalImage.alt = "";
      elements.hub.modal.removeAttribute("data-media-fit");
      elements.hub.modalLabel.textContent = "";
      elements.hub.modalTitle.textContent = "";
      elements.hub.modalDescription.textContent = "";
      elements.hub.modalStart.dataset.gameId = "";
      return;
    }

    elements.hub.modal.dataset.mediaFit = game.modalImage ? "cover" : "contain";
    elements.hub.modalImage.src = game.modalImage ?? game.cardImage;
    elements.hub.modalImage.alt = game.title;
    elements.hub.modalLabel.textContent = game.label;
    elements.hub.modalTitle.textContent = game.title;
    elements.hub.modalDescription.textContent = game.description;
    elements.hub.modalStart.dataset.gameId = game.id;
    queueMicrotask(() => {
      if (state.hubModalOpen && state.hubModalGameId === game.id) {
        elements.hub.modalStart.focus();
      }
    });
  }

  function renderRules() {
    const content = rulesContent[state.rulesModalGameId] ?? null;
    const isOpen = state.rulesModalOpen && Boolean(content);

    elements.rules.modal.hidden = !isOpen;
    document.body.classList.toggle("is-rules-modal-open", isOpen);

    if (!isOpen || !content) {
      elements.rules.label.textContent = "Como jogar";
      elements.rules.title.textContent = "";
      elements.rules.copy.textContent = "";
      elements.rules.steps.replaceChildren();
      return;
    }

    const items = content.steps.map((step) => {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      const copy = document.createElement("span");
      item.className = "rules-step";
      title.textContent = step.title;
      copy.textContent = step.copy;
      item.append(title, copy);
      return item;
    });

    elements.rules.label.textContent = "Como jogar";
    elements.rules.title.textContent = content.title;
    elements.rules.copy.textContent = content.copy;
    elements.rules.steps.replaceChildren(...items);
    queueMicrotask(() => {
      if (state.rulesModalOpen) {
        elements.rules.confirm.focus();
      }
    });
  }

  function preloadImages() {
    const sources = new Set();

    games.forEach((game) => {
      sources.add(game.cardImage);
      sources.add(game.modalImage ?? game.cardImage);
    });

    sources.forEach((src) => {
      if (src) {
        const image = new Image();
        image.src = src;
      }
    });
  }

  function openHubModal(gameId, trigger = null) {
    if (!getGame(gameId)) {
      return;
    }

    stopVideos();
    lastHubModalTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
    state.hubModalGameId = gameId;
    state.hubModalOpen = true;
    renderHubModal();
  }

  function closeHubModal() {
    if (!state.hubModalOpen && state.hubModalGameId === null) {
      return;
    }

    state.hubModalOpen = false;
    state.hubModalGameId = null;
    renderHubModal();
    queueMicrotask(() => {
      if (lastHubModalTrigger instanceof HTMLElement && lastHubModalTrigger.isConnected) {
        lastHubModalTrigger.focus();
      }
      lastHubModalTrigger = null;
    });
  }

  function openRulesModal(gameId, trigger = null) {
    if (!rulesContent[gameId]) {
      return;
    }

    lastRulesModalTrigger =
      trigger instanceof HTMLElement ? trigger : document.activeElement;
    state.rulesModalGameId = gameId;
    state.rulesModalOpen = true;
    renderRules();
  }

  function closeRulesModal({ restoreFocus = true } = {}) {
    if (!state.rulesModalOpen) {
      lastRulesModalTrigger = restoreFocus ? lastRulesModalTrigger : null;
      return;
    }

    state.rulesModalOpen = false;
    state.rulesModalGameId = null;
    renderRules();

    if (!restoreFocus) {
      lastRulesModalTrigger = null;
      return;
    }

    queueMicrotask(() => {
      if (
        lastRulesModalTrigger instanceof HTMLElement &&
        lastRulesModalTrigger.isConnected
      ) {
        lastRulesModalTrigger.focus();
      }
      lastRulesModalTrigger = null;
    });
  }

  function startSelectedGame() {
    const game = getGame(state.hubModalGameId);

    if (!game) {
      closeHubModal();
      return;
    }

    closeHubModal();
    openGame(game.openScreen);
  }

  function handleKeydown(event) {
    if (state.rulesModalOpen) {
      if (event.key === "Escape") {
        closeRulesModal();
        return;
      }
      trapFocus(event, [elements.rules.close, elements.rules.confirm]);
      return;
    }

    if (!state.hubModalOpen) {
      return;
    }

    if (event.key === "Escape") {
      closeHubModal();
      return;
    }
    trapFocus(event, [elements.hub.modalClose, elements.hub.modalStart]);
  }

  function bind() {
    elements.hub.grid.addEventListener("click", (event) => {
      const card = event.target.closest(".hub-card[data-game-id]");
      if (card) {
        openHubModal(
          card.dataset.gameId,
          event.target.closest(".hub-card-action") ??
            card.querySelector(".hub-card-action"),
        );
      }
    });
    hoverMediaQuery.addEventListener("change", (event) => {
      if (!event.matches) {
        stopVideos();
      }
    });
    elements.hub.modal.addEventListener("click", (event) => {
      if (event.target === elements.hub.modal) {
        closeHubModal();
      }
    });
    elements.hub.modalClose.addEventListener("click", closeHubModal);
    elements.hub.modalStart.addEventListener("click", startSelectedGame);
    elements.rules.buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        openRulesModal(button.dataset.rulesGame, event.currentTarget);
      });
    });
    elements.rules.modal.addEventListener("click", (event) => {
      if (event.target === elements.rules.modal) {
        closeRulesModal();
      }
    });
    elements.rules.close.addEventListener("click", () => closeRulesModal());
    elements.rules.confirm.addEventListener("click", () => closeRulesModal());
    document.addEventListener("keydown", handleKeydown);
  }

  function initialize() {
    preloadImages();
    renderCards();
    renderHubModal();
    renderRules();
  }

  return {
    bind,
    closeHubModal,
    closeRulesModal,
    initialize,
    refreshRules: renderRules,
    stopVideos,
  };
}
