import { Scene } from "phaser";

export class Boot extends Scene {
    // private player: Phaser.Physics.Arcade.Image; // Explicit type for player

    // private cursor: Phaser.Types.Input.Keyboard.CursorKeys; // Correct type for cursor keys

    // private playerSpeed = 350; // Assign a value instead of using it as a type

    constructor() {
        super("Boot");
    }

    preload() {
        // Load assets
        // this.load.image("bg", "assets/game/bg.png");
        // this.load.image("basket", "assets/game/basket.png");
    }

    create() {
        // Add background
        this.scene.start("Preloader");
        // this.add.image(0, 0, "bg").setOrigin(0, 0);

        // // Add basket with physics enabled
        // this.player = this.physics.add
        //     .image(0, 400, "basket")
        //     .setOrigin(0, 0) as Phaser.Physics.Arcade.Image;

        // // Make the basket immovable and disable gravity
        // this.player.setImmovable(true);
        // this.player.body.allowGravity = false;
        // this.player.setCollideWorldBounds(true); // Prevent the player from going out of bounds

        // // Capture keyboard input (cursor keys)
        // this.cursor = this.input.keyboard?.createCursorKeys();

        // Ensure the canvas captures input focus (important in Next.js/React environment)
    }

    // update() {
    //     const { left, right } = this.cursor;

    //     if (left?.isDown) {
    //         this.player.setVelocityX(-this.playerSpeed); // Move left
    //     } else if (right?.isDown) {
    //         this.player.setVelocityX(this.playerSpeed); // Move right
    //     } else {
    //         this.player.setVelocityX(0); // Stop movement
    //     }
    // }
}
