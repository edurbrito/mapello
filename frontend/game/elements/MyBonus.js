/**
 * MyBonus class, representing the bonus pieces that can be collected and moved to the auxiliar board.
 */
class MyBonus extends MyPiece {
    constructor(scene, graph, pickId = -1) {
        super(scene, graph, pickId);
    }

    setTile(tile) {
        this.tile = tile;
        this.setRowCol(tile.row, tile.col)
    }

    getTile() {
        return this.tile;
    }

    removeTile() {
        this.tile.removePiece();
        this.tile = null;
    }

    setRowCol(row, col) {
        this.row = row;
        this.col = col;
    }
}