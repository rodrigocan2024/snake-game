import "./style.css";

import { CANVAS_SIZE, CELL_SIZE, DIRECTIONS, GRID_SIZE } from "./constants";
import { Snake } from "./entities/Snake";
import { Food } from "./entities/Food";
import { ScreenManager } from "./managers/ScreenManager";
import grassSprite from "/images/grass.jpg";
import snakeSprite from "/images/sprite_sheet.png";
import { AudioManager } from "./managers/AudioManager";

class Game {
  canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
  ctx = this.canvas.getContext("2d")!;

  background = new Image();
  spriteSheet = new Image();

  screenManager = new ScreenManager(this.canvas, this.ctx);
  audioManager = new AudioManager();

  snake = new Snake();
  food = new Food();
  isPlaying = false;
  isGameOver = false;
  score = 0;

  constructor() {
    this.canvas.width = CANVAS_SIZE;
    this.canvas.height = CANVAS_SIZE;
    this.background.src = grassSprite;
    this.spriteSheet.src = snakeSprite;

    this.setupControls();
    this.startGameLoop();
  }

  reset() {
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
    this.isPlaying = true;
    this.isGameOver = false;
  }

  setupControls() {
    document.addEventListener("keydown", (e) => {
      if (
        !this.isPlaying &&
        !this.isGameOver &&
        (e.code === "Enter" || e.code === "Space")
      ) {
        this.isPlaying = true;
        this.audioManager.playMusic();
        return;
      }

      if (this.isGameOver && (e.code === "Enter" || e.code === "Space")) {
        this.reset();
        this.audioManager.playMusic();
        return;
      }

      if (this.isPlaying) {
        const newDirection = {
          ArrowUp: DIRECTIONS.UP,
          ArrowDown: DIRECTIONS.DOWN,
          ArrowLeft: DIRECTIONS.LEFT,
          ArrowRight: DIRECTIONS.RIGHT,
        }[e.code];

        if (newDirection) {
          // muda a direção da snake
          this.snake.changeDirection(newDirection);
        }
      }
    });
  }

  drawGrid() {
    this.ctx.fillStyle = "#2c3e50";
    this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    this.ctx.strokeStyle = "#ffffff33";
    this.ctx.lineWidth = 1;

    for (let i = 0; i < GRID_SIZE; i++) {
      // Vertical lines
      this.ctx.beginPath();
      this.ctx.moveTo(i * CELL_SIZE, 0);
      this.ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      this.ctx.stroke();

      // Horizontal lines
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * CELL_SIZE);
      this.ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      this.ctx.stroke();
    }
  }

  draw() {
    // this.drawGrid();
    const pattern = this.ctx.createPattern(this.background, "repeat");
    if (pattern) {
      this.ctx.fillStyle = pattern;
      this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    this.snake.draw(this.ctx, this.spriteSheet);

    this.food.draw(this.ctx, this.spriteSheet);

    // score
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 3;
    this.ctx.font = "20px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.strokeText(`Score: ${this.score}`, 20, 40);
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);

    if (!this.isPlaying && !this.isGameOver) {
      this.screenManager.drawInitialScreen();
    }

    if (this.isGameOver) {
      this.screenManager.drawGameOverScreen(this.score);
    }
  }

  update() {
    this.draw();

    if (!this.isPlaying) return;

    if (this.snake.checkCollisions(GRID_SIZE)) {
      this.isPlaying = false;
      this.isGameOver = true;
      this.audioManager.playGameOver();
      return;
    }

    this.snake.move();

    const head = this.snake.getHead();
    const food = this.food.getPosition();

    if (head.x === food.x && head.y === food.y) {
      this.score++;
      this.food.respawn();
      this.audioManager.playEat();
    } else {
      this.snake.removeTail();
    }
  }

  startGameLoop() {
    setInterval(() => this.update(), 100);
  }
}

window.onload = () => new Game();
