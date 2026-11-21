import Phaser from "phaser";
import { HEIGHT, WIDTH } from "../actors.ts";
import { fadeOut } from "./boot.ts";
import { Backdrop } from "./backdrop.ts";
import type { Hud } from "../hud.ts";
import type { LaunchOptions } from "../main.ts";
import { sectors } from "../route.ts";

/** Seconds of idling before the title hands the ship to the autopilot. */
const IDLE_SECONDS = 8;

export class TitleScene extends Phaser.Scene {
  private idle = 0;
  private countdown!: Phaser.GameObjects.Text;
  leaving = false;
  private backdrop!: Backdrop;

  constructor(
    private readonly hud: Hud,
    private readonly options: LaunchOptions,
  ) {
    super("title");
  }
  init(): void {
    this.hud.setMode("title");
    this.leaving = false;

    this.idle = 0;
  }
  create() {
    this.backdrop = new Backdrop(this);
    this.input.keyboard?.on("keydown-SPACE", () => this.onSpace());

    const route = sectors.map((sector) => sector.name);
    route.push("The Warden");
    this.hud.setRoute(route);
    this.hud.setSector(-1);
    this.hud.setBoss(null);
    this.hud.say("");

    const title = this.add.text(WIDTH / 2, HEIGHT * 0.34, "NEON\nWARDEN", {
      fontFamily: "Orbitron, Trebuchet MS, sans-serif",
      fontSize: "64px",
      fontStyle: "bold",
      align: "center",
      color: "#e8fdff",
    }).setOrigin(0.5).setLineSpacing(-6);
    title.enableFilters();
    title.filters?.internal.addGlow(0x5ef2ff, 6, 0, 1);
    this.tweens.add({
      targets: title,
      scale: 1.04,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    this.add.text(WIDTH / 2, HEIGHT * 0.62, "SPACE  launch", {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#ffe066",
    }).setOrigin(0.5);
    this.countdown = this.add.text(WIDTH / 2, HEIGHT * 0.68, "", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#8aa4c8",
    }).setOrigin(0.5);
  }

  onSpace(): void {
    fadeOut(this, "play", {
      control: "keyboard",
    });
  }

  override update(_time: number, delta: number): void {
    this.backdrop.scroll(delta);
    if (this.leaving) return;
    this.idle += delta / 1000;
    const left = Math.ceil(IDLE_SECONDS - this.idle);
    this.countdown.setText(`self-play demo in ${left}`);
    if (left <= 0) {
      fadeOut(this, "play", {
        control: "auto",
      });
    }
    if (this.options.attract) {
      fadeOut(this, "play", {
        control: "auto",
      });
    }
  }
}
