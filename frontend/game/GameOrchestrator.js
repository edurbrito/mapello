/**
 * GameOrchestrator class, representing the game scene that is to be rendered.
 * https://paginas.fe.up.pt/~ruirodrig/pub/sw/webcgf/docs/#!/api
 */
class GameOrchestrator extends GameScene {
    constructor(myinterface) {
        super(myinterface);
        this.animator = new MyAnimator();
        this.prolog = new PrologController(8081);
        this.stateMachine = new StateMachine(this, this.prolog, this.animator);

        this.gameStates = [];

        // players[0] - black player level; players[1] - white player level
        // 0 - human, 1 - random, 2 - greedy
        this.players = [0, 0]; 
    }

    init(application) {
        super.init(application);

        // enable picking
        this.setPickEnabled(true);
    }

    setGame(settings) {

        // Get initial board
        this.prolog.send('initial', `[${settings['board']},B]`, null, null, false);

        // Set initial game state
        let gameState = new MyGameState(this.prolog.getResult()[1]); // Save received board
        this.stateMachine.setGameState(gameState);

        // Init Board Tiles and Pieces
        let theme = this.themes[this.selectedTheme];
        this.board.initTiles(this.prolog.getResult()[1], theme);


        // Set Computers
        if (settings['player-p2'] == 'computer')
            this.players[1] = parseInt(settings['level-p2']);

        if (settings['player-p1'] == 'computer')
            this.players[0] = parseInt(settings['level-p1']);

        this.prolog.send(
            'valid_moves',
            `[${gameState.getBoard()},${gameState.player},M]`,
            null,
            null,
            true);

        this.timer.setState(TimerState.START);
    }

    display() {
        //-- For Picking
        if (this.getPlayer() == 0)
            this.handlePicking();
        this.clearPickRegistration();
        if ((this.stateMachine.state > State.PLAYER) || (this.getPlayer() != 0) || (this.timer.state > TimerState.STOP))
            this.stateMachine.next_state();

        super.display();
    }

    update(t) {
        super.update(t);

        this.timer.update(t);

        this.animator.animate(t);
    }

    handlePicking() {

        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        if (this.stateMachine.state == State.INIT)
                            this.stateMachine.next_state(obj, null)
                        else if (this.stateMachine.state == State.PLAYER)
                            this.stateMachine.next_state(null, obj)
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    pushState(gameState) {
        this.gameStates.push(gameState);
    }

    popState() {
        if (this.gameStates.length > 0)
            return this.gameStates.pop();
        return new MyGameState(this.board.initialBoard);
    }

    undo() {
        let sum = this.players[0] + this.players[1];
        let mult = this.players[0] * this.players[1];
        if (sum == 0) { // ONLY HUMANS
            let gameState = this.popState();
            if (gameState != null) {
                this.stateMachine.state = State.UNDO;
                this.stateMachine.setGameState(gameState);
            }
        }
        else if (mult == 0 && this.getPlayer() == 0) { // CURRENT PLAYER HUMAN
            let gameState = this.popState();
            if (gameState != null) {
                this.stateMachine.state = State.DOUBLE_UNDO1;
                this.stateMachine.setGameState(gameState);
            }
        }
    }

    getPlayer() {
        return this.stateMachine.gameState.player == 1 ? this.players[0] : this.players[1];
    }

    replay() {

        let sum = this.players[0] + this.players[1];
        let mult = this.players[0] * this.players[1];


        // ONLY HUMANS OR CURRENT PLAYER HUMAN OR GAMEOVER
        if (sum == 0 || (mult == 0 && this.getPlayer() == 0) || this.stateMachine.gameOver) {

            // Pause the timer
            this.timer.setState(TimerState.PAUSE);

            if (!this.stateMachine.gameOver) {
                let validMoves = this.prolog.getResult()[2];
                for (let validMove of validMoves) {
                    let tile = this.board.getTile(validMove[1], validMove[2])
                    tile.setInvalid();
                }

                if (this.stateMachine.elem1 != null)
                    this.stateMachine.elem1.deselect();
            }

            for (let e of this.playerPieces) {
                e.moveToPiece(e.initPosition);
                if (e.initColor != e.color) {
                    e.turn();
                }
                e.rotate(180 * (e.color == "black"));
            }

            for (let e of this.bonusPieces) {
                e.moveToPiece(e.initPosition);
            }

            this.bonusBoard.available = 0;
            this.stateMachine.replayState = 0;
            this.stateMachine.state = State.REPLAY;
        }
    }
}