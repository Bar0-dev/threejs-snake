class CollisionChecker {
    constructor(snake, frame) {
        this.snake = snake;
        this.frame = frame;
    }

    checkForCollisions() {
        for (let i in this.frame.walls) {
            if (this.snake.head.body.geometry.boundingBox.intersectsBox(this.frame.walls[i].body.geometry.boundingBox)) {
                return true;
            }
        }
        return false;
    }
}

class Gameplay extends CollisionChecker {
    constructor(snake, frame, renderer) {
        super(snake, frame);
        this.renderer = renderer;
    }

    updateGameStatus() {
        const hasCollided = this.checkForCollisions();
        if (hasCollided) {
            this.snake.restartSnake();
        }

    }
}

export {Gameplay, CollisionChecker}