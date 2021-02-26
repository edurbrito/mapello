/**
 * XMLscene class, representing the scene that is to be rendered.
 * https://paginas.fe.up.pt/~ruirodrig/pub/sw/webcgf/docs/#!/api
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
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
        this.spritesheets = [];
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {

        // Reads the views from the scene graph.
        for (var key in this.graph.views) {

            if (this.graph.views.hasOwnProperty(key)) {
                var graphView = this.graph.views[key];

                if (graphView[0] == "perspective") {
                    this.cameras[key] = new CGFcamera(
                        Utils.degToRad(graphView[3]), // angle
                        graphView[1], // near
                        graphView[2], // far
                        vec3.fromValues(...graphView[4]),  // from
                        vec3.fromValues(...graphView[5])); // to
                }
                else if (graphView[0] == "ortho") {
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
        this.interface.setActiveCamera(this.camera);

        // Add Selected Camera Option to Interface Gui
        this.interface.initCameras(this, 'selectedCamera', this.cameras);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {

        // Lights index.
        var i = 0;

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

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

    initMaterials() {
        // Reads the materials from the scene graph
        for (var key in this.graph.materials) {
            if (this.graph.materials.hasOwnProperty(key)) {
                var graphMaterial = this.graph.materials[key];

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

    initTextures() {
        // Reads the textures from the scene graph
        for (var key in this.graph.textures) {
            if (this.graph.textures.hasOwnProperty(key)) {
                var graphTexturePath = this.graph.textures[key];

                this.textures[key] = new CGFtexture(this, graphTexturePath);
            }
        }
        this.textures['mySpriteTextTexture'] = new CGFtexture(this, './scenes/images/spriteTextBlack.png');
    }

    initSpritesheets() {
        // Reads the spritesheets from the scene graph
        for (var key in this.graph.spritesheets) {
            if (this.graph.spritesheets.hasOwnProperty(key)) {
                var graphSpritesheet = this.graph.spritesheets[key];

                var texture = new CGFtexture(this, graphSpritesheet[0]);
                var sizeM = graphSpritesheet[1];
                var sizeN = graphSpritesheet[2];

                this.spritesheets[key] = new MySpriteSheet(this, texture, sizeM, sizeN);
            }
        }
    }

    /** 
     * Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initCameras();

        this.initLights();

        this.initMaterials();

        this.initSpritesheets();

        this.initTextures();

        this.sceneInited = true;
    }

    update(t) {

        if (this.sceneInited) {
            // Update Animations
            for (var key in this.graph.animations) {
                if (this.graph.animations.hasOwnProperty(key)) {
                    this.graph.animations[key].update(t);
                }
            }

            // Update SpriteAnimations
            for (var key in this.graph.spriteAnims) {
                if (this.graph.spriteAnims.hasOwnProperty(key)) {
                    this.graph.spriteAnims[key].update(t);
                }
            }
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        
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

}