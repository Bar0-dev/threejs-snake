import * as THREE from 'three';

export class SnakeSegment {
    constructor(size, color) {
        this.size = size;
        this.color = color;
        this.speed  = 0.1;
        this.direction = new THREE.Vector3( 1, 0, 0 );
        this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size );
        this.material = new THREE.MeshBasicMaterial( { color: this.color } );
        this.segment = new THREE.Mesh( this.geometry, this.material );
    }
    
    changeDirection(keyCode) {
        switch (keyCode) {
            case 'KeyW':
                this.direction.set(0, 1, 0);
                break;
                
            case 'KeyS':
                this.direction.set(0, -1, 0);
                break;

            case 'KeyA':
                this.direction.set(-1, 0, 0);
                break;
            
            case 'KeyD':
                this.direction.set(1, 0, 0);
                break;
        }
    }

    move() {
        this.segment.translateOnAxis(this.direction, this.speed)
    }

}
