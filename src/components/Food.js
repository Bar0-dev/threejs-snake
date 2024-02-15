import * as THREE from 'three'
import { v4 as uuidv4 } from 'uuid'

class Food {
  constructor (size, color) {
    this.uuid = uuidv4()
    this.size = size
    this.color = color
    this.geometry = new THREE.SphereGeometry(this.size, 6 * this.size, 4 * this.size)
    this.material = new THREE.MeshStandardMaterial({ color: this.color, metalness: 0.7, roughness: 0.3 })
    this.body = new THREE.Mesh(this.geometry, this.material)
    this.body.geometry.computeBoundingBox()
  }

  spawn (spawnBoundaries) {
    const randomizedCoordinates = []
    for (let i = 0; i < 2; i++) {
      randomizedCoordinates.push((Math.random() * spawnBoundaries) - spawnBoundaries / 2)
    }
    randomizedCoordinates.push(0)
    const randomPosition = new THREE.Vector3(...randomizedCoordinates)
    this.body.translateOnAxis(randomPosition, 1)
    this.body.updateMatrix()
    this.body.geometry.boundingBox.applyMatrix4(this.body.matrix)
  }
}

export default class FoodSpawner {
  constructor (size, interval, frame, scene) {
    this.size = size
    this.interval = interval
    this.frame = frame
    this.scene = scene
    this.allFood = new Map()
    this.eatenFood = 0
    this.baseColor = 0xd4968c
    this.timer = new THREE.Clock(true)
    this.foodSpawnDelay = 1 // s
  }

  colorGenerator () {
    return this.baseColor * Math.random() * 0x0000F0
  }

  spawnFood () {
    const food = new Food(this.size, this.colorGenerator())
    food.spawn(this.frame.size)
    this.scene.add(food.body)
    this.allFood.set(food.uuid, food)
    this.timer.getDelta()
    // DEBUG
    // this.scene.add( new THREE.Box3Helper(food.body.geometry.boundingBox, 0xff00ff));
  }

  removeFood (foodUuid) {
    const food = this.allFood.get(foodUuid)
    this.scene.remove(food.body)
    this.allFood.delete(foodUuid)
    food.geometry.dispose()
    food.body = null
    this.eatenFood++
  }

  resetEatenFood () {
    this.eatenFood = 0
  }
}
