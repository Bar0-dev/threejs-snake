import * as THREE from 'three';

class GenericComponent {
    constructor(size, color, speed) {
        this.size = size;
        this.color = color;
        this.speed  = speed;
        this.direction = new THREE.Vector3( 0, 0, 0 );
    }
}

class SnakeSegment extends GenericComponent{
    constructor(size, color, speed, previousSegment) {
        super(size, color, speed);
        // this.geometry = new THREE.SphereGeometry( this.size, 3*this.size, 2*this.size );
        this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size );
        this.material = new THREE.MeshStandardMaterial( { color: this.color, metalness:0.2, roughness:0.7 } );
        this.body = new THREE.Mesh( this.geometry, this.material );
        this.previousSegment = previousSegment;
        this.body.geometry.computeBoundingBox();
    }

    alignToPrevious() {
        this.direction = this.previousSegment.body.position.clone().sub(this.body.position).multiplyScalar(this.size/(this.size*10));
    }

    move() {
        this.body.translateOnAxis(this.direction, this.speed);
        this.body.geometry.boundingBox.translate(this.direction.clone().multiplyScalar(this.speed))
    }

    checkCollisions(objects){
        for (let i in objects) {
            if(this.body.geometry.boundingBox.intersectsBox(objects[i].body.geometry.boundingBox)) {
                console.log(true);
                return true;
            }
        }
        return false;
    }
}

class SnakeHead extends SnakeSegment {
    constructor(size, color, speed) {
        super(size, color, speed, null);
        this.vectorLookup = {
            KeyW: [0, 1, 0],
            KeyS: [0, -1, 0],
            KeyA: [-1, 0, 0],
            KeyD: [1, 0, 0],
        };
    }

    changeDirection(e) {
        if (e.code in this.vectorLookup) {
            const newDirection = new THREE.Vector3(...this.vectorLookup[e.code]);
            if (!newDirection.equals(this.direction.clone().negate())) {
                this.direction = newDirection;
            }
        }
    }

    setStationary() {
        const newDirection = new THREE.Vector3(0,0,0);
        this.direction = newDirection;
    }
}

class Snake extends GenericComponent{
    constructor(size, color, speed, numberOfSegments, scene) {
        super(size, color, speed);
        this.numberOfSegments = numberOfSegments;
        this.scene = scene;
        this.head = new SnakeHead(this.size, 0x0a0b10, this.speed);
        this.gap = this.size/2;
        this.segments = [this.head];
        this.spawnSegments(this.numberOfSegments);
        this.initialMatrix = this.head.body.matrixWorld;
    }

    spawnSegments(n) {
        this.scene.add(this.head.body)
        //DEBUG
        // this.scene.add( new THREE.Box3Helper(this.head.body.geometry.boundingBox, 0xff00ff));
        for (let i = 1; i<n; i++) {
            const segment = new SnakeSegment(this.size, this.color, this.speed, this.segments[i-1]);
            this.segments.push(segment);
            this.scene.add(segment.body);
            //DEBUG
            // this.scene.add( new THREE.Box3Helper(this.segments[i].body.geometry.boundingBox, 0xff00ff));
        }
    }

    moveAll() {
        for (let i in this.segments) {
            this.segments[i].move();
            if (i>0){
                this.segments[i].alignToPrevious()
            }
        }
    }

    restartSnake() {
        this.head.setStationary();
        this.head.body.applyMatrix4(this.initialMatrix.clone().invert());
        this.head.body.geometry.boundingBox.applyMatrix4(this.initialMatrix.clone().invert())
    }
}

export {SnakeSegment, SnakeHead, Snake}