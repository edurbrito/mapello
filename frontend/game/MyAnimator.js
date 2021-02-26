/**
* MyAnimator class, for animating the GameMoves.
*/
class MyAnimator {
    constructor() {
        this.moves = [];
    }

    addMove(move) {
        this.moves.push(move);
    }

    /**
    * Called when the GameScene is updating.
    * It animates all the assigned GameMoves and deletes the finished ones.
    */
    animate(t) {

        let new_moves = [];

        for (let i = 0; i < this.moves.length; i++) {
            if (this.moves[i].animate(t))
                new_moves.push(this.moves[i])
        }

        this.moves = new_moves;
    }

    /**
    * If there is no GameMove remaining, returns false.
    */
    isActive() {
        return this.moves.length > 0;
    }
}



