// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // WRONG // Establish bidirectional references between scene and graph.
        this.scene = scene;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /**
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Check for errors in an array of parsed variables
     * @param {array} dataArr 
     */
    hasXMLErrors(dataArr) {
        for (var data of dataArr) {
            if (typeof data === 'string')
                return true;
        }
        return false;
    }

    /**
     * To be executed on an array with minor error messages, showing an error for each of the errors and a final warning.
     * @param {array} errorArr 
     * @param {array} nodeID 
     */
    onXMLNodeMultipleErrors(errorArr, nodeID) {
        for (var i = 0; i < errorArr.length; i++) {
            if (typeof errorArr[i] === 'string') {
                if (i != errorArr.length - 1)
                    this.onXMLError(errorArr[i] + " on node " + nodeID);
                else
                    this.onXMLMinorError(errorArr[i] + " on node " + nodeID);
            }
        }
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Check if a file exists
     * @param {path} the path of the file 
     */
    fileExists(path) {
        var req = new XMLHttpRequest();
        req.open('HEAD', path, false);
        req.send();

        return (req.status == "404") ? false : true;
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <parseerror>
        var index;
        if ((index = nodeNames.indexOf("parsererror")) != -1) { // Parsing Error
            var errorNode = nodes[index].children;
            return errorNode[1].innerHTML;
        }

        // <initials>
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse spritesheets block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            this.onXMLMinorError("tag <animations> missing");
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        var nodesIdx;
        if((index = nodeNames.indexOf("animations")) == -1)
            nodesIdx = NODES_INDEX-1;
        else
            nodesIdx = NODES_INDEX;

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != nodesIdx)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }

    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;


        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {

        var children = viewsNode.children;
        this.views = [];
        var defaultCamera = this.reader.getString(viewsNode, "default");

        if (defaultCamera == null) {
            this.onXMLMinorError("No default camera was set");
            this.scene.selectedCamera = "defaultCamera";
        }
        else {
            this.scene.selectedCamera = defaultCamera;
        }

        var cameraIDs = [];

        for (var i = 0; i < children.length; i++) {

            var nodeName = children[i].nodeName;
            var global = [];
            var attributeNames = [];

            if (nodeName != "perspective" && nodeName != "ortho") {
                this.onXMLMinorError("unknown camera tag <" + nodeName + ">");
                continue;
            }
            else {
                attributeNames = ["near", "far", "angle", "left", "right", "bottom", "top"];
                global.push(nodeName); // perspective or ortho
            }

            // Get id of the current view.
            var viewID = this.reader.getString(children[i], 'id');
            if (viewID == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewID] != null)
                return "ID must be unique for each view (conflict: ID = " + viewID + ")";

            for (var j = 0; j < attributeNames.length; j++) {
                if ((attributeNames[j] == "angle" && nodeName == "ortho") || (j > 2 && nodeName == "perspective")) continue;

                var aux = this.reader.getFloat(children[i], attributeNames[j]);
                if (aux == null) {
                    this.onXMLMinorError("no " + attributeNames[j] + " attribute defined for view " + viewID);
                    aux = 1.0;
                }
                if (typeof aux === 'string')
                    return aux;

                global.push(aux);
            }

            // Specifications for the current view.
            var grandChildren = children[i].children;
            attributeNames = ["from", "to", "up"];

            var nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            nodeNames.forEach(val => {
                if (!attributeNames.includes(val)) {
                    this.onXMLMinorError("unknown property " + val + " for view ID = " + viewID);
                }
            });

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[attributeIndex], attributeNames[j] + " view position for ID" + viewID);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else if (attributeNames[j] != "up") {
                    this.onXMLMinorError(attributeNames[j] + " is not defined for view ID = " + viewID);
                    global.push([10, 10, 10]); // default vector
                }
                else if (attributeNames[j] == "up" && nodeName == "ortho")
                    global.push([0, 1, 0]); // default up vector
            }

            this.views[viewID] = global;
            cameraIDs.push(viewID);
        }

        if (cameraIDs.length == 0) {
            this.onXMLMinorError("No Perspective or Ortho cameras were set");
            this.views[this.scene.selectedCamera] = ["perspective", 0.1, 500, 40, [0, 15, 15], [0, 0, 0]];
        }
        else if (this.views[this.scene.selectedCamera] == null) {
            this.onXMLMinorError("Default Camera ID does not match existing cameras. Setting it to the first of the list.");
            this.scene.selectedCamera = cameraIDs[0];
        }


        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        if (ambientIndex == -1) {
            this.onXMLMinorError("No ambient illumination defined for scene.");
            this.ambient = [0.3, 0.3, 0.4, 0.8];
        }
        else {

            var color = this.parseColor(children[ambientIndex], "ambient");
            if (!Array.isArray(color))
                return color;
            else
                this.ambient = color;
        }

        var backgroundIndex = nodeNames.indexOf("background");
        if (backgroundIndex == -1) {
            this.onXMLMinorError("No background illumination defined for scene.");
            this.background = [0.53, 0.95, 0.8, 1];
        }
        else {

            color = this.parseColor(children[backgroundIndex], "background");
            if (!Array.isArray(color))
                return color;
            else
                this.background = color;
        }

       

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];
        var error;

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];
            error = false;

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Specifications for the current light.
            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string') {
                        this.onXMLError(aux);
                        error = true;
                    }

                    global.push(aux);
                }
                else {
                    this.onXMLError("light " + attributeNames[j] + " block is undefined for ID " + lightId);
                    error = true;
                    break;
                }
            }

            if (error) {
                this.onXMLError("light with ID " + lightId + " has missing attributes or values");
                continue;
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

   
        return null;
    }

    /**
     * Parses the <spritesheets> block. 
     * @param {spritesheets block element} spritesheetsNode
     */
    parseSpritesheets(spritesheetsNode) {
        var children = spritesheetsNode.children;

        this.spritesheets = [];

        // Any number of spritesheets.
        for (var i = 0; i < children.length; i++) {

            var global = [];

            if (children[i].nodeName != "spritesheet") {
                this.onXMLMinorError("unknown spritesheet tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current spritesheet.
            var spritesheetID = this.reader.getString(children[i], 'id');
            if (spritesheetID == null)
                return "no ID defined for spritesheet";

            // Checks for repeated IDs.
            if (this.spritesheets[spritesheetID] != null)
                return "ID must be unique for each texture (conflict: ID = " + spritesheetID + ")";

            // Get path of the current spritesheet.
            var path = this.reader.getString(children[i], 'path');

            if (!this.fileExists(path)) {
                this.onXMLError("invalid path for spritesheet with ID " + this.spritesheetID);
                continue;
            }
            else if (path == null || path == "") {
                this.onXMLMinorError("failed to load spritesheet with ID " + this.spritesheetID);
                continue;
            }

            global.push(path);


            // Get number of columns(M) of the current spritesheet.
            var sizeM = this.parseInteger(children[i], 'sizeM', ' spritesheet with ID ' + this.spritesheetID);

            if (typeof sizeM === 'string') {
                this.onXMLMinorError(sizeM);
                continue;
            }

            if (sizeM < 0) {
                this.onXMLMinorError('spritesheet sizeM should be positive in spritesheet with ID ' + this.spritesheetID);
                continue;
            }

            global.push(sizeM);

            // Get number of rows(N) of the current spritesheet.      
            var sizeN = this.parseInteger(children[i], 'sizeN', ' spritesheet with ID ' + this.spritesheetID);

            if (typeof sizeN === 'string') {
                this.onXMLMinorError(sizeM);
                continue;
            }

            if (sizeN < 0) {
                this.onXMLMinorError('spritesheet sizeM should be positive in spritesheet with ID ' + this.spritesheetID);
                continue;
            }
            global.push(sizeN);

            this.spritesheets[spritesheetID] = global;

        }

 
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        this.textures = [];

        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown texture tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            // Get path of the current texture.
            var texturePath = this.reader.getString(children[i], 'path');

            if (!this.fileExists(texturePath)) {
                this.onXMLError("invalid path for texture with ID " + this.textureID);
                continue;
            }
            else if (texturePath == null || texturePath == "") {
                this.onXMLMinorError("failed to load texture with ID " + this.textureID);
                continue;
            }

            this.textures[textureID] = texturePath;

        }

  
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        var attrError;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            // Attribute error flag
            attrError = false;

            // Storing material information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["shininess", "ambient", "diffuse", "specular", "emissive"]);
                attributeTypes.push(...["positive float", "color", "color", "color", "color"]);
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            // Specifications for the current material.
            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "positive float") {
                        var aux = this.parseFloat(grandChildren[attributeIndex], "value", attributeNames[j] + " attribute for material of ID " + materialID);

                        if (typeof aux !== 'string' && aux <= 0) {
                            this.onXMLError("unable to parse non positive value of the " + attributeNames[j] + " attribute for material of ID " + materialID);
                            this.onXMLMinorError("unable to parse material with ID " + materialID);
                            attrError = true;
                            break;
                        }
                    }
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " attribute for material of ID " + materialID);

                    if (typeof aux === 'string') {
                        this.onXMLError(aux);
                        this.onXMLMinorError("unable to parse material with ID " + materialID);
                        attrError = true;
                        break;
                    }

                    global.push(aux);
                }
                else {
                    this.onXMLError("material " + attributeNames[i] + " block undefined for ID " + materialID);
                    attrError = true;
                }
            }

            if (!attrError)
                this.materials[materialID] = global;

        }

        if (Object.keys(this.materials).length === 0) {
            this.onXMLMinorError("at least one material must be defined. Default material will be used.");
            this.defaultMaterial();
        }

  
        return null;
    }


    /**
     * Parses the <animations> node.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;
        this.animations = [];

        // Any number of animations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

            // Keyframes for the current animation.
            var grandChildren = children[i].children;

            var keyFrames = [];
            for (var j = 0; j < grandChildren.length; j++) {

                var instant = this.parseFloat(grandChildren[j], 'instant', ' keyframe ' + j);

                if(instant <= 0) instant = 0.01;

                if (typeof instant === 'string' || (j > 0 && instant * 1000 <= keyFrames[j - 1]['instant'])) {
                    this.onXMLMinorError("unable to parse keyframe " + j + " instant time");
                    instant = (keyFrames[j - 1]['instant'])/1000 + 0.2;
                }

                var transformations = grandChildren[j].children;

                if (transformations.length < 5)
                    this.onXMLMinorError("transformations for the keyframe " + j + " are missing");

                var transformationMatrix = this.parseKeyframeTransformations(transformations);

                if (typeof transformationMatrix === 'string') {
                    this.onXMLMinorError(transformationMatrix + " on keyframe " + j);
                    transformationMatrix = { translation: [0, 0, 0], rotationX: 0, rotationY: 0, rotationZ: 0, scale: [1, 1, 1] };
                }

                keyFrames.push(new Keyframe(this.scene, instant * 1000, transformationMatrix));
            }

            if (keyFrames.length > 0)
                this.animations[animationID] = new KeyframeAnimation(this.scene, keyFrames);
            else {
                this.onXMLMinorError('No keyframes defined for animation ' + animationID);
            }
        }


        return null;
    }


    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];
        this.spriteAnims = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];
        var descendants = [];
        var primitives = [];
        var sprites = [];
        var transformationMatrix, animationNode, materialNode, textureNode;

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");
            var animationIndex = nodeNames.indexOf("animationref");

            // Transformations  
            if (transformationsIndex == -1) {
                this.onXMLMinorError("missing transformations block on node " + nodeID);
                transformationMatrix = mat4.create();
            }
            else {
                grandgrandChildren = grandChildren[transformationsIndex].children;

                transformationMatrix = this.parseTransformations(grandgrandChildren);

                if (typeof transformationMatrix === 'string')
                    this.onXMLMinorError(transformationMatrix + "on node " + nodeID);
            }

            // Animation  
            if (animationIndex == -1) {
                animationNode = { 'id': null };
            }
            else {
                animationNode = this.reader.getString(grandChildren[animationIndex], 'id');

                if (animationNode == null || this.animations == undefined || this.animations[animationNode] == null) {
                    this.onXMLMinorError("no ID defined for animationref on nodeID " + nodeID);
                    animationNode = { 'id': null };
                }
                else {
                    animationNode = { 'id': animationNode };
                }
            }

            // Material
            if (materialIndex == -1) {
                this.onXMLMinorError("missing material block on node " + nodeID);
                materialNode = { "id": this.defaultMaterial() };
            }
            else {
                materialNode = this.parseNodeMaterial(grandChildren[materialIndex]);

                if (typeof materialNode === 'string') {
                    this.onXMLMinorError(materialNode + "on node " + nodeID);
                }

                if (this.materials[materialNode.id] == null && materialNode.id != "null") {
                    this.onXMLMinorError("missing material on node " + nodeID + ". Default was used");
                    materialNode = { "id": this.defaultMaterial() };
                }

                if (nodeID == this.idRoot && materialNode.id == "null") {
                    this.onXMLMinorError("Root's material shouldn't be null. Default material will be used.");
                    materialNode.id = this.defaultMaterial();
                }
            }

            // Texture
            if (textureIndex == -1) {
                this.onXMLMinorError("missing texture block on node " + nodeID);
                textureNode = { "id": "clear", "afs": 1, "aft": 1 };
            }
            else {

                textureNode = this.parseNodeTexture(grandChildren[textureIndex]);

                if (typeof textureNode === 'string')
                    this.onXMLMinorError(textureNode + "on node " + nodeID);

                if (this.textures[textureNode.id] == null && textureNode.id != "null" && textureNode.id != "clear") {
                    this.onXMLMinorError("missing texture on node " + nodeID + ". No texture was used");
                    textureNode = { "id": "clear", "afs": 1, "aft": 1 };
                }

                if (nodeID == this.idRoot && textureNode.id == "null") {
                    this.onXMLMinorError("Root's texture shouldn't be null. 'clear' will be used instead.");
                    textureNode.id = "clear";
                }
            }

            // Descendants
            descendants = [];
            primitives = [];
            sprites = [];

            if (descendantsIndex == -1)
                this.onXMLMinorError("missing descendants block on node " + nodeID);
            else {
                grandgrandChildren = grandChildren[descendantsIndex].children;

                if (grandgrandChildren.length == 0)
                    this.onXMLMinorError("no descendants on node " + nodeID);

                for (var j = 0; j < grandgrandChildren.length; j++) {

                    switch (grandgrandChildren[j].nodeName) {
                        case 'noderef':
                            var descendantId = this.reader.getString(grandgrandChildren[j], 'id');
                            if (descendantId == null)
                                return "no ID defined for noderef of node " + nodeID;

                            descendants.push(descendantId);
                            break;

                        case 'leaf':
                            // Parse Sprites
                            if (this.reader.getString(grandgrandChildren[j], 'type') == 'spritetext' ||
                                this.reader.getString(grandgrandChildren[j], 'type') == 'spriteanim') {

                                var sprite = this.parseSpriteLeaf(grandgrandChildren[j]);

                                if (Array.isArray(sprite)) {
                                    this.onXMLNodeMultipleErrors(sprite, nodeID);
                                    continue;
                                }

                                sprites.push(sprite);
                            }

                            // Parse other primitives
                            else {

                                var primitive = this.parseLeaf(grandgrandChildren[j]);

                                if (Array.isArray(primitive)) {
                                    this.onXMLNodeMultipleErrors(primitive, nodeID);
                                    continue;
                                }

                                primitives.push(primitive);

                            }

                            break;

                        default:
                            return "unknown tag <" + grandgrandChildren[j].nodeName + ">";
                    }
                }
            }

            var node = new MyNode(this.scene, nodeID, transformationMatrix, materialNode.id, textureNode.id, animationNode.id, textureNode.afs, textureNode.aft, descendants, primitives, sprites);
            this.nodes[nodeID] = node;

        }
    }

    /**
     * Parse the transformations from a node
     * @param {block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

        var transformationMatrix = mat4.create();

        // Any number of transformations.
        for (var i = 0; i < transformationsNode.length; i++) {

            switch (transformationsNode[i].nodeName) {
                case "translation":
                    var coords = this.parseCoordinates3D(transformationsNode[i], "translate transformation ");

                    // Error check
                    if (typeof coords === 'string')
                        return coords;

                    transformationMatrix = mat4.translate(transformationMatrix, transformationMatrix, coords);
                    break;

                case "rotation":
                    var angle = Utils.degToRad(this.reader.getFloat(transformationsNode[i], 'angle'));
                    var axis = this.reader.getString(transformationsNode[i], 'axis');

                    // Error check
                    if (!(angle != null && !isNaN(angle)))
                        return "unable to parse rotation angle of the rotation transformation ";

                    switch (axis) {
                        case 'x':
                            transformationMatrix = mat4.rotateX(transformationMatrix, transformationMatrix, angle);
                            break;
                        case 'y':
                            transformationMatrix = mat4.rotateY(transformationMatrix, transformationMatrix, angle);
                            break;
                        case 'z':
                            transformationMatrix = mat4.rotateZ(transformationMatrix, transformationMatrix, angle);
                            break;
                        default:
                            return "unable to parse rotation axis of the rotation transformation ";
                    }
                    break;

                case "scale":
                    var coords = this.parseScaleCoordinates3D(transformationsNode[i], "scale transformation ");

                    // Error check
                    if (typeof coords === 'string')
                        return coords;

                    transformationMatrix = mat4.scale(transformationMatrix, transformationMatrix, coords);
                    break;

                default:
                    return "unknown transformation tag <" + transformationsNode[i].nodeName + ">";
            }
        }

        return transformationMatrix;
    }

    /**
     * Creates a defaultMaterial
     */
    defaultMaterial() {
        if (this.materials['onErrorDefaultMaterial'] != null)
            return 'onErrorDefaultMaterial';

        var shininess = 10.0;
        var ambient = [0, 1, 0, 1];
        var diffuse = [0, 1, 0, 1];
        var specular = [0, 1, 0, 1];
        var emissive = [0, 0, 0, 1];

        this.materials['onErrorDefaultMaterial'] = [shininess, ambient, diffuse, specular, emissive];

        return 'onErrorDefaultMaterial';
    }

    /**
     * Parse the material from a node
     * @param {block element} materialsNode
     */
    parseNodeMaterial(materialsNode) {
        var materialID = this.reader.getString(materialsNode, 'id');
        if (materialID == null)
            return "no ID defined for material ";

        return { "id": materialID };
    }

    /**
     * Parse the texture from a node
     * @param {block element} textureNode
     */
    parseNodeTexture(textureNode) {
        var textureID = this.reader.getString(textureNode, 'id');
        if (textureID == null)
            return "no ID defined for texture ";

        var textureChildren = textureNode.children;
        var amps = [];

        if (textureChildren.length == 0) {
            this.onXMLMinorError("No amplification tag was set on texture tag " + textureID);
            amps = [1, 1];
        }
        else {

            var element = textureChildren[0];

            if (element.nodeName != "amplification") {
                this.onXMLMinorError("unknown tag <" + element.nodeName + "> on texture tag " + textureID);
                amps = [1, 1];
            }
            else {
                for (const iterator of ["afs", "aft"]) {
                    var aux = this.parseFloat(element, iterator, "texture " + textureID + " amplification");
                    if (typeof aux === "string") {
                        this.onXMLMinorError(aux);
                        amps.push(1);
                    }
                    else {
                        amps.push(aux);
                    }
                }

            }
        }


        return { "id": textureID, "afs": amps[0], "aft": amps[1] };
    }

    /**
     * Parse a primitive
     * @param {block element} leafNode
     */
    parseLeaf(leafNode) {

        var type = this.reader.getString(leafNode, 'type');
        var primitive;
        var primitiveData = [];

        switch (type) {
            case 'triangle':
                var x1 = this.parseFloat(leafNode, 'x1', type);
                var y1 = this.parseFloat(leafNode, 'y1', type);
                var x2 = this.parseFloat(leafNode, 'x2', type);
                var y2 = this.parseFloat(leafNode, 'y2', type);
                var x3 = this.parseFloat(leafNode, 'x3', type);
                var y3 = this.parseFloat(leafNode, 'y3', type);
                primitiveData.push(x1, y1, x2, y2, x3, y3);

                if (this.hasXMLErrors(primitiveData)) {
                    primitiveData.push("Failed drawing Triangle ");
                    return primitiveData;
                }

                primitive = new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3);
                break;

            case 'rectangle':
                var x1 = this.parseFloat(leafNode, 'x1', type);
                var y1 = this.parseFloat(leafNode, 'y1', type);
                var x2 = this.parseFloat(leafNode, 'x2', type);
                var y2 = this.parseFloat(leafNode, 'y2', type);
                primitiveData.push(x1, y1, x2, y2);

                if (this.hasXMLErrors(primitiveData)) {
                    primitiveData.push("Failed drawing Rectangle ");
                    return primitiveData;
                }

                primitive = new MyRectangle(this.scene, x1, y1, x2, y2);
                break;

            case 'cylinder':
                var height = this.parseFloat(leafNode, 'height', type);
                var topRadius = this.parseFloat(leafNode, 'topRadius', type);
                var bottomRadius = this.parseFloat(leafNode, 'bottomRadius', type);
                var stacks = this.parseInteger(leafNode, 'stacks', type);
                var slices = this.parseInteger(leafNode, 'slices', type);
                primitiveData.push(height, topRadius, bottomRadius, stacks, slices);

                if (this.hasXMLErrors(primitiveData)) {
                    primitiveData.push("Failed drawing Cylinder ");
                    return primitiveData;
                }

                primitive = new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks);
                break;

            case 'sphere':
                var radius = this.parseFloat(leafNode, 'radius', type);
                var stacks = this.parseInteger(leafNode, 'stacks', type);
                var slices = this.parseInteger(leafNode, 'slices', type);
                primitiveData.push(radius, stacks, slices);

                if (this.hasXMLErrors(primitiveData)) {
                    primitiveData.push("Failed drawing Sphere ");
                    return primitiveData;
                }

                primitive = new MySphere(this.scene, radius, slices, stacks);
                break;

            case 'torus':
                var inner = this.parseFloat(leafNode, 'inner', type);
                var outer = this.parseFloat(leafNode, 'outer', type);
                var slices = this.parseInteger(leafNode, 'slices', type);
                var loops = this.parseInteger(leafNode, 'loops', type);
                primitiveData.push(inner, outer, slices, loops);

                if (this.hasXMLErrors(primitiveData)) {
                    primitiveData.push("Failed drawing Torus ");
                    return primitiveData;
                }

                primitive = new MyTorus(this.scene, inner, outer, slices, loops);
                break;

            case 'plane':
                var npartsU = this.parseInteger(leafNode, 'npartsU', type);
                var npartsV = this.parseInteger(leafNode, 'npartsV', type);
                primitiveData.push(npartsU, npartsV);

                if (this.hasXMLErrors(primitiveData)) {
                    primitiveData.push("Failed drawing Plane ");
                    return primitiveData;
                }

                primitive = new MyPlane(this.scene, npartsU, npartsV);
                break;

            case 'patch':
                var npointsU = this.parseInteger(leafNode, 'npointsU', type);
                var npointsV = this.parseInteger(leafNode, 'npointsV', type);
                var npartsU = this.parseInteger(leafNode, 'npartsU', type);
                var npartsV = this.parseInteger(leafNode, 'npartsV', type);
                primitiveData.push(npointsU, npointsV, npartsU, npartsV);

                if (this.hasXMLErrors(primitiveData)) {
                    primitiveData.push("Failed drawing Patch ");
                    return primitiveData;
                }
                

                // Parse Control Points

                var controlPointsNodes = leafNode.children;
                var controlPoints = [];

                // Check number of control points
                if (controlPointsNodes.length != npointsU * npointsV) {
                    primitiveData.push("Wrong number of Control Points in Patch ");
                    return primitiveData;
                }

                for (var i = 0; i < npointsU * npointsV; i++) {
                    if (controlPointsNodes[i].nodeName != "controlpoint") {
                        this.onXMLMinorError("unknown tag <" + controlPointsNodes[i].nodeName + ">");
                        primitiveData.push("Unknown tag in patch ");
                        return primitiveData;
                    }
                    var coords = this.parseCoordinates3D(controlPointsNodes[i], 'coordinates of Patch control point ');

                    if (typeof coords === 'string') {
                        primitiveData.push("Error parsing coordinates of Patch ");
                        return primitiveData;
                    }
            
                    coords.push(1);// w = 1

                    controlPoints.push(coords);
                }

                primitive = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);
                break;

            case 'defbarrel':
                var base = this.parseFloat(leafNode, 'base', type);
                var middle = this.parseFloat(leafNode, 'middle', type);
                var height = this.parseFloat(leafNode, 'height', type);
                var slices = this.parseInteger(leafNode, 'slices', type);
                var stacks = this.parseInteger(leafNode, 'stacks', type);
                var angle = Utils.degToRad(30);

                primitiveData.push(base, middle, height, slices, stacks);

                if (this.hasXMLErrors(primitiveData)) {
                    primitiveData.push("Failed drawing Barrel ");
                    return primitiveData;
                }

                primitive = new MyBarrel(this.scene, base, middle, height, angle, slices, stacks);
                break;

            case 'cube':
                primitive = new MyCube(this.scene);
                break;

            case 'water':
                var x1 = this.parseFloat(leafNode, 'x1', type);
                var y1 = this.parseFloat(leafNode, 'y1', type);
                var x2 = this.parseFloat(leafNode, 'x2', type);
                var y2 = this.parseFloat(leafNode, 'y2', type);
                primitiveData.push(x1, y1, x2, y2);

                if (this.hasXMLErrors(primitiveData)) {
                    primitiveData.push("Failed drawing Water ");
                    return primitiveData;
                }

                primitive = new MyWater(this.scene, x1, y1, x2, y2);
                break;
    
            case null:
                primitiveData.push("No type defined for a primitive");
                return primitiveData;
            default:
                primitiveData.push("Invalid type defined for a primitive");
                return primitiveData;
        }

        return primitive;
    }

    /**
     * Parse a sprite primitive
     * @param {block element} spriteNode
     */
    parseSpriteLeaf(spriteNode) {
        var type = this.reader.getString(spriteNode, 'type');

        var sprite;
        var spriteData = [];

        switch (type) {

            case 'spritetext':
                var text = this.reader.getString(spriteNode, 'text');
                sprite = new MySpriteText(this.scene, text);
                break;

            case 'spriteanim':
                var spriteID = this.reader.getString(spriteNode, 'ssid');
                if (spriteID == null || this.spritesheets[spriteID] == null) {
                    spriteData.push("No valid ID defined for SpriteSheet ");
                    return spriteData;
                }

                var duration = this.parseFloat(spriteNode, 'duration', type);
                var startCell = this.parseInteger(spriteNode, 'startCell', type);
                var endCell = this.parseInteger(spriteNode, 'endCell', type);
                spriteData.push(duration, startCell, endCell);

                if (this.hasXMLErrors(spriteData)) {
                    spriteData.push("Failed reading SpriteAnim ");
                    return spriteData;
                }

                duration *= 1000;
                sprite = new MySpriteAnimation(this.scene, spriteID, startCell, endCell, duration);
                this.spriteAnims.push(sprite);
                break;

            default:
                spriteData.push("Invalid type defined for a sprite");
                return spriteData;
        }

        return sprite;
    }


    /**
     * Parse the animations keyframe transformations
     * @param {block element} transformationsNode
     */
    parseKeyframeTransformations(transformationsNode) {

        var transformations = {};
        var check = 0;

        // Any number of transformations.
        for (var i = 0; i < transformationsNode.length; i++) {

            switch (transformationsNode[i].nodeName) {
                case "translation":
                    var coords = this.parseCoordinates3D(transformationsNode[i], "translate transformation ");

                    // Error check
                    if (typeof coords === 'string')
                        return coords;

                    transformations.translation = coords;
                    check++;
                    break;

                case "rotation":
                    var angle = Utils.degToRad(this.reader.getFloat(transformationsNode[i], 'angle'));
                    var axis = this.reader.getString(transformationsNode[i], 'axis');

                    // Error check
                    if (!(angle != null && !isNaN(angle)))
                        return "unable to parse rotation angle of the rotation transformation ";

                    switch (axis) {
                        case 'x':
                            transformations.rotationX = angle;
                            check++;
                            break;
                        case 'y':
                            transformations.rotationY = angle;
                            check++;
                            break;
                        case 'z':
                            transformations.rotationZ = angle;
                            check++;
                            break;
                        default:
                            return "unable to parse rotation axis of the rotation transformation ";
                    }
                    break;

                case "scale":
                    var coords = this.parseScaleCoordinates3D(transformationsNode[i], "scale transformation ");

                    // Error check
                    if (typeof coords === 'string')
                        return coords;

                    transformations.scale = coords;
                    check++;
                    break;

                default:
                    return "unknown transformation tag <" + transformationsNode[i].nodeName + ">";
            }
        }

        if (check < 5)
            return "missing correct transformations specifications ";

        return transformations;
    }

    /**
     * Parse boolean value from a node
     * @param {block element} node
     * @param {string} name - the name of the XML value to be verified
     * @param {string} messageError - message to be displayed in case of error
     */
    parseBoolean(node, name, messageError) {
        var boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
            return true;
        }

        return boolVal;
    }

    /**
     * Parse integer value from a node
     * @param {block element} node 
     * @param {string} name - the name of the XML value to be verified
     * @param {string} messageError - message to be displayed in case of error
     */
    parseInteger(node, name, messageError) {
        var intVal = this.reader.getInteger(node, name);
        if (!(intVal != null && !isNaN(intVal)))
            return "unable to parse " + name + " of the " + messageError;

        return intVal;
    }

    /**
     * Parse float value from a node
     * @param {block element} node
     * @param {string} name - the name of the XML value to be verified
     * @param {string} messageError - message to be displayed in case of error
     */
    parseFloat(node, name, messageError) {
        var floatVal = this.reader.getFloat(node, name);
        if (!(floatVal != null && !isNaN(floatVal)))
            return "unable to parse " + name + " of the " + messageError;

        return floatVal;
    }

    /**
     * Parse the coordinates from a node
     * @param {block element} node
     * @param {string} messageError - message to be displayed in case of error
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the scale coordinates from a node
     * @param {block element} node
     * @param {string} messageError - message to be displayed in case of error
     */
    parseScaleCoordinates3D(node, messageError) {
        var position = [];

        // sx
        var sx = this.reader.getFloat(node, 'sx');
        if (!(sx != null && !isNaN(sx)))
            return "unable to parse x-coordinate of the " + messageError;

        // sy
        var sy = this.reader.getFloat(node, 'sy');
        if (!(sy != null && !isNaN(sy)))
            return "unable to parse y-coordinate of the " + messageError;

        // sz
        var sz = this.reader.getFloat(node, 'sz');
        if (!(sz != null && !isNaN(sz)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[sx, sy, sz]);

        return position;
    }

    /**
     * Parse the coordinates from a node
     * @param {block element} node
     * @param {string} messageError - message to be displayed in case of error
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {string} messageError - message to be displayed in case of error
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.processNode(this.idRoot, "null", "null")
    }

    /**
     * Processes a node.
     * @param {string} id
     * @param {string} materialParent 
     * @param {string} textureParent
     */
    processNode(id, materialParent, textureParent) {

        var node = this.nodes[id];
        var appliedMaterial = undefined;
        var appliedTexture = undefined;

        if (node == undefined) {
            // this.onXMLError("node " + id + " is not defined");
            return;
        }

        if (node.animationID == null || this.animations[node.animationID].isActive) {

            this.scene.pushMatrix();

            if (node.transformations != null)
                this.scene.multMatrix(node.transformations);

            if (node.animationID != null) {
                this.animations[node.animationID].apply();
            }

            // Set applied material to the material of the node itself
            if (node.materialID != "null")
                appliedMaterial = node.materialID;
            // Set applied material to the parent's material
            else if (materialParent != "null")
                appliedMaterial = materialParent;

            // Set applied texture to the texture of the node itself
            if (node.textureID != "null")
                appliedTexture = node.textureID;
            // Set applied texture to the parent's texture
            else if (textureParent != "null")
                appliedTexture = textureParent;


            // Apply material & texture
            if (this.scene.materials[appliedMaterial] != undefined) {
                switch (appliedTexture) {
                    case "clear":
                        this.scene.materials[appliedMaterial].setTexture(null);
                        break;
                    case undefined:
                        this.onXMLError("Processing nodes error - Undefined Texture (parent and child have null texture)");
                        return;
                    default:
                        this.scene.materials[appliedMaterial].setTexture(this.scene.textures[appliedTexture]);
                        break;
                }

                this.scene.materials[appliedMaterial].apply();
            }
            else {
                this.onXMLError("Processing nodes error - Undefined Material (parent and child have null materials)");
                return;
            }


            // Display primitives
            node.primitives.forEach(primitive => {
                if (typeof primitive.setAmplification == 'function') {
                    primitive.setAmplification(node.afs, node.aft);
                }
                primitive.display()
            });

            // Display sprites
            node.sprites.forEach(sprite => { sprite.display() });

            // Process descendant nodes
            for (var i = 0; i < node.descendants.length; i++) {

                if (this.nodes[node.descendants[i]] == undefined) {
                    this.onXMLError("node " + node.descendants[i] + " is not defined");
                    node.descendants.splice(i, 1); // Remove undefined nodes from descendants
                    i--;
                }
                else
                    this.processNode(node.descendants[i], appliedMaterial, appliedTexture);
            }

            this.scene.popMatrix();
        }
    }
}