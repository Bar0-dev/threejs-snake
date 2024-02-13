import WebGL from 'three/addons/capabilities/WebGL.js';
import * as THREE from 'three';

// Basic instances
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

// Cube geometry
const geometry = new THREE.BoxGeometry( 10, 10, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );

// Line geometry
const lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000} );
const linePoints = [];
linePoints.push( new THREE.Vector3(0, 0, 0));
linePoints.push( new THREE.Vector3(0, 30, 0));
linePoints.push( new THREE.Vector3(10, 0, 0));

const lineGeometry = new THREE.BufferGeometry().setFromPoints( linePoints );

const line = new THREE.Line( lineGeometry, lineMaterial );

// Renderer settings
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Scene settings
scene.add( cube );
scene.add( line );

// Camera settings
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 0);

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}
