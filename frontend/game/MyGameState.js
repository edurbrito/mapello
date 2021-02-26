/**
* MyGameState class, saving the current gameState information and board.
*/
class MyGameState {
    constructor(board, player = 1, blackPoints = 0, whitePoints = 0) {
        this.board = board;
        this.blackPoints = blackPoints;
        this.whitePoints = whitePoints;
        this.player = player;
        this.turns = [];
        this.piece = null;
        this.tile = null;
        this.bonus = null;
        this.initPosition = null;
    }

    setPlayer(player) {
        this.player = player;
    }

    setTurns(turns) {
        this.turns = turns;
    }

    setPieces(piece, tile, bonus = null) {
        this.piece = piece;
        this.initPosition = { x: piece.x, y: piece.y, z: piece.z };
        this.tile = tile;
        this.bonus = bonus;
    }

    getBoard() {
        return JSON.stringify(this.board).replaceAll("\"", "");
    }

}
