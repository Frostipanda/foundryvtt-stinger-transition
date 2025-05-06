class StingerTransition extends Application {
  constructor(duration = 3000, image = "modules/stinger-transition/media/stinger.mp4") {
    super();
    this.duration = duration;
    this.image = image;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "stinger-transition",
      template: "modules/stinger-transition/templates/stinger.html",
      popOut: false,
      width: 100,
      height: 100,
      resizable: false,
      minimizable: false,
      classes: ["stinger-transition"]
    });
  }

  getData() {
    return { image: this.image };
  }

  activateListeners(html) {
    const overlay = html[0].querySelector(".stinger-overlay");
    if (!overlay) return;

    // Inject into visible DOM
    document.body.appendChild(overlay);

    // Trigger fade-in
    void overlay.offsetWidth;
    overlay.classList.add("visible");

    // Start fade-out just before the end
    setTimeout(() => {
      overlay.classList.remove("visible");
    }, this.duration - 500); // Adjust if you change fade duration

    // Clean up and close
    setTimeout(() => {
      overlay.remove();
      this.close();
    }, this.duration);
  }
}

// Setup API
Hooks.once('init', () => {
  console.log("Stinger Transition | Initialized");

  game.modules.get("stinger-transition").api = {
    playStinger: async (sceneId, videoPath = "modules/stinger-transition/media/stinger.mp4", duration = 3000) => {
      const transition = new StingerTransition(duration, videoPath);
      await transition.render(true);

      setTimeout(() => {
        const targetScene = game.scenes.get(sceneId);
        if (targetScene) targetScene.view();
      }, duration);
    }
  };
});

// Add "Copy Scene ID" button to the scene navigation bar
Hooks.on("renderSceneNavigation", (app, html, data) => {
  const btn = $(`<button class="scene-id-copy" title="Copy Current Scene ID">
    <i class="fas fa-clipboard"></i> ID
  </button>`);

  btn.on("click", () => {
    const sceneId = game.scenes.viewed?.id || "Unknown";
    navigator.clipboard.writeText(sceneId).then(() => {
      ui.notifications.info(`Scene ID copied: ${sceneId}`);
    }).catch(err => {
      ui.notifications.error("Failed to copy scene ID.");
      console.error(err);
    });
  });

  html.find(".scene-control").last().after(btn);
});
