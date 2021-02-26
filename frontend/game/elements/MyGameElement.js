/**
 * MyGameElement class, representing all the game elements.
 */
class MyGameElement {
    constructor(scene, graph, pickId = -1) {
        this.scene = scene;
        this.graph = graph;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.r = 0;

        this.pickId = pickId;
        this.canPick = (this.pickId != -1) ? true : false;
    }

    setGraph(graph) {
        this.graph = graph
    }

    getPosition() {
        return { x: this.x, y: this.y, z: this.z };
    }

    moveTo(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    moveToPiece(piece) {
        this.x = piece.x;
        this.y = piece.y;
        this.z = piece.z;
    }

    rotate(r) {
        this.r = Utils.degToRad(r);
    }

    display() {
        this.scene.pushMatrix();

        this.scene.translate(this.x, this.y, this.z);

        if (this.r > 0)
            this.scene.translate(0, 0.4, 0);
        this.scene.rotate(this.r, 0, 0, 1);

        if (this.animation != null)
            this.animation.apply();

        if (this.canPick)
            this.scene.registerForPick(this.pickId, this);

        this.graph.display();

        this.scene.clearPickRegistration()
        this.scene.popMatrix();
    }

    enablePick() {
        this.canPick = true;
    }

    setPickId(pickId) {
        this.pickId = pickId;
        this.enablePick();
    }

    disablePick() {
        this.canPick = false;
    }
}