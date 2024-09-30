import { Scene } from "phaser";

export class Preloader extends Scene {
  private player: Phaser.Physics.Arcade.Image;
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerSpeed = 350;

  constructor() {
    super("Preloader");
  }

  init() {
    this.add.image(512, 384, "background");
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
    this.load.on("progress", (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets/game");
    this.load.image("logo", "logo.png");
    this.load.image("star", "star.png");
    this.load.image("bg", "bg.png");
    this.load.image("basket", "basket.png");
  }

  create() {
    this.player = this.physics.add
      .image(0, 400, "basket")
      .setOrigin(0, 0) as Phaser.Physics.Arcade.Image;

    this.player.setImmovable(true);

    if (this.player.body) {
      this.player.setGravity(0, 0);
    }

    this.player.setCollideWorldBounds(true);

    if (this.input.keyboard) {
      this.cursor = this.input.keyboard.createCursorKeys();
    }

    this.scene.start("MainMenu");
  }

  update() {
    const { left, right } = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }
}
