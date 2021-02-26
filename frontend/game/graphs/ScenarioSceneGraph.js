/**
 * GameSceneGraph class, representing a game scenario scene graph.
 */
class ScenarioSceneGraph extends MySceneGraph {
    constructor(filename, scene, def = false) {
        super(filename, scene)
        this.default = def
    }

    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.scene.addTexturesFromGraph(this)
        this.scene.addMaterialsFromGraph(this)
        this.scene.addSpritesheetsFromGraph(this)
        if (this.default)
            this.scene.onGraphLoaded(this)

        this.loadedOk = true;
    }

    display() {
        this.displayScene();
    }
}