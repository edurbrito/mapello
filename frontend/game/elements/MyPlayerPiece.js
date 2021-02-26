/**
 * MyPlayerPiece class, representing the playable pieces that change state.
 */
class MyPlayerPiece extends MyPiece {
    constructor(scene, graph, color, pickId = -1) {
        super(scene, graph, pickId);
        this.elevated = false;
        this.color = color;
    }

    turn() {
        (this.color == 'white') ? (this.color = 'black') : (this.color = 'white');
    }

    select() {
        if (!this.elevated) {
            this.elevated = true;
            this.moveTo(this.x, this.y + 1, this.z);
        }
    }

    deselect() {
        if (this.elevated) {
            this.elevated = false;
            this.moveTo(this.x, this.y - 1, this.z);
        }
    }

    setInitPosition() {
        super.setInitPosition();
        this.initColor = this.color;
    }

}