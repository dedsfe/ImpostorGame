const THREE_MODULE_URL = "../assets/vendor/three/three.module.min.js";
const GLTF_LOADER_URL = "../assets/vendor/three/addons/loaders/GLTFLoader.js";
const CLIPBOARD_MODEL_URL = "../assets/setup/clipboard.glb";
const CLIPBOARD_TABLE_SCALE = 2.7;
const CLIPBOARD_SHADOW_OPACITY = 0.34;

function canUseWebGL() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (probe.getContext("webgl2") || probe.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export function createClipboardScene({
  backgroundContent,
  canvas,
  closeButton,
  fallback,
  interfaceLayer,
  onClose,
  onHide,
  root,
  stage,
  status,
}) {
  let camera = null;
  let renderer = null;
  let scene = null;
  let resizeObserver = null;
  let initializationPromise = null;
  let initializationFailed = false;
  let lastFocusedElement = null;
  let clipboardPlacement = null;
  let shadowMaterial = null;
  let raycaster = null;
  let pointer = null;
  let pullAnimationFrame = null;
  let pullFallbackTimer = null;
  let isPulled = false;
  let isTransitioning = false;

  function render() {
    if (renderer && scene && camera && !root.hidden) {
      renderer.render(scene, camera);
    }
  }

  function hideInterface() {
    interfaceLayer.hidden = true;
    interfaceLayer.inert = true;
  }

  function showInterface() {
    interfaceLayer.hidden = false;
    interfaceLayer.inert = false;
  }

  function resetClipboard() {
    if (pullAnimationFrame) {
      cancelAnimationFrame(pullAnimationFrame);
      pullAnimationFrame = null;
    }

    if (pullFallbackTimer) {
      clearTimeout(pullFallbackTimer);
      pullFallbackTimer = null;
    }

    isPulled = false;
    isTransitioning = false;
    root.classList.remove("is-pulling-clipboard", "is-clipboard-focused");
    hideInterface();
    canvas.classList.remove("is-over-clipboard", "is-outside-clipboard");
    canvas.setAttribute("aria-disabled", "false");
    canvas.setAttribute(
      "aria-label",
      "Puxar a prancheta da mesa para o centro da tela",
    );
    canvas.tabIndex = 0;

    if (clipboardPlacement) {
      clipboardPlacement.position.set(0, 0, 0);
      clipboardPlacement.rotation.set(0, -0.09, 0);
      clipboardPlacement.scale.setScalar(CLIPBOARD_TABLE_SCALE);
    }

    if (shadowMaterial) {
      shadowMaterial.opacity = CLIPBOARD_SHADOW_OPACITY;
    }

    render();
  }

  function isClipboardHit(event) {
    if (!clipboardPlacement || !raycaster || !pointer || !camera) {
      return false;
    }

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return false;
    }

    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(clipboardPlacement, true).length > 0;
  }

  function pullClipboard() {
    if (isPulled || isTransitioning || !clipboardPlacement) {
      return;
    }

    isPulled = true;
    isTransitioning = true;
    root.classList.add("is-pulling-clipboard");
    canvas.classList.remove("is-over-clipboard", "is-outside-clipboard");
    canvas.setAttribute(
      "aria-label",
      "Prancheta ampliada. Clique fora dela para devolver à mesa",
    );

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 140 : 1120;
    const portrait = window.innerWidth < window.innerHeight;
    const targetScale = portrait ? 2.84 : 3.3;
    const targetY = portrait ? 0.28 : 0.32;
    const targetZ = portrait ? 0.1 : 0.16;
    const targetTilt = portrait ? 0.57 : 0.6;
    let startedAt = null;

    function finishPull() {
      if (!isPulled || root.hidden) {
        return;
      }

      clipboardPlacement.position.set(0, targetY, targetZ);
      clipboardPlacement.rotation.set(targetTilt, 0, 0);
      clipboardPlacement.scale.setScalar(targetScale);
      if (shadowMaterial) {
        shadowMaterial.opacity = 0;
      }
      root.classList.add("is-clipboard-focused");
      isTransitioning = false;
      pullAnimationFrame = null;
      if (pullFallbackTimer) {
        clearTimeout(pullFallbackTimer);
        pullFallbackTimer = null;
      }
      showInterface();
      render();
      root.dispatchEvent(new CustomEvent("clipboardfocused"));
    }

    function animate(timestamp) {
      startedAt ??= timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / duration);

      if (progress < 0.16) {
        const grip = progress / 0.16;
        const gripEase = 1 - Math.pow(1 - grip, 2);
        clipboardPlacement.scale.setScalar(
          CLIPBOARD_TABLE_SCALE - 0.1 * gripEase,
        );
        clipboardPlacement.position.set(-0.045 * gripEase, 0.025 * gripEase, 0);
        clipboardPlacement.rotation.set(0, -0.09, -0.026 * gripEase);
      } else {
        const pull = (progress - 0.16) / 0.84;
        const pullEase = 1 - Math.pow(1 - pull, 3);
        const handWobble = Math.sin(pull * Math.PI * 2) * (1 - pull);
        const scaleOvershoot = Math.sin(pull * Math.PI) * 0.055;

        clipboardPlacement.scale.setScalar(
          2.6 + (targetScale - 2.6) * pullEase + scaleOvershoot,
        );
        clipboardPlacement.position.set(
          -0.045 * (1 - pullEase) + handWobble * 0.026,
          0.025 + (targetY - 0.025) * pullEase,
          targetZ * pullEase,
        );
        clipboardPlacement.rotation.set(
          targetTilt * pullEase,
          -0.09 * (1 - pullEase),
          -0.026 * (1 - pullEase) + handWobble * 0.018,
        );

        if (shadowMaterial) {
          shadowMaterial.opacity =
            CLIPBOARD_SHADOW_OPACITY * Math.pow(1 - pullEase, 1.6);
        }
      }

      render();

      if (progress < 1) {
        pullAnimationFrame = requestAnimationFrame(animate);
        return;
      }

      finishPull();
    }

    pullFallbackTimer = setTimeout(finishPull, duration + 220);
    pullAnimationFrame = requestAnimationFrame(animate);
  }

  function lowerClipboard() {
    if (!isPulled || isTransitioning || !clipboardPlacement) {
      return;
    }

    isTransitioning = true;
    root.classList.remove("is-pulling-clipboard", "is-clipboard-focused");
    hideInterface();
    canvas.classList.remove("is-outside-clipboard");
    canvas.setAttribute("aria-label", "Prancheta retornando à mesa");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 140 : 1120;
    const startScale = clipboardPlacement.scale.x;
    const startPosition = {
      x: clipboardPlacement.position.x,
      y: clipboardPlacement.position.y,
      z: clipboardPlacement.position.z,
    };
    const startRotation = {
      x: clipboardPlacement.rotation.x,
      y: clipboardPlacement.rotation.y,
      z: clipboardPlacement.rotation.z,
    };
    let startedAt = null;

    function finishLower() {
      if (!isPulled || root.hidden) {
        return;
      }

      clipboardPlacement.position.set(0, 0, 0);
      clipboardPlacement.rotation.set(0, -0.09, 0);
      clipboardPlacement.scale.setScalar(CLIPBOARD_TABLE_SCALE);
      if (shadowMaterial) {
        shadowMaterial.opacity = CLIPBOARD_SHADOW_OPACITY;
      }

      isPulled = false;
      isTransitioning = false;
      pullAnimationFrame = null;
      if (pullFallbackTimer) {
        clearTimeout(pullFallbackTimer);
        pullFallbackTimer = null;
      }
      canvas.setAttribute(
        "aria-label",
        "Puxar a prancheta da mesa para o centro da tela",
      );
      render();
      root.dispatchEvent(new CustomEvent("clipboardreturned"));
    }

    function animate(timestamp) {
      startedAt ??= timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const handWobble = Math.sin(progress * Math.PI * 1.5) * (1 - progress);
      const scaleSettle = Math.sin(progress * Math.PI) * 0.035;

      clipboardPlacement.scale.setScalar(
        startScale + (CLIPBOARD_TABLE_SCALE - startScale) * ease - scaleSettle,
      );
      clipboardPlacement.position.set(
        startPosition.x * (1 - ease) + handWobble * 0.018,
        startPosition.y * (1 - ease),
        startPosition.z * (1 - ease),
      );
      clipboardPlacement.rotation.set(
        startRotation.x * (1 - ease),
        startRotation.y + (-0.09 - startRotation.y) * ease,
        startRotation.z * (1 - ease) + handWobble * 0.012,
      );

      if (shadowMaterial) {
        shadowMaterial.opacity = CLIPBOARD_SHADOW_OPACITY * Math.pow(ease, 1.5);
      }

      render();

      if (progress < 1) {
        pullAnimationFrame = requestAnimationFrame(animate);
        return;
      }

      finishLower();
    }

    pullFallbackTimer = setTimeout(finishLower, duration + 220);
    pullAnimationFrame = requestAnimationFrame(animate);
  }

  function handlePointerMove(event) {
    if (isTransitioning) {
      canvas.classList.remove("is-over-clipboard", "is-outside-clipboard");
      return;
    }

    if (isPulled) {
      canvas.classList.toggle("is-outside-clipboard", !isClipboardHit(event));
      return;
    }

    canvas.classList.toggle("is-over-clipboard", isClipboardHit(event));
  }

  function handleCanvasClick(event) {
    if (isTransitioning) {
      return;
    }

    const didHitClipboard = isClipboardHit(event);
    if (!isPulled && didHitClipboard) {
      pullClipboard();
      return;
    }

    if (isPulled && !didHitClipboard) {
      lowerClipboard();
    }
  }

  function handleCanvasKeydown(event) {
    if ((event.key === "Enter" || event.key === " ") && !isTransitioning) {
      event.preventDefault();
      if (isPulled) {
        lowerClipboard();
      } else {
        pullClipboard();
      }
    }
  }

  function resize() {
    if (!renderer || !camera || root.hidden) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const isCompact = window.matchMedia("(pointer: coarse)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isCompact ? 1 : 1.75);
    const width = Math.max(1, Math.floor(rect.width * pixelRatio));
    const height = Math.max(1, Math.floor(rect.height * pixelRatio));

    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(width, height, false);
    }

    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    render();
  }

  function showFallback() {
    initializationFailed = true;
    status.hidden = true;
    fallback.hidden = false;
    canvas.hidden = true;
  }

  async function initialize() {
    if (!canUseWebGL()) {
      showFallback();
      return;
    }

    try {
      const [THREE, loaderModule] = await Promise.all([
        import(THREE_MODULE_URL),
        import(GLTF_LOADER_URL),
      ]);
      const { GLTFLoader } = loaderModule;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !window.matchMedia("(pointer: coarse)").matches,
        canvas,
        premultipliedAlpha: true,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.82;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
      camera.position.set(0.08, 3.35, 4.5);
      camera.lookAt(0, 0.12, 0.06);

      const roomLight = new THREE.HemisphereLight(0xffd19a, 0x241108, 1.55);
      scene.add(roomLight);

      const lampLight = new THREE.DirectionalLight(0xffa34d, 3.15);
      lampLight.position.set(-4.5, 6.2, 2.4);
      lampLight.castShadow = true;
      lampLight.shadow.mapSize.set(1024, 1024);
      lampLight.shadow.camera.left = -3;
      lampLight.shadow.camera.right = 3;
      lampLight.shadow.camera.top = 3;
      lampLight.shadow.camera.bottom = -3;
      lampLight.shadow.camera.near = 0.1;
      lampLight.shadow.camera.far = 14;
      lampLight.shadow.bias = -0.00015;
      lampLight.shadow.normalBias = 0.018;
      scene.add(lampLight);

      shadowMaterial = new THREE.ShadowMaterial({
        color: 0x160a03,
        opacity: CLIPBOARD_SHADOW_OPACITY,
      });
      const shadowCatcher = new THREE.Mesh(
        new THREE.PlaneGeometry(5.2, 5.2),
        shadowMaterial,
      );
      shadowCatcher.rotation.x = -Math.PI / 2;
      shadowCatcher.position.y = 0;
      shadowCatcher.receiveShadow = true;
      scene.add(shadowCatcher);

      const gltf = await new GLTFLoader().loadAsync(CLIPBOARD_MODEL_URL);
      const clipboard = gltf.scene;
      const originalBounds = new THREE.Box3().setFromObject(clipboard);
      const center = originalBounds.getCenter(new THREE.Vector3());

      clipboard.position.set(-center.x, -originalBounds.min.y + 0.012, -center.z);
      clipboard.traverse((object) => {
        if (!object.isMesh) {
          return;
        }

        object.castShadow = true;
        object.receiveShadow = true;
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          if (material?.map) {
            material.map.anisotropy = Math.min(
              8,
              renderer.capabilities.getMaxAnisotropy(),
            );
          }
          material.needsUpdate = true;
        });
      });

      clipboardPlacement = new THREE.Group();
      clipboardPlacement.scale.setScalar(CLIPBOARD_TABLE_SCALE);
      clipboardPlacement.rotation.y = -0.09;
      clipboardPlacement.add(clipboard);
      scene.add(clipboardPlacement);
      raycaster = new THREE.Raycaster();
      pointer = new THREE.Vector2();

      status.hidden = true;
      fallback.hidden = true;
      canvas.hidden = false;
      initializationFailed = false;
      root.classList.add("is-ready");
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
      resize();
    } catch (error) {
      console.error("Falha ao carregar a prancheta 3D.", error);
      showFallback();
    }
  }

  function open() {
    lastFocusedElement = document.activeElement;
    resetClipboard();
    root.hidden = false;
    root.inert = false;
    backgroundContent.setAttribute("inert", "");
    backgroundContent.setAttribute("aria-hidden", "true");
    document.body.classList.add("is-clipboard-scene");
    status.hidden = Boolean(clipboardPlacement) || initializationFailed;
    fallback.hidden = !initializationFailed;
    canvas.hidden = initializationFailed;
    closeButton.focus({ preventScroll: true });

    initializationPromise ??= initialize();
    requestAnimationFrame(resize);
  }

  function hideScene() {
    if (root.hidden) {
      return false;
    }

    root.hidden = true;
    root.inert = true;
    resetClipboard();
    backgroundContent.removeAttribute("inert");
    backgroundContent.removeAttribute("aria-hidden");
    document.body.classList.remove("is-clipboard-scene");
    onHide?.();
    return true;
  }

  function close() {
    if (!hideScene()) {
      return;
    }

    onClose?.();

    if (lastFocusedElement instanceof HTMLElement && lastFocusedElement.isConnected) {
      lastFocusedElement.focus({ preventScroll: true });
    }
  }

  function dismiss() {
    hideScene();
  }

  closeButton.addEventListener("click", close);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerleave", () => {
    canvas.classList.remove("is-over-clipboard", "is-outside-clipboard");
  });
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("keydown", handleCanvasKeydown);
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (isPulled && !isTransitioning) {
        lowerClipboard();
      } else if (!isTransitioning) {
        close();
      }
    }
  });

  return {
    close,
    dismiss,
    open,
    render,
  };
}
