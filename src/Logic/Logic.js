import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

/* eslint no-unused-vars: ["error", { "destructuredArrayIgnorePattern": "^_" }] */

class CollisionChecker {
  constructor (snake, frame, foodSpawner) {
    this.snake = snake
    this.frame = frame
    this.foodSpawner = foodSpawner
  }

  checkCollision (boundingBox) {
    return this.snake.head.body.geometry.boundingBox.intersectsBox(boundingBox)
  }

  checkForWallCollisions () {
    for (const i in this.frame.walls) {
      if (this.checkCollision(this.frame.walls[i].body.geometry.boundingBox)) {
        return true
      }
    }
    return false
  }

  checkForFoodCollisions () {
    for (const [_key, value] of this.foodSpawner.allFood) {
      const food = value
      if (this.checkCollision(food.body.geometry.boundingBox)) { return food.uuid }
    }
    return null
  }
}

class Text3DGenerator {
  constructor (size, color, zOffset, scene) {
    this.size = size
    this.color = color
    this.zOffset = zOffset
    this.scene = scene
    this.height = this.size / 20
    this.loader = new FontLoader()
    this.font = null
    this.loadFont()
    this.geometry = null
    this.material = new THREE.MeshPhongMaterial({ color: this.color })
    this.body = null
  }

  loadFont () {
    this.loader.load('fonts/helvetiker_regular.typeface.json', (font) => { this.font = font })
  }

  generateNew3Dtext (text) {
    this.remove3Dtext()
    this.geometry = new TextGeometry(text, {
      font: this.font,
      size: this.size,
      height: this.height,
      curveSegments: 30,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 5,
      bevelOffset: 0,
      bevelSegments: 20
    })
    this.body = new THREE.Mesh(this.geometry, this.material)
    this.body.geometry.computeBoundingBox()
    this.body.position.z = this.zOffset
    const centerVector = new THREE.Vector3()
    this.body.geometry.boundingBox.getCenter(centerVector)
    this.body.translateOnAxis(centerVector.negate(), 1)
    this.scene.add(this.body)
  }

  remove3Dtext () {
    if(this.geometry) {
      this.geometry.dispose()
    }
    this.scene.remove(this.body)
    this.body = null
  }
}

class Gameplay extends CollisionChecker {
  constructor (snake, frame, foodSpawner, scene) {
    super(snake, frame, foodSpawner)
    this.scene = scene
    this.score = -1
    this.text3DGenerator = new Text3DGenerator(50, 0x985adb, -40, this.scene)
  }

  newGame () {
    if (this.score === -1) {
      this.text3DGenerator.generateNew3Dtext("press WSAD\n    to play")
      this.score = 0
    }
  }

  updateGameStatus () {
    this.newGame()
    const hasCollidedWithWall = this.checkForWallCollisions()
    const collidedFoodUuid = this.checkForFoodCollisions()
    if (hasCollidedWithWall) {
      this.snake.resetSnake()
      this.foodSpawner.resetEatenFood()
      this.score = 0
      this.text3DGenerator.generateNew3Dtext("You lost\npress WSAD to\n play again")
    }
    if (collidedFoodUuid) {
      this.foodSpawner.removeFood(collidedFoodUuid)
      this.foodSpawner.spawnFood()
      this.score = this.foodSpawner.eatenFood
      this.text3DGenerator.generateNew3Dtext(this.score.toString())
      this.snake.appendSegment()
    }
  }
}

export { Gameplay, CollisionChecker }
