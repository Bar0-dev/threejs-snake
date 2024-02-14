import * as THREE from 'three';

class GenericBlock {
    constructor(size, wallThickness, wallHeight, color) {
        this.size = size;
        this.wallThickness = wallThickness;
        this.wallHeight = wallHeight;
        this.color = color;
    }
}

class Wall extends GenericBlock {
    constructor(size, wallThickness, wallHeight, color, normalVector) {
        super(size, wallThickness, wallHeight, color);
        this.normalVector = normalVector;
        this.geometry = new THREE.BoxGeometry( this.size, this.wallThickness, this.wallHeight ); 
        this.material = new THREE.MeshStandardMaterial( { color: this.color, metalness:0.2, roughness:0.7 } );
        this.body = new THREE.Mesh( this.geometry, this.material );
        this.body.geometry.computeBoundingBox();
        this.updateWallPosition();
        this.alignToNormal();
    }

    updateWallPosition() {
            this.body.translateOnAxis(this.normalVector, this.size/2-this.wallThickness/2);
        }

    alignToNormal() {
        const rotationAxis = new THREE.Vector3(0,1,0).cross(this.normalVector);
        this.body.rotateOnAxis(rotationAxis, Math.PI/2);
        this.body.updateMatrix();
        this.body.geometry.boundingBox.applyMatrix4(this.body.matrix);
    }

}

class Frame extends GenericBlock {
    constructor(size, wallThickness, wallHeight, color, scene) {
        super(size, wallThickness, wallHeight, color);
        this.scene = scene;
        this.walls = [];
        this.wallNormals = {
            0: [1,0,0],
            1: [-1,0,0],
            2: [0,1,0],
            3: [0,-1,0],
        }
        this.generateWalls();
        // this.scene.add( new THREE.BoxHelper(this.walls[3].body, 0xff00ff))
    }

    generateWalls() {
        for (let i in this.wallNormals) {
            const wall = new Wall(this.size, this.wallThickness, this.wallHeight, this.color, new THREE.Vector3(...this.wallNormals[i]));
            this.walls.push(wall);
            this.scene.add(wall.body);
            this.scene.add( new THREE.Box3Helper(wall.body.geometry.boundingBox, 0xff00ff));
        }
    }
}

export {Frame}