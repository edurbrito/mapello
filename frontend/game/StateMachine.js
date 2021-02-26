const State = { "INIT": 1, "PLAYER": 2, "TILE": 3, "ANIM": 4, "UNDO": 5, "OVER": 6, "END": 7, "REPLAY": 8, "DOUBLE_UNDO1": 9, "DOUBLE_UNDO2": 10, "TIMEUP": 11 }
Object.freeze(State)

/**
* StateMachine class, the game logic controller for each gameState.
*/
class StateMachine {
    constructor(scene, prolog, animator) {
        this.elem1 = null;
        this.elem2 = null;
        this.elem3 = null;

        this.scene = scene;
        this.prolog = prolog;
        this.animator = animator;
        this.state = State.INIT;
        this.gameState = null;
        this.nextGameState = null;

        this.replayState = 0;
        this.gameOver = false;
    }

    setGameState(gameState) {
        this.gameState = gameState;
    }

    getWinner() {
        if (this.gameState.blackPoints > this.gameState.whitePoints)
            return 1;
        else if (this.gameState.whitePoints > this.gameState.blackPoints)
            return -1;
        else
            return 0;
    }

    init_state(elem1) {

        // Time Up
        if (this.scene.timer.isTimeUp())
            return State.TIMEUP;


        // Wait for previous animations
        if (this.animator.isActive()) return State.INIT;


        // Restart countdown
        if (this.scene.timer.isInactive()) {
            this.scene.timer.setState(TimerState.START)
            return State.INIT;
        }
        // Resume countdown
        if (this.scene.timer.isPaused()) {
            this.scene.timer.setState(TimerState.ACTIVE)
            return State.INIT;
        }


        let result = this.prolog.getResult();
        if (result == undefined) return State.INIT;

        // Start the move
        this.elem1 = null;
        this.elem2 = null;
        this.elem3 = null;

        // ---- Computer Move ----
        // Select player piece
        if (this.scene.getPlayer() != 0) {
            this.elem1 = this.scene.getAvailablePiece();
            this.elem1.select();
            return State.PLAYER;
        }

        // ---- Human move ----

        // Select player piece
        if (elem1 != null && elem1.constructor.name == "MyPlayerPiece") {
            this.elem1 = elem1;
            this.elem1.select();

            // Show valid moves
            for (let validMove of result[2]) {
                let tile = this.scene.board.getTile(validMove[1], validMove[2])
                tile.setValid();
            }
            return State.PLAYER;
        }

        return State.INIT;
    }

    player_state(elem2) {

        if (this.scene.timer.isTimeUp())
            return State.TIMEUP;

        let turns = [];
        let result = this.prolog.getResult();
        let validMoves = result[2];

        // ---- Human move ----
        if (this.scene.getPlayer() == 0) {

            // The second piece is a Player Piece
            if (elem2 != null && elem2.constructor.name == "MyPlayerPiece") {
                this.elem1.deselect();
                this.elem1 = elem2;
                this.elem1.select();
                return State.PLAYER;
            }

            // The second piece is not a Tile nor a Bonus
            if (elem2 == null || (elem2.constructor.name != "MyTile" && elem2.constructor.name != "MyBonus"))
                return State.INIT;

            // The second piece is a Tile or a Bonus
            this.elem2 = elem2;

            // Check if the move is valid - loop through list of valid moves
            for (let validMove of validMoves) {
                if (validMove[1] == this.elem2.row && validMove[2] == this.elem2.col) {
                    turns = validMove[3];
                    break;
                }
            }

        }

        // ---- Computer move ----
        else {

            let validMove;

            // Random Computer Level
            if (this.scene.getPlayer() == 1)
                validMove = validMoves[Math.floor(Math.random() * validMoves.length)]

            // Greedy Computer Level
            else
                validMove = validMoves[validMoves.length - 1]

            let chosenTile = this.scene.board.getTile(validMove[1], validMove[2]);
            if (chosenTile.piece != null && chosenTile.piece.constructor.name == "MyBonus")
                this.elem2 = chosenTile.piece;
            else this.elem2 = chosenTile;
            turns = validMove[3];
        }

        // If the move is valid, it will turn at least a piece
        if (turns.length == 0) return State.PLAYER;

        // Stop and reset the timer
        this.scene.timer.setState(TimerState.STOP);

        // Move is valid
        // Disable picking
        this.elem1.disablePick();
        this.elem2.disablePick();

        // Add Piece to Tile
        if (this.elem2.constructor.name == "MyBonus") {  // Destiny is a Tile with a Bonus

            let tile = this.elem2.getTile();
            this.elem2.removeTile();
            tile.addPiece(this.elem1);

            this.elem3 = this.elem2;
            this.elem2 = tile;
        }
        else // Destiny is an empty Tile
            this.elem2.addPiece(this.elem1);

        if (this.scene.getPlayer() == 0) {
            for (let validMove of validMoves) {
                let tile = this.scene.board.getTile(validMove[1], validMove[2])
                tile.setInvalid();
            }
        }


        // Get new game state
        this.prolog.send(
            'move',
            `[${this.gameState.getBoard()},${this.gameState.player},${this.elem2.row},${this.elem2.col},${JSON.stringify(turns)},${this.gameState.blackPoints},${this.gameState.whitePoints},NewBP,NewWP,NewGameState]`,
            null, null, true);

        if (this.gameState.player == 1)
            this.elem1.turn();

        this.gameState.setTurns(turns);
        this.gameState.setPieces(this.elem1, this.elem2, this.elem3);
        this.scene.pushState(this.gameState);

        return State.TILE;
    }

    tile_state() {

        let result = this.prolog.getResult();
        if (result == undefined)
            return State.TILE;

        // Creates an animation for the player piece
        let move = new MyGameMove(this.elem1);
        move.setAnimation(MyGameMove.animateTranslateRotate(
            this.scene,
            this.elem1,
            this.elem2,
            this.elem1.color == 'black',
            () => {
                this.elem1.moveToPiece(this.elem2);
                if (this.elem1.color == 'black')
                    this.elem1.rotate(180);
            }));

        this.animator.addMove(move);

        // Creates an animation for the bonus piece
        if (this.elem3 != null && this.elem3.constructor.name == 'MyBonus') {
            let bonusMove = new MyGameMove(this.elem3);
            let tile = this.scene.bonusBoard.availableTile();
            bonusMove.setAnimation(MyGameMove.animateTranslateRotate(
                this.scene,
                this.elem3,
                tile,
                false,
                () => {
                    this.elem3.moveToPiece(tile);
                }));
            this.animator.addMove(bonusMove);
        }

        // Creates an animation for the turnable pieces
        for (let turn of this.gameState.turns) {
            let piece = this.scene.board.getTile(turn[0], turn[1]).piece;
            piece.turn();

            let turnMove = new MyGameMove(piece);

            let angles = { init: 0, final: 180 };
            if (this.elem1.color != 'black')
                angles = { init: 180, final: 0 };

            turnMove.setAnimation(MyGameMove.animateRotate(
                this.scene,
                angles.init,
                angles.final,
                () => {
                    piece.rotate(angles.final);
                }));
            this.animator.addMove(turnMove);
        }

        // Sets the new gameState
        let nextGameState = new MyGameState(
            result[result.length - 1],
            -this.gameState.player,
            result[result.length - 3],
            result[result.length - 2]);
        this.nextGameState = nextGameState;

        // Gets valid moves for the next player
        this.prolog.send('valid_moves', `[${nextGameState.getBoard()},${nextGameState.player},M]`, null, null, true);

        return State.ANIM;
    }

    undo_state() {
        this.scene.timer.setState(TimerState.STOP);

        // Resets the tile material for the valid moves
        if (!this.gameOver) {

            let validMoves = this.prolog.getResult()[2];
            for (let validMove of validMoves) {
                let tile = this.scene.board.getTile(validMove[1], validMove[2])
                tile.setInvalid();
            }
        }

        if (this.gameState.piece == null) {
            if (this.elem1 != null)
                this.elem1.deselect();
            return State.INIT;
        }

        if (this.elem1 != this.gameState.piece) {
            this.elem1.deselect();
        }

        // Creates an animation for the player piece
        let move = new MyGameMove(this.gameState.piece);
        this.gameState.piece.rotate(0);
        move.setAnimation(MyGameMove.animateTranslateRotate(
            this.scene,
            this.gameState.piece,
            this.gameState.initPosition,
            false,
            () => {
                this.gameState.piece.moveToPiece(this.gameState.initPosition);
                this.gameState.piece.color = 'white';
                this.gameState.piece.enablePick();
                this.gameState.piece.deselect();
                this.gameState.tile.removePiece();
                this.gameState.tile.enablePick();
            }));

        this.animator.addMove(move);

        // Creates an animation for the bonus piece
        if (this.gameState.bonus != null) {
            let bonusMove = new MyGameMove(this.gameState.bonus);
            bonusMove.setAnimation(MyGameMove.animateTranslateRotate(
                this.scene,
                this.gameState.bonus,
                this.gameState.tile,
                false,
                () => {
                    this.gameState.bonus.moveToPiece(this.gameState.tile);
                    this.gameState.bonus.enablePick();
                    this.gameState.tile.addPiece(this.gameState.bonus);
                    this.gameState.bonus.setTile(this.gameState.tile);
                    this.scene.bonusBoard.restoreTile();
                }));
            this.animator.addMove(bonusMove);
        }

        // Creates an animation for the turnable pieces
        for (let turn of this.gameState.turns) {
            let piece = this.scene.board.getTile(turn[0], turn[1]).piece;
            piece.turn();

            let turnMove = new MyGameMove(piece);

            let angles = { init: 180, final: 0 };
            if (this.gameState.piece.color != 'black')
                angles = { init: 0, final: 180 };

            turnMove.setAnimation(MyGameMove.animateRotate(
                this.scene,
                angles.init,
                angles.final,
                () => {
                    piece.rotate(angles.final);
                }));
            this.animator.addMove(turnMove);
        }

        // Gets valid moves for the next player
        this.prolog.send('valid_moves', `[${this.gameState.getBoard()},${this.gameState.player},M]`, null, null, false);

        this.scene.marker.setMarker(this.gameState.blackPoints, this.gameState.whitePoints, this.gameState.player);

        this.gameOver = false;

        return State.INIT;
    }

    animation_state() {

        let result = this.prolog.getResult();

        if (!this.animator.isActive() && result != undefined) {
            
            let moves = result[2];

            // If the current player cannot play
            if (moves.length == 0) {

                this.prolog.send('valid_moves', `[${this.nextGameState.getBoard()},${-this.nextGameState.player},M]`, null, null, false);
                result = this.prolog.getResult();
                moves = result[2];

                // If the next player also cannot play
                if (moves.length == 0) {
                    // GameOver was reached
                    this.prolog.send('get_total_points', `[${this.nextGameState.getBoard()},${this.nextGameState.blackPoints},${this.nextGameState.whitePoints},TB,TW]`)
                    this.scene.timer.setState(TimerState.STOP)
                    return State.OVER;
                }

                // Changing player
                this.nextGameState.setPlayer(-this.nextGameState.player);

            }
            this.scene.marker.setMarker(this.nextGameState.blackPoints, this.nextGameState.whitePoints, this.nextGameState.player)
            this.gameState = this.nextGameState;
            this.scene.timer.setState(TimerState.START)
            return State.INIT;
        }

        return State.ANIM;
    }

    game_over_state() {
        let result = this.prolog.getResult();

        if (result != undefined) {
            this.gameOver = true;

            let gameState = new MyGameState(
                this.gameState.board,
                -this.gameState.player,
                result[result.length - 2],
                result[result.length - 1]);

            this.gameState = gameState;

            this.scene.marker.setMarker(this.gameState.blackPoints, this.gameState.whitePoints, this.gameState.player, this.getWinner())

            return State.END;
        }

        return State.OVER;

    }

    replay_state() {

        if (!this.animator.isActive()) {
            if (this.replayState < this.scene.gameStates.length) {

                let gameState = this.scene.gameStates[this.replayState];
                gameState.piece.elevated = false;
                gameState.piece.select();

                // Creates an animation for the player piece
                let move = new MyGameMove(gameState.piece);
                move.setAnimation(MyGameMove.animateTranslateRotate(
                    this.scene,
                    gameState.piece,
                    gameState.tile,
                    gameState.player == 1,
                    () => {
                        gameState.piece.moveToPiece(gameState.tile);
                        if (gameState.player == 1) {
                            gameState.piece.rotate(180);
                            gameState.piece.turn();
                        }
                    }));

                this.animator.addMove(move);

                // Creates an animation for the bonus piece
                if (gameState.bonus != null) {
                    let bonusMove = new MyGameMove(gameState.bonus);
                    let tile = this.scene.bonusBoard.availableTile();
                    bonusMove.setAnimation(MyGameMove.animateTranslateRotate(
                        this.scene,
                        gameState.bonus,
                        tile,
                        false,
                        () => {
                            gameState.bonus.moveToPiece(tile);
                        }));
                    this.animator.addMove(bonusMove);
                }

                // Creates an animation for the turnable pieces
                for (let turn of gameState.turns) {
                    let piece = this.scene.board.getTile(turn[0], turn[1]).piece;
                    piece.turn();

                    let turnMove = new MyGameMove(piece);

                    let angles = { init: 0, final: 180 };
                    if (gameState.player != 1)
                        angles = { init: 180, final: 0 };

                    turnMove.setAnimation(MyGameMove.animateRotate(
                        this.scene,
                        angles.init,
                        angles.final,
                        () => {
                            piece.rotate(angles.final);
                        }));
                    this.animator.addMove(turnMove);
                }

                this.scene.marker.setMarker(this.scene.gameStates[this.replayState].blackPoints, this.scene.gameStates[this.replayState].whitePoints, this.scene.gameStates[this.replayState].player)

                this.replayState++;

                return State.REPLAY;
            }

            this.scene.marker.setMarker(this.gameState.blackPoints, this.gameState.whitePoints, this.gameState.player)

            if (this.gameOver)
                return State.OVER;

            return State.INIT;
        }

        return State.REPLAY;
    }

    timeup_state() {

        if (!this.gameOver) {

            let validMoves = this.prolog.getResult()[2];
            for (let validMove of validMoves) {
                let tile = this.scene.board.getTile(validMove[1], validMove[2])
                tile.setInvalid();
            }

            if (this.elem1 != null)
                this.elem1.deselect();
        }

        this.prolog.send('get_total_points', `[${this.gameState.getBoard()},${this.gameState.blackPoints},${this.gameState.whitePoints},TB,TW]`)
        return State.OVER;
    }

    double_undo_state1() {
        this.undo_state();
        return State.DOUBLE_UNDO2;
    }

    double_undo_state2() {
        let result = this.prolog.getResult();

        if (!this.animator.isActive() && result != undefined) {
            let gameState = this.scene.popState();
            if (gameState != null) {
                this.setGameState(gameState);
            }
            return this.undo_state();
        }
        return State.DOUBLE_UNDO2;
    }

    next_state(elem1 = null, elem2 = null) {

        switch (this.state) {
            case State.INIT:
                this.state = this.init_state(elem1);
                break;
            case State.PLAYER:
                this.state = this.player_state(elem2);
                break;
            case State.TILE:
                this.state = this.tile_state();
                break;
            case State.UNDO:
                this.state = this.undo_state();
                break;
            case State.DOUBLE_UNDO1:
                this.state = this.double_undo_state1();
                break;
            case State.DOUBLE_UNDO2:
                this.state = this.double_undo_state2();
                break;
            case State.ANIM:
                this.state = this.animation_state();
                break;
            case State.OVER:
                this.state = this.game_over_state();
                break;
            case State.END:
                break;
            case State.REPLAY:
                this.state = this.replay_state();
                break;
            case State.TIMEUP:
                this.state = this.timeup_state();
                break;
            default:
                this.state = State.INIT;
                break;
        }
    }
}