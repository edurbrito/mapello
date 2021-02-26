/**
 * MyBoard class, representing the main game board.
 */
class MyBoard extends MyGameElement {
    constructor(scene, graph, tileGraph, wallGraph, pickId = -1) {
        super(scene, graph, pickId);

        this.initialBoard = null;
        this.tiles = [];
        this.tileGraph = tileGraph;
        this.wallGraph = wallGraph;
    }

    /**
     * Sets the Tiles and its Pieces - picking ids from 1 to 52 (64 spaces - 8 walls - 4 central pieces )
     */
    initTiles(initialBoard, theme) {
        this.initialBoard = initialBoard;
        let pickId = 1;
        let offsetX = -4.725, offsetZ;
        let tile, piece;

        for (let x = 0; x < 10; x++) {
            offsetZ = 4.725;
            for (let z = 0; z < 10; z++) {

                // Set type of tile and row/col
                if (x > 0 && x < 9 && z > 0 && z < 9) {
                    tile = new MyTile(this.scene, this.tileGraph);
                    tile.setRowCol(x, z);
                }
                else {
                    tile = new MyTile(this.scene, this.wallGraph);
                    tile.setRowCol(x, z);
                }

                // Set tile piece
                switch (initialBoard[x][z]) {
                    case 'wall':
                        piece = new MyPiece(this.scene, theme.wallGraph);
                        piece.moveTo(offsetX + x, 0.27, offsetZ - z);
                        tile.addPiece(piece);
                        this.scene.wallsPieces.push(piece);
                        break;

                    case 'joker':
                        piece = new MyPiece(this.scene, theme.jokerGraph);
                        piece.moveTo(offsetX + x, 0.27, offsetZ - z);
                        tile.addPiece(piece);
                        this.scene.jokerPieces.push(piece);
                        break;

                    case 'bonus':
                        piece = new MyBonus(this.scene, theme.bonusGraph, pickId);
                        piece.moveTo(offsetX + x, 0.27, offsetZ - z);
                        tile.addPiece(piece);
                        piece.setTile(tile); // Bidirectional association when a tile has a bonus
                        piece.setInitPosition();
                        this.scene.bonusPieces.push(piece);
                        pickId++;
                        break;

                    case 'black':
                        piece = new MyPlayerPiece(this.scene, theme.playerGraph, 'black');
                        piece.moveTo(offsetX + x, 0.27, offsetZ - z);
                        piece.rotate(180);
                        tile.addPiece(piece);
                        piece.setInitPosition();
                        this.scene.playerPieces.push(piece);
                        break;

                    case 'white':
                        piece = new MyPlayerPiece(this.scene, theme.playerGraph, 'white');
                        piece.moveTo(offsetX + x, 0.27, offsetZ - z);
                        tile.addPiece(piece);
                        piece.setInitPosition();
                        this.scene.playerPieces.push(piece);
                        break;

                    case 'empty':
                        tile.setPickId(pickId); // Enable picking when the tile is empty
                        pickId++;
                        break;
                    default:
                        break;
                }

                tile.moveTo(offsetX + x, 0.26, offsetZ - z);
                this.tiles.push(tile);
                offsetZ -= 0.05;
            }
            offsetX += 0.05;
        }
    }
           
    getTile(row, col) {
        // row and col from 0 to 9        
        let idx = 10 * row + col;
        return this.tiles[idx]
    }

    setGraph(graph, tileGraph, wallGraph) {
        super.setGraph(graph);
        this.tileGraph = tileGraph;
        this.wallGraph = wallGraph;

        for (let i = 0; i < 100; i++) {
            if ((i < 10) || (i > 89) || (i % 10 == 0) || (i % 10 == 9))
                this.tiles[i].setGraph(this.wallGraph);
            else
                this.tiles[i].setGraph(this.tileGraph);
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);

        this.tiles.forEach(element => {
            element.display();
        })

        this.graph.display();
        this.scene.popMatrix();
    }
}