/**
 * MyAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 * @param initialTime 
 * @param finalTime
 * @param initialTransformations 
 * @param finalTransformations
 */

class MyAnimation {

    constructor(scene, initialTime, finalTime, initialTransformations, finalTransformations) {

        if (this.constructor === MyAnimation) {
            throw new TypeError('MyAnimation is an abstract class');
        }

        this.scene = scene;

        this.initialTime = initialTime;
        this.finalTime = finalTime;

        this.initialTransformations = initialTransformations;
        this.finalTransformations = finalTransformations;
    }

    update(t) {

    }

    apply() {

    }
}
