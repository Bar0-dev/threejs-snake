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
    this.body = null
  }

  generate3Dtext (text) {
    this.loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
      const material = new THREE.MeshPhongMaterial({ color: this.color })
      const geometry = new TextGeometry(text, {
        font,
        size: this.size,
        height: this.height,
        curveSegments: 30,
        bevelEnabled: true,
        bevelThickness: 8,
        bevelSize: 4,
        bevelOffset: 0,
        bevelSegments: 15
      })
      this.body = new THREE.Mesh(geometry, material)
      this.body.geometry.computeBoundingBox()
      this.body.position.z = this.zOffset
      const centerVector = new THREE.Vector3()
      this.body.geometry.boundingBox.getCenter(centerVector)
      this.body.translateOnAxis(centerVector.negate(), 1)
      this.scene.add(this.body)
    })
  }

  remove3Dtext () {
    if (this.body) {
      this.body.geometry.dispose()
      this.scene.remove(this.body)
      this.body = null
    }
  }
}

class Gameplay extends CollisionChecker {
  constructor (snake, frame, foodSpawner, scene) {
    super(snake, frame, foodSpawner)
    this.scene = scene
    this.score = 0
    this.text3DGenerator = new Text3DGenerator(30, 0x985adb, -40, this.scene)
    this.states = ['INIT', 'IDLE', 'NEWGAME', 'PLAYING', 'LOST', 'RESTART']
    this.state = 'INIT'
  }

  handleKeyPress (e) {
    if (this.state === 'IDLE' || this.state === 'LOST') {
      if (e.code === 'Enter') { this.state = 'NEWGAME' }
    }
    if (this.state === 'PLAYING') {
      this.snake.head.changeDirection(e)
    }
  }

  gameTick () {
    let hasCollidedWithWall = null
    let collidedFoodUuid = null
    switch (this.state) {
      case 'IDLE':
        break

      case 'INIT':
        this.text3DGenerator.generate3Dtext('press\nEnter to play\nWSAD to move')
        this.state = 'IDLE'
        break

      case 'NEWGAME':
        this.snake.resetSnake()
        this.text3DGenerator.remove3Dtext()
        this.text3DGenerator.generate3Dtext(this.score.toString())
        this.state = 'PLAYING'
        break

      case 'PLAYING':
        this.snake.moveAll()
        this.foodSpawner.spinAllFood()
        hasCollidedWithWall = this.checkForWallCollisions()
        collidedFoodUuid = this.checkForFoodCollisions()
        if (hasCollidedWithWall) { this.state = 'LOST' }
        if (collidedFoodUuid) {
          this.foodSpawner.removeFood(collidedFoodUuid)
          this.foodSpawner.spawnFood()
          this.text3DGenerator.remove3Dtext()
          this.score++
          this.text3DGenerator.generate3Dtext(this.score.toString())
          this.snake.appendSegment()
        }
        break

      case 'LOST':
        this.text3DGenerator.remove3Dtext()
        this.text3DGenerator.generate3Dtext(`Score: ${this.score}\nEnter to restart`)
        this.score = 0
        this.state = 'IDLE'
        break

      default:
        break
    }
  }
}

export { Gameplay, CollisionChecker }
