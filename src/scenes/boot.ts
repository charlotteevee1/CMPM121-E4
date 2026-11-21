import Phaser from "phaser";
import { loadSounds } from "../sounds.ts";
import { makeTextures } from "../textures.ts";

export function fadeOut(
  scene: Phaser.Scene & { leaving: boolean },
  nextScene: string,
  data?: object,
) {
  if (scene.leaving) return;
  scene.leaving = true;
  scene.cameras.main.fadeOut(450, 4, 2, 12);
  scene.cameras.main.once("camerafadeoutcomplete", () => {
    scene.scene.start(nextScene, data);
  });
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }
  create() {
    // first run only: draw every texture and synthesize every sound
    if (!this.textures.exists("player")) {
      makeTextures(this);
      loadSounds(this);
    }
    this.scene.start("title");
  }
}
