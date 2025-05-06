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
