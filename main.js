import WebGL from 'three/addons/capabilities/WebGL.js';
import * as THREE from 'three';
import {Snake, SnakeHead} from './src/components/SnakeSegment.js'

// Basic instances
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const light = new THREE.AmbientLight( 0xffffff, 1 ); // soft white light
scene.add( light );

// Renderer settings
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let snake = new Snake(5, 0x802c22, 0.1, 4, scene)
// Scene settings
// scene.add( ...snake.allSegments );

// Camera settings
camera.position.set(10, 10, 50);
camera.lookAt(0, 0, 0);

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
