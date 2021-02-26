/**
 * MyMarker class, representing the game marker that displays the points, the players and the game final state.
 */
class MyMarker extends MyGameElement {
    constructor(scene, graph, pickId = -1) {
        super(scene, graph, pickId)
        this.spritesLoaded = false;

        this.blackPoints = 0;
        this.whitePoints = 0;
        this.player = 1;
        this.winner = null;
    }

    setGraph(graph) {
        this.graph = graph;
        this.setSprites();
        this.setMarker(this.blackPoints, this.whitePoints, this.player, this.winner);
    }

    setSprites() {
        this.blackMarker = this.graph.nodes['blackMarker'].sprites[0]
        this.whiteMarker = this.graph.nodes['whiteMarker'].sprites[0]
        this.playerMarker = this.graph.nodes['playerMarker'].sprites[0]
        this.spritesLoaded = true;
    }

    setMarker(blackPoints, whitePoints, player, winner = null) {

        this.blackPoints = blackPoints;
        this.whitePoints = whitePoints;
        this.player = player;
        this.winner = winner;

        this.blackMarker.setText(String(this.blackPoints));
        this.whiteMarker.setText(String(this.whitePoints));

        if (this.winner == null) {
            this.playerMarker.setText((player == 1 ? "Black" : "White") + "'s turn")
            return;
        }

        switch (this.winner) {
            case 0:
                this.playerMarker.setText("It's a tie!")
                break;

            case 1:
                this.playerMarker.setText("Black won!")
                break;

            case -1:
                this.playerMarker.setText("White won!")
                break;
        }

    }

    display() {

        if (!this.spritesLoaded)
            this.setSprites();

        this.graph.display();
    }

} 
