import {
  heroContent,
  hubGames,
  mimicaPools,
  whoAmIPools,
  wordPools,
} from "./data/catalogs.js";
import { rulesContent } from "./data/tutorials.js";
import { hydrateCatalogFromApi } from "./data/remote-catalog.js?v=41";
import { createInitialState } from "./state.js";
import { getElements } from "./views/elements.js?v=41";
import { createCityController } from "./games/city.js";
import { createImpostorController } from "./games/impostor.js?v=41";
import { createMimicaController } from "./games/mimica.js";
import { createPoliceController } from "./games/police.js";
import { createWhoAmIController } from "./games/whoami.js";
import { createHubController } from "./hub.js";
import { createRoleFlow } from "./role-flow.js?v=41";

document.documentElement.dataset.catalogSource = "local";
const catalogRuntimePromise = hydrateCatalogFromApi();

const state = createInitialState();
const APP_VERSION = "v41";

const elements = getElements();

function setHero(content) {
  elements.heroEyebrow.textContent = content.eyebrow;
  elements.heroTitle.textContent = content.title;
  elements.heroCopy.textContent = content.copy;
}

function openGameFromHubScreen(screen) {
  const controller = gameControllersByScreen.get(screen);

  if (controller) {
    controller.openSetup();
  }
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
  state.currentScreen = screen;
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
    pools: wordPools,
    startRoleGame: roleFlow.startGame,
  }),
  createPoliceController({
    elements: elements.police,
    openHub: roleFlow.openHub,
    openRoleSetup: roleFlow.openSetup,
    startRoleGame: roleFlow.startGame,
  }),
  createCityController({
    elements: elements.city,
    openHub: roleFlow.openHub,
    openRoleSetup: roleFlow.openSetup,
    startRoleGame: roleFlow.startGame,
  }),
  createMimicaController({
    elements: elements.mimica,
    enterFullscreen: enterMimicaFullscreen,
    openHub: roleFlow.openHub,
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
const hubController = createHubController({
  elements,
  games: hubGames,
  openGame: openGameFromHubScreen,
  rulesContent,
  state,
});

gameControllers.forEach((controller) => {
  controller.bind();
  controller.initialize();
});

elements.navHome.addEventListener("click", roleFlow.openHub);
roleFlow.bind();

renderAppVersion();
hubController.bind();
hubController.initialize();
setActiveScreen("hub");

void catalogRuntimePromise.then((catalogRuntime) => {
  document.documentElement.dataset.catalogSource = catalogRuntime.source;
  hubController.refreshRules();
  gameControllers.forEach((controller) => controller.initialize());
});
