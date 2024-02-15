class CollisionChecker {
    constructor(snake, frame, foodSpawner) {
        this.snake = snake;
        this.frame = frame;
        this.foodSpawner = foodSpawner;
    }

    checkCollision(boundingBox){
        return this.snake.head.body.geometry.boundingBox.intersectsBox(boundingBox);
    }

    checkForWallCollisions() {
        for (let i in this.frame.walls) {
            if (this.checkCollision(this.frame.walls[i].body.geometry.boundingBox)) {
                return true;
            }
        }
        return false;
    }

    checkForFoodCollisions() {
        for (const [key, value] of this.foodSpawner.allFood) {
            const food = value;
            if(this.checkCollision(food.body.geometry.boundingBox))
                return food.uuid;
        }
        return null;
    }
}

class Gameplay extends CollisionChecker {
    constructor(snake, frame, foodSpawner, renderer) {
        super(snake, frame, foodSpawner);
        this.renderer = renderer;
        this.score = 0;
    }

    updateGameStatus() {
        const hasCollidedWithWall = this.checkForWallCollisions();
        const collidedFoodUuid = this.checkForFoodCollisions();
        if (hasCollidedWithWall) {
            this.snake.restartSnake();
            this.foodSpawner.resetEatenFood();
            this.score = 0;
        }
        if (collidedFoodUuid) {
            this.foodSpawner.removeFood(collidedFoodUuid);
            this.foodSpawner.spawnFood();
            this.score = this.foodSpawner.eatenFood
        }
    }
}

export {Gameplay, CollisionChecker}