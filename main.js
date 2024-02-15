import WebGL from 'three/addons/capabilities/WebGL.js'
import * as THREE from 'three'
import { Snake } from './src/components/SnakeSegment.js'
import { Frame } from './src/components/Frame.js'
import { Gameplay } from './src/Logic/Logic.js'
import FoodSpawner from './src/components/Food.js'

// Basic instances
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const light = new THREE.DirectionalLight(0xffffff, 3)

// Renderer settings
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Scene settings
scene.background = new THREE.Color(0x16172e)

// Camera settings
camera.position.set(10, 10, 300)
camera.lookAt(0, 0, 0)

// Lighting settigns
light.position.set(10, 15, 15).normalize()
scene.add(light)

// Snake
const snake = new Snake(10, 0x8fa852, 1, 5, scene)
snake.spawnSnake()
document.addEventListener('keypress', snake.head.changeDirection.bind(snake.head))

// Frame
const frame = new Frame(400, 2, 20, 0xa8327b, scene)
frame.spawnFrame()

// Food
const foodSpawner = new FoodSpawner(3, 1, frame, scene)
foodSpawner.spawnFood()

// Gameplay
const gameplay = new Gameplay(snake, frame, foodSpawner, scene)

function animate () {
  requestAnimationFrame(animate)

  snake.moveAll()
  gameplay.updateGameStatus()

  renderer.render(scene, camera)
}

if (WebGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  animate()
} else {
  const warning = WebGL.getWebGLErrorMessage()
  document.getElementById('container').appendChild(warning)
}
