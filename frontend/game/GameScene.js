/**
 * GameScene class, representing the scene that is to be rendered.
 * https://paginas.fe.up.pt/~ruirodrig/pub/sw/webcgf/docs/#!/api
 */
class GameScene extends CGFscene {
    constructor(myinterface) {
        super();
        this.interface = myinterface;

        this.themes = []
        this.selectedTheme = null

        this.board = null
        this.bonusBoard = null
        this.piecesBoard = null
        this.marker = null
        this.timer = null
        this.playerPieces = [];
        this.bonusPieces = [];
        this.wallsPieces = [];
        this.jokerPieces = [];
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {

        super.init(application);

        this.sceneInited = false;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress = 0;

        // Default CGF appearance
        this.defaultAppearance = new CGFappearance(this);

        // Default CGF camera
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 0), vec3.fromValues(0, 0, 0));

        this.cameras = []; // To store CGFcamera & CGFcameraOrtho objects
        this.selectedCamera = null; // interface's currently selected Camera
        this.materials = []; // To store CGFappearance objects
        this.textures = []; // To store CGFtexture objects
        this.textures['mySpriteTextTexture'] = new CGFtexture(this, './scenes/images/spriteTextBlack.png');
        this.spritesheets = [];
        this.waterShader = new CGFshader(this.gl, "./shaders/water.vert", "./shaders/water.frag");
		this.waterShader.setUniformsValues({ uSampler2: 1 });
		this.waterShader.setUniformsValues({ timeFactor: 0 });

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras(graph) {

        // Reads the views from the scene graph.
        for (var key in graph.views) {

            if (graph.views.hasOwnProperty(key)) {
                var graphView = graph.views[key];

                if (graphView[0] == "perspective" && this.cameras[key] == undefined) {
                    this.cameras[key] = new CGFcamera(
                        Utils.degToRad(graphView[3]), // angle
                        graphView[1], // near
                        graphView[2], // far
                        vec3.fromValues(...graphView[4]),  // from
                        vec3.fromValues(...graphView[5])); // to
                }
                else if (graphView[0] == "ortho" && this.cameras[key] == undefined) {
                    this.cameras[key] = new CGFcameraOrtho(
                        graphView[3], // left
                        graphView[4], // right
                        graphView[5], // bottom
                        graphView[6], // top
                        graphView[1], // near
                        graphView[2], // far
                        vec3.fromValues(...graphView[7]),  // from
                        vec3.fromValues(...graphView[8]),  // to
                        vec3.fromValues(...graphView[9])); // up
                }
            }
        }
        // XML default camera ID
        this.camera = this.cameras[this.selectedCamera];

        // Add Selected Camera Option to Interface Gui
        this.interface.initCameras(this, 'selectedCamera');
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights(graph) {

        for (let light of this.lights) {
            delete light.name;
            light.disable();
            light.update();
        }

        // Lights index.
        let i = 0;

        // Reads the lights from the scene graph.
        for (let key in graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (graph.lights.hasOwnProperty(key)) {
                let graphLight = graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);
                this.lights[i].name = key;

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }

        // Add Lights Enabled Option to Interface Gui
        this.interface.initLights(this.lights, 'enabled');
    }

    /**
     * Initializes the game pieces with the default theme.
     */
    initPieces() {

        let theme = this.themes[this.selectedTheme];

        // Init Main Board
        this.board = new MyBoard(this,
            theme.boardGraph,
            theme.playableTileGraph,
            theme.nonPlayableTileGraph);

        // Init Bonus Board
        this.bonusBoard = new MyAuxiliarBoard(this,
            theme.bonusBoardGraph,
            theme.nonPlayableTileGraph, 0, -3.675, 1, 8, 7);

        // Init Pieces Board
        this.piecesBoard = new MyAuxiliarBoard(this,
            theme.piecesBoardGraph,
            theme.nonPlayableTileGraph, -3.15, -3.675, 7, 8, -10);

        // Init Points Marker
        this.marker = new MyMarker(this, theme.markerGraph);

        // Init Timer
        this.timer = new MyTimer(this, theme.timerGraph);

        // Init Player Pieces
        let piecePickId = 53;
        let offsetX = -13.15;
        let offsetZ;

        for (let x = 0; x < 7; x++) {
            offsetZ = -3.675;
            for (let z = 0; z < ((x == 0) ? 4 : 8); z++) {
                let playerPiece = new MyPlayerPiece(this, theme.playerGraph, 'white', piecePickId);
                playerPiece.moveTo(offsetX + x, 0.27, offsetZ + z);
                playerPiece.setInitPosition();
                this.playerPieces.push(playerPiece);

                offsetZ += 0.05;
                piecePickId++;
            }
            offsetX += 0.05;
        }

    }

    /**
     * Sets the Themes and creates the dropdown interface.
     */
    setThemes(sthemes) {
        this.themes = [];
        let defaultTheme = sthemes[0];
        for (let i = sthemes.length - 1; i >= 0; i--) {
            let theme = sthemes[i];
            this.themes[theme] = new MyTheme(this, theme, i == 0)
        }
        this.setCurrentTheme(defaultTheme, false);
        this.interface.initThemes(this, "selectedTheme", Object.keys(this.themes));
        this.initPieces();
    }

    /**
     * Updates the pieces graphs with the current theme settings.
     */
    setCurrentTheme(stheme, update) {
        this.selectedTheme = stheme
        let theme = this.themes[this.selectedTheme];

        if (update) {
            // Update Main Board Graph
            this.board.setGraph(theme.boardGraph,
                theme.playableTileGraph,
                theme.nonPlayableTileGraph);

            // Update Bonus Board Graph
            this.bonusBoard.setGraph(theme.bonusBoardGraph,
                theme.nonPlayableTileGraph);

            // Update Pieces Board Graph
            this.piecesBoard.setGraph(theme.piecesBoardGraph,
                theme.nonPlayableTileGraph);

            // Update Player Pieces Board Graph
            this.playerPieces.forEach(element => {
                element.setGraph(theme.playerGraph);
            })

            // Update Bonus Pieces Graph
            this.bonusPieces.forEach(element => {
                element.setGraph(theme.bonusGraph);
            })

            // Update Wall Pieces Graph
            this.wallsPieces.forEach(element => {
                element.setGraph(theme.wallGraph);
            })

            // Update Joker Pieces Graph
            this.jokerPieces.forEach(element => {
                element.setGraph(theme.jokerGraph);
            })

            // Update Points Marker Graph
            this.marker.setGraph(theme.markerGraph);

            // Update Timer Marker Graph
            this.timer.setGraph(theme.timerGraph);

            this.gl.clearColor(...theme.graph.background);
            this.setGlobalAmbientLight(...theme.graph.ambient);
            this.initLights(theme.graph);
        }
    }

    /**
     * Adds loaded textures from graph into the scene textures list.
     */
    addTexturesFromGraph(graph) {
        for (var key in graph.textures) {
            if (graph.textures.hasOwnProperty(key)) {
                var graphTexturePath = graph.textures[key];

                this.textures[key] = new CGFtexture(this, graphTexturePath);
            }
        }
    }

    /**
     * Adds loaded materials from graph into the scene materials list.
     */
    addMaterialsFromGraph(graph) {
        // Reads the materials from the scene graph
        for (var key in graph.materials) {
            if (graph.materials.hasOwnProperty(key)) {
                var graphMaterial = graph.materials[key];

                this.materials[key] = new CGFappearance(this);

                this.materials[key].setShininess(graphMaterial[0]);
                this.materials[key].setAmbient(...graphMaterial[1]);
                this.materials[key].setDiffuse(...graphMaterial[2]);
                this.materials[key].setSpecular(...graphMaterial[3]);
                this.materials[key].setEmission(...graphMaterial[4]);

                this.materials[key].setTextureWrap('REPEAT', 'REPEAT');
            }
        }
    }

    /**
     * Adds loaded spritesheets from graph into the scene spritesheets list.
     */
    addSpritesheetsFromGraph(graph) {
        // Reads the spritesheets from the scene graph
        for (var key in graph.spritesheets) {
            if (graph.spritesheets.hasOwnProperty(key)) {
                var graphSpritesheet = graph.spritesheets[key];

                var texture = new CGFtexture(this, graphSpritesheet[0]);
                var sizeM = graphSpritesheet[1];
                var sizeN = graphSpritesheet[2];

                this.spritesheets[key] = new MySpriteSheet(this, texture, sizeM, sizeN);
            }
        }
    }

    onGraphLoaded(graph) {

        this.axis = new CGFaxis(this, graph.referenceLength);

        this.gl.clearColor(...graph.background);

        this.setGlobalAmbientLight(...graph.ambient);

        this.initLights(graph);

        this.initCameras(graph);

        this.sceneInited = true;

        console.log("Scene Initiated");
    }

    update(t) {

        // Update Animations
        for (var key in this.themes[this.selectedTheme].graph.animations) {
            if (this.themes[this.selectedTheme].graph.animations.hasOwnProperty(key)) {
                this.themes[this.selectedTheme].graph.animations[key].update(t);
            }
        }

        // Update SpriteAnimations
        for (var key in this.themes[this.selectedTheme].graph.spriteAnims) {
            if (this.themes[this.selectedTheme].graph.spriteAnims.hasOwnProperty(key)) {
                this.themes[this.selectedTheme].graph.spriteAnims[key].update(t);
            }
        }

        this.waterShader.setUniformsValues({ timeFactor: t / 500 % 1000 });
    }

    /**
     * Displays all the Game pieces and boards.
     */
    displayGame() {

        this.themes[this.selectedTheme].graph.displayScene();

        this.board.display();
        this.bonusBoard.display();
        this.piecesBoard.display();
        this.marker.display();
        this.timer.display();

        this.playerPieces.forEach(element => {
            element.display();
        })
        this.bonusPieces.forEach(element => {
            element.display();
        })
        this.wallsPieces.forEach(element => {
            element.display();
        })
        this.jokerPieces.forEach(element => {
            element.display();
        })

    }

    display() {

        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if(!this.updatedLights){
            for (let light of this.lights)
                light.update();
            this.updatedLights = true;
        }

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            this.defaultAppearance.apply();

            // Displays the game pieces and boards.
            this.displayGame();
        }
        else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress / 10.0, 0, 0, 1);

            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Returns an available piece to be picked.
     */
    getAvailablePiece() {
        for (let piece of this.playerPieces) {
            if (piece.canPick) {
                return piece;
            }
        }
    }

    /**
     * Returns the current theme name.
     */
    getThemeName() {
        return this.selectedTheme;
    }

}