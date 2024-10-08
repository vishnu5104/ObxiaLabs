import Phaser from "phaser";

class MenuScene extends Phaser.Scene {
    private playButton: Phaser.GameObjects.Text;
    private marketplace: Phaser.GameObjects.Text;
    constructor() {
        super("MenuScene");
    }

    create() {
        // Add a background or other visuals
        this.add.image(0, 0, "sky").setOrigin(0, 0);

        // Add a title
        this.add
            .text(400, 200, "My Phaser Game", {
                fontSize: "48px",
                fill: "#ffffff",
            })
            .setOrigin(0.5);

        // Add a Play button
        this.playButton = this.add
            .text(400, 400, "Play", {
                fontSize: "32px",
                fill: "#ffffff",
            })
            .setOrigin(0.5)
            .setInteractive();

        this.marketplace = this.add
            .text(400, 500, "Marketplace", {
                fontSize: "32px",
                fill: "#ffffff",
            })
            .setOrigin(0.5)
            .setInteractive();

        // When "Play" button is clicked, switch to the PlayScene
        this.playButton.on("pointerdown", () => {
            this.scene.start("PlayScene");
        });

        this.marketplace.on("pointerdown", () => {
            this.scene.start("Marketplace");
        });
    }
}

export default MenuScene;
