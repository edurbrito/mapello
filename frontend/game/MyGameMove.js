/**
* MyGameMove class, responsible for animating a specific piece.
*/
class MyGameMove {
    constructor(piece) {
        this.piece = piece;
    }
    
    /**
    * Factory Method, returning an already prepared KeyframeAnimation.
    * This animation translates the piece from one position to the other
    * while rotating it in the air, if needed.
    * When finished, executes the callback function.
    */
    static animateTranslateRotate(scene, initP, finalP, rotate, callback) {
        let xTranslate = finalP.x - initP.x;
        let zTranslate = finalP.z - initP.z;

        let pi = Utils.degToRad(180);

        let initialT = {
            translation: [0, 0, 0],
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: [1, 1, 1]
        };

        let intermediateT1 = {
            translation: [xTranslate / 3, 1.8, zTranslate / 3],
            rotationX: 0,
            rotationY: 0,
            rotationZ: rotate ? -pi / 3 : 0,
            scale: [1, 1, 1]
        };

        let intermediateT2 = {
            translation: [2 * xTranslate / 3, 1, 2 * zTranslate / 3],
            rotationX: 0,
            rotationY: 0,
            rotationZ: rotate ? -2 * pi / 3 : 0,
            scale: [1, 1, 1]
        };

        let finalT = {
            translation: [xTranslate, 0, zTranslate],
            rotationX: 0,
            rotationY: 0,
            rotationZ: rotate ? -pi : 0,
            scale: [1, 1, 1]
        };

        let keyFrames = [
            new Keyframe(scene, 0, initialT),
            new Keyframe(scene, 250, intermediateT1),
            new Keyframe(scene, 500, intermediateT2),
            new Keyframe(scene, 1000, finalT)];

        return new KeyframeAnimation(scene, keyFrames, callback);
    }

    /**
    * Factory Method, returning an already prepared KeyframeAnimation.
    * This animation rotates the piece in the place.
    * When finished, executes the callback function.
    */
    static animateRotate(scene, initAngle, finalAngle, callback) {

        let deltaAngle = Utils.degToRad(finalAngle) - Utils.degToRad(initAngle);

        let offset = 1;
        if (deltaAngle < 0) offset = -1;

        let initialT = {
            translation: [0, 0, 0],
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: [1, 1, 1]
        };

        let intermediateT1 = {
            translation: [0, offset * 1, 0],
            rotationX: 0,
            rotationY: 0,
            rotationZ: deltaAngle / 4,
            scale: [1, 1, 1]
        };

        let intermediateT2 = {
            translation: [0, offset * 0.8, 0],
            rotationX: 0,
            rotationY: 0,
            rotationZ: deltaAngle / 2,
            scale: [1, 1, 1]
        };

        let intermediateT3 = {
            translation: [0, offset * 0.8, 0],
            rotationX: 0,
            rotationY: 0,
            rotationZ: 3 * deltaAngle / 4,
            scale: [1, 1, 1]
        };

        let finalT = {
            translation: [0, offset * 0.4, 0],
            rotationX: 0,
            rotationY: 0,
            rotationZ: deltaAngle,
            scale: [1, 1, 1]
        };

        let keyFrames = [
            new Keyframe(scene, 1000, initialT),
            new Keyframe(scene, 1250, intermediateT1),
            new Keyframe(scene, 1500, intermediateT2),
            new Keyframe(scene, 1750, intermediateT3),
            new Keyframe(scene, 2000, finalT)];

        return new KeyframeAnimation(scene, keyFrames, callback);
    }

    setAnimation(animation) {
        this.piece.animation = animation;
    }

    /**
    * This is called by the animator and returns false when the animation has ended.
    */
    animate(t) {
        if (this.piece.animation != null) {
            this.piece.animation.update(t);
            if (this.piece.animation.isEnded) {
                this.piece.animation = null;
                return false;
            }
            return true;
        }
        return false;
    }
}