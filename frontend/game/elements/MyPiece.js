/**
 * MyPiece class, representing the game movable and animatable pieces.
 */
class MyPiece extends MyGameElement {
    constructor(scene, graph, pickId = -1) {
        super(scene, graph, pickId);
        this.animation = null;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    setInitPosition() {
        this.initPosition = this.getPosition();
    }
}