import * as THREE from 'three'
import { v4 as uuidv4 } from 'uuid'

/* eslint no-unused-vars: ["error", { "destructuredArrayIgnorePattern": "^_" }] */

class Food {
  constructor (size, color) {
    this.uuid = uuidv4()
    this.size = size
    this.color = color
    // this.geometry = new THREE.SphereGeometry(this.size, 6 * this.size, 4 * this.size)
    this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
    this.material = new THREE.MeshStandardMaterial({ color: this.color, metalness: 0.9, roughness: 0.5 })
    this.body = new THREE.Mesh(this.geometry, this.material)
    this.body.geometry.computeBoundingBox()
    this.spinAxis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
    this.spinSpeed = Math.random() / 10
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

  spin () {
    this.body.rotateOnAxis(this.spinAxis, this.spinSpeed)
  }
}

export default class FoodSpawner {
  constructor (size, interval, frame, scene) {
    this.size = size
    this.interval = interval
    this.frame = frame
    this.scene = scene
    this.allFood = new Map()
    this.baseColor = 0xd4968c
    this.foodSpawnDelay = 1 // s
  }

  colorGenerator () {
    return this.baseColor * Math.random() * 0xF00000
  }

  spawnFood () {
    const food = new Food(this.size, this.colorGenerator())
    food.spawn(this.frame.size)
    this.scene.add(food.body)
    this.allFood.set(food.uuid, food)
    // DEBUG
    // this.scene.add( new THREE.Box3Helper(food.body.geometry.boundingBox, 0xff00ff));
  }

  removeFood (foodUuid) {
    const food = this.allFood.get(foodUuid)
    this.scene.remove(food.body)
    this.allFood.delete(foodUuid)
    food.geometry.dispose()
    food.body = null
  }

  spinAllFood () {
    for (const [_key, food] of this.allFood) {
      food.spin()
    }
  }
}
