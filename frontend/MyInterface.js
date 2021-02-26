/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        dat.GUI.prototype.removeFolder = function (name) {
            var folder = this.__folders[name];
            if (!folder) {
                return;
            }
            folder.close();
            this.__ul.removeChild(folder.domElement.parentNode);
            delete this.__folders[name];
            this.onResize();
        }

        this.cameraFolder = this.gui.addFolder("Camera");
        this.cameraFolder.open();
        this.lightsFolder = this.gui.addFolder("Lights");
        this.lightsFolder.open();
        this.themesFolder = this.gui.addFolder("Themes");
        this.themesFolder.open();

        this.initKeys();

        return true;
    }

    /**
     * Initializes the Dropdown Menu for the scene's cameras
     * @param scene CGFscene object
     * @param attribute relates to the scene's 'selected camera'
     */
    initCameras(scene, attribute) {
        this.cameraFolder.add(scene, attribute, Object.keys(scene.cameras))
            .name(attribute)
            .onChange(
                () => {
                    scene.animator.addMove(
                        new CameraAnimation(scene, scene.camera, scene.cameras[scene[attribute]]))
                });
    }

    /**
     * Initializes the Checkboxes for the scene's lights
     * @param lights scene's array of CGFlight objects
     * @param attribute relates to the 'enabled' property of the lights
     */
    initLights(lights, attribute) {
        this.gui.removeFolder("Lights");
        this.lightsFolder = this.gui.addFolder("Lights");
        
        this.lightsFolder.open();

        for (const light of lights) {
            if (light.name != undefined){
                this.lightsFolder.add(light, attribute)
                    .name(light.name)
                    .onChange(() => light.update());
            }
        }
    }

    /**
     * Initializes the Dropdown Menu for the game themes
     * @param scene CGFscene object
     * @param attribute relates to the scene's 'selected theme'
     * @param themes list of game themes
     */
    initThemes(scene, attribute, themes) {
        this.themesFolder.add(scene, attribute, themes)
            .name("Theme")
            .onChange(
                () => {
                    scene.setCurrentTheme(scene[attribute], true);
                });
    }

    /**
     * Initializes the Undo and Replay buttons
     * @param scene CGFscene object
     */
    initButtons(scene){
        var obj = { Undo:function(){ scene.undo() }, Replay:function(){ scene.replay() }};

        this.gui.add(obj,'Undo');
        this.gui.add(obj,'Replay');
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}