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
      width: "100%",
      height: "100%",
      classes: ["stinger-transition"]
    });
  }

  getData() {
    return { image: this.image };
  }

  activateListeners(html) {
    setTimeout(() => this.close(), this.duration);
  }
}

// Setup API and UI buttons
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

// Add "Copy Scene ID" button to top bar
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
