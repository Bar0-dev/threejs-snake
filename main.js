import WebGL from 'three/addons/capabilities/WebGL.js';
import * as THREE from 'three';
import {SnakeSegment} from './src/components/SnakeSegment.js'

// Basic instances
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

// Renderer settings
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let segment = new SnakeSegment(5, 0xff0033)
// Scene settings
scene.add( segment.segment );

// Camera settings
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 0);

document.addEventListener('keypress', (e)=>{segment.changeDirection(e.code)})

function animate() {
	requestAnimationFrame( animate );

	segment.move();

	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}
