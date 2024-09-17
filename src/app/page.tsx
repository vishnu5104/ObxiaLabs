import { MainMenu } from "./game/scenes/MainMenu";
import { useRef, useState } from "react";
export default function Home() {
  const [canMoveSprite, setCanMoveSprite] = useState(true);

  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

  const changeScene = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as MainMenu;

      if (scene) {
        scene.changeScene();
      }
    }
  };

  const moveSprite = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as MainMenu;

      if (scene && scene.scene.key === "MainMenu") {
        // Get the update logo position
        scene.moveLogo(({ x, y }) => {
          setSpritePosition({ x, y });
        });
      }
    }
  };

  const addSprite = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene;

      if (scene) {
        // Add new objects (basket, star, text) with random positions
        const x = Phaser.Math.Between(64, scene.scale.width - 64);
        const y = Phaser.Math.Between(64, scene.scale.height - 64);

        // Add the basket image and make it interactive for dragging
        const basket = scene.add.image(x, y, "basket").setInteractive();
        scene.input.setDraggable(basket);

        // Optional: Add other objects (star, text) as you wish
        const star = scene.add.sprite(x, y, "star").setInteractive();
        scene.input.setDraggable(star);

        const txt = scene.add.text(x, y, "hello").setInteractive();
        scene.input.setDraggable(txt);

        // Make the basket (or any object) draggable
        scene.input.on(
          "dragstart",
          (
            pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.Image
          ) => {
            gameObject.setTint(0xff0000); // Optional visual feedback when dragging starts
          }
        );

        scene.input.on(
          "drag",
          (
            pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.Image,
            dragX: number,
            dragY: number
          ) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
          }
        );

        scene.input.on(
          "dragend",
          (
            pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.Image
          ) => {
            gameObject.clearTint(); // Remove the tint when dragging ends
          }
        );
      }
    }
  };

  const currentScene = (scene: Phaser.Scene) => {
    setCanMoveSprite(scene.scene.key !== "MainMenu");
  };
  return (
    <div>
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
      <div>
        <div>
          <button className="button" onClick={changeScene}>
            Change Scene
          </button>
        </div>
        <div>
          <button
            disabled={canMoveSprite}
            className="button"
            onClick={moveSprite}
          >
            Toggle Movement
          </button>
        </div>
        <div className="spritePosition">
          Sprite Position:
          <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
        </div>
        <div>
          <button className="button" onClick={addSprite}>
            Add New Sprite
          </button>
        </div>
      </div>
    </div>
  );
}
