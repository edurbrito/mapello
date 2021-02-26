/**
 * MyTile class, representing the tile elements that reference game positions for the moves to be made.
 */
class MyTile extends MyGameElement {
    constructor(scene, graph, pickId = -1) {
        super(scene, graph, pickId);

        this.piece = null;
        this.valid = false;
    }

    setRowCol(row, col) {
        this.row = row;
        this.col = col;
    }

    addPiece(piece) {
        this.piece = piece;
    }

    removePiece() {
        this.piece = null;
    }

    setValid() {
        this.valid = true;
    }

    setInvalid() {
        this.valid = false;
    }

    display() {
        let materialID = this.graph.nodes[this.graph.idRoot].materialID;

        if (this.valid)
            this.graph.nodes[this.graph.idRoot].materialID = this.scene.getThemeName() + 'ValidTileMaterial';

        super.display();

        if (this.valid)
            this.graph.nodes[this.graph.idRoot].materialID = materialID;
    }
}