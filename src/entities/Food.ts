import { GRID_SIZE } from "../constants";

type Position = {
  x: number;
  y: number;
};

export class Food {
  position: Position;

  constructor() {
    this.position = this.getRandomPosition();
  }

  getPosition() {
    return this.position;
  }

  getRandomPosition(): Position {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }

  respawn() {
    this.position = this.getRandomPosition();
  }

  draw(ctx: CanvasRenderingContext2D, cellSize: number) {
    ctx.fillStyle = "#e74c3c";

    ctx.fillRect(
      this.position.x * cellSize,
      this.position.y * cellSize,
      cellSize,
      cellSize
    );
  }
}
