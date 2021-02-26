/**
 * KeyframeAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 * @param keyframes - Array of keyframes
 */
class KeyframeAnimation extends MyAnimation {

    constructor(scene, keyframes, callback = null) {
        // Animation class initializes initialTime, lastTime, initialTransformations and finalTransformations
        super(scene, 0, keyframes[keyframes.length - 1].instant,
            { translation: [0, 0, 0], rotationX: 0, rotationY: 0, rotationZ: 0, scale: [1, 1, 1] }, keyframes[keyframes.length - 1].transformations);

        // Total time of the animation
        this.totalTime = this.finalTime - this.initialTime;

        // Total time passed
        this.sumT = 0;

        // Last t from update function arg
        this.lastT = 0;

        // First keyframe => Neutral transformations when t=0
        this.keyframes = [new Keyframe(scene, 0, this.initialTransformations)];

        // Remaining keyframes
        this.keyframes.push(...keyframes);

        // Index of actual and next keyframes
        this.actualKF = 0;
        this.nextKF = 1;

        // Percentage of time elapsed within the two keyframes
        this.elapsedPercentage = 0;

        // Current Animation Matrix
        this.currentState = mat4.create();

        // If only one keyframe was set in the XML make the transformation sticky
        if(this.keyframes.length == 2){
            this.keyframes[0] = new Keyframe(scene, this.keyframes[1].instant, this.keyframes[1].transformations);
            this.buildAnimation();
        }

        // If Animation has started or not
        this.isActive = false;

        this.isEnded = false;
        this.callback = callback;
    }

    update(t) {
      
        // If animation time has ended
        if (this.sumT > this.totalTime) {
            this.isActive = true; // guarantee that it shows the node in time, if only 1 keyframe was set
            if(!this.isEnded){
                if(this.callback != null)
                    this.callback();
                this.isEnded = true;
            }
            return;
        }

        if (this.lastT == 0)
            this.lastT = t;
        
        var deltaT = t - this.lastT;
        this.lastT = t;

        this.sumT += deltaT;

        if(this.keyframes[this.nextKF] == undefined)
            return;

        // If still in the current keyframe
        if (this.keyframes[this.nextKF].instant > this.sumT) {

            if (this.actualKF == 0)
                return;

            this.isActive = true;

            // Total time elapsed within the two keyframes
            let elapsedTime = this.sumT - this.keyframes[this.actualKF].instant;

            // Percentage of time passed within the two keyframes
            this.elapsedPercentage = elapsedTime / (this.keyframes[this.nextKF].instant - this.keyframes[this.actualKF].instant);
            
            this.buildAnimation();
        }
        else { // Next keyframe
            this.elapsedPercentage = 1;
            this.buildAnimation();
            this.actualKF++;
            this.nextKF++;
        }
    }

    buildAnimation() {

        // Interpolate translate, rotate and scale values based on percentage
        this.currentState = mat4.create();

        var translation = [0, 0, 0];
        vec3.lerp(translation, this.keyframes[this.actualKF].translation, this.keyframes[this.nextKF].translation, this.elapsedPercentage);

        mat4.translate(this.currentState, this.currentState, translation);

        var rotation = [0, 0, 0];
        vec3.lerp(rotation, this.keyframes[this.actualKF].rotation, this.keyframes[this.nextKF].rotation, this.elapsedPercentage);

        mat4.rotate(this.currentState, this.currentState, rotation[0], [1, 0, 0]);
        mat4.rotate(this.currentState, this.currentState, rotation[1], [0, 1, 0]);
        mat4.rotate(this.currentState, this.currentState, rotation[2], [0, 0, 1]);

        var scale = [0, 0, 0];
        vec3.lerp(scale, this.keyframes[this.actualKF].scale, this.keyframes[this.nextKF].scale, this.elapsedPercentage);

        mat4.scale(this.currentState, this.currentState, scale);
    }

    apply() {
        this.scene.multMatrix(this.currentState);
    }

}
