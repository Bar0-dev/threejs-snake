import * as THREE from 'three';

class GenericComponent {
    constructor(size, color, speed) {
        this.size = size;
        this.color = color;
        this.speed  = speed;
        this.direction = new THREE.Vector3( 1, 0, 0 );
    }
}

class SnakeSegment extends GenericComponent{
    constructor(size, color, speed) {
        super(size, color, speed);
        this.geometry = new THREE.CapsuleGeometry( this.size/2, this.size/4, this.size, this.size );
        this.material = new THREE.MeshStandardMaterial( { color: this.color, defines: { 'STANDARD': ''}, metalness:0.2, roughness:0.7 } );
        this.body = new THREE.Mesh( this.geometry, this.material );
    }

    updateDirection(newDirection) {
        this.direction.set(...newDirection);
    }

    move() {
        this.body.translateOnAxis(this.direction, this.speed);
    }

}

class SnakeHead extends SnakeSegment {
    constructor(size, color, speed) {
        super(size, color, speed);
        this.lastPositionToChangeDirection = new THREE.Vector3(0,0,0);
        this.vectorLookup = {
            KeyW: [0, 1, 0],
            KeyS: [0, -1, 0],
            KeyA: [-1, 0, 0],
            KeyD: [1, 0, 0],
        };
    }

    changeDirection(e) {
        if (e.code in this.vectorLookup) {
            this.direction = new THREE.Vector3(...this.vectorLookup[e.code]);
            this.lastPositionToChangeDirection = this.body.position.clone();
        }
    }
}

class Snake extends GenericComponent{
    constructor(size, color, speed, numberOfSegments, scene) {
        super(size, color, speed);
        this.numberOfSegments = numberOfSegments;
        this.scene = scene;
        this.head = new SnakeHead(this.size, this.color, this.speed);
        this.gap = this.size/5
        this.segments = [this.head];
        this.spawnSegments(this.numberOfSegments);
    }

    spawnSegments(n) {
        this.scene.add(this.head.body)
        for (let i = 1; i<n; i++) {
            const segment = new SnakeSegment(this.size, this.color, this.speed);
            segment.body.translateOnAxis(this.direction.clone().negate(), (this.size+this.gap)*i)
            this.segments.push(segment);
            this.scene.add(segment.body)
        }
    }

    moveAll() {
        for (let i in this.segments) {
            this.segments[i].move();
            let substrat = this.head.lastPositionToChangeDirection.clone().sub(this.segments[i].body.position).length()
            if (i>=1 && substrat < 0.01){
                this.segments[i].direction = this.segments[i-1].direction;
            }
        }
    }
}

export {SnakeSegment, SnakeHead, Snake}