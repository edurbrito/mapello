/**
 * Keyframe
 * @constructor
 * @param scene - Reference to MyScene object
 * @param instant
 * @param transformations
 */

class Keyframe {

    constructor(scene, instant, transformations) {
        this.scene = scene;

        this.instant = instant;
        
        this.transformations = transformations;
        this.translation = transformations.translation;
        this.rotation = [transformations.rotationX, transformations.rotationY, transformations.rotationZ];
        this.scale = transformations.scale;
    }
}
