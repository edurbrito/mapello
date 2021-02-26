/**
* MyTheme class, saving the current theme information and graphs.
*/
class MyTheme {
    constructor(scene, name, def) {
        this.name = name

        this.graph = new ScenarioSceneGraph(this.name + "/scene.xml", scene, def);
        this.boardGraph = new GameSceneGraph(this.name + "/board.xml", scene)
        this.bonusBoardGraph = new GameSceneGraph(this.name + "/bonus_board.xml", scene)
        this.piecesBoardGraph = new GameSceneGraph(this.name + "/pieces_board.xml", scene)
        this.playerGraph = new GameSceneGraph(this.name + "/pieces/player.xml", scene)
        this.bonusGraph = new GameSceneGraph(this.name + "/pieces/bonus.xml", scene)
        this.wallGraph = new GameSceneGraph(this.name + "/pieces/wall.xml", scene)
        this.jokerGraph = new GameSceneGraph(this.name + "/pieces/joker.xml", scene)
        this.nonPlayableTileGraph = new GameSceneGraph(this.name + "/non_playable_tile.xml", scene)
        this.playableTileGraph = new GameSceneGraph(this.name + "/playable_tile.xml", scene)
        this.markerGraph = new GameSceneGraph(this.name + "/marker.xml", scene);
        this.timerGraph = new GameSceneGraph(this.name + "/timer.xml", scene);

        this.graphs = [this.graph, this.boardGraph, this.bonusBoardGraph, this.piecesBoardGraph, this.playerGraph, this.bonusGraph, this.wallGraph, this.jokerGraph, this.nonPlayableTileGraph, this.playableTileGraph, this.markerGraph];
    }

    /**
    * Returns true if all graphs were loaded, false otherwise.
    */
    is_loaded() {
        for (const g of this.graphs) {
            if (!g.loadedOk) {
                return false;
            }
        }

        return true;
    }

    /**
    * Returns the total percentage of graphs loaded.
    */
    loading_percentage() {
        let total = this.graphs.length;
        let current = total;

        for (const g of this.graphs) {
            if (!g.loadedOk) {
                current--;
            }
        }
        this.loaded = Math.floor(current / total * 100);
        return this.loaded;
    }
}