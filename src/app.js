import {
  heroContent,
  hubGames,
  mimicaPools,
  whoAmIPools,
  wordPools,
} from "./data/catalogs.js?v=43";
import { rulesContent } from "./data/tutorials.js?v=43";
import { hydrateCatalogFromApi } from "./data/remote-catalog.js?v=41";
import { createInitialState } from "./state.js?v=45";
import { getElements } from "./views/elements.js?v=50";
import { createIntroController } from "./intro.js?v=3";
import { createCityController } from "./games/city.js?v=45";
import { createImpostorController } from "./games/impostor.js?v=48";
import { createMimicaController } from "./games/mimica.js?v=45";
import { createPoliceController } from "./games/police.js?v=45";
import { createWhoAmIController } from "./games/whoami.js?v=45";
import { createHubController } from "./hub.js";
import {
  createGameEntryCoordinator,
  createPartyFlow,
  formatPartyNames,
  shouldConfirmPartyEdit,
} from "./party-flow.js?v=47";
import { createRoleFlow } from "./role-flow.js?v=48";
import { animateElement } from "./motion.js";
import { track } from "./analytics.js?v=1";
import { initAds } from "./ads.js?v=1";

document.documentElement.dataset.catalogSource = "local";
const catalogRuntimePromise = hydrateCatalogFromApi();

const state = createInitialState();
const APP_VERSION = "v48";

const elements = getElements();
let gameEntryCoordinator = null;

function renderPartySummaries() {
  const party = state.partySession.getParty();
  const players = party?.players ?? [];
  const countLabel = `${players.length} ${
    players.length === 1 ? "jogador" : "jogadores"
  }`;
  const names = formatPartyNames(players);

  elements.party.summaries.forEach((summary) => {
    summary.querySelector("[data-party-count]").textContent = countLabel;
    summary.querySelector("[data-party-names]").textContent = names;
  });
}

function setHero(content) {
  elements.heroEyebrow.textContent = content.eyebrow;
  elements.heroTitle.textContent = content.title;
  elements.heroCopy.textContent = content.copy;
}

function openGameFromHubScreen(screen) {
  const controller = gameControllersByScreen.get(screen);

  if (controller) {
    gameEntryCoordinator.selectGame({
      minimumPlayers: controller.minimumPlayers,
      screen,
    });
  }
}

function openGameDirect(screen) {
  const controller = gameControllersByScreen.get(screen);

  if (!controller) {
    return false;
  }

  renderPartySummaries();
  controller.openSetup();
  return true;
}

function getFullscreenElement() {
  return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
}

async function enterFullscreenFor(target) {

  if (getFullscreenElement() === target || getFullscreenElement()) {
    return;
  }

  try {
    if (target.requestFullscreen) {
      await target.requestFullscreen();
      return;
    }

    if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    }
  } catch {}
}

async function enterWhoAmIFullscreen() {
  await enterFullscreenFor(elements.screens.whoamiReveal);
}

async function enterMimicaFullscreen() {
  await enterFullscreenFor(elements.screens.mimicaPlay);
}

async function exitFullscreenIfNeeded() {
  try {
    if (document.exitFullscreen && document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    }
  } catch {}
}

function setActiveScreen(screen) {
  const previousScreen = state.currentScreen;
  state.currentScreen = screen;
  elements.navHome.setAttribute(
    "aria-label",
    screen === "hub" ? "Voltar para a sala" : "Voltar para a home",
  );
  document.body.classList.toggle("is-whoami-reveal", screen === "whoamiReveal");
  document.body.classList.toggle("is-mimica-play", screen === "mimicaPlay");

  if (screen !== "hub") {
    hubController.stopVideos();
  }

  if (
    !["impostorSetup", "policeSetup", "citySetup", "whoamiSetup", "mimicaSetup"].includes(
      screen,
    ) &&
    state.rulesModalOpen
  ) {
    hubController.closeRulesModal({ restoreFocus: false });
  }

  if (screen !== "hub") {
    hubController.closeHubModal();
  }

  Object.entries(elements.screens).forEach(([key, element]) => {
    element.classList.toggle("is-active", key === screen);
  });

  if (previousScreen !== screen) {
    track("screen_viewed", {
      screen,
      players: state.partySession.getPlayerCount(),
    });
    void animateElement(
      elements.screens[screen],
      [
        { transform: "translateY(7px)" },
        { transform: "translateY(0)" },
      ],
      { duration: 180 },
    );
  }

  if (screen !== "whoamiReveal" && screen !== "mimicaPlay") {
    exitFullscreenIfNeeded();
  }

  if (screen === "hub") {
    setHero(heroContent.hub);
    return;
  }

  if (screen === "impostorSetup") {
    setHero(heroContent.impostorSetup);
    return;
  }

  if (screen === "policeSetup") {
    setHero(heroContent.policeSetup);
    return;
  }

  if (screen === "citySetup") {
    setHero(heroContent.citySetup);
    return;
  }

  if (screen === "mimicaSetup" || screen === "mimicaPrep") {
    setHero(heroContent.mimicaSetup);
    return;
  }

  if (screen === "whoamiSetup") {
    setHero(heroContent.whoamiSetup);
  }
}

function renderAppVersion() {
  elements.appVersion.textContent = APP_VERSION;
}

function showHub() {
  hubController.closeHubModal();
  gameControllers.forEach((controller) => controller.cleanup?.());
  setActiveScreen("hub");
}

function openGameSetup(gameId, { playAgain = false } = {}) {
  const controller = gameControllersById.get(gameId);
  if (!controller) {
    return false;
  }

  if (state.partySession.getPlayerCount() < controller.minimumPlayers) {
    gameEntryCoordinator.selectGame({
      minimumPlayers: controller.minimumPlayers,
      screen: controller.setupScreen,
    });
    return true;
  }

  renderPartySummaries();
  if (playAgain && typeof controller.playAgain === "function") {
    controller.playAgain();
  } else {
    controller.openSetup();
  }
  return true;
}

const roleFlow = createRoleFlow({
  elements,
  onOpenHub: showHub,
  openGameSetup,
  setHero,
  showScreen: setActiveScreen,
  state,
});

const gameControllers = [
  createImpostorController({
    elements: elements.impostor,
    openHub: roleFlow.openHub,
    openRoleSetup: roleFlow.openSetup,
    partySession: state.partySession,
    pools: wordPools,
    startRoleGame: roleFlow.startGame,
  }),
  createPoliceController({
    elements: elements.police,
    openHub: roleFlow.openHub,
    openRoleSetup: roleFlow.openSetup,
    partySession: state.partySession,
    startRoleGame: roleFlow.startGame,
  }),
  createCityController({
    elements: elements.city,
    openHub: roleFlow.openHub,
    openRoleSetup: roleFlow.openSetup,
    partySession: state.partySession,
    startRoleGame: roleFlow.startGame,
  }),
  createMimicaController({
    elements: elements.mimica,
    enterFullscreen: enterMimicaFullscreen,
    openHub: roleFlow.openHub,
    partySession: state.partySession,
    pools: mimicaPools,
    showScreen: setActiveScreen,
    state,
  }),
  createWhoAmIController({
    elements: elements.whoami,
    enterFullscreen: enterWhoAmIFullscreen,
    openHub: roleFlow.openHub,
    pools: whoAmIPools,
    showScreen: setActiveScreen,
    state,
  }),
];
const gameControllersById = new Map(
  gameControllers.map((controller) => [controller.id, controller]),
);
const gameControllersByScreen = new Map(
  gameControllers.map((controller) => [controller.setupScreen, controller]),
);
const partyFlow = createPartyFlow({
  elements: elements.party,
  onCancel: () => {
    const cancelledGame = gameEntryCoordinator.cancel();

    if (cancelledGame?.editing) {
      openGameDirect(cancelledGame.screen);
      return;
    }

    showHub();
  },
  onChange: renderPartySummaries,
  onContinue: () => gameEntryCoordinator.resumeGame(),
  partySession: state.partySession,
  setHero,
  showScreen: setActiveScreen,
});
gameEntryCoordinator = createGameEntryCoordinator({
  getPlayerCount: () => state.partySession.getPlayerCount(),
  openGame: openGameDirect,
  openParty: partyFlow.open,
});
const hubController = createHubController({
  elements,
  games: hubGames,
  openGame: openGameFromHubScreen,
  rulesContent,
  state,
});
const introController = createIntroController({ elements });

gameControllers.forEach((controller) => {
  controller.bind();
  controller.initialize();
});

elements.party.editButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const screen = button.closest("[data-party-screen]")?.dataset.partyScreen;
    const controller = gameControllersByScreen.get(screen);

    if (controller) {
      gameEntryCoordinator.editGame({
        minimumPlayers: controller.minimumPlayers,
        screen,
      });
    }
  });
});

function editPartyDuringRound() {
  if (!state.currentGame || !shouldConfirmPartyEdit(state.currentScreen)) {
    return;
  }

  elements.party.editDialog.showModal();
  void animateElement(
    elements.party.editDialog.querySelector(".result-confirm-content"),
    [
      { transform: "translateY(6px)" },
      { transform: "translateY(0)" },
    ],
    { duration: 170 },
  );
}

function discardRoundAndEditParty() {
  elements.party.editDialog.close();

  const screen = state.currentGame.setupScreen;
  const controller = gameControllersByScreen.get(screen);

  if (!controller) {
    return;
  }

  roleFlow.openSetup(screen);
  gameEntryCoordinator.editGame({
    minimumPlayers: controller.minimumPlayers,
    screen,
  });
}

elements.party.editDuringTurn.addEventListener("click", editPartyDuringRound);
elements.party.editDuringEnd.addEventListener("click", editPartyDuringRound);
elements.party.cancelEdit.addEventListener("click", () => {
  elements.party.editDialog.close();
});
elements.party.confirmEdit.addEventListener("click", discardRoundAndEditParty);

elements.navHome.addEventListener("click", () => {
  if (state.currentScreen === "hub" && !introController.isVisible()) {
    introController.returnToIntro();
    return;
  }

  roleFlow.openHub();
});
partyFlow.bind();
roleFlow.bind();
introController.bind();

renderAppVersion();
renderPartySummaries();
hubController.bind();
hubController.initialize();
setActiveScreen("hub");
introController.initialize();

track("app_loaded", { version: APP_VERSION });
initAds();

void catalogRuntimePromise.then((catalogRuntime) => {
  document.documentElement.dataset.catalogSource = catalogRuntime.source;
  hubController.refreshRules();
  gameControllers.forEach((controller) => controller.initialize());
  track("catalog_ready", { source: catalogRuntime.source });
});
