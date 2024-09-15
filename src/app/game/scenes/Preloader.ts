import { Scene } from "phaser";

export class Preloader extends Scene {
    private player: Phaser.Physics.Arcade.Image; // Explicit type for player

    private cursor: Phaser.Types.Input.Keyboard.CursorKeys; // Correct type for cursor keys

    private playerSpeed = 350; // Assign a value instead of using it as a type

    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets/game");

        this.load.image("logo", "logo.png");
        this.load.image("star", "star.png");

        this.load.image("bg", "bg.png");
        this.load.image("basket", "basket.png");
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.

        // Add basket with physics enabled
        this.player = this.physics.add
            .image(0, 400, "basket")
            .setOrigin(0, 0) as Phaser.Physics.Arcade.Image;

        // Make the basket immovable and disable gravity
        this.player.setImmovable(true);
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true); // Prevent the player from going out of bounds

        // Capture keyboard input (cursor keys)
        this.cursor = this.input.keyboard?.createCursorKeys();

        this.scene.start("MainMenu");
    }
    update() {
        const { left, right } = this.cursor;
        if (left?.isDown) {
            this.player.setVelocityX(-this.playerSpeed); // Move left
        } else if (right?.isDown) {
            this.player.setVelocityX(this.playerSpeed); // Move right
        } else {
            this.player.setVelocityX(0); // Stop movement
        }
    }
}
