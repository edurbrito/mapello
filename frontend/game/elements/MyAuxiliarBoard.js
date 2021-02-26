/**
 * MyAuxiliarBoard class, representing an auxiliar game board for the pieces to be moved.
 */
class MyAuxiliarBoard extends MyGameElement {
    constructor(scene, graph, tileGraph, startX, startZ, columns, rows, boardX, pickId = -1) {
        super(scene, graph, pickId);

        this.startX = startX;
        this.startZ = startZ;
        this.columns = columns;
        this.rows = rows;
        this.tiles = [];
        this.tileGraph = tileGraph;
        this.available = 0;

        this.moveTo(boardX, 0, 0);
        this.initTiles();
    }

    initTiles() {

        let offsetX = this.startX + this.x;
        let offsetZ;

        for (let x = 0; x < this.columns; x++) {
            offsetZ = this.startZ;
            for (let z = 0; z < this.rows; z++) {
                let tile = new MyTile(this.scene, this.tileGraph);
                tile.moveTo(offsetX + x, 0.26, offsetZ + z);
                this.tiles.push(tile);

                offsetZ += 0.05;
            }
            offsetX += 0.05;
        }
    }

    setGraph(graph, tileGraph) {
        super.setGraph(graph);
        this.tileGraph = tileGraph

        this.tiles.forEach(element => {
            element.setGraph(this.tileGraph);
        })
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        this.graph.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.tiles.forEach(element => {
            element.display();
        })
        this.scene.popMatrix();
    }

    availableTile() {
        this.available++;
        return this.tiles[this.available - 1];
    }

    restoreTile() {
        this.available--;
    }
}