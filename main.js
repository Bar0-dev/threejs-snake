import WebGL from 'three/addons/capabilities/WebGL.js';
import * as THREE from 'three';
import {Snake, SnakeHead} from './src/components/SnakeSegment.js'

// Basic instances
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const light = new THREE.DirectionalLight( 0xffffff, 3 );

// Renderer settings
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Scene settings
scene.background = new THREE.Color( 0x16172e );

// Camera settings
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

//Lighting settigns
light.position.set( 1, 1, 1 ).normalize();
scene.add( light );

//Snake
let snake = new Snake(5, 0x8fa852, 1, 10, scene)
document.addEventListener('keypress', snake.head.changeDirection.bind(snake.head))

function animate() {
	requestAnimationFrame( animate );

	snake.moveAll();

	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}
