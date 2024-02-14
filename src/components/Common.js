export default class Hitbox {
    constructor() {
        this.position = position;
        this.size = size;
        this.collisionBox =
    }

    upateHitbox(position) {
        this.position = position;
    }

    isColliding(otherHitbox) {
        const distanceBetweenTwoHitboxes = this.position.clone().sub(otherHitbox.position);
        if (distanceBetweenTwoHitboxes < (this.size+otherHitbox.size)) {
            return true;
        }
        return false; 
    }
}