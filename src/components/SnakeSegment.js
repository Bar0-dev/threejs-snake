import * as THREE from 'three'

class GenericComponent {
  constructor (size, color, speed) {
    this.size = size
    this.color = color
    this.speed = speed
    this.direction = new THREE.Vector3(0, 0, 0)
  }
}

class SnakeSegment extends GenericComponent {
  constructor (size, color, speed, previousSegment) {
    super(size, color, speed)
    // this.geometry = new THREE.SphereGeometry( this.size, 3*this.size, 2*this.size );
    this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
    this.material = new THREE.MeshStandardMaterial({ color: this.color, metalness: 0.4, roughness: 0.5 })
    this.body = new THREE.Mesh(this.geometry, this.material)
    this.previousSegment = previousSegment
    this.body.geometry.computeBoundingBox()
    this.tailSegmentDispersionFactor = 10
    this.collisionBox = new THREE.Box3()
  }

  alignToPrevious () {
    this.direction = this.previousSegment.body.position.clone().sub(this.body.position).multiplyScalar(1 / this.tailSegmentDispersionFactor)
  }

  updateCollisionBoxPosition () {
    this.collisionBox.copy(this.body.geometry.boundingBox).applyMatrix4(this.body.matrixWorld)
  }

  move () {
    this.body.translateOnAxis(this.direction, this.speed)
    this.updateCollisionBoxPosition()
  }
}

class SnakeHead extends SnakeSegment {
  constructor (size, color, speed) {
    super(size, color, speed, null)
    this.vectorLookup = {
      KeyW: [0, 1, 0],
      KeyS: [0, -1, 0],
      KeyA: [-1, 0, 0],
      KeyD: [1, 0, 0]
    }
  }

  changeDirection (e) {
    if (e.code in this.vectorLookup) {
      const newDirection = new THREE.Vector3(...this.vectorLookup[e.code])
      if (!newDirection.equals(this.direction.clone().negate())) {
        this.direction = newDirection
      }
    }
  }

  setStationary () {
    const newDirection = new THREE.Vector3(0, 0, 0)
    this.direction = newDirection
  }
}

class Snake extends GenericComponent {
  constructor (size, color, speed, numberOfSegments, scene) {
    super(size, color, speed)
    this.initialNumberOfSegments = numberOfSegments
    this.scene = scene
    this.head = new SnakeHead(this.size, this.color, this.speed)
    this.gap = this.size / 2
    this.segments = []
    this.initialMatrix = this.head.body.matrixWorld
  }

  addSegment (previousSegment) {
    const segment = new SnakeSegment(this.size, this.color, this.speed, previousSegment)
    segment.body.translateOnAxis(previousSegment.body.position, 1)
    segment.updateCollisionBoxPosition()
    this.segments.push(segment)
    this.scene.add(segment.body)
    // DEBUG
    // this.scene.add(new THREE.Box3Helper(segment.body.geometry.boundingBox, 0xff00ff))
    // this.scene.add(new THREE.Box3Helper(segment.collisionBox, 0xff00ff))
  }

  spawnSnake () {
    this.segments.push(this.head)
    this.scene.add(this.head.body)
    // DEBUG
    // this.scene.add( new THREE.Box3Helper(this.head.body.geometry.boundingBox, 0xff00ff));
    // this.scene.add(new THREE.Box3Helper(this.head.collisionBox, 0xff00ff))

    for (let i = 1; i < this.initialNumberOfSegments; i++) {
      const previousSegment = this.segments[i - 1]
      this.addSegment(previousSegment)
    }
  }

  appendSegment () {
    const [previousSegment] = this.segments.slice(-1)
    this.addSegment(previousSegment)
  }

  moveAll () {
    for (const i in this.segments) {
      this.segments[i].move()
      if (i > 0) {
        this.segments[i].alignToPrevious()
      }
    }
  }

  removeGainedSegments () {
    for (let i = this.segments.length; i > this.initialNumberOfSegments; i--) {
      const segment = this.segments.pop()
      this.scene.remove(segment.body)
      segment.geometry.dispose()
      segment.body = null
    }
  }

  resetSnake () {
    this.head.setStationary()
    this.head.body.applyMatrix4(this.initialMatrix.clone().invert())
    this.head.body.geometry.boundingBox.applyMatrix4(new THREE.Matrix4())
    this.removeGainedSegments()
  }
}

export { SnakeSegment, SnakeHead, Snake }
